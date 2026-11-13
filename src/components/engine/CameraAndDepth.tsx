import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, enterSpring } from "../../utils/motion";

export type CameraMovementPreset =
  | "dolly-in"
  | "dolly-out"
  | "pan-right"
  | "pan-left"
  | "tilt-up"
  | "subtle-float";

type CameraRig2DProps = {
  readonly children: React.ReactNode;
  readonly movement?: CameraMovementPreset;
  readonly intensity?: number;
  readonly impactFrame?: number;
};

/**
 * Deterministic 2D/2.5D cinema camera rig simulating dolly push-ins, smooth pans,
 * subtle optical breathing, and optional impact tremor driven strictly by Remotion frames.
 */
export const CameraRig2D: React.FC<CameraRig2DProps> = ({
  children,
  movement = "dolly-in",
  intensity = 1,
  impactFrame,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  let scale = 1;
  let tx = 0;
  let ty = 0;

  if (movement === "dolly-in") {
    scale = 1 + progress * 0.08 * intensity;
    ty = -progress * 10 * intensity;
  } else if (movement === "dolly-out") {
    scale = 1.09 - progress * 0.08 * intensity;
    ty = progress * 8 * intensity;
  } else if (movement === "pan-right") {
    scale = 1.06;
    tx = interpolate(progress, [0, 1], [-18 * intensity, 18 * intensity]);
  } else if (movement === "pan-left") {
    scale = 1.06;
    tx = interpolate(progress, [0, 1], [18 * intensity, -18 * intensity]);
  } else if (movement === "tilt-up") {
    scale = 1.06;
    ty = interpolate(progress, [0, 1], [18 * intensity, -18 * intensity]);
  } else {
    const t = frame / fps;
    scale = 1.02 + Math.sin(t * 0.5) * 0.012 * intensity;
    tx = Math.sin(t * 0.55) * 7 * intensity;
    ty = Math.cos(t * 0.45) * 5 * intensity;
  }

  let shakeX = 0;
  let shakeY = 0;
  if (impactFrame !== undefined && frame >= impactFrame && frame < impactFrame + 12) {
    const decay = 1 - (frame - impactFrame) / 12;
    shakeX = Math.sin(frame * 2.4) * 5 * decay;
    shakeY = Math.cos(frame * 3.1) * 4 * decay;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${(tx + shakeX).toFixed(2)}px, ${(ty + shakeY).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type ParallaxLayerProps = {
  readonly children: React.ReactNode;
  readonly depth?: number;
  readonly driftX?: number;
  readonly driftY?: number;
  readonly style?: React.CSSProperties;
};

/**
 * Depth-weighted layer that shifts proportionally to simulated Z-depth across the scene timeline.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depth = 1,
  driftX = 24,
  driftY = 14,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [-0.5, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = progress * driftX * depth;
  const y = progress * driftY * depth;
  const scale = 1 + (depth - 1) * 0.02;

  return (
    <div
      style={{
        transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export type RevealMode = "curtain-vertical" | "curtain-horizontal" | "aperture-iris" | "diagonal";

type ImageRevealProps = {
  readonly src: string;
  readonly mode?: RevealMode;
  readonly delayFrames?: number;
  readonly durationFrames?: number;
  readonly kenBurnsScale?: number;
  readonly overlayGradient?: string;
  readonly opacity?: number;
  readonly objectPosition?: string;
  readonly filter?: string;
};

/**
 * Photorealistic visual plate renderer with deterministic optical reveal masks,
 * Ken Burns zoom, and atmospheric scrims so documentary typography reads effortlessly.
 */
export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  mode = "curtain-vertical",
  delayFrames = 0,
  durationFrames = 26,
  kenBurnsScale = 1.09,
  overlayGradient = "linear-gradient(180deg, rgba(7,9,14,0.82) 0%, rgba(7,9,14,0.34) 48%, rgba(7,9,14,0.92) 100%)",
  opacity = 1,
  objectPosition = "center center",
  filter = "contrast(1.06) saturate(0.92) brightness(0.76)",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const rev = interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const kb = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [1.0, kenBurnsScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let clipPath = "inset(0% 0% 0% 0%)";
  if (mode === "curtain-vertical") {
    const pct = (1 - rev) * 50;
    clipPath = `inset(${pct.toFixed(2)}% 0% ${pct.toFixed(2)}% 0%)`;
  } else if (mode === "curtain-horizontal") {
    const right = (1 - rev) * 100;
    clipPath = `inset(0% ${right.toFixed(2)}% 0% 0%)`;
  } else if (mode === "aperture-iris") {
    const r = rev * 85;
    clipPath = `circle(${r.toFixed(2)}% at 50% 50%)`;
  } else if (mode === "diagonal") {
    const edge = rev * 140;
    clipPath = `polygon(0 0, ${edge.toFixed(1)}% 0, ${(edge - 35).toFixed(1)}% 100%, 0 100%)`;
  }

  const resolvedSrc =
    src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")
      ? src
      : staticFile(src);

  return (
    <AbsoluteFill style={{ clipPath, opacity, overflow: "hidden" }}>
      <Img
        src={resolvedSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${kb.toFixed(4)})`,
          filter,
        }}
      />
      <AbsoluteFill style={{ background: overlayGradient }} />
    </AbsoluteFill>
  );
};

type VideoMaskRevealProps = {
  readonly children: React.ReactNode;
  readonly delayFrames?: number;
  readonly durationFrames?: number;
  readonly direction?: "up" | "right" | "expand";
  readonly borderRadius?: number;
  readonly borderColor?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Windowed cinematic viewport reveal — ideal for aspect-ratio conversions (9:16 & 16:9)
 * or layered B-roll inspection panels without generic boxy cards.
 */
export const VideoMaskReveal: React.FC<VideoMaskRevealProps> = ({
  children,
  delayFrames = 0,
  durationFrames = 24,
  direction = "expand",
  borderRadius = 14,
  borderColor = "rgba(255,255,255,0.18)",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prog = interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });
  const s = enterSpring(frame, fps, delayFrames, 20, 140);

  let clipPath = "inset(0% 0% 0% 0%)";
  if (direction === "up") {
    clipPath = `inset(${((1 - prog) * 100).toFixed(2)}% 0% 0% 0%)`;
  } else if (direction === "right") {
    clipPath = `inset(0% ${((1 - prog) * 100).toFixed(2)}% 0% 0%)`;
  } else {
    const inset = (1 - prog) * 18;
    clipPath = `inset(${inset.toFixed(2)}% ${inset.toFixed(2)}% ${inset.toFixed(2)}% ${inset.toFixed(2)}% round ${borderRadius}px)`;
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        border: `1px solid ${borderColor}`,
        clipPath,
        transform: `scale(${interpolate(s, [0, 1], [0.96, 1])})`,
        opacity: interpolate(prog, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
        boxShadow: "0 28px 65px rgba(0, 0, 0, 0.65)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

type LightSweepProps = {
  readonly color?: string;
  readonly startFrame?: number;
  readonly durationFrames?: number;
  readonly angleDeg?: number;
  readonly widthPct?: number;
  readonly maxOpacity?: number;
};

/**
 * Volumetric anamorphic light beam sweeping diagonally across the scene or title stage.
 */
export const LightSweep: React.FC<LightSweepProps> = ({
  color = "#FFFFFF",
  startFrame = 6,
  durationFrames = 44,
  angleDeg = 22,
  widthPct = 36,
  maxOpacity = 0.2,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  if (frame < startFrame || frame > startFrame + durationFrames) {
    return null;
  }

  const leftPct = interpolate(progress, [0, 1], [-45, 130]);
  const alpha = Math.sin(progress * Math.PI) * maxOpacity;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 18 }}>
      <div
        style={{
          position: "absolute",
          top: "-25%",
          bottom: "-25%",
          left: `${leftPct.toFixed(2)}%`,
          width: `${widthPct}%`,
          transform: `skewX(-${angleDeg}deg)`,
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: alpha,
          filter: "blur(26px)",
        }}
      />
    </AbsoluteFill>
  );
};

