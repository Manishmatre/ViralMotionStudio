import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../../utils/motion";
import { KineticTypography } from "../KineticTypography";

export { KineticTypography };

export type StatItem = {
  readonly label: string;
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly decimals?: number;
  readonly delta?: string;
  readonly accentColor?: string;
};

type AnimatedStatisticsProps = {
  readonly items: readonly StatItem[];
  readonly delayFrames?: number;
  readonly accentColor?: string;
  readonly textColor?: string;
  readonly columns?: number;
};

/**
 * Editorial financial statistics ledger with open hairline rules and tabular numerals.
 * Replaces boxy rounded software cards with documentary broadcast typography.
 */
export const AnimatedStatistics: React.FC<AnimatedStatisticsProps> = ({
  items,
  delayFrames = 6,
  accentColor = "#D4AF37",
  textColor = "#F8FAFC",
  columns = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        gap: "24px 36px",
        borderTop: "1px solid rgba(255,255,255,0.16)",
        paddingTop: 22,
      }}
    >
      {items.map((item, idx) => {
        const itemDelay = delayFrames + idx * 6;
        const rev = enterSpring(frame, fps, itemDelay, 18, 130);
        const countProg = interpolate(
          frame,
          [itemDelay, itemDelay + 34],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EDITORIAL_EASE,
          },
        );
        const val = item.value * countProg;
        const decimals = item.decimals ?? 1;
        const formatted =
          decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
        const colColor = item.accentColor ?? accentColor;

        return (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingBottom: 18,
              borderBottom: `1px solid rgba(255,255,255,0.1)`,
              opacity: interpolate(rev, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(rev, [0, 1], [18, 0]).toFixed(1)}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(248,250,252,0.68)",
                }}
              >
                {item.label}
              </span>
              {item.delta ? (
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 16,
                    fontWeight: 700,
                    color: colColor,
                  }}
                >
                  {item.delta}
                </span>
              ) : null}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.05,
                color: textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.prefix ?? ""}
              {formatted}
              {item.suffix ?? ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

