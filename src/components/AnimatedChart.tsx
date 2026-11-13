import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { ChartDatum } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";
import { AnimatedStatBar } from "./ProgressBar";

type AnimatedChartProps = {
  readonly data: readonly ChartDatum[];
  readonly accentColor?: string;
  readonly textColor?: string;
  readonly mode?: "bars" | "sparkline";
  readonly title?: string;
};

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  accentColor = "#D4AF37",
  textColor = "#F8F6F0",
  mode = "bars",
  title,
}) => {
  const frame = useCurrentFrame();

  if (mode === "sparkline") {
    const width = 880;
    const height = 340;
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const minVal = Math.min(...data.map((d) => d.value), 0);
    const span = Math.max(1, maxVal - minVal);

    const points = data.map((d, idx) => {
      const x =
        data.length === 1
          ? width / 2
          : 40 + (idx / (data.length - 1)) * (width - 80);
      const y = height - 48 - ((d.value - minVal) / span) * (height - 96);
      return { x, y, datum: d };
    });

    const pathD = points
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const drawProgress = interpolate(frame, [6, 46], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EDITORIAL_EASE,
    });

    const evolved = evolvePath(drawProgress, pathD);

    return (
      <div
        style={{
          padding: 32,
          borderRadius: 28,
          backgroundColor: "rgba(18, 22, 32, 0.78)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {title ? (
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {title}
          </span>
        ) : null}

        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height }}>
          {[0.25, 0.5, 0.75].map((r) => (
            <line
              key={r}
              x1={32}
              y1={height * r}
              x2={width - 32}
              y2={height * r}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="6 8"
            />
          ))}
          <path
            d={pathD}
            fill="none"
            stroke={accentColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
          {points.map((pt, idx) => {
            const ptThreshold = idx / Math.max(1, points.length - 1);
            const ptOpacity = interpolate(
              drawProgress,
              [Math.max(0, ptThreshold - 0.08), ptThreshold + 0.04],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <g key={pt.datum.label} opacity={ptOpacity}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={10}
                  fill={accentColor}
                  stroke="#09090B"
                  strokeWidth={3}
                />
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.65)"
                  fontSize={20}
                  fontFamily={FONTS.mono}
                >
                  {pt.datum.label}
                </text>
                <text
                  x={pt.x}
                  y={pt.y - 20}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={22}
                  fontWeight={700}
                  fontFamily={FONTS.mono}
                >
                  {pt.datum.formattedValue}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 34,
        borderRadius: 28,
        backgroundColor: "rgba(16, 18, 24, 0.8)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {title ? (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accentColor,
          }}
        >
          {title}
        </span>
      ) : null}

      {data.map((item, idx) => (
        <AnimatedStatBar
          key={item.label}
          rank={idx + 1}
          label={item.label}
          sublabel={item.ticker ?? item.sublabel}
          valueText={item.formattedValue}
          ratio={item.value / maxValue}
          barColor={item.color ?? accentColor}
          textColor={textColor}
          delayFrames={idx * 5}
        />
      ))}
    </div>
  );
};

