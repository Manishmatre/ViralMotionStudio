import { Easing, interpolate, spring } from "remotion";

export const EDITORIAL_EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const SNAP_EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const clamp01 = (value: number): number =>
  Math.min(1, Math.max(0, value));

export const enterSpring = (
  frame: number,
  fps: number,
  delayFrames = 0,
  damping = 18,
  stiffness = 140,
): number => {
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping, stiffness, mass: 0.9 },
  });
};

export const smoothReveal = (
  frame: number,
  startFrame: number,
  durationFrames: number,
): number => {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });
};

/**
 * Subtle continuous camera micro-drift so frames always feel alive,
 * even during static reading beats.
 */
export const useCameraDrift = (frame: number, fps: number, amplitude = 1) => {
  const t = frame / fps;
  const scale = 1 + 0.025 * Math.sin(t * 0.45) * amplitude + t * 0.004 * amplitude;
  const x = Math.sin(t * 0.6) * 8 * amplitude;
  const y = Math.cos(t * 0.5) * 6 * amplitude;
  return { scale, x, y };
};

