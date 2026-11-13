import React from "react";
import { z } from "zod";
import {
  AnimatedHeading,
  CinematicScene,
  FinancialChart,
  GeographicMapAnimation,
  VideoComposition,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import { VOICEOVER_MANIFEST } from "../data/voiceoverManifest";
import { DocumentaryThesisScene } from "../engines/DocumentaryEngine";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { ChartDatum, MapArc, MapMarker, SfxCue } from "../types/video";
import { FONTS } from "../utils/fonts";

export const LongFormSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accentColor: z.string(),
  muted: z.boolean(),
});

export type LongFormProps = z.infer<typeof LongFormSchema>;

const TRANSITION_FRAMES = 14;
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

const MARKET_CAP_RANKING: readonly ChartDatum[] = [
  { label: "Apple", ticker: "AAPL", value: 3.4, formattedValue: "$3.4T", color: "#D4AF37" },
  { label: "NVIDIA", ticker: "NVDA", value: 3.3, formattedValue: "$3.3T", color: "#10B981" },
  { label: "Microsoft", ticker: "MSFT", value: 3.1, formattedValue: "$3.1T", color: "#38BDF8" },
  { label: "Alphabet", ticker: "GOOGL", value: 2.2, formattedValue: "$2.2T", color: "#F59E0B" },
  { label: "Amazon", ticker: "AMZN", value: 2.1, formattedValue: "$2.1T", color: "#FB923C" },
  { label: "Saudi Aramco", ticker: "2222.SR", value: 1.8, formattedValue: "$1.8T", color: "#A78BFA" },
];

const WidescreenMapAndChartScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => (
  <CinematicScene
    photoSrc="assets/scenes/trading-atrium.jpg"
    revealMode="curtain-horizontal"
    cameraMovement="pan-right"
    accentColor={accentColor}
    overlayGradient="linear-gradient(180deg, rgba(6,8,14,0.9) 0%, rgba(6,8,14,0.75) 50%, rgba(6,8,14,0.95) 100%)"
    padding="88px 96px 140px 96px"
  >
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 56, height: "100%" }}>
      <div style={{ flex: 1.05, display: "flex", flexDirection: "column", gap: 28 }}>
        <AnimatedHeading
          eyebrow="CAPITAL CONCENTRATION"
          title="GLOBAL HQ FOOTPRINT"
          highlightWords={["GLOBAL", "HQ"]}
          accentColor={accentColor}
          fontFamily={FONTS.playfair}
          fontSize={62}
        />
        <GeographicMapAnimation
          markers={GLOBAL_HQ_MARKERS}
          arcs={GLOBAL_HQ_ARCS}
          accentColor={accentColor}
          focusCenter={[310, 185]}
          zoom={1.32}
          height={520}
        />
      </div>
      <div style={{ flex: 1 }}>
        <FinancialChart
          data={MARKET_CAP_RANKING}
          accentColor={accentColor}
          title="MARKET CAPITALIZATION (USD)"
          mode="split-compare"
        />
      </div>
    </div>
  </CinematicScene>
);

export const LONG_FORM_DURATION =
  MANIFEST.scenes.hook.durationInFrames +
  MANIFEST.scenes.ranking.durationInFrames -
  TRANSITION_FRAMES;

const LONG_FORM_SFX: readonly SfxCue[] = [
  { id: "lf-boom", frame: 4, preset: "boom", volume: 0.44 },
  {
    id: "lf-whoosh",
    frame: MANIFEST.scenes.hook.durationInFrames - TRANSITION_FRAMES,
    preset: "whoosh",
    volume: 0.34,
  },
];

export const RichestCompaniesLongForm: React.FC<LongFormProps> = ({
  title,
  subtitle,
  accentColor,
  muted,
}) => {
  const theme = { ...TEMPLATE_PRESETS["business-stories"], accent: accentColor };

  const scenes: CompositionSceneItem[] = [
    {
      id: "lf-hook",
      name: "01 Widescreen Documentary Open",
      durationInFrames: MANIFEST.scenes.hook.durationInFrames,
      transitionAfter: "depth-push",
      transitionDuration: TRANSITION_FRAMES,
      voiceoverSrc: MANIFEST.scenes.hook.audioSrc,
      captions: MANIFEST.scenes.hook.captions,
      element: (
        <DocumentaryThesisScene
          photoSrc="assets/scenes/manhattan-skyline.jpg"
          eyebrow="LONG-FORM DOCUMENTARY // 16:9"
          headline={title}
          subtitle={subtitle}
          highlightWords={["$15", "TRILLION", "EMPIRES", "RICHEST"]}
          accentColor={accentColor}
          cameraMovement="dolly-in"
          featuredBrand={{ brand: "apple", valuation: "$3.4T LEAD", label: "ANCHOR HOLDING • AAPL" }}
          stats={[
            {
              label: "TOP 5 COMBINED MARKET CAP",
              value: 15.2,
              prefix: "$",
              suffix: "T",
              decimals: 1,
              delta: "EXCEEDS JAPAN + GERMANY + INDIA",
            },
          ]}
        />
      ),
    },
    {
      id: "lf-ranking",
      name: "02 Global Map & Ranked Comparison",
      durationInFrames: MANIFEST.scenes.ranking.durationInFrames,
      voiceoverSrc: MANIFEST.scenes.ranking.audioSrc,
      captions: MANIFEST.scenes.ranking.captions,
      element: <WidescreenMapAndChartScene accentColor={accentColor} />,
    },
  ];

  return (
    <VideoComposition
      theme={theme}
      scenes={scenes}
      sfxCues={LONG_FORM_SFX}
      bgmSrc={MANIFEST.bgmSrc}
      bgmVolume={0.14}
      muted={muted}
      showProgressBar
    />
  );
};
