import React, { useId } from "react";

type BrandLogoProps = {
  size?: number;
  animate?: boolean;
  showWordmark?: boolean;
  subtitle?: string;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 34,
  animate = true,
  showWordmark = false,
  subtitle,
}) => {
  const uid = useId().replace(/:/g, "");
  const gradMain = `vmsGradMain-${uid}`;
  const gradRing = `vmsGradRing-${uid}`;

  return (
    <span className="vms-logo-lockup">
      <span
        className={animate ? "vms-logo-mark vms-logo-animated" : "vms-logo-mark"}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg className="vms-brand-svg" viewBox="0 0 64 64" width={size} height={size} fill="none">
          <defs>
            <linearGradient id={gradMain} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8247FF" />
              <stop offset="52%" stopColor="#3677FF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id={gradRing} x1="4" y1="32" x2="60" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8247FF" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Outer orbital aperture ring */}
          <ellipse
            cx="32"
            cy="32"
            rx="27"
            ry="13"
            transform="rotate(-24 32 32)"
            stroke={`url(#${gradRing})`}
            strokeWidth="2"
            className="vms-logo-orbit"
          />

          {/* Precision hexagonal prism frame */}
          <polygon
            points="32,8 53,20 53,44 32,56 11,44 11,20"
            fill="rgba(16, 19, 41, 0.9)"
            stroke={`url(#${gradMain})`}
            strokeWidth="2.8"
            strokeLinejoin="round"
            className="vms-logo-prism"
          />

          {/* Inner futuristic ribbon slash + play prism */}
          <path
            d="M25.5 21.5L43.5 32L25.5 42.5V21.5Z"
            fill={`url(#${gradMain})`}
            className="vms-logo-play"
          />
          <circle cx="51" cy="18" r="2.6" fill="#22D3EE" className="vms-logo-spark" />
          <circle cx="13" cy="46" r="2.2" fill="#A78BFA" className="vms-logo-spark" />
        </svg>
      </span>

      {showWordmark ? (
        <span className="vms-logo-wordmark">
          <strong>
            Viral<span className="vms-logo-accent">Motion</span>Studio
          </strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </span>
      ) : null}
    </span>
  );
};

