import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { readDb, updateDb } from "../db/store";
import type { RenderedVideoDoc, VideoFormat } from "../types/automation";
import {
  assertFormatAllowed,
  consumeRenderCredits,
  refundRenderCredits,
} from "./billingService";
import { dispatchWorkspaceWebhook } from "./webhookService";

const OUT_DIR = path.resolve(process.cwd(), "out");
const THUMB_DIR = path.resolve(OUT_DIR, "thumbnails");

function runNpxRemotion(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["remotion", ...args], {
      cwd: process.cwd(),
      shell: process.platform === "win32",
      stdio: "pipe",
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Remotion exited with code ${code}: ${stderr.slice(-400)}`));
      }
    });
  });
}

export async function renderThumbnailForProject(
  projectId: string,
  workspaceId: string,
): Promise<{ readonly thumbnailPath: string; readonly thumbnailUrl: string }> {
  const db = readDb();
  const project = db.video_projects.find(
    (p) => p._id === projectId && p.workspaceId === workspaceId,
  );
  if (!project) {
    throw new Error(`Project ${projectId} not found in workspace`);
  }

  fs.mkdirSync(THUMB_DIR, { recursive: true });
  const stillId =
    project.format === "short" ? "ShortsThumbnail" : "LongFormThumbnail";
  const fileName = `${project._id}-${stillId}.png`;
  const thumbnailPath = path.join(THUMB_DIR, fileName);
  const thumbnailUrl = `/media/out/thumbnails/${fileName}`;

  const propsJson = JSON.stringify({
    kicker: project.niche.toUpperCase(),
    headline: project.title.toUpperCase().slice(0, 42),
    bigStat: project.format === "short" ? "$15.2T" : "FULL BRIEF",
    accentColor: "#D4AF37",
    bgColor: "#08090C",
  });

  await runNpxRemotion([
    "still",
    "src/index.ts",
    stillId,
    thumbnailPath,
    `--props=${propsJson}`,
  ]);

  updateDb((draft) => {
    const idx = draft.rendered_videos.findIndex(
      (v) => v.projectId === projectId && v.workspaceId === workspaceId,
    );
    if (idx >= 0) {
      draft.rendered_videos[idx] = {
        ...draft.rendered_videos[idx],
        thumbnailPath,
        thumbnailUrl,
      };
    }
  });

  return { thumbnailPath, thumbnailUrl };
}

export async function renderProjectVideo(
  projectId: string,
  workspaceId: string,
): Promise<RenderedVideoDoc> {
  const db = readDb();
  const project = db.video_projects.find(
    (p) => p._id === projectId && p.workspaceId === workspaceId,
  );
  if (!project) {
    throw new Error(`Project ${projectId} not found in workspace`);
  }

  assertFormatAllowed(workspaceId, project.format);
  const deductedCredits = consumeRenderCredits(
    workspaceId,
    project.format,
    project._id,
  );

  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const fileName = `${project.compositionId}-${project._id}.mp4`;
    const mp4Path = path.join(OUT_DIR, fileName);
    const mp4Url = `/media/out/${fileName}`;

    await runNpxRemotion([
      "render",
      "src/index.ts",
      project.compositionId,
      mp4Path,
      "--codec=h264",
      "--pixel-format=yuv420p",
      "--crf=18",
    ]);

    const { thumbnailPath, thumbnailUrl } = await renderThumbnailForProject(
      projectId,
      workspaceId,
    );
    const sizeMb = Number((fs.statSync(mp4Path).size / (1024 * 1024)).toFixed(2));
    const format: VideoFormat = project.format;
    const videoDoc: RenderedVideoDoc = {
      _id: `vid_${crypto.randomUUID().slice(0, 8)}`,
      workspaceId,
      projectId: project._id,
      compositionId: project.compositionId,
      format,
      mp4Path,
      mp4Url,
      thumbnailPath,
      thumbnailUrl,
      fileSizeMb: sizeMb,
      durationSec: format === "short" ? 30 : 45,
      resolution: format === "short" ? "1080x1920" : "1920x1080",
      fps: 30,
      renderedAt: new Date().toISOString(),
    };

    updateDb((draft) => {
      const existingIdx = draft.rendered_videos.findIndex(
        (v) => v.projectId === project._id && v.workspaceId === workspaceId,
      );
      if (existingIdx >= 0) {
        draft.rendered_videos[existingIdx] = videoDoc;
      } else {
        draft.rendered_videos.push(videoDoc);
      }

      const pIdx = draft.video_projects.findIndex(
        (p) => p._id === project._id && p.workspaceId === workspaceId,
      );
      if (pIdx >= 0) {
        draft.video_projects[pIdx] = {
          ...draft.video_projects[pIdx],
          status: "rendered",
        };
      }
    });

    void dispatchWorkspaceWebhook(workspaceId, "video.rendered", {
      projectId: project._id,
      videoId: videoDoc._id,
      mp4Url: videoDoc.mp4Url,
      thumbnailUrl: videoDoc.thumbnailUrl,
    });

    return videoDoc;
  } catch (err) {
    refundRenderCredits(workspaceId, deductedCredits, project._id);
    throw err;
  }
}
