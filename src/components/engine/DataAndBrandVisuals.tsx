import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ChartDatum, MapArc, MapMarker } from "../../types/video";
import { FONTS } from "../../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../../utils/motion";
import { BrandLogoMark } from "./BrandLogoMark";

type FinancialChartMode = "pillars" | "area-curve" | "split-compare";

type FinancialChartProps = {
  readonly data: readonly ChartDatum[];
  readonly mode?: FinancialChartMode;
  readonly accentColor?: string;
  readonly secondaryColor?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly height?: number;
  readonly delayFrames?: number;
};

/**
 * Dynamic, non-card editorial financial data visualization component.
 * Renders open-air SVG pillars, spline area charts with tracking reticle, or split era benchmarks.
 */
export const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  mode = "pillars",
  accentColor = "#D4AF37",
  secondaryColor = "#38BDF8",
  title,
  subtitle,
  height = 460,
  delayFrames = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delayFrames);

  if (mode === "area-curve") {
    const width = 900;
    const h = height;
    const padX = 54;
    const padTop = 58;
    const padBottom = 64;
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const minVal = Math.min(...data.map((d) => d.value), 0);
    const span = Math.max(0.1, maxVal - minVal);

    const pts = data.map((d, idx) => {
      const x =
        data.length === 1
          ? width / 2
          : padX + (idx / (data.length - 1)) * (width - padX * 2);
      const y =
        h - padBottom - ((d.value - minVal) / span) * (h - padTop - padBottom);
      return { x, y, datum: d };
    });

    // Build smooth cubic spline path
    let lineD = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midX = (p0.x + p1.x) / 2;
      lineD += ` C ${midX.toFixed(1)} ${p0.y.toFixed(1)}, ${midX.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)} ${h - padBottom} L ${pts[0].x.toFixed(1)} ${h - padBottom} Z`;

    const drawProg = interpolate(localFrame, [0, 48], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EDITORIAL_EASE,
    });
    const evolved = evolvePath(drawProg, lineD);
    const clipX = interpolate(drawProg, [0, 1], [0, width]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {title ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 21,
                letterSpacing: "0.14em",
                color: accentColor,
                textTransform: "uppercase",
              }}
            >
              {title}
            </span>
            {subtitle ? (
              <span style={{ fontFamily: FONTS.inter, fontSize: 18, color: "rgba(248,250,252,0.64)" }}>
                {subtitle}
              </span>
            ) : null}
          </div>
        ) : null}
        <svg viewBox={`0 0 ${width} ${h}`} style={{ width: "100%", height: h, overflow: "visible" }}>
          <defs>
            <linearGradient id="vmsFinAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.42" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </linearGradient>
            <clipPath id="vmsFinAreaClip">
              <rect x={0} y={0} width={clipX} height={h} />
            </clipPath>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((r) => {
            const gy = padTop + (h - padTop - padBottom) * r;
            return (
              <line
                key={r}
                x1={padX}
                y1={gy}
                x2={width - padX}
                y2={gy}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4 8"
              />
            );
          })}

          <path d={areaD} fill="url(#vmsFinAreaFill)" clipPath="url(#vmsFinAreaClip)" />

          <path
            d={lineD}
            fill="none"
            stroke={accentColor}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />

          {pts.map((pt, idx) => {
            const thresh = idx / Math.max(1, pts.length - 1);
            const ptAlpha = interpolate(drawProg, [Math.max(0, thresh - 0.08), thresh + 0.03], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const isLast = idx === pts.length - 1;
            const pulseR = isLast ? 14 + Math.sin((frame / fps) * 6) * 4 : 0;

            return (
              <g key={pt.datum.label} opacity={ptAlpha}>
                {isLast ? (
                  <circle cx={pt.x} cy={pt.y} r={pulseR} fill={accentColor} opacity={0.22} />
                ) : null}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isLast ? 9 : 6.5}
                  fill="#07090F"
                  stroke={pt.datum.color ?? accentColor}
                  strokeWidth={3.5}
                />
                <text
                  x={pt.x}
                  y={h - 22}
                  textAnchor="middle"
                  fill="rgba(248,250,252,0.72)"
                  fontSize={20}
                  fontFamily={FONTS.mono}
                >
                  {pt.datum.label}
                </text>
                <text
                  x={pt.x}
                  y={pt.y - 20}
                  textAnchor="middle"
                  fill="#F8FAFC"
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

  if (mode === "split-compare") {
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {title ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 21,
                letterSpacing: "0.14em",
                color: accentColor,
                textTransform: "uppercase",
              }}
            >
              {title}
            </span>
            {subtitle ? (
              <span style={{ fontFamily: FONTS.inter, fontSize: 18, color: "rgba(248,250,252,0.62)" }}>
                {subtitle}
              </span>
            ) : null}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {data.map((row, idx) => {
            const p = interpolate(localFrame, [idx * 5, idx * 5 + 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EDITORIAL_EASE,
            });
            const widthPct = (row.value / maxVal) * 100 * p;
            const barColor = row.color ?? (idx === 0 ? accentColor : secondaryColor);

            return (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingBottom: 14,
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 26, fontWeight: 700, color: "#F8FAFC" }}>
                      {row.label}
                    </span>
                    {row.ticker ? (
                      <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: barColor }}>
                        {row.ticker}
                      </span>
                    ) : null}
                  </div>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: barColor }}>
                    {row.formattedValue}
                  </span>
                </div>
                <div
                  style={{
                    height: 14,
                    width: "100%",
                    background: "rgba(255,255,255,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${widthPct.toFixed(1)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${barColor}AA 0%, ${barColor} 100%)`,
                      boxShadow: `0 0 18px ${barColor}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: vertical perspective-stepped architectural pillars
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {title ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 21,
              letterSpacing: "0.14em",
              color: accentColor,
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontFamily: FONTS.inter, fontSize: 18, color: "rgba(248,250,252,0.62)" }}>
              {subtitle}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          height,
          display: "flex",
          alignItems: "flex-end",
          gap: 18,
          borderBottom: "1px solid rgba(255,255,255,0.22)",
          paddingBottom: 14,
          position: "relative",
        }}
      >
        {data.map((item, idx) => {
          const prog = interpolate(localFrame, [idx * 4, idx * 4 + 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EDITORIAL_EASE,
          });
          const barH = Math.max(24, (item.value / maxVal) * (height - 105) * prog);
          const color = item.color ?? accentColor;
          const fade = enterSpring(frame, fps, delayFrames + idx * 4, 18, 130);

          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                opacity: interpolate(fade, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#F8FAFC",
                }}
              >
                {item.formattedValue}
              </span>
              <div
                style={{
                  width: "76%",
                  height: barH,
                  background: `linear-gradient(180deg, ${color} 0%, ${color}30 100%)`,
                  borderTop: `4px solid ${color}`,
                  boxShadow: `0 -10px 28px ${color}40`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span
                  style={{
                    fontFamily: FONTS.spaceGrotesk,
                    fontSize: 19,
                    fontWeight: 700,
                    color: "#F8FAFC",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </span>
                {item.ticker ? (
                  <span style={{ fontFamily: FONTS.mono, fontSize: 14, color }}>
                    {item.ticker}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type CompanyBrandId =
  | "apple"
  | "nvidia"
  | "microsoft"
  | "alphabet"
  | "amazon"
  | "aramco"
  | "viralmotion";

type CompanyLogoRevealProps = {
  readonly brand: CompanyBrandId;
  readonly valuation?: string;
  readonly label?: string;
  readonly delayFrames?: number;
  readonly accentColor?: string;
  readonly size?: number;
};

/**
 * Clean geometric brand insignia reveal with specular stroke animation and hairline orbital index.
 */
export const CompanyLogoReveal: React.FC<CompanyLogoRevealProps> = ({
  brand,
  valuation,
  label,
  delayFrames = 0,
  accentColor = "#D4AF37",
  size = 110,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = enterSpring(frame, fps, delayFrames, 17, 150);

  const brandMeta: Record<CompanyBrandId, { title: string; color: string }> = {
    apple: { title: "AAPL", color: "#F8FAFC" },
    nvidia: { title: "NVDA", color: "#10B981" },
    microsoft: { title: "MSFT", color: "#38BDF8" },
    alphabet: { title: "GOOGL", color: "#F59E0B" },
    amazon: { title: "AMZN", color: "#FB923C" },
    aramco: { title: "2222.SR", color: "#A78BFA" },
    viralmotion: { title: "VIRALMOTION", color: "#22D3EE" },
  };
  const info = brandMeta[brand];
  const color = accentColor || info.color;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        transform: `scale(${s.toFixed(4)})`,
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {brand === "viralmotion" ? (
          <BrandLogoMark size={size * 0.85} />
        ) : (
          <svg viewBox="0 0 80 80" width={size} height={size} fill="none">
            <rect
              x={8}
              y={8}
              width={64}
              height={64}
              rx={16}
              stroke={`${color}55`}
              strokeWidth={1.6}
              fill="rgba(7,9,15,0.66)"
            />
            {brand === "apple" ? (
              <path
                d="M44 22 C47 18, 50 18, 50 22 C47 24, 45 25, 44 22 Z M40 27 C49 27, 55 34, 53 45 C51 54, 45 59, 41 59 C38 59, 36 57, 34 57 C32 57, 30 59, 27 59 C23 59, 19 52, 19 42 C19 32, 26 27, 33 27 C36 27, 38 29, 40 27 Z"
                transform="translate(4 0)"
                stroke={info.color}
                strokeWidth={2.5}
                fill={`${info.color}18`}
              />
            ) : null}
            {brand === "nvidia" ? (
              <path
                d="M20 44 C26 28, 48 24, 58 38 C49 52, 31 54, 20 44 Z M32 40 C36 33, 45 33, 49 39"
                stroke="#10B981"
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            ) : null}
            {brand === "microsoft" ? (
              <g fill="#38BDF8">
                <rect x={23} y={23} width={15} height={15} opacity={0.95} />
                <rect x={42} y={23} width={15} height={15} opacity={0.75} />
                <rect x={23} y={42} width={15} height={15} opacity={0.75} />
                <rect x={42} y={42} width={15} height={15} opacity={0.55} />
              </g>
            ) : null}
            {brand === "aramco" ? (
              <polygon
                points="40,18 59,30 59,50 40,62 21,50 21,30"
                stroke="#A78BFA"
                strokeWidth={3}
                fill="rgba(167,139,250,0.16)"
              />
            ) : null}
            {brand === "alphabet" || brand === "amazon" ? (
              <path
                d="M24 44 C32 52, 48 52, 56 42 M50 38 L58 41 L54 49"
                stroke={info.color}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </svg>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 17, color: info.color, letterSpacing: "0.1em" }}>
          {label ?? info.title}
        </span>
        {valuation ? (
          <span style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 36, fontWeight: 700, color: "#F8FAFC" }}>
            {valuation}
          </span>
        ) : null}
      </div>
    </div>
  );
};

const WORLD_LAND_PATHS = [
  "M 90,94 L 188,66 L 288,76 L 315,124 L 280,176 L 252,218 L 222,240 L 188,205 L 152,188 L 116,146 Z",
  "M 322,42 L 385,32 L 405,72 L 352,95 L 318,75 Z",
  "M 248,252 L 308,262 L 348,312 L 325,382 L 288,448 L 265,442 L 255,365 L 236,305 Z",
  "M 455,82 L 545,68 L 575,112 L 542,154 L 488,162 L 452,138 Z",
  "M 458,178 L 548,176 L 592,226 L 574,312 L 535,388 L 495,382 L 478,295 L 442,248 Z",
  "M 552,72 L 735,64 L 865,98 L 852,175 L 795,212 L 725,245 L 652,228 L 585,182 L 562,124 Z",
  "M 862,145 L 882,132 L 892,158 L 872,172 Z",
  "M 762,258 L 828,266 L 835,288 L 768,284 Z",
  "M 778,318 L 868,316 L 892,368 L 855,406 L 788,392 L 768,354 Z",
];

type GeographicMapAnimationProps = {
  readonly markers: readonly MapMarker[];
  readonly arcs?: readonly MapArc[];
  readonly accentColor?: string;
  readonly focusCenter?: readonly [number, number];
  readonly zoom?: number;
  readonly height?: number;
};

/**
 * Animated geopolitical & global capital map with camera zoom, bezier geodesic arcs,
 * traveling data tips, and crisp open architectural coordinates (no bulky frames).
 */
export const GeographicMapAnimation: React.FC<GeographicMapAnimationProps> = ({
  markers,
  arcs = [],
  accentColor = "#D4AF37",
  focusCenter = [490, 210],
  zoom = 1.28,
  height = 540,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camProg = interpolate(frame, [0, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });
  const currentZoom = interpolate(camProg, [0, 1], [1.0, zoom]);
  const panX = interpolate(camProg, [0, 1], [0, 500 - focusCenter[0]]);
  const panY = interpolate(camProg, [0, 1], [0, 250 - focusCenter[1]]);

  const byId = new Map(markers.map((m) => [m.id, m]));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderTop: "1px solid rgba(255,255,255,0.14)",
        borderBottom: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(6, 10, 18, 0.56)",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 1000 500" style={{ width: "100%", height: "100%" }}>
        <g opacity={0.14} stroke="rgba(255,255,255,0.35)" strokeWidth={0.7}>
          {[100, 200, 300, 400].map((y) => (
            <line key={`lat-${y}`} x1={0} y1={y} x2={1000} y2={y} strokeDasharray="3 7" />
          ))}
          {[166, 333, 500, 666, 833].map((x) => (
            <line key={`lon-${x}`} x1={x} y1={0} x2={x} y2={500} strokeDasharray="3 7" />
          ))}
        </g>

        <g transform={`translate(500 250) scale(${currentZoom}) translate(${-500 + panX} ${-250 + panY})`}>
          {WORLD_LAND_PATHS.map((d, idx) => (
            <path
              key={idx}
              d={d}
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1.3}
              strokeLinejoin="round"
            />
          ))}

          {arcs.map((arc, idx) => {
            const from = byId.get(arc.fromId);
            const to = byId.get(arc.toId);
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const dist = Math.hypot(to.x - from.x, to.y - from.y);
            const midY = Math.min(from.y, to.y) - Math.min(115, dist * 0.28);
            const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
            const prog = interpolate(frame, [12 + idx * 7, 38 + idx * 7], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EDITORIAL_EASE,
            });
            const evolved = evolvePath(prog, d);
            const col = arc.color ?? accentColor;

            // Evaluate quadratic point at `prog` for glowing packet head
            const u = 1 - prog;
            const hx = u * u * from.x + 2 * u * prog * midX + prog * prog * to.x;
            const hy = u * u * from.y + 2 * u * prog * midY + prog * prog * to.y;

            return (
              <g key={`${arc.fromId}-${arc.toId}-${idx}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={col}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeDasharray={evolved.strokeDasharray}
                  strokeDashoffset={evolved.strokeDashoffset}
                  opacity={0.9}
                />
                {prog > 0.05 && prog < 0.99 ? (
                  <circle cx={hx} cy={hy} r={5} fill="#FFFFFF" />
                ) : null}
              </g>
            );
          })}

          {markers.map((marker, idx) => {
            const delay = 8 + idx * 6;
            const pop = enterSpring(frame, fps, delay, 16, 170);
            const pulse = 1 + 0.3 * Math.sin(((frame - delay) / fps) * 4);
            const col = marker.color ?? accentColor;
            const boxW = Math.max(138, marker.label.length * 10 + 26);

            return (
              <g key={marker.id} transform={`translate(${marker.x}, ${marker.y}) scale(${pop})`}>
                <circle r={15 * pulse} fill={col} opacity={0.18} />
                <circle r={5.5} fill={col} stroke="#07090F" strokeWidth={2} />
                <line x1={6} y1={-4} x2={16} y2={-14} stroke={col} strokeWidth={1.4} />
                <g transform="translate(16, -34)">
                  <rect
                    x={0}
                    y={0}
                    width={boxW}
                    height={40}
                    rx={6}
                    fill="rgba(7,10,18,0.88)"
                    stroke={`${col}77`}
                    strokeWidth={1.1}
                  />
                  <text
                    x={10}
                    y={16}
                    fill="#F8FAFC"
                    fontSize={12.5}
                    fontWeight={700}
                    fontFamily={FONTS.inter}
                  >
                    {marker.label}
                  </text>
                  <text
                    x={10}
                    y={32}
                    fill={col}
                    fontSize={12.5}
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

