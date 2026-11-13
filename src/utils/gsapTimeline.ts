import gsap from "gsap";

export type GsapState = Record<string, number>;

/**
 * Evaluates a deterministic GSAP timeline at a specific Remotion frame.
 * GSAP runs paused and is scrubbed cleanly with `.seek(frame / fps)` so
 * every Remotion render frame is 100% reproducible without RAF side effects.
 */
export const evaluateGsapTimeline = <T extends GsapState>(
  initialState: T,
  buildTimeline: (tl: gsap.core.Timeline, target: T) => void,
  frame: number,
  fps: number,
): T => {
  const target: T = { ...initialState };
  const tl = gsap.timeline({ paused: true });
  buildTimeline(tl, target);
  const timeSeconds = Math.max(0, frame / fps);
  tl.seek(timeSeconds, false);
  tl.kill();
  return target;
};

/**
 * Evaluates a named GSAP easing curve deterministically for progress in [0, 1].
 */
export const gsapEase = (easeName: string, progress: number): number => {
  const clamped = Math.min(1, Math.max(0, progress));
  const fn = gsap.parseEase(easeName);
  return fn(clamped);
};

