import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AnimatedHeading,
  AnimatedStatistics,
  CinematicScene,
  CompanyLogoReveal,
  FinancialChart,
  GeographicMapAnimation,
  LightSweep,
  ParallaxLayer,
  type CameraMovementPreset,
  type CompanyBrandId,
  type StatItem,
} from "../components";
import type { ChartDatum, MapArc, MapMarker } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

type DocumentaryHeroSceneProps = {
  readonly photoSrc: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly highlightWords?: readonly string[];
  readonly subheadline?: string;
  readonly subtitle?: string;
  readonly stats: readonly StatItem[];
  readonly accentColor?: string;
  readonly cameraMovement?: CameraMovementPreset;
  readonly featuredBrand?: {
    readonly brand: CompanyBrandId;
    readonly valuation: string;
    readonly label: string;
  };
};

/**
 * Engine A — Cinematic Documentary Opening / Thesis Scene:
 * Pairs realistic photography + 2.5D Ken Burns push-in + open-air serif headline + tabular macro stats.
 * Zero rounded SaaS dashboard boxes or cartoon floating circles.
 */
export const DocumentaryThesisScene: React.FC<DocumentaryHeroSceneProps> = ({
  photoSrc,
  eyebrow,
  headline,
  highlightWords = [],
  subheadline,
  subtitle,
  stats,
  accentColor = "#D4AF37",
  cameraMovement = "dolly-in",
  featuredBrand,
}) => {
  const { width, height } = useVideoConfig();
  const isWidescreen = width > height;
  const resolvedSub = subheadline ?? subtitle;

  return (
    <CinematicScene
      photoSrc={photoSrc}
      revealMode="curtain-vertical"
      cameraMovement={cameraMovement}
      accentColor={accentColor}
      padding={isWidescreen ? "96px 110px 150px 110px" : "130px 72px 280px 72px"}
      overlayGradient="linear-gradient(180deg, rgba(6,8,14,0.88) 0%, rgba(6,8,14,0.42) 48%, rgba(6,8,14,0.95) 100%)"
    >
      <div
        style={{
          display: "flex",
          flexDirection: isWidescreen ? "row" : "column",
          justifyContent: "space-between",
          alignItems: isWidescreen ? "center" : "stretch",
          gap: isWidescreen ? 72 : 44,
          height: "100%",
        }}
      >
        <ParallaxLayer depth={1.15} driftX={16} driftY={8} style={{ flex: 1.2 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <AnimatedHeading
              eyebrow={eyebrow}
              title={headline}
              subtitle={resolvedSub}
              highlightWords={highlightWords}
              accentColor={accentColor}
              fontFamily={FONTS.playfair}
              bodyFontFamily={FONTS.jakarta}
              fontSize={isWidescreen ? 84 : 78}
              variant="tilt-3d"
            />
            {featuredBrand ? (
              <div style={{ marginTop: 12 }}>
                <CompanyLogoReveal
                  brand={featuredBrand.brand}
                  valuation={featuredBrand.valuation}
                  label={featuredBrand.label}
                  accentColor={accentColor}
                  delayFrames={16}
                  size={86}
                />
              </div>
            ) : null}
          </div>
        </ParallaxLayer>

        <ParallaxLayer depth={1.4} driftX={26} driftY={14} style={{ flex: isWidescreen ? 0.9 : undefined }}>
          <AnimatedStatistics
            items={stats}
            accentColor={accentColor}
            columns={isWidescreen ? 1 : stats.length > 2 ? 2 : 1}
            delayFrames={10}
          />
        </ParallaxLayer>
      </div>
    </CinematicScene>
  );
};

type DocumentaryChartSceneProps = {
  readonly photoSrc: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly highlightWords?: readonly string[];
  readonly chartTitle: string;
  readonly chartSubtitle?: string;
  readonly chartMode: "pillars" | "area-curve" | "split-compare";
  readonly data: readonly ChartDatum[];
  readonly calloutText?: string;
  readonly accentColor?: string;
  readonly cameraMovement?: CameraMovementPreset;
};

/**
 * Engine A — Documentary Analytical Chart Sequence:
 * Integrates animated SVG financial graphs cleanly onto dimmed documentary architecture imagery.
 */
export const DocumentaryChartScene: React.FC<DocumentaryChartSceneProps> = ({
  photoSrc,
  eyebrow,
  headline,
  highlightWords = [],
  chartTitle,
  chartSubtitle,
  chartMode,
  data,
  calloutText,
  accentColor = "#D4AF37",
  cameraMovement = "pan-right",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isWidescreen = width > height;

  const badgeAlpha = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <CinematicScene
      photoSrc={photoSrc}
      revealMode="curtain-horizontal"
      cameraMovement={cameraMovement}
      accentColor={accentColor}
      padding={isWidescreen ? "90px 100px 140px 100px" : "130px 72px 270px 72px"}
      overlayGradient="linear-gradient(180deg, rgba(6,8,14,0.9) 0%, rgba(6,8,14,0.72) 55%, rgba(6,8,14,0.96) 100%)"
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <AnimatedHeading
            eyebrow={eyebrow}
            title={headline}
            highlightWords={highlightWords}
            accentColor={accentColor}
            fontFamily={FONTS.playfair}
            fontSize={isWidescreen ? 68 : 70}
            variant="mask-up"
          />
          {calloutText && isWidescreen ? (
            <div
              style={{
                borderLeft: `3px solid ${accentColor}`,
                paddingLeft: 18,
                opacity: badgeAlpha,
                fontFamily: FONTS.mono,
                fontSize: 21,
                fontWeight: 700,
                color: accentColor,
                whiteSpace: "nowrap",
              }}
            >
              {calloutText}
            </div>
          ) : null}
        </div>

        <ParallaxLayer depth={1.2} driftX={18} driftY={8}>
          <FinancialChart
            data={data}
            mode={chartMode}
            title={chartTitle}
            subtitle={chartSubtitle}
            accentColor={accentColor}
            height={isWidescreen ? 460 : chartMode === "pillars" ? 680 : 480}
          />
        </ParallaxLayer>

        {calloutText && !isWidescreen ? (
          <div
            style={{
              borderLeft: `3px solid ${accentColor}`,
              paddingLeft: 20,
              opacity: badgeAlpha,
              fontFamily: FONTS.mono,
              fontSize: 22,
              fontWeight: 700,
              color: accentColor,
            }}
          >
            {calloutText}
          </div>
        ) : null}
      </div>
    </CinematicScene>
  );
};

type DocumentaryMapSceneProps = {
  readonly photoSrc?: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly highlightWords?: readonly string[];
  readonly markers: readonly MapMarker[];
  readonly arcs: readonly MapArc[];
  readonly focusCenter: readonly [number, number];
  readonly zoom?: number;
  readonly accentColor?: string;
};

/**
 * Engine A — Documentary Geopolitical Atlas Sequence.
 */
export const DocumentaryMapScene: React.FC<DocumentaryMapSceneProps> = ({
  photoSrc = "assets/scenes/manhattan-skyline.jpg",
  eyebrow,
  headline,
  highlightWords = [],
  markers,
  arcs,
  focusCenter,
  zoom = 1.32,
  accentColor = "#D4AF37",
}) => {
  const { width, height } = useVideoConfig();
  const isWidescreen = width > height;

  return (
    <CinematicScene
      photoSrc={photoSrc}
      revealMode="aperture-iris"
      cameraMovement="subtle-float"
      accentColor={accentColor}
      padding={isWidescreen ? "90px 100px 140px 100px" : "130px 72px 270px 72px"}
      overlayGradient="linear-gradient(180deg, rgba(6,10,18,0.92) 0%, rgba(6,10,18,0.78) 52%, rgba(6,10,18,0.95) 100%)"
    >
      <AnimatedHeading
        eyebrow={eyebrow}
        title={headline}
        highlightWords={highlightWords}
        accentColor={accentColor}
        fontFamily={FONTS.playfair}
        fontSize={isWidescreen ? 66 : 70}
        variant="mask-up"
      />

      <GeographicMapAnimation
        markers={markers}
        arcs={arcs}
        accentColor={accentColor}
        focusCenter={focusCenter}
        zoom={zoom}
        height={isWidescreen ? 540 : 780}
      />
    </CinematicScene>
  );
};

type DocumentarySplitContrastSceneProps = {
  readonly leftPhotoSrc: string;
  readonly rightPhotoSrc: string;
  readonly headline: string;
  readonly highlightWords?: readonly string[];
  readonly leftTag: string;
  readonly leftValue: string;
  readonly rightTag: string;
  readonly rightValue: string;
  readonly trendData: readonly ChartDatum[];
  readonly trendTitle: string;
  readonly accentColor?: string;
};

/**
 * Engine A — Documentary Dual-Plate Split Contrast Sequence (e.g., Silicon Compute vs Crude Oil):
 * Features authentic split-screen cinema footage plates instead of rounded comparison cards.
 */
export const DocumentarySplitContrastScene: React.FC<DocumentarySplitContrastSceneProps> = ({
  leftPhotoSrc,
  rightPhotoSrc,
  headline,
  highlightWords = [],
  leftTag,
  leftValue,
  rightTag,
  rightValue,
  trendData,
  trendTitle,
  accentColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const splitW = interpolate(frame, [4, 28], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080E", overflow: "hidden" }}>
      {/* Dual split photorealistic environments */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${splitW}%`, overflow: "hidden" }}>
        <CinematicScene
          photoSrc={leftPhotoSrc}
          revealMode="curtain-horizontal"
          cameraMovement="dolly-in"
          accentColor={accentColor}
          showLightSweep={false}
          showMicroDust={false}
          padding={0}
          overlayGradient="linear-gradient(180deg, rgba(6,8,14,0.86) 0%, rgba(6,22,18,0.45) 45%, rgba(6,8,14,0.96) 100%)"
        >
          <div />
        </CinematicScene>
      </div>

      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `${splitW}%`, overflow: "hidden" }}>
        <CinematicScene
          photoSrc={rightPhotoSrc}
          revealMode="curtain-horizontal"
          cameraMovement="pan-left"
          accentColor="#94A3B8"
          showLightSweep={false}
          showMicroDust={false}
          padding={0}
          overlayGradient="linear-gradient(180deg, rgba(6,8,14,0.86) 0%, rgba(16,18,24,0.58) 45%, rgba(6,8,14,0.96) 100%)"
        >
          <div />
        </CinematicScene>
      </div>

      {/* Crisp hairline architectural split divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 2,
          background: `linear-gradient(180deg, transparent 0%, ${accentColor} 45%, transparent 100%)`,
          zIndex: 15,
        }}
      />

      <LightSweep color={accentColor} startFrame={8} durationFrames={42} maxOpacity={0.18} />

      <AbsoluteFill
        style={{
          padding: "130px 72px 270px 72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 25,
        }}
      >
        <AnimatedHeading
          eyebrow="HISTORICAL INFLECTION"
          title={headline}
          highlightWords={highlightWords}
          accentColor={accentColor}
          fontFamily={FONTS.playfair}
          fontSize={72}
          variant="slam"
        />

        {/* Integrated architectural stat duel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            padding: "24px 0",
          }}
        >
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: accentColor, letterSpacing: "0.1em" }}>
              {leftTag}
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 56, fontWeight: 700, color: "#FFFFFF" }}>
              {leftValue}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: "#94A3B8", letterSpacing: "0.1em" }}>
              {rightTag}
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 56, fontWeight: 700, color: "#94A3B8" }}>
              {rightValue}
            </div>
          </div>
        </div>

        <FinancialChart
          data={trendData}
          mode="area-curve"
          title={trendTitle}
          accentColor={accentColor}
          height={420}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
