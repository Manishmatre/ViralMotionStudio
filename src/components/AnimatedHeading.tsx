import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../utils/motion";

export type HeadingVariant = "mask-up" | "tilt-3d" | "tracking-expand" | "slam";

type AnimatedHeadingProps = {
  readonly title: string;
  readonly eyebrow?: string;
  readonly subtitle?: string;
  readonly highlightWords?: readonly string[];
  readonly accentColor?: string;
  readonly textColor?: string;
  readonly mutedColor?: string;
  readonly fontFamily?: string;
  readonly bodyFontFamily?: string;
  readonly fontSize?: number;
  readonly align?: "left" | "center";
  readonly variant?: HeadingVariant;
  readonly delayFrames?: number;
};

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  title,
  eyebrow,
  subtitle,
  highlightWords = [],
  accentColor = "#D4AF37",
  textColor = "#F8F6F0",
  mutedColor = "#A1A1AA",
  fontFamily = FONTS.playfair,
  bodyFontFamily = FONTS.jakarta,
  fontSize = 84,
  align = "left",
  variant = "mask-up",
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delayFrames);
  const progress = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const springVal = enterSpring(frame, fps, delayFrames, 17, 150);

  const eyebrowOpacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleProgress = interpolate(localFrame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  const normalizedHighlights = new Set(
    highlightWords.map((w) => w.toLowerCase()),
  );

  const words = title.split(" ");

  const getContainerTransform = (): React.CSSProperties => {
    if (variant === "tilt-3d") {
      const rotateX = interpolate(progress, [0, 1], [32, 0]);
      const translateY = interpolate(progress, [0, 1], [60, 0]);
      return {
        transform: `perspective(1200px) rotateX(${rotateX}deg) translateY(${translateY}px)`,
        opacity: progress,
      };
    }
    if (variant === "tracking-expand") {
      const letterSpacing = interpolate(progress, [0, 1], [14, -1.5]);
      return {
        letterSpacing: `${letterSpacing}px`,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.94, 1])})`,
      };
    }
    if (variant === "slam") {
      const scale = interpolate(springVal, [0, 1], [1.28, 1]);
      return {
        transform: `scale(${scale})`,
        opacity: interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      };
    }
    return {};
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 18,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            opacity: eyebrowOpacity,
            transform: `translateY(${interpolate(eyebrowOpacity, [0, 1], [12, 0])}px)`,
          }}
        >
          <span
            style={{
              width: 28,
              height: 2,
              backgroundColor: accentColor,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {eyebrow}
          </span>
        </div>
      ) : null}

      <h1
        style={{
          margin: 0,
          fontFamily,
          fontSize,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: textColor,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : "flex-start",
          columnGap: "0.26em",
          rowGap: "0.06em",
          ...getContainerTransform(),
        }}
      >
        {words.map((word, index) => {
          const clean = word.replace(/[^a-zA-Z0-9$%+-]/g, "").toLowerCase();
          const isHighlight =
            normalizedHighlights.has(clean) ||
            normalizedHighlights.has(word.toLowerCase());
          const wordDelay = delayFrames + index * 2;
          const wordProg = interpolate(
            frame,
            [wordDelay, wordDelay + 14],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EDITORIAL_EASE,
            },
          );

          const wordY =
            variant === "mask-up" ? interpolate(wordProg, [0, 1], [48, 0]) : 0;

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                overflow: variant === "mask-up" ? "hidden" : "visible",
                paddingBottom: 4,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  color: isHighlight ? accentColor : textColor,
                  opacity: variant === "mask-up" ? wordProg : 1,
                  transform: `translateY(${wordY}px)`,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </h1>

      {subtitle ? (
        <p
          style={{
            margin: 0,
            fontFamily: bodyFontFamily,
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.38,
            color: mutedColor,
            maxWidth: 880,
            opacity: subtitleProgress,
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [18, 0])}px)`,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

