import React from "react";
import { AbsoluteFill } from "remotion";
import type { VisualStyle } from "../types/video";
import { ParticleField } from "./engine/EnvironmentAndScenes";

type ParticleBackgroundProps = {
  readonly bgPrimary: string;
  readonly bgSecondary: string;
  readonly accentColor: string;
  readonly visualStyle: VisualStyle;
  readonly particleCount?: number;
};

/**
 * Restrained atmospheric cinema canvas background without cartoon circles or large blobs.
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  bgPrimary,
  bgSecondary,
  accentColor,
  visualStyle,
  particleCount = 16,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${bgSecondary} 0%, ${bgPrimary} 76%)`,
        overflow: "hidden",
      }}
    >
      {visualStyle === "futuristic-hud" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${accentColor}12 1px, transparent 1px), linear-gradient(90deg, ${accentColor}12 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.75) 18%, transparent 78%)",
          }}
        />
      ) : null}

      <ParticleField color={accentColor} count={particleCount} maxOpacity={0.14} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, transparent 50%, rgba(0,0,0,0.68) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
