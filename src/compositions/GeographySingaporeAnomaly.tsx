import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import {
  AnimatedHeading,
  AnimatedStatistics,
  BrandLogoMark,
  CinematicScene,
  GeographicMapAnimation,
  KineticTypography,
  ParallaxLayer,
  VideoComposition,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import { VOICEOVER_MANIFEST } from "../data/voiceoverManifest";
import {
  DocumentaryChartScene,
  DocumentaryThesisScene,
} from "../engines/DocumentaryEngine";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { ChartDatum, MapArc, MapMarker, SfxCue } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

export const GeographySingaporeSchema = z.object({
  headline: z.string(),
  gdpPerCapita: z.number().min(1000).max(250000),
  accentColor: z.string(),
  muted: z.boolean(),
});

export type GeographySingaporeProps = z.infer<typeof GeographySingaporeSchema>;

const TRANSITION_FRAMES = 12;
const MANIFEST = VOICEOVER_MANIFEST.GeographySingaporeAnomaly;

const TRADE_MARKERS: readonly MapMarker[] = [
  { id: "sg", label: "Singapore • Strait Hub", value: "734 km²", x: 778, y: 274 },
  { id: "rotterdam", label: "Europe Corridor", value: "Suez Link", x: 492, y: 112, color: "#38BDF8" },
  { id: "tokyo", label: "East Asia Basin", value: "Pacific", x: 874, y: 154, color: "#F59E0B" },
  { id: "dubai", label: "Middle East Gulf", value: "Energy", x: 615, y: 214, color: "#10B981" },
];

const TRADE_ARCS: readonly MapArc[] = [
  { fromId: "rotterdam", toId: "dubai", color: "#38BDF8" },
  { fromId: "dubai", toId: "sg" },
  { fromId: "sg", toId: "tokyo", color: "#F59E0B" },
];

const GDP_CURVE: readonly ChartDatum[] = [
  { label: "1965", value: 516, formattedValue: "$516" },
  { label: "1980", value: 4900, formattedValue: "$4.9K" },
  { label: "1995", value: 24900, formattedValue: "$24.9K" },
  { label: "2010", value: 47200, formattedValue: "$47.2K" },
  { label: "NOW", value: 88400, formattedValue: "$88.4K" },
];

const ChokepointMapScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => (
  <CinematicScene
    photoSrc="assets/scenes/singapore-port.jpg"
    revealMode="aperture-iris"
    cameraMovement="pan-left"
    accentColor={accentColor}
    bgColor="#0B1622"
    overlayGradient="linear-gradient(180deg, rgba(6,12,20,0.92) 0%, rgba(6,12,20,0.74) 50%, rgba(6,12,20,0.95) 100%)"
    padding="130px 72px 270px 72px"
  >
    <AnimatedHeading
      eyebrow="THE CHOKEPOINT ADVANTAGE"
      title="CROSSROADS OF GLOBAL SHIPPING"
      highlightWords={["CROSSROADS", "SHIPPING"]}
      accentColor={accentColor}
      fontFamily={FONTS.syne}
      fontSize={70}
      variant="mask-up"
    />

    <GeographicMapAnimation
      markers={TRADE_MARKERS}
      arcs={TRADE_ARCS}
      accentColor={accentColor}
      focusCenter={[710, 225]}
      zoom={1.45}
      height={780}
    />
  </CinematicScene>
);

const GeoOutroScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <CinematicScene
      photoSrc="assets/scenes/singapore-port.jpg"
      revealMode="curtain-vertical"
      cameraMovement="dolly-out"
      accentColor={accentColor}
      bgColor="#0B1622"
      overlayGradient="radial-gradient(circle at 50% 45%, rgba(8,14,24,0.72) 0%, rgba(6,10,18,0.95) 85%)"
      padding="180px 72px 300px 72px"
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          opacity: fade,
        }}
      >
        <BrandLogoMark size={92} />

        <ParallaxLayer depth={1.2}>
          <KineticTypography
            lines={[
              [{ text: "GEOGRAPHY", highlight: true }, { text: "IS" }],
              [{ text: "DESTINY", highlight: true }],
            ]}
            align="center"
            fontFamily={FONTS.syne}
            baseFontSize={80}
            accentColor={accentColor}
            textColor="#F8F5EE"
            delayFrames={6}
          />
        </ParallaxLayer>

        <AnimatedStatistics
          accentColor={accentColor}
          columns={2}
          items={[
            { label: "LAND AREA", value: 734, suffix: " km²", decimals: 0 },
            { label: "MULTIPLIER", value: 171, suffix: "x", decimals: 0, delta: "1965 → NOW" },
          ]}
        />
      </div>
    </CinematicScene>
  );
};

const SCENE_DEFS = [
  { id: "geo-hook", name: "01 Island Port Documentary", transitionAfter: "depth-push" as const, sfx: "whoosh" as const },
  { id: "geo-map", name: "02 Trade Chokepoint Map", transitionAfter: "slide-left" as const, sfx: "shutter" as const },
  { id: "geo-chart", name: "03 171x GDP Area Surge", transitionAfter: "depth-push" as const, sfx: "ding" as const },
  { id: "geo-outro", name: "04 Atlas Outro", transitionAfter: undefined, sfx: "whip" as const },
];

export const GEO_SINGAPORE_DURATION =
  SCENE_DEFS.reduce((sum, s) => sum + MANIFEST.scenes[s.id].durationInFrames, 0) -
  (SCENE_DEFS.length - 1) * TRANSITION_FRAMES;

function buildGeoSfx(): readonly SfxCue[] {
  const cues: SfxCue[] = [];
  let cursor = 0;
  SCENE_DEFS.forEach((def, idx) => {
    const dur = MANIFEST.scenes[def.id].durationInFrames;
    cues.push({
      id: `sfx-${def.id}`,
      frame: cursor + (idx === 0 ? 2 : 0),
      preset: def.sfx,
      volume: 0.34,
    });
    cursor += dur - (idx < SCENE_DEFS.length - 1 ? TRANSITION_FRAMES : 0);
  });
  return cues;
}

const GEO_SFX = buildGeoSfx();

export const GeographySingaporeAnomaly: React.FC<GeographySingaporeProps> = ({
  headline,
  gdpPerCapita,
  accentColor,
  muted,
}) => {
  const theme = { ...TEMPLATE_PRESETS["geography-explained"], accent: accentColor };

  const renderElement = (id: string) => {
    switch (id) {
      case "geo-hook":
        return (
          <DocumentaryThesisScene
            photoSrc="assets/scenes/singapore-port.jpg"
            eyebrow="FINANCIAL GEOGRAPHY // CASE 04"
            headline={headline}
            highlightWords={["TINY", "ISLAND", "EMPIRES"]}
            subheadline="Zero domestic oil. Zero agricultural hinterland. One irreplaceable strait."
            accentColor={accentColor}
            cameraMovement="dolly-in"
            stats={[
              {
                label: "GDP PER CAPITA (USD)",
                value: gdpPerCapita,
                prefix: "$",
                decimals: 0,
                delta: "+171x SINCE 1965",
              },
              {
                label: "1965 STARTING BASELINE",
                value: 516,
                prefix: "$",
                decimals: 0,
                delta: "POST-INDEPENDENCE",
              },
            ]}
          />
        );
      case "geo-map":
        return <ChokepointMapScene accentColor={accentColor} />;
      case "geo-chart":
        return (
          <DocumentaryChartScene
            photoSrc="assets/scenes/trading-atrium.jpg"
            eyebrow="COMPOUND ECONOMIC SURGE"
            headline="60 YEARS OF COMPOUND GROWTH"
            highlightWords={["60", "YEARS"]}
            chartTitle="GDP PER CAPITA TRAJECTORY (1965 → PRESENT)"
            chartSubtitle="Nominal USD Index"
            chartMode="area-curve"
            data={GDP_CURVE}
            calloutText="$516 → $88,400 PER CITIZEN"
            accentColor={accentColor}
            cameraMovement="pan-right"
          />
        );
      case "geo-outro":
      default:
        return <GeoOutroScene accentColor={accentColor} />;
    }
  };

  const scenes: CompositionSceneItem[] = SCENE_DEFS.map((def) => {
    const asset = MANIFEST.scenes[def.id];
    return {
      id: def.id,
      name: def.name,
      durationInFrames: asset.durationInFrames,
      transitionAfter: def.transitionAfter,
      transitionDuration: TRANSITION_FRAMES,
      voiceoverSrc: asset.audioSrc,
      captions: asset.captions,
      element: renderElement(def.id),
    };
  });

  return (
    <VideoComposition
      theme={theme}
      scenes={scenes}
      sfxCues={GEO_SFX}
      bgmSrc={MANIFEST.bgmSrc}
      bgmVolume={0.14}
      muted={muted}
      showProgressBar
    />
  );
};
