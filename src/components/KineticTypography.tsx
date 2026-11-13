import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";
import { enterSpring } from "../utils/motion";

export type KineticWord = {
  readonly text: string;
  readonly highlight?: boolean;
  readonly sizeMultiplier?: number;
};

type KineticTypographyProps = {
  readonly lines: readonly (readonly KineticWord[])[];
  readonly staggerFrames?: number;
  readonly fontFamily?: string;
  readonly baseFontSize?: number;
  readonly textColor?: string;
  readonly accentColor?: string;
  readonly align?: "left" | "center";
  readonly delayFrames?: number;
};

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  lines,
  staggerFrames = 4,
  fontFamily = FONTS.jakarta,
  baseFontSize = 72,
  textColor = "#F8FAFC",
  accentColor = "#00E5FF",
  align = "left",
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let globalIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 12,
      }}
    >
      {lines.map((line, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: align === "center" ? "center" : "flex-start",
            gap: "0.34em",
            alignItems: "baseline",
          }}
        >
          {line.map((word) => {
            const idx = globalIndex++;
            const start = delayFrames + idx * staggerFrames;
            const springVal = enterSpring(frame, fps, start, 15, 210);
            const opacity = interpolate(frame, [start, start + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = interpolate(springVal, [0, 1], [34, 0]);
            const scale = interpolate(springVal, [0, 1], [0.84, 1]);

            return (
              <span
                key={`${word.text}-${idx}`}
                style={{
                  display: "inline-block",
                  fontFamily,
                  fontSize: baseFontSize * (word.sizeMultiplier ?? 1),
                  fontWeight: word.highlight ? 800 : 700,
                  lineHeight: 1.06,
                  letterSpacing: "-0.025em",
                  color: word.highlight ? accentColor : textColor,
                  opacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  textShadow: word.highlight
                    ? `0 0 36px ${accentColor}44`
                    : "none",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

