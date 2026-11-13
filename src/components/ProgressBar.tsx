import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

type StoryProgressBarProps = {
  readonly accentColor?: string;
  readonly trackColor?: string;
  readonly height?: number;
  readonly topOffset?: number;
};

export const ProgressBar: React.FC<StoryProgressBarProps> = ({
  accentColor = "#D4AF37",
  trackColor = "rgba(255,255,255,0.14)",
  height = 6,
  topOffset = 48,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames - 1)));

  return (
    <div
      style={{
        position: "absolute",
        top: topOffset,
        left: 64,
        right: 64,
        height,
        borderRadius: 999,
        backgroundColor: trackColor,
        overflow: "hidden",
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: accentColor,
          boxShadow: `0 0 18px ${accentColor}99`,
          borderRadius: 999,
        }}
      />
    </div>
  );
};

type AnimatedStatBarProps = {
  readonly label: string;
  readonly valueText: string;
  readonly ratio: number;
  readonly sublabel?: string;
  readonly barColor?: string;
  readonly trackColor?: string;
  readonly textColor?: string;
  readonly delayFrames?: number;
  readonly rank?: number;
};

export const AnimatedStatBar: React.FC<AnimatedStatBarProps> = ({
  label,
  valueText,
  ratio,
  sublabel,
  barColor = "#D4AF37",
  trackColor = "rgba(255,255,255,0.08)",
  textColor = "#F8F6F0",
  delayFrames = 0,
  rank,
}) => {
  const frame = useCurrentFrame();
  const clampedRatio = Math.min(1, Math.max(0.05, ratio));

  const fill = interpolate(
    frame,
    [delayFrames, delayFrames + 26],
    [0, clampedRatio],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EDITORIAL_EASE,
    },
  );

  const opacity = interpolate(frame, [delayFrames, delayFrames + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity,
        transform: `translateX(${interpolate(opacity, [0, 1], [-24, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          {rank !== undefined ? (
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 24,
                fontWeight: 700,
                color: barColor,
              }}
            >
              0{rank}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: FONTS.jakarta,
              fontSize: 32,
              fontWeight: 700,
              color: textColor,
            }}
          >
            {label}
          </span>
          {sublabel ? (
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 21,
                color: "rgba(255,255,255,0.52)",
              }}
            >
              {sublabel}
            </span>
          ) : null}
        </div>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 32,
            fontWeight: 700,
            color: barColor,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {valueText}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 20,
          borderRadius: 999,
          backgroundColor: trackColor,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${barColor}AA 0%, ${barColor} 100%)`,
            boxShadow: `0 0 24px ${barColor}55`,
          }}
        />
      </div>
    </div>
  );
};

