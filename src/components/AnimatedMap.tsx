import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { MapArc, MapMarker } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../utils/motion";

type AnimatedMapProps = {
  readonly markers: readonly MapMarker[];
  readonly arcs?: readonly MapArc[];
  readonly accentColor?: string;
  readonly landColor?: string;
  readonly borderColor?: string;
  readonly focusCenter?: readonly [number, number];
  readonly zoom?: number;
  readonly height?: number;
};

/**
 * Clean stylized vector world continent silhouettes on a 1000x500 equirectangular grid.
 */
const CONTINENT_PATHS = [
  // North America
  "M 95,95 L 185,68 L 285,78 L 312,125 L 278,175 L 252,218 L 222,238 L 188,205 L 152,188 L 118,145 Z",
  // Greenland
  "M 322,42 L 385,32 L 405,72 L 352,95 L 318,75 Z",
  // South America
  "M 248,252 L 308,262 L 348,312 L 325,382 L 288,448 L 265,442 L 255,365 L 236,305 Z",
  // Europe
  "M 455,82 L 545,68 L 575,112 L 542,154 L 488,162 L 452,138 Z",
  // Africa
  "M 458,178 L 548,176 L 592,226 L 574,312 L 535,388 L 495,382 L 478,295 L 442,248 Z",
  // Asia
  "M 552,72 L 735,64 L 865,98 L 852,175 L 795,212 L 725,245 L 652,228 L 585,182 L 562,124 Z",
  // Southeast Asia / Indonesia / Japan
  "M 862,145 L 882,132 L 892,158 L 872,172 Z",
  "M 762,258 L 828,266 L 835,288 L 768,284 Z",
  // Australia
  "M 778,318 L 868,316 L 892,368 L 855,406 L 788,392 L 768,354 Z",
];

export const AnimatedMap: React.FC<AnimatedMapProps> = ({
  markers,
  arcs = [],
  accentColor = "#D4AF37",
  landColor = "rgba(255,255,255,0.08)",
  borderColor = "rgba(255,255,255,0.2)",
  focusCenter = [500, 220],
  zoom = 1.25,
  height = 680,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camProgress = interpolate(frame, [0, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const currentZoom = interpolate(camProgress, [0, 1], [1, zoom]);
  const panX = interpolate(camProgress, [0, 1], [0, 500 - focusCenter[0]]);
  const panY = interpolate(camProgress, [0, 1], [0, 250 - focusCenter[1]]);

  const markerById = new Map(markers.map((m) => [m.id, m]));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 28,
        overflow: "hidden",
        backgroundColor: "rgba(8, 12, 20, 0.72)",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
      }}
    >
      <svg
        viewBox="0 0 1000 500"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* Subtle latitude / longitude grid */}
        <g opacity={0.18} stroke={borderColor} strokeWidth={0.8}>
          {[100, 200, 300, 400].map((y) => (
            <line key={`lat-${y}`} x1={0} y1={y} x2={1000} y2={y} strokeDasharray="4 6" />
          ))}
          {[166, 333, 500, 666, 833].map((x) => (
            <line key={`lon-${x}`} x1={x} y1={0} x2={x} y2={500} strokeDasharray="4 6" />
          ))}
        </g>

        <g
          transform={`translate(500 250) scale(${currentZoom}) translate(${-500 + panX} ${-250 + panY})`}
        >
          {/* Continents */}
          {CONTINENT_PATHS.map((d, idx) => (
            <path
              key={idx}
              d={d}
              fill={landColor}
              stroke={borderColor}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          ))}

          {/* Animated connecting arcs */}
          {arcs.map((arc, idx) => {
            const from = markerById.get(arc.fromId);
            const to = markerById.get(arc.toId);
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const distance = Math.hypot(to.x - from.x, to.y - from.y);
            const midY = Math.min(from.y, to.y) - Math.min(110, distance * 0.28);
            const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

            const arcProg = interpolate(
              frame,
              [14 + idx * 8, 40 + idx * 8],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EDITORIAL_EASE,
              },
            );

            const evolved = evolvePath(arcProg, pathD);
            const strokeColor = arc.color ?? accentColor;

            return (
              <path
                key={`${arc.fromId}-${arc.toId}-${idx}`}
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={evolved.strokeDasharray}
                strokeDashoffset={evolved.strokeDashoffset}
                opacity={0.9}
              />
            );
          })}

          {/* Pulsing HQ / Region Markers */}
          {markers.map((marker, idx) => {
            const delay = 8 + idx * 6;
            const pop = enterSpring(frame, fps, delay, 14, 180);
            const pulse = 1 + 0.35 * Math.sin(((frame - delay) / fps) * 4);
            const color = marker.color ?? accentColor;

            return (
              <g
                key={marker.id}
                transform={`translate(${marker.x}, ${marker.y}) scale(${pop})`}
              >
                <circle
                  r={18 * pulse}
                  fill={color}
                  opacity={0.18}
                />
                <circle
                  r={7}
                  fill={color}
                  stroke="#09090B"
                  strokeWidth={2}
                />
                <g transform="translate(14, -14)">
                  <rect
                    x={0}
                    y={-18}
                    width={Math.max(118, marker.label.length * 10.5 + 24)}
                    height={46}
                    rx={8}
                    fill="rgba(9, 9, 11, 0.9)"
                    stroke={color}
                    strokeWidth={1.2}
                  />
                  <text
                    x={10}
                    y={0}
                    fill="#FFFFFF"
                    fontSize={13}
                    fontWeight={700}
                    fontFamily={FONTS.jakarta}
                  >
                    {marker.label}
                  </text>
                  <text
                    x={10}
                    y={18}
                    fill={color}
                    fontSize={13}
                    fontWeight={700}
                    fontFamily={FONTS.mono}
                  >
                    {marker.value}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

