import crypto from "node:crypto";
import { readDb, updateDb } from "../db/store";
import type { PublishingJobDoc } from "../types/automation";
import { dispatchWorkspaceWebhook } from "./webhookService";
import { uploadVideoToYouTube } from "./youtubeService";

const activeChannelWorkers = new Set<string>();

function workerLockKey(workspaceId: string, channelKey: string): string {
  return `${workspaceId}:${channelKey}`;
}

export function enqueuePublishingJob(input: {
  readonly workspaceId: string;
  readonly channelKey: string;
  readonly projectId: string;
  readonly videoId: string;
  readonly publishAt: string;
}): PublishingJobDoc {
  const db = readDb();
  const project = db.video_projects.find(
    (p) => p._id === input.projectId && p.workspaceId === input.workspaceId,
  );
  const video = db.rendered_videos.find(
    (v) => v._id === input.videoId && v.workspaceId === input.workspaceId,
  );
  if (!project || !video) {
    throw new Error("Project or rendered video not found in workspace");
  }

  // Unique idempotency key preventing duplicate uploads on retry/restart
  const jobKey = `${input.workspaceId}:${input.channelKey}:${input.videoId}:${input.publishAt.slice(0, 16)}`;
  const existing = db.publishing_jobs.find((j) => j.jobKey === jobKey);
  if (existing) {
    return existing;
  }

  const nowIso = new Date().toISOString();
  const job: PublishingJobDoc = {
    _id: `job_${crypto.randomUUID().slice(0, 8)}`,
    workspaceId: input.workspaceId,
    jobKey,
    channelKey: input.channelKey,
    projectId: input.projectId,
    videoId: input.videoId,
    format: project.format,
    status: "scheduled",
    publishAt: input.publishAt,
    metadata: {
      title: project.seo.title,
      description: project.seo.description,
      tags: project.seo.tags,
      categoryId: project.seo.categoryId,
      privacyStatus: project.seo.privacyStatus,
    },
    youtubeVideoId: null,
    youtubeUrl: null,
    retryCount: 0,
    uploadProgressPct: 0,
    lastError: null,
    simulated: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  updateDb((draft) => {
    draft.publishing_jobs.unshift(job);
    const pIdx = draft.video_projects.findIndex(
      (p) => p._id === project._id && p.workspaceId === input.workspaceId,
    );
    if (pIdx >= 0) {
      draft.video_projects[pIdx] = {
        ...draft.video_projects[pIdx],
        status: "queued",
      };
    }
  });

  return job;
}

export async function processPublishingJob(
  jobId: string,
  workspaceId?: string,
): Promise<PublishingJobDoc> {
  const db = readDb();
  const job = db.publishing_jobs.find(
    (j) => j._id === jobId && (!workspaceId || j.workspaceId === workspaceId),
  );
  if (!job) {
    throw new Error(`Publishing job ${jobId} not found`);
  }
  if (job.youtubeVideoId) {
    return job;
  }
  const lockKey = workerLockKey(job.workspaceId, job.channelKey);
  if (activeChannelWorkers.has(lockKey)) {
    throw new Error(`Channel worker ${job.channelKey} is currently busy`);
  }

  const video = db.rendered_videos.find(
    (v) => v._id === job.videoId && v.workspaceId === job.workspaceId,
  );
  if (!video) {
    throw new Error(`Rendered video ${job.videoId} missing`);
  }

  activeChannelWorkers.add(lockKey);
  updateDb((draft) => {
    const idx = draft.publishing_jobs.findIndex((j) => j._id === jobId);
    if (idx >= 0) {
      draft.publishing_jobs[idx] = {
        ...draft.publishing_jobs[idx],
        status: "uploading",
        uploadProgressPct: 5,
        updatedAt: new Date().toISOString(),
      };
    }
  });

  try {
    const result = await uploadVideoToYouTube(
      job,
      video.mp4Path,
      video.thumbnailPath,
      (pct) => {
        updateDb((draft) => {
          const idx = draft.publishing_jobs.findIndex((j) => j._id === jobId);
          if (idx >= 0) {
            draft.publishing_jobs[idx] = {
              ...draft.publishing_jobs[idx],
              uploadProgressPct: pct,
              updatedAt: new Date().toISOString(),
            };
          }
        });
      },
    );

    const nowIso = new Date().toISOString();
    const channel = readDb().youtube_channels.find(
      (c) =>
        c.workspaceId === job.workspaceId && c.channelKey === job.channelKey,
    );

    updateDb((draft) => {
      const idx = draft.publishing_jobs.findIndex((j) => j._id === jobId);
      if (idx >= 0) {
        draft.publishing_jobs[idx] = {
          ...draft.publishing_jobs[idx],
          status: "published",
          youtubeVideoId: result.youtubeVideoId,
          youtubeUrl: result.youtubeUrl,
          simulated: result.simulated,
          uploadProgressPct: 100,
          lastError: null,
          updatedAt: nowIso,
        };
      }

      const pIdx = draft.video_projects.findIndex((p) => p._id === job.projectId);
      if (pIdx >= 0) {
        draft.video_projects[pIdx] = {
          ...draft.video_projects[pIdx],
          status: "published",
        };
      }

      draft.publishing_history.unshift({
        _id: `hist_${crypto.randomUUID().slice(0, 8)}`,
        workspaceId: job.workspaceId,
        jobId: job._id,
        channelKey: job.channelKey,
        channelTitle: channel?.channelTitle ?? job.channelKey,
        title: job.metadata.title,
        format: job.format,
        youtubeVideoId: result.youtubeVideoId,
        youtubeUrl: result.youtubeUrl,
        privacyStatus: job.metadata.privacyStatus,
        publishAt: job.publishAt,
        publishedAt: nowIso,
        simulated: result.simulated,
        analytics: {
          views: 0,
          likes: 0,
          comments: 0,
          ctrPercent: 0,
        },
      });
    });

    void dispatchWorkspaceWebhook(job.workspaceId, "video.published", {
      jobId: job._id,
      channelKey: job.channelKey,
      youtubeVideoId: result.youtubeVideoId,
      youtubeUrl: result.youtubeUrl,
      simulated: result.simulated,
    });

    return readDb().publishing_jobs.find((j) => j._id === jobId)!;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    updateDb((draft) => {
      const idx = draft.publishing_jobs.findIndex((j) => j._id === jobId);
      if (idx >= 0) {
        draft.publishing_jobs[idx] = {
          ...draft.publishing_jobs[idx],
          status: "failed",
          retryCount: draft.publishing_jobs[idx].retryCount + 1,
          lastError: message,
          updatedAt: new Date().toISOString(),
        };
      }
    });
    throw err;
  } finally {
    activeChannelWorkers.delete(lockKey);
  }
}

export function startAutomationScheduler(): void {
  setInterval(() => {
    const db = readDb();
    const now = Date.now();
    const enabledWorkspaces = new Set(
      db.automation_settings
        .filter((s) => s.schedulerRunning && s.publishingMode === "fully-automatic")
        .map((s) => s.workspaceId),
    );
    const activeSubscriptions = new Set(
      db.workspaces
        .filter((w) => w.subscriptionStatus !== "canceled")
        .map((w) => w._id),
    );

    const dueJobs = db.publishing_jobs.filter(
      (j) =>
        enabledWorkspaces.has(j.workspaceId) &&
        activeSubscriptions.has(j.workspaceId) &&
        (j.status === "scheduled" || j.status === "ready") &&
        !j.youtubeVideoId &&
        new Date(j.publishAt).getTime() <= now &&
        !activeChannelWorkers.has(workerLockKey(j.workspaceId, j.channelKey)),
    );
    for (const job of dueJobs) {
      processPublishingJob(job._id).catch((err) => {
        console.error(`[Scheduler] Job ${job._id} failed:`, err);
      });
    }
  }, 30_000);
}
