import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const compositionId = args[0] ?? "RichestCompaniesCinematic";
const outDir = path.resolve(process.cwd(), "out");
fs.mkdirSync(outDir, { recursive: true });

const rawOut = path.join(outDir, `${compositionId}.raw.mp4`);
const finalOut = path.join(outDir, `${compositionId}.mp4`);

console.log(`Rendering ${compositionId} -> ${rawOut}`);
execFileSync(
  "npx",
  [
    "remotion",
    "render",
    "src/index.ts",
    compositionId,
    rawOut,
    "--codec=h264",
    "--pixel-format=yuv420p",
    "--crf=18",
  ],
  { stdio: "inherit", shell: process.platform === "win32" },
);

const bundledFfmpeg = path.resolve(
  process.cwd(),
  "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
);
const ffmpegBin = fs.existsSync(bundledFfmpeg) ? bundledFfmpeg : "ffmpeg";

try {
  execFileSync(ffmpegBin, ["-version"], { stdio: "ignore" });
  console.log(`Applying FFmpeg faststart + audio normalization with ${ffmpegBin} -> ${finalOut}`);
  execFileSync(
    ffmpegBin,
    [
      "-y",
      "-i",
      rawOut,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      finalOut,
    ],
    { stdio: "inherit" },
  );
  fs.unlinkSync(rawOut);
} catch {
  console.log("FFmpeg post-processing skipped; using Remotion H.264 output directly.");
  fs.renameSync(rawOut, finalOut);
}

console.log(`Render complete: ${finalOut}`);

