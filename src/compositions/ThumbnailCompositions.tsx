import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { FONTS } from "../utils/fonts";

export const ThumbnailSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  bigStat: z.string(),
  accentColor: z.string(),
  bgColor: z.string(),
});

export type ThumbnailProps = z.infer<typeof ThumbnailSchema>;

export const ThumbnailComposition: React.FC<ThumbnailProps> = ({
  kicker,
  headline,
  bigStat,
  accentColor,
  bgColor,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 75% 30%, ${accentColor}38 0%, ${bgColor} 65%)`,
        padding: 72,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: "10px 22px",
          borderRadius: 999,
          backgroundColor: `${accentColor}22`,
          border: `2px solid ${accentColor}`,
          fontFamily: FONTS.mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: accentColor,
          textTransform: "uppercase",
        }}
      >
        {kicker}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: FONTS.playfair,
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 0.98,
          color: "#FFFFFF",
          textShadow: "0 12px 36px rgba(0,0,0,0.8)",
          maxWidth: "92%",
        }}
      >
        {headline}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 36px",
          borderRadius: 24,
          backgroundColor: "rgba(9, 9, 11, 0.88)",
          border: `2px solid ${accentColor}`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 72,
            fontWeight: 800,
            color: accentColor,
          }}
        >
          {bigStat}
        </span>
        <span
          style={{
            fontFamily: FONTS.jakarta,
            fontSize: 30,
            fontWeight: 700,
            color: "#F8F6F0",
          }}
        >
          VIRALMOTION STUDIO
        </span>
      </div>
    </AbsoluteFill>
  );
};

