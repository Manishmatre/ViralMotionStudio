import { Cpu, Layers, Workflow, Zap } from "lucide-react";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import {
  AnimatedHeading,
  AnimatedStatistics,
  BrandLogoMark,
  FinancialChart,
  KineticTypography,
  ParallaxLayer,
  VideoComposition,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import { VOICEOVER_MANIFEST } from "../data/voiceoverManifest";
import {
  ExplainerPipelineGraph,
  ExplainerStage,
  type NodeSpec,
} from "../engines/ExplainerEngine";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { ChartDatum, SfxCue } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE } from "../utils/motion";

export const AiAgentsHudSchema = z.object({
  headline: z.string(),
  automationPercent: z.number().min(10).max(100),
  accentColor: z.string(),
  muted: z.boolean(),
});

export type AiAgentsHudProps = z.infer<typeof AiAgentsHudSchema>;

const TRANSITION_FRAMES = 12;
const MANIFEST = VOICEOVER_MANIFEST.AiAgentsHudTech;

const WORKFLOW_SHIFT_BARS: readonly ChartDatum[] = [
  { label: "Manual App Clicks", ticker: "LEGACY", value: 18, formattedValue: "18%", color: "#64748B" },
  { label: "Copilot Assist", ticker: "2024", value: 47, formattedValue: "47%", color: "#38BDF8" },
  { label: "Autonomous Agents", ticker: "NEXT", value: 91, formattedValue: "91%", color: "#00E5FF" },
];

const HudHookScene: React.FC<{
  readonly headline: string;
  readonly automationPercent: number;
  readonly accentColor: string;
}> = ({ headline, automationPercent, accentColor }) => (
  <ExplainerStage photoSrc="assets/scenes/datacenter-corridor.jpg" accentColor={accentColor} padding="155px 72px 280px 72px">
    <ParallaxLayer depth={1.15}>
      <AnimatedHeading
        eyebrow="PARADIGM SHIFT // 2026"
        title={headline}
        highlightWords={["AGENTS", "REPLACE", "APPS"]}
        accentColor={accentColor}
        fontFamily={FONTS.spaceGrotesk}
        bodyFontFamily={FONTS.inter}
        fontSize={82}
        variant="slam"
      />
    </ParallaxLayer>

    <ParallaxLayer depth={1.35}>
      <AnimatedStatistics
        accentColor={accentColor}
        columns={1}
        items={[
          {
            label: "TASK AUTONOMY INDEX",
            value: automationPercent,
            suffix: "%",
            decimals: 0,
            delta: "4.8x FASTER WITHOUT UI CLICKS",
          },
        ]}
      />
    </ParallaxLayer>
  </ExplainerStage>
);

const NeuralPipelineScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => {
  const nodes: readonly NodeSpec[] = [
    {
      id: "intent",
      indexLabel: "01",
      title: "INTENT PROMPT",
      subtitle: "1 natural objective",
      x: 240,
      y: 120,
      delayFrames: 4,
      state: "complete",
      accentColor,
      icon: <Zap size={20} />,
    },
    {
      id: "planner",
      indexLabel: "02",
      title: "TOOL PLANNER",
      subtitle: "API orchestration",
      x: 680,
      y: 340,
      delayFrames: 16,
      state: "active",
      accentColor: "#8247FF",
      icon: <Workflow size={20} />,
    },
    {
      id: "exec",
      indexLabel: "03",
      title: "VERIFIED OUTPUT",
      subtitle: "Autonomous delivery",
      x: 420,
      y: 560,
      delayFrames: 28,
      state: "complete",
      accentColor: "#10B981",
      icon: <Layers size={20} />,
    },
  ];

  const edges = [
    { fromId: "intent", toId: "planner", delayFrames: 10, color: accentColor },
    { fromId: "planner", toId: "exec", delayFrames: 22, color: "#10B981" },
  ];

  return (
    <ExplainerStage photoSrc="assets/scenes/silicon-wafer.jpg" accentColor={accentColor} padding="155px 72px 270px 72px">
      <AnimatedHeading
        eyebrow="ARCHITECTURE"
        title="ONE PROMPT. ZERO TABS."
        highlightWords={["ZERO", "TABS"]}
        accentColor={accentColor}
        fontFamily={FONTS.spaceGrotesk}
        fontSize={76}
        variant="mask-up"
      />

      <ExplainerPipelineGraph
        nodes={nodes}
        edges={edges}
        stageWidth={936}
        stageHeight={690}
        accentColor={accentColor}
      />
    </ExplainerStage>
  );
};

const TelemetryBarsScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => (
  <ExplainerStage photoSrc="assets/scenes/datacenter-corridor.jpg" accentColor={accentColor} padding="155px 72px 270px 72px">
    <AnimatedHeading
      eyebrow="EFFICIENCY BENCHMARK"
      title="FROM INTERFACES TO OUTCOMES"
      highlightWords={["OUTCOMES"]}
      accentColor={accentColor}
      fontFamily={FONTS.spaceGrotesk}
      fontSize={74}
      variant="mask-up"
    />

    <FinancialChart
      data={WORKFLOW_SHIFT_BARS}
      accentColor={accentColor}
      title="WORKFLOW AUTOMATION RATE"
      mode="split-compare"
    />
  </ExplainerStage>
);

const HudOutroScene: React.FC<{ readonly accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <ExplainerStage photoSrc="assets/scenes/datacenter-corridor.jpg" accentColor={accentColor} padding="180px 72px 300px 72px">
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Cpu size={38} color={accentColor} />
          <BrandLogoMark size={84} />
        </div>

        <KineticTypography
          lines={[
            [{ text: "STOP" }, { text: "CLICKING.", highlight: true }],
            [{ text: "START" }, { text: "ORCHESTRATING.", highlight: true }],
          ]}
          align="center"
          fontFamily={FONTS.spaceGrotesk}
          baseFontSize={74}
          accentColor={accentColor}
        />
      </div>
    </ExplainerStage>
  );
};

const SCENE_DEFS = [
  { id: "ai-hook", name: "01 AI Compute Hook", transitionAfter: "depth-push" as const, sfx: "switch" as const },
  { id: "ai-pipe", name: "02 Agent Pipeline", transitionAfter: "slide-left" as const, sfx: "click" as const },
  { id: "ai-bars", name: "03 Benchmark Bars", transitionAfter: "depth-push" as const, sfx: "whoosh" as const },
  { id: "ai-outro", name: "04 Cyber Outro", transitionAfter: undefined, sfx: "ding" as const },
];

export const AI_HUD_DURATION =
  SCENE_DEFS.reduce((sum, s) => sum + MANIFEST.scenes[s.id].durationInFrames, 0) -
  (SCENE_DEFS.length - 1) * TRANSITION_FRAMES;

function buildAiSfxCues(): readonly SfxCue[] {
  const cues: SfxCue[] = [];
  let cursor = 0;
  SCENE_DEFS.forEach((def, idx) => {
    const dur = MANIFEST.scenes[def.id].durationInFrames;
    cues.push({ id: `sfx-${def.id}`, frame: cursor + (idx === 0 ? 2 : 0), preset: def.sfx, volume: 0.34 });
    cursor += dur - (idx < SCENE_DEFS.length - 1 ? TRANSITION_FRAMES : 0);
  });
  return cues;
}

const AI_SFX_CUES = buildAiSfxCues();

export const AiAgentsHudTech: React.FC<AiAgentsHudProps> = ({
  headline,
  automationPercent,
  accentColor,
  muted,
}) => {
  const baseTheme = TEMPLATE_PRESETS["ai-technology"];
  const theme = { ...baseTheme, accent: accentColor };

  const renderElement = (id: string) => {
    switch (id) {
      case "ai-hook":
        return (
          <HudHookScene
            headline={headline}
            automationPercent={automationPercent}
            accentColor={accentColor}
          />
        );
      case "ai-pipe":
        return <NeuralPipelineScene accentColor={accentColor} />;
      case "ai-bars":
        return <TelemetryBarsScene accentColor={accentColor} />;
      case "ai-outro":
      default:
        return <HudOutroScene accentColor={accentColor} />;
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
      sfxCues={AI_SFX_CUES}
      bgmSrc={MANIFEST.bgmSrc}
      bgmVolume={0.14}
      muted={muted}
      showProgressBar
      showHudOverlay
      hudLeftLabel="AI.CORE // AGENT ENGINE"
      hudRightLabel="LATENCY 14ms"
    />
  );
};
