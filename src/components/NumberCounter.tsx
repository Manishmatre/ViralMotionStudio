import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";
import { evaluateGsapTimeline } from "../utils/gsapTimeline";

type NumberCounterProps = {
  readonly value: number;
  readonly from?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly decimals?: number;
  readonly durationFrames?: number;
  readonly delayFrames?: number;
  readonly fontSize?: number;
  readonly fontFamily?: string;
  readonly color?: string;
  readonly label?: string;
  readonly labelColor?: string;
  readonly delta?: string;
  readonly deltaColor?: string;
};

export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 1,
  durationFrames = 42,
  delayFrames = 4,
  fontSize = 132,
  fontFamily = FONTS.mono,
  color = "#D4AF37",
  label,
  labelColor = "#A1A1AA",
  delta,
  deltaColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delayFrames);
  const animDurationSec = Math.max(0.2, durationFrames / fps);

  // Deterministic GSAP timeline scrubbed by exact frame time
  const state = evaluateGsapTimeline(
    { count: from, opacity: 0, y: 28 },
    (tl, target) => {
      tl.to(
        target,
        {
          count: value,
          duration: animDurationSec,
          ease: "power3.out",
        },
        0,
      ).to(
        target,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0,
      );
    },
    localFrame,
    fps,
  );

  const formatted = state.count.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const deltaOpacity = interpolate(
    localFrame,
    [durationFrames * 0.55, durationFrames * 0.85],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity: state.opacity,
        transform: `translateY(${state.y}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span
          style={{
            fontFamily,
            fontSize,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            color,
          }}
        >
          {prefix}
          {formatted}
          {suffix}
        </span>

        {delta ? (
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 28,
              fontWeight: 700,
              color: deltaColor,
              backgroundColor: `${deltaColor}1F`,
              border: `1px solid ${deltaColor}55`,
              padding: "8px 16px",
              borderRadius: 999,
              opacity: deltaOpacity,
            }}
          >
            {delta}
          </span>
        ) : null}
      </div>

      {label ? (
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: 28,
            fontWeight: 500,
            color: labelColor,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

