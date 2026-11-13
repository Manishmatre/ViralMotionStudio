import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../../utils/motion";

export type BezierCurveSpec = {
  readonly x0: number;
  readonly y0: number;
  readonly cx1: number;
  readonly cy1: number;
  readonly cx2: number;
  readonly cy2: number;
  readonly x1: number;
  readonly y1: number;
};

export const bezierToSvgPath = (c: BezierCurveSpec): string =>
  `M ${c.x0} ${c.y0} C ${c.cx1} ${c.cy1}, ${c.cx2} ${c.cy2}, ${c.x1} ${c.y1}`;

export const sampleCubicBezier = (
  c: BezierCurveSpec,
  t: number,
): { readonly x: number; readonly y: number } => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * c.x0 + 3 * uu * t * c.cx1 + 3 * u * tt * c.cx2 + ttt * c.x1,
    y: uuu * c.y0 + 3 * uu * t * c.cy1 + 3 * u * tt * c.cy2 + ttt * c.y1,
  };
};

type NetworkConnectionProps = {
  readonly curve: BezierCurveSpec;
  readonly delayFrames?: number;
  readonly durationFrames?: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly strokeWidth?: number;
};

/**
 * Progressive SVG cubic Bezier conduit connecting Explainer Engine workflow nodes.
 */
export const NetworkConnection: React.FC<NetworkConnectionProps> = ({
  curve,
  delayFrames = 0,
  durationFrames = 22,
  color = "#22D3EE",
  trackColor = "rgba(167, 139, 250, 0.16)",
  strokeWidth = 3.5,
}) => {
  const frame = useCurrentFrame();
  const d = bezierToSvgPath(curve);

  const progress = interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const evolved = evolvePath(progress, d);

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
        opacity={0.18}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </g>
  );
};

type DataStreamProps = {
  readonly curve: BezierCurveSpec;
  readonly startFrame?: number;
  readonly color?: string;
  readonly particleCount?: number;
  readonly cycleFrames?: number;
};

/**
 * Deterministic animated data packets traveling cleanly along an exact cubic Bezier curve.
 */
export const DataStream: React.FC<DataStreamProps> = ({
  curve,
  startFrame = 12,
  color = "#22D3EE",
  particleCount = 3,
  cycleFrames = 42,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) {
    return null;
  }

  const elapsed = frame - startFrame;
  const fadeIn = interpolate(elapsed, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={fadeIn}>
      {Array.from({ length: particleCount }, (_, idx) => {
        const phase = ((elapsed / cycleFrames) + idx / particleCount) % 1;
        const pos = sampleCubicBezier(curve, phase);
        const tailPos = sampleCubicBezier(curve, Math.max(0, phase - 0.06));
        const edgeFade = Math.sin(phase * Math.PI);

        return (
          <g key={idx} opacity={edgeFade}>
            <line
              x1={tailPos.x}
              y1={tailPos.y}
              x2={pos.x}
              y2={pos.y}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.55}
            />
            <circle cx={pos.x} cy={pos.y} r={7.5} fill={color} opacity={0.28} />
            <circle cx={pos.x} cy={pos.y} r={4} fill="#FFFFFF" />
          </g>
        );
      })}
    </g>
  );
};

type WorkflowNodeProps = {
  readonly indexLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly x: number;
  readonly y: number;
  readonly width?: number;
  readonly state?: "pending" | "active" | "complete";
  readonly accentColor?: string;
  readonly delayFrames?: number;
  readonly icon?: React.ReactNode;
};

/**
 * Clean precision system node (SVG/HTML hybrid positioned cleanly on coordinate stage)
 * with animated state ring and telemetry label — avoiding cartoonish giant boxes.
 */
export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  indexLabel,
  title,
  subtitle,
  x,
  y,
  width = 270,
  state = "active",
  accentColor = "#8247FF",
  delayFrames = 0,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = enterSpring(frame, fps, delayFrames, 18, 170);
  const pulse = state === "active" ? 1 + Math.sin(((frame - delayFrames) / fps) * 5) * 0.04 : 1;
  const activeBorder =
    state === "complete"
      ? "#10B981"
      : state === "active"
        ? accentColor
        : "rgba(167,139,250,0.22)";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(-50%, -50%) scale(${(pop * pulse).toFixed(4)})`,
        opacity: interpolate(pop, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        background:
          state === "active"
            ? "linear-gradient(145deg, rgba(23,20,56,0.96) 0%, rgba(16,19,41,0.92) 100%)"
            : "rgba(13, 16, 32, 0.88)",
        border: `1.5px solid ${activeBorder}`,
        borderRadius: 14,
        padding: "14px 18px",
        boxShadow:
          state === "active"
            ? `0 18px 40px rgba(0,0,0,0.55), 0 0 28px ${accentColor}30`
            : "0 12px 28px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: `${activeBorder}22`,
          border: `1px solid ${activeBorder}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: activeBorder,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 13,
              fontWeight: 700,
              color: activeBorder,
              letterSpacing: "0.08em",
            }}
          >
            {indexLabel}
          </span>
          <span
            style={{
              fontFamily: FONTS.spaceGrotesk,
              fontSize: 20,
              fontWeight: 700,
              color: "#F8FAFC",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 14,
            color: "#9299B0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};

type AnimatedArrowProps = {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly delayFrames?: number;
  readonly durationFrames?: number;
  readonly color?: string;
  readonly strokeWidth?: number;
};

/**
 * Architectural directional trajectory arrow animated smoothly along its stem + snapped head.
 */
export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  delayFrames = 0,
  durationFrames = 18,
  color = "#22D3EE",
  strokeWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [delayFrames, delayFrames + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const cx = interpolate(prog, [0, 1], [x1, x2]);
  const cy = interpolate(prog, [0, 1], [y1, y2]);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const headOpacity = interpolate(prog, [0.7, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={cx}
        y2={cy}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <polygon
        points="-10,-6 2,0 -10,6"
        fill={color}
        opacity={headOpacity}
        transform={`translate(${cx}, ${cy}) rotate(${angle})`}
      />
    </g>
  );
};

