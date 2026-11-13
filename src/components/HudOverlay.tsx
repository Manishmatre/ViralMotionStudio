import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../utils/fonts";

type HudOverlayProps = {
  readonly accentColor?: string;
  readonly topLeftLabel?: string;
  readonly topRightLabel?: string;
  readonly showScanner?: boolean;
};

export const HudOverlay: React.FC<HudOverlayProps> = ({
  accentColor = "#00E5FF",
  topLeftLabel = "SYS // LIVE TELEMETRY",
  topRightLabel = "9:16 • 30FPS",
  showScanner = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame / fps) * 240) % 1920;
  const blink = Math.sin((frame / fps) * 6) > 0 ? 1 : 0.35;
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bracketStyle = (
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
  ): React.CSSProperties => ({
    position: "absolute",
    top,
    bottom,
    left,
    right,
    width: 34,
    height: 34,
    borderColor: `${accentColor}AA`,
    borderStyle: "solid",
    borderTopWidth: top !== undefined ? 3 : 0,
    borderBottomWidth: bottom !== undefined ? 3 : 0,
    borderLeftWidth: left !== undefined ? 3 : 0,
    borderRightWidth: right !== undefined ? 3 : 0,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: fadeIn,
        zIndex: 25,
      }}
    >
      {/* Corner HUD Brackets */}
      <div style={bracketStyle(78, undefined, 54, undefined)} />
      <div style={bracketStyle(78, undefined, undefined, 54)} />
      <div style={bracketStyle(undefined, 96, 54, undefined)} />
      <div style={bracketStyle(undefined, 96, undefined, 54)} />

      {/* Top HUD Bar */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 102,
          right: 102,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: "0.14em",
          color: accentColor,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: accentColor,
              opacity: blink,
            }}
          />
          <span>{topLeftLabel}</span>
        </div>
        <span style={{ opacity: 0.78 }}>{topRightLabel}</span>
      </div>

      {/* Subtle laser scan beam */}
      {showScanner ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${accentColor}44 50%, transparent 100%)`,
          }}
        />
      ) : null}
    </div>
  );
};

