import { noise2D } from "@remotion/noise";
import type { TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CameraRig2D,
  type CameraMovementPreset,
  ImageReveal,
  LightSweep,
  type RevealMode,
} from "./CameraAndDepth";

type ParticleFieldProps = {
  readonly color?: string;
  readonly count?: number;
  readonly maxOpacity?: number;
};

/**
 * Fine atmospheric micro-dust pinpoints (1–2px). Never draws oversized cartoon circles or blobs.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  color = "#FFFFFF",
  count = 22,
  maxOpacity = 0.24,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {Array.from({ length: count }, (_, i) => {
        const nx = noise2D(`pfx-${i}`, t * 0.06, i * 0.41);
        const ny = noise2D(`pfy-${i}`, i * 0.29, t * 0.07);
        const x = ((i * 211) % width) + nx * 64;
        const y = ((i * 307) % height) + ny * 72;
        const r = 0.9 + (i % 2) * 0.7;
        const alpha = (0.25 + ((i % 4) * 0.18)) * maxOpacity;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 4 === 0 ? color : "#FFFFFF"}
            opacity={alpha}
          />
        );
      })}
    </svg>
  );
};

export type DepthTransitionProps = {
  readonly direction?: "push" | "pull";
};

/**
 * Custom Remotion depth-blur + scale push transition between connected documentary/explainer scenes.
 */
export const DepthTransition: React.FC<
  TransitionPresentationComponentProps<DepthTransitionProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const isEntering = presentationDirection === "entering";
  const dir = passedProps?.direction ?? "push";

  const scale = isEntering
    ? interpolate(presentationProgress, [0, 1], [dir === "push" ? 1.1 : 0.92, 1])
    : interpolate(presentationProgress, [0, 1], [1, dir === "push" ? 0.93 : 1.08]);

  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.75], [0, 1], { extrapolateRight: "clamp" })
    : interpolate(presentationProgress, [0.25, 1], [1, 0], { extrapolateLeft: "clamp" });

  const blurPx = isEntering
    ? interpolate(presentationProgress, [0, 0.7], [8, 0], { extrapolateRight: "clamp" })
    : interpolate(presentationProgress, [0.2, 1], [0, 8], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale.toFixed(4)})`,
        opacity,
        filter: blurPx > 0.2 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type CinematicSceneProps = {
  readonly children: React.ReactNode;
  readonly photoSrc?: string;
  readonly revealMode?: RevealMode;
  readonly cameraMovement?: CameraMovementPreset;
  readonly overlayGradient?: string;
  readonly bgColor?: string;
  readonly accentColor?: string;
  readonly showLightSweep?: boolean;
  readonly showMicroDust?: boolean;
  readonly photoFilter?: string;
  readonly photoObjectPosition?: string;
  readonly padding?: string | number;
};

/**
 * Master Engine A / Engine B scene wrapper uniting CameraRig2D, photographic plate reveal,
 * graded atmospheric vignette, volumetric LightSweep, and foreground typography/graphic slots.
 */
export const CinematicScene: React.FC<CinematicSceneProps> = ({
  children,
  photoSrc,
  revealMode = "curtain-vertical",
  cameraMovement = "dolly-in",
  overlayGradient = "linear-gradient(180deg, rgba(6,8,14,0.84) 0%, rgba(6,8,14,0.38) 46%, rgba(6,8,14,0.92) 100%)",
  bgColor = "#06080E",
  accentColor = "#D4AF37",
  showLightSweep = true,
  showMicroDust = true,
  photoFilter = "contrast(1.06) saturate(0.92) brightness(0.78)",
  photoObjectPosition = "center center",
  padding = "130px 72px 280px 72px",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden" }}>
      <CameraRig2D movement={cameraMovement} intensity={0.95}>
        {photoSrc ? (
          <ImageReveal
            src={photoSrc}
            mode={revealMode}
            durationFrames={24}
            overlayGradient={overlayGradient}
            filter={photoFilter}
            objectPosition={photoObjectPosition}
          />
        ) : (
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 25%, ${accentColor}16 0%, ${bgColor} 70%)`,
            }}
          />
        )}
      </CameraRig2D>

      {showMicroDust ? <ParticleField color={accentColor} count={20} maxOpacity={0.22} /> : null}
      {showLightSweep ? <LightSweep color={accentColor} startFrame={6} durationFrames={42} maxOpacity={0.16} /> : null}

      {/* Optical cinema edge vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, transparent 56%, rgba(3,4,8,0.68) 100%)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          padding,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

