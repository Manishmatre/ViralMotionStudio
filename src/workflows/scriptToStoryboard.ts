import type { Caption } from "@remotion/captions";
import type {
  SfxCue,
  Storyboard,
  StoryboardScene,
  TemplateCategory,
  VisualStyle,
} from "../types/video";

export type ScriptBeat = {
  readonly id: string;
  readonly title: string;
  readonly narration: string;
  readonly durationSeconds: number;
  readonly sceneSpec: Omit<StoryboardScene, "id" | "title" | "durationInFrames">;
};

/**
 * Step 1-6 workflow compiler:
 * Converts a narration script + scene beats into timed Remotion scenes,
 * word-by-word Caption[] timestamps, and synchronized SFX cues.
 */
export const buildStoryboardFromScript = ({
  id,
  topic,
  category,
  visualStyle,
  fps = 30,
  width = 1080,
  height = 1920,
  transitionOverlapFrames = 12,
  beats,
}: {
  readonly id: string;
  readonly topic: string;
  readonly category: TemplateCategory;
  readonly visualStyle: VisualStyle;
  readonly fps?: number;
  readonly width?: number;
  readonly height?: number;
  readonly transitionOverlapFrames?: number;
  readonly beats: readonly ScriptBeat[];
}): {
  readonly storyboard: Storyboard;
  readonly totalDurationInFrames: number;
} => {
  const scenes: StoryboardScene[] = beats.map((beat) => ({
    id: beat.id,
    title: beat.title,
    durationInFrames: Math.round(beat.durationSeconds * fps),
    ...beat.sceneSpec,
  }));

  const captions: Caption[] = [];
  const sfxCues: SfxCue[] = [];
  let cursorFrame = 0;

  beats.forEach((beat, idx) => {
    const durationFrames = Math.round(beat.durationSeconds * fps);
    const startMs = (cursorFrame / fps) * 1000;
    const endMs = ((cursorFrame + durationFrames - 8) / fps) * 1000;

    if (beat.sceneSpec.sfx) {
      sfxCues.push({
        id: `sfx-${beat.id}`,
        frame: cursorFrame + (idx === 0 ? 2 : 0),
        preset: beat.sceneSpec.sfx,
        volume: beat.sceneSpec.sfx === "boom" ? 0.5 : 0.36,
      });
    }

    const words = beat.narration.trim().split(/\s+/).filter(Boolean);
    const msPerWord = words.length > 0 ? (endMs - startMs) / words.length : 0;

    words.forEach((word, wIdx) => {
      const wStart = Math.round(startMs + wIdx * msPerWord);
      const wEnd = Math.round(startMs + (wIdx + 1) * msPerWord);
      captions.push({
        text: `${wIdx === 0 ? "" : " "}${word}`,
        startMs: wStart,
        endMs: wEnd,
        timestampMs: Math.round((wStart + wEnd) / 2),
        confidence: 1,
      });
    });

    cursorFrame +=
      durationFrames - (idx < beats.length - 1 ? transitionOverlapFrames : 0);
  });

  const totalDurationInFrames =
    scenes.reduce((acc, s) => acc + s.durationInFrames, 0) -
    Math.max(0, scenes.length - 1) * transitionOverlapFrames;

  return {
    storyboard: {
      id,
      topic,
      category,
      visualStyle,
      fps,
      width,
      height,
      scenes,
      captions,
      sfxCues,
    },
    totalDurationInFrames,
  };
};

