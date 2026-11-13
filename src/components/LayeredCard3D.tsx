import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, enterSpring } from "../utils/motion";

type LayeredCard3DProps = {
  readonly children: React.ReactNode;
  readonly delayFrames?: number;
  readonly tiltX?: number;
  readonly tiltY?: number;
  readonly accentColor?: string;
  readonly surfaceColor?: string;
  readonly borderColor?: string;
  readonly padding?: number;
  readonly borderRadius?: number;
  readonly shimmer?: boolean;
};

export const LayeredCard3D: React.FC<LayeredCard3DProps> = ({
  children,
  delayFrames = 0,
  tiltX = 4,
  tiltY = -6,
  accentColor = "#D4AF37",
  surfaceColor = "rgba(18, 20, 26, 0.86)",
  borderColor = "rgba(255, 255, 255, 0.14)",
  padding = 36,
  borderRadius = 28,
  shimmer = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springVal = enterSpring(frame, fps, delayFrames, 18, 130);
  const localFrame = Math.max(0, frame - delayFrames);

  const rx = interpolate(springVal, [0, 1], [16, tiltX]);
  const ry = interpolate(springVal, [0, 1], [-18, tiltY]);
  const y = interpolate(springVal, [0, 1], [48, 0]);
  const opacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  // Specular sweep across the glass card
  const sheenPos = interpolate(localFrame, [10, 48], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        perspective: 1400,
        opacity,
      }}
    >
      {/* Back depth plate for 3D layered look */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          backgroundColor: `${accentColor}16`,
          border: `1px solid ${accentColor}33`,
          transform: `translate3d(14px, 16px, -24px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      />

      {/* Foreground glass surface */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius,
          padding,
          backgroundColor: surfaceColor,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 28px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.14)`,
          transform: `translate3d(0px, ${y}px, 0px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        {shimmer ? (
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              width: 140,
              left: `${sheenPos}%`,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              transform: "skewX(-22deg)",
              pointerEvents: "none",
            }}
          />
        ) : null}
        {children}
      </div>
    </div>
  );
};

