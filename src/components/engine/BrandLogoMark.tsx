import React, { useId } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../utils/motion";

type BrandLogoMarkProps = {
  readonly size?: number;
  readonly animate?: boolean;
};

/**
 * Deterministic Remotion SVG prism logo mark matching the Vibrant Creative Futurism brand identity.
 */
export const BrandLogoMark: React.FC<BrandLogoMarkProps> = ({
  size = 110,
  animate = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const gMain = `vmsVidGrad-${uid}`;
  const gOrbit = `vmsVidOrbit-${uid}`;

  const t = animate ? frame / fps : 0;
  const orbitRot = -24 + t * 22;
  const scaleProg = animate
    ? interpolate(frame, [0, 22], [0.7, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EDITORIAL_EASE,
      })
    : 1;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      style={{ transform: `scale(${scaleProg.toFixed(4)})` }}
    >
      <defs>
        <linearGradient id={gMain} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8247FF" />
          <stop offset="52%" stopColor="#3677FF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id={gOrbit} x1="4" y1="32" x2="60" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8247FF" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <ellipse
        cx="32"
        cy="32"
        rx="27"
        ry="13"
        transform={`rotate(${orbitRot.toFixed(2)} 32 32)`}
        stroke={`url(#${gOrbit})`}
        strokeWidth="2"
      />
      <polygon
        points="32,8 53,20 53,44 32,56 11,44 11,20"
        fill="rgba(16, 19, 41, 0.92)"
        stroke={`url(#${gMain})`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <polygon
        points="26,22 44,32 26,42"
        fill={`url(#${gMain})`}
      />
      <circle cx="48" cy="14" r="2.2" fill="#22D3EE" />
      <circle cx="15" cy="48" r="1.8" fill="#A78BFA" />
    </svg>
  );
};

