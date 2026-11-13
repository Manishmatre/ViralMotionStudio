import type { Caption } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";

type SubtitleRendererProps = {
  readonly captions: readonly Caption[];
  readonly accentColor?: string;
  readonly textColor?: string;
  readonly bgColor?: string;
  readonly fontFamily?: string;
  readonly bottomOffset?: number;
  readonly combineTokensWithinMs?: number;
};

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({
  captions,
  accentColor = "#D4AF37",
  textColor = "#FFFFFF",
  bgColor = "rgba(9, 9, 11, 0.78)",
  fontFamily = FONTS.jakarta,
  bottomOffset = 185,
  combineTokensWithinMs = 1100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const { pages } = useMemo(() => {
    if (captions.length === 0) {
      return { pages: [] };
    }
    return createTikTokStyleCaptions({
      captions: [...captions],
      combineTokensWithinMilliseconds: combineTokensWithinMs,
    });
  }, [captions, combineTokensWithinMs]);

  const activePage = pages.find(
    (page) =>
      currentTimeMs >= page.startMs &&
      currentTimeMs <= page.startMs + page.durationMs,
  );

  if (!activePage) {
    return null;
  }

  const pageAgeMs = currentTimeMs - activePage.startMs;
  const pageScale = interpolate(pageAgeMs, [0, 90], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: bottomOffset,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 12px",
          padding: "16px 28px",
          borderRadius: 22,
          backgroundColor: bgColor,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 18px 42px rgba(0, 0, 0, 0.55)",
          transform: `scale(${pageScale})`,
        }}
      >
        {activePage.tokens.map((token, idx) => {
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs <= token.toMs;
          const hasPassed = currentTimeMs > token.toMs;

          return (
            <span
              key={`${token.fromMs}-${idx}`}
              style={{
                fontFamily,
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                color: isActive
                  ? "#09090B"
                  : hasPassed
                    ? textColor
                    : "rgba(255,255,255,0.68)",
                backgroundColor: isActive ? accentColor : "transparent",
                padding: isActive ? "2px 12px" : "2px 2px",
                borderRadius: 10,
                transform: isActive ? "scale(1.06)" : "scale(1)",
                display: "inline-block",
              }}
            >
              {token.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

