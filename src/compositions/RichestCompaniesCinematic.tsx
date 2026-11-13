import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import {
  BrandLogoMark,
  CinematicScene,
  CompanyLogoReveal,
  KineticTypography,
  ParallaxLayer,
  VideoComposition,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import { VOICEOVER_MANIFEST } from "../data/voiceoverManifest";
import {
  DocumentaryChartScene,
  DocumentaryMapScene,
  DocumentarySplitContrastScene,
  DocumentaryThesisScene,
} from "../engines/DocumentaryEngine";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { ChartDatum, MapArc, MapMarker, SfxCue } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

export const RichestCompaniesSchema = z.object({
  hookEyebrow: z.string(),
  hookHeadline: z.string(),
  combinedTrillions: z.number().min(1).max(100),
  accentColor: z.string(),
  muted: z.boolean(),
});

export type RichestCompaniesProps = z.infer<typeof RichestCompaniesSchema>;

const TRANSITION_FRAMES = 12;
const MANIFEST = VOICEOVER_MANIFEST.RichestCompaniesCinematic;

const GLOBAL_HQ_MARKERS: readonly MapMarker[] = [
  { id: "cupertino", label: "Apple • Cupertino", value: "$3.4T", x: 145, y: 158 },
  { id: "seattle", label: "Microsoft & Amazon", value: "$5.2T", x: 154, y: 122 },
  { id: "santaclara", label: "NVIDIA • AI Core", value: "$3.3T", x: 140, y: 185, color: "#10B981" },
  { id: "dhahran", label: "Saudi Aramco", value: "$1.8T", x: 598, y: 215, color: "#38BDF8" },
];

const GLOBAL_HQ_ARCS: readonly MapArc[] = [
  { fromId: "santaclara", toId: "seattle" },
  { fromId: "cupertino", toId: "dhahran", color: "#38BDF8" },
  { fromId: "seattle", toId: "dhahran", color: "#10B981" },
];

const GDP_COMPARISON_DATA: readonly ChartDatum[] = [
  { label: "Top 5 Tech", ticker: "BLOC", value: 15.2, formattedValue: "$15.2T", color: "#D4AF37" },
  { label: "Germany", ticker: "EUR", value: 4.5, formattedValue: "$4.5T", color: "#38BDF8" },
  { label: "Japan", ticker: "JPY", value: 4.2, formattedValue: "$4.2T", color: "#60A5FA" },
  { label: "India", ticker: "INR", value: 3.9, formattedValue: "$3.9T", color: "#34D399" },
];

const MARKET_CAP_RANKING: readonly ChartDatum[] = [
  { label: "Apple", ticker: "AAPL", value: 3.4, formattedValue: "$3.4T", color: "#D4AF37" },
  { label: "NVIDIA", ticker: "NVDA", value: 3.3, formattedValue: "$3.3T", color: "#10B981" },
  { label: "Microsoft", ticker: "MSFT", value: 3.1, formattedValue: "$3.1T", color: "#38BDF8" },
  { label: "Alphabet", ticker: "GOOGL", value: 2.2, formattedValue: "$2.2T", color: "#F59E0B" },
  { label: "Amazon", ticker: "AMZN", value: 2.1, formattedValue: "$2.1T", color: "#FB923C" },
  { label: "Saudi Aramco", ticker: "2222.SR", value: 1.8, formattedValue: "$1.8T", color: "#A78BFA" },
];

const ERA_SHIFT_CURVE: readonly ChartDatum[] = [
  { label: "2010", value: 0.35, formattedValue: "$0.35T" },
  { label: "2015", value: 0.75, formattedValue: "$0.75T" },
  { label: "2020", value: 2.0, formattedValue: "$2.0T" },
  { label: "2023", value: 3.0, formattedValue: "$3.0T" },
  { label: "NOW", value: 3.4, formattedValue: "$3.4T" },
];

const DocumentaryOutroScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <CinematicScene
      photoSrc="assets/scenes/manhattan-skyline.jpg"
      revealMode="curtain-vertical"
      cameraMovement="dolly-out"
      accentColor={accentColor}
      overlayGradient="radial-gradient(circle at 50% 45%, rgba(8,10,16,0.68) 0%, rgba(5,6,10,0.96) 85%)"
      padding="160px 72px 290px 72px"
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          opacity: fade,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <CompanyLogoReveal brand="apple" label="AAPL" valuation="$3.4T" accentColor={accentColor} delayFrames={4} size={82} />
          <CompanyLogoReveal brand="nvidia" label="NVDA" valuation="$3.3T" accentColor="#10B981" delayFrames={10} size={82} />
        </div>

        <ParallaxLayer depth={1.2}>
          <KineticTypography
            lines={[
              [{ text: "WHO", highlight: false }, { text: "CROSSES" }],
              [{ text: "$5 TRILLION", highlight: true }, { text: "FIRST?" }],
            ]}
            align="center"
            fontFamily={FONTS.playfair}
            baseFontSize={80}
            accentColor={accentColor}
            textColor="#F8F5EE"
            delayFrames={8}
          />
        </ParallaxLayer>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandLogoMark size={54} />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: "0.14em",
              color: accentColor,
            }}
          >
            DROP YOUR 2030 FORECAST
          </span>
        </div>
      </div>
    </CinematicScene>
  );
};

const SCENE_DEFS = [
  { id: "hook", name: "01 Manhattan Skyline Thesis", transitionAfter: "depth-push" as const, sfx: "boom" as const },
  { id: "gdp-compare", name: "02 GDP Pillar Documentary", transitionAfter: "slide-up" as const, sfx: "whoosh" as const },
  { id: "map", name: "03 Global Capital Map", transitionAfter: "slide-left" as const, sfx: "whoosh" as const },
  { id: "ranking", name: "04 Top 6 Market Ranking", transitionAfter: "wipe-diagonal" as const, sfx: "shutter" as const },
  { id: "shift", name: "05 Silicon vs Crude Oil", transitionAfter: "depth-push" as const, sfx: "ding" as const },
  { id: "outro", name: "06 Editorial Outro", transitionAfter: undefined, sfx: "whip" as const },
];

export const RICHEST_COMPANIES_DURATION =
  SCENE_DEFS.reduce((sum, s) => sum + MANIFEST.scenes[s.id].durationInFrames, 0) -
  (SCENE_DEFS.length - 1) * TRANSITION_FRAMES;

function buildSfxCues(): readonly SfxCue[] {
  const cues: SfxCue[] = [];
  let cursor = 0;
  SCENE_DEFS.forEach((def, idx) => {
    const dur = MANIFEST.scenes[def.id].durationInFrames;
    cues.push({
      id: `sfx-${def.id}`,
      frame: cursor + (idx === 0 ? 2 : 0),
      preset: def.sfx,
      volume: def.sfx === "boom" ? 0.45 : 0.32,
    });
    cursor += dur - (idx < SCENE_DEFS.length - 1 ? TRANSITION_FRAMES : 0);
  });
  return cues;
}

const SFX_CUES = buildSfxCues();

export const RichestCompaniesCinematic: React.FC<RichestCompaniesProps> = ({
  hookEyebrow,
  hookHeadline,
  combinedTrillions,
  accentColor,
  muted,
}) => {
  const baseTheme = TEMPLATE_PRESETS["business-stories"];
  const theme = { ...baseTheme, accent: accentColor };

  const renderElement = (id: string) => {
    switch (id) {
      case "hook":
        return (
          <DocumentaryThesisScene
            photoSrc="assets/scenes/manhattan-skyline.jpg"
            eyebrow={hookEyebrow}
            headline={hookHeadline}
            highlightWords={["FIVE", "CONTINENTS", "EMPIRES", "RICHEST"]}
            subheadline="Inside the concentrated silicon and software monopoly reshaping global capital."
            accentColor={accentColor}
            cameraMovement="dolly-in"
            featuredBrand={{ brand: "apple", valuation: "$3.4T LEAD", label: "TOP COMPONENT • AAPL" }}
            stats={[
              {
                label: "TOP 5 COMBINED MARKET CAP",
                value: combinedTrillions,
                prefix: "$",
                suffix: "T",
                decimals: 1,
                delta: "S&P 500 CORE",
              },
            ]}
          />
        );
      case "gdp-compare":
        return (
          <DocumentaryChartScene
            photoSrc="assets/scenes/trading-atrium.jpg"
            eyebrow="ECONOMIC SCALE"
            headline="COMPANIES OUTWEIGHING NATIONS"
            highlightWords={["OUTWEIGHING", "NATIONS"]}
            chartTitle="CORPORATE BLOC VS NATIONAL GDP (USD)"
            chartSubtitle="Annualized Macro Comparison"
            chartMode="pillars"
            data={GDP_COMPARISON_DATA}
            calloutText="+$2.6T SURPLUS OVER GERMANY + JAPAN + INDIA"
            accentColor={accentColor}
            cameraMovement="tilt-up"
          />
        );
      case "map":
        return (
          <DocumentaryMapScene
            photoSrc="assets/scenes/manhattan-skyline.jpg"
            eyebrow="GEOGRAPHY OF WEALTH"
            headline="ONE COASTLINE RULES GLOBAL CAPITAL"
            highlightWords={["ONE", "COASTLINE", "CAPITAL"]}
            markers={GLOBAL_HQ_MARKERS}
            arcs={GLOBAL_HQ_ARCS}
            focusCenter={[310, 185]}
            zoom={1.36}
            accentColor={accentColor}
          />
        );
      case "ranking":
        return (
          <DocumentaryChartScene
            photoSrc="assets/scenes/garage-origin.jpg"
            eyebrow="THE $16 TRILLION CLUB"
            headline="INSIDE THE TOP 6 TITANS"
            highlightWords={["TOP", "6", "TITANS"]}
            chartTitle="FROM GARAGE STARTUPS TO TRILLION-DOLLAR EMPIRES"
            chartSubtitle="Market Cap (USD)"
            chartMode="split-compare"
            data={MARKET_CAP_RANKING}
            accentColor={accentColor}
            cameraMovement="pan-right"
          />
        );
      case "shift":
        return (
          <DocumentarySplitContrastScene
            leftPhotoSrc="assets/scenes/silicon-wafer.jpg"
            rightPhotoSrc="assets/scenes/oil-platform.jpg"
            headline="SILICON OVERTAKES CRUDE OIL"
            highlightWords={["SILICON", "CRUDE", "OIL"]}
            leftTag="AI & COMPUTE LEADERS"
            leftValue="$12.0T+"
            rightTag="FOSSIL BENCHMARK"
            rightValue="$1.8T"
            trendData={ERA_SHIFT_CURVE}
            trendTitle="PEAK COMPANY VALUATION TRAJECTORY"
            accentColor="#10B981"
          />
        );
      case "outro":
      default:
        return <DocumentaryOutroScene accentColor={accentColor} />;
    }
  };

  const scenes: CompositionSceneItem[] = SCENE_DEFS.map((def) => {
    const audioAsset = MANIFEST.scenes[def.id];
    return {
      id: def.id,
      name: def.name,
      durationInFrames: audioAsset.durationInFrames,
      transitionAfter: def.transitionAfter,
      transitionDuration: TRANSITION_FRAMES,
      voiceoverSrc: audioAsset.audioSrc,
      captions: audioAsset.captions,
      element: renderElement(def.id),
    };
  });

  return (
    <VideoComposition
      theme={theme}
      scenes={scenes}
      sfxCues={SFX_CUES}
      bgmSrc={MANIFEST.bgmSrc}
      bgmVolume={0.14}
      muted={muted}
      showProgressBar
    />
  );
};
