import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  FileText,
  Layers,
  Mic,
  Sparkles,
  Subtitles,
  Tv,
  UploadCloud,
} from "lucide-react";
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  AnimatedArrow,
  AnimatedHeading,
  BrandLogoMark,
  DataStream,
  LightSweep,
  NetworkConnection,
  ParallaxLayer,
  VideoComposition,
  VideoMaskReveal,
  type BezierCurveSpec,
} from "../components";
import type { CompositionSceneItem } from "../components/VideoComposition";
import { VOICEOVER_MANIFEST } from "../data/voiceoverManifest";
import {
  ExplainerAudioWaveform,
  ExplainerPipelineGraph,
  ExplainerStage,
  type NodeSpec,
} from "../engines/ExplainerEngine";
import { TEMPLATE_PRESETS } from "../templates/presets";
import type { SfxCue } from "../types/video";
import { FONTS } from "../utils/fonts";
import { EDITORIAL_EASE, enterSpring } from "../utils/motion";

export const WorkflowAutomationSchema = z.object({
  accentColor: z.string(),
  muted: z.boolean(),
});

export type WorkflowAutomationProps = z.infer<typeof WorkflowAutomationSchema>;

const TRANSITION_FRAMES = 12;
const MANIFEST = VOICEOVER_MANIFEST.WorkflowAutomationExplainer;

const SCENE_ASSETS = [
  { label: "01 HOOK", title: "Manhattan Skyline", img: "assets/scenes/manhattan-skyline.jpg" },
  { label: "02 ORIGIN", title: "Vintage Garage", img: "assets/scenes/garage-origin.jpg" },
  { label: "03 DATA", title: "Trading Floor", img: "assets/scenes/trading-atrium.jpg" },
  { label: "04 COMPUTE", title: "Silicon Wafer", img: "assets/scenes/silicon-wafer.jpg" },
];

/**
 * Stage 1 (Requirement 1–5):
 * Idea node with LightSweep -> Bezier energy line -> Script Generator typing -> Storyboard fan-out.
 */
const IdeaScriptStoryboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullScript =
    "\"Apple began inside a dim Palo Alto garage — today just five companies outweigh entire nations.\"";
  const charsShown = Math.floor(
    interpolate(frame, [28, 128], [0, fullScript.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const nodes: readonly NodeSpec[] = [
    {
      id: "idea",
      indexLabel: "01",
      title: "IDEA SPARK",
      subtitle: "\"World's richest companies\"",
      x: 195,
      y: 135,
      delayFrames: 4,
      state: "complete",
      accentColor: "#8247FF",
      icon: <Sparkles size={20} />,
    },
    {
      id: "script",
      indexLabel: "02",
      title: "AI SCRIPT ENGINE",
      subtitle: "Hook · Pacing · Facts",
      x: 780,
      y: 135,
      delayFrames: 18,
      state: "active",
      accentColor: "#22D3EE",
      icon: <FileText size={20} />,
    },
    {
      id: "storyboard",
      indexLabel: "03",
      title: "STORYBOARD",
      subtitle: "4 Auto-Timed Visual Beats",
      x: 1390,
      y: 135,
      delayFrames: 38,
      state: "active",
      accentColor: "#3677FF",
      icon: <Layers size={20} />,
    },
  ];

  const edges = [
    { fromId: "idea", toId: "script", delayFrames: 10, color: "#8247FF" },
    { fromId: "script", toId: "storyboard", delayFrames: 28, color: "#22D3EE" },
  ];

  const terminalAlpha = interpolate(frame, [24, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <ExplainerStage padding="72px 86px 140px 86px" accentColor="#8247FF">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <AnimatedHeading
          eyebrow="AUTONOMOUS PIPELINE // STAGES 01 → 03"
          title="IDEA TO AI STORYBOARD"
          highlightWords={["AI", "STORYBOARD"]}
          accentColor="#22D3EE"
          fontFamily={FONTS.spaceGrotesk}
          fontSize={62}
          variant="mask-up"
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: "#A78BFA",
            border: "1px solid rgba(167,139,250,0.34)",
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          REMOTION + LLM WORKFLOW
        </span>
      </div>

      {/* Connected Node Diagram Top Band */}
      <div style={{ position: "relative", height: 240 }}>
        <ExplainerPipelineGraph
          nodes={nodes}
          edges={edges}
          stageWidth={1660}
          stageHeight={230}
          accentColor="#22D3EE"
        />
      </div>

      {/* Progressive AI Script Stream + Storyboard Scene Thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 36, alignItems: "stretch" }}>
        <div
          style={{
            background: "rgba(11, 15, 34, 0.9)",
            border: "1px solid rgba(167,139,250,0.28)",
            borderRadius: 16,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: terminalAlpha,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#22D3EE" }}>
              NARRATION STREAM.TSX
            </span>
            <Bot size={20} color="#A78BFA" />
          </div>
          <p
            style={{
              fontFamily: FONTS.inter,
              fontSize: 28,
              lineHeight: 1.45,
              color: "#F8FAFC",
              margin: "18px 0",
              minHeight: 130,
            }}
          >
            {fullScript.slice(0, charsShown)}
            <span style={{ color: "#22D3EE" }}>|</span>
          </p>
          <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#10B981" }}>
            ✓ Camera vectors · Transition cues · SFX attached
          </div>
        </div>

        {/* Multi-Thumbnail Storyboard Fan-Out */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {SCENE_ASSETS.map((sc, idx) => {
            const pop = enterSpring(frame, fps, 68 + idx * 14, 18, 160);
            return (
              <div
                key={sc.label}
                style={{
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(34,211,238,0.34)",
                  transform: `scale(${pop.toFixed(4)}) translateY(${interpolate(pop, [0, 1], [24, 0]).toFixed(1)}px)`,
                  opacity: interpolate(pop, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
                  height: 185,
                }}
              >
                <Img
                  src={staticFile(sc.img)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 35%, rgba(7,9,22,0.92) 100%)",
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: "#22D3EE" }}>{sc.label}</span>
                  <strong style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 20, color: "#FFF" }}>
                    {sc.title}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ExplainerStage>
  );
};

/**
 * Stage 2 (Requirement 6–9):
 * Assets fly into composition -> Voiceover waveform builds -> Motion Graphics Render + Subtitles ->
 * Dual transformation into 9:16 Shorts and 16:9 Long-form video!
 */
const AssetVoiceRenderDualScene: React.FC = () => {
  const frame = useCurrentFrame();

  const assetNodes: readonly NodeSpec[] = [
    {
      id: "assets",
      indexLabel: "04",
      title: "VISUAL ASSETS",
      subtitle: "Cinema Stills & Maps",
      x: 210,
      y: 95,
      delayFrames: 4,
      state: "complete",
      accentColor: "#3677FF",
      icon: <Layers size={20} />,
    },
    {
      id: "voice",
      indexLabel: "05",
      title: "NEURAL VOICEOVER",
      subtitle: "Audio + Word Timings",
      x: 210,
      y: 265,
      delayFrames: 14,
      state: "complete",
      accentColor: "#22D3EE",
      icon: <Mic size={20} />,
    },
    {
      id: "remotion",
      indexLabel: "06",
      title: "REMOTION ENGINE",
      subtitle: "60fps Motion Compositor",
      x: 740,
      y: 180,
      delayFrames: 26,
      state: "active",
      accentColor: "#8247FF",
      icon: <Clapperboard size={20} />,
    },
    {
      id: "subs",
      indexLabel: "07",
      title: "SUBTITLE SYNC",
      subtitle: "Kinetic Captions Lock",
      x: 740,
      y: 350,
      delayFrames: 38,
      state: "complete",
      accentColor: "#10B981",
      icon: <Subtitles size={20} />,
    },
  ];

  const edges = [
    { fromId: "assets", toId: "remotion", delayFrames: 12, color: "#3677FF" },
    { fromId: "voice", toId: "remotion", delayFrames: 20, color: "#22D3EE" },
    { fromId: "remotion", toId: "subs", delayFrames: 34, color: "#10B981" },
  ];

  const words = ["SILICON", "OVERTAKES", "CRUDE", "OIL"];
  const activeWordIdx = Math.floor(interpolate(frame, [45, 190], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <ExplainerStage padding="72px 86px 140px 86px" accentColor="#22D3EE">
      <AnimatedHeading
        eyebrow="ASSEMBLY & RENDERING // STAGES 04 → 07"
        title="VOICE, GRAPHICS & DUAL FORMATS"
        highlightWords={["DUAL", "FORMATS"]}
        accentColor="#22D3EE"
        fontFamily={FONTS.spaceGrotesk}
        fontSize={60}
        variant="mask-up"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 42, alignItems: "center" }}>
        {/* Left: Node graph + Audio Waveform + Synchronized Subtitle Strip */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ position: "relative", height: 425 }}>
            <ExplainerPipelineGraph
              nodes={assetNodes}
              edges={edges}
              stageWidth={920}
              stageHeight={420}
              accentColor="#8247FF"
            />
          </div>

          <ExplainerAudioWaveform accentColor="#22D3EE" height={68} barCount={28} />

          {/* Synchronized Kinetic Caption Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "12px 18px",
              background: "rgba(9,11,24,0.92)",
              border: "1px solid rgba(16,185,129,0.34)",
              borderRadius: 10,
            }}
          >
            {words.map((w, idx) => (
              <span
                key={w}
                style={{
                  fontFamily: FONTS.spaceGrotesk,
                  fontSize: 24,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 6,
                  backgroundColor: idx === activeWordIdx ? "#22D3EE" : "transparent",
                  color: idx === activeWordIdx ? "#090B18" : "#9299B0",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Dual Format Output Transformation (9:16 Short + 16:9 Documentary) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <VideoMaskReveal delayFrames={56} direction="up" borderColor="rgba(130,71,255,0.65)" style={{ width: 270, height: 480 }}>
            <AbsoluteFill>
              <Img
                src={staticFile("assets/scenes/manhattan-skyline.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(9,11,24,0.3) 0%, rgba(9,11,24,0.92) 100%)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#A78BFA" }}>
                  9:16 SHORTS · 1080×1920
                </span>
                <div style={{ fontFamily: FONTS.playfair, fontSize: 32, fontWeight: 700, color: "#FFF" }}>
                  5 Giants Worth $15.2T
                </div>
              </div>
            </AbsoluteFill>
          </VideoMaskReveal>

          <VideoMaskReveal delayFrames={76} direction="right" borderColor="rgba(34,211,238,0.65)" style={{ width: 470, height: 275 }}>
            <AbsoluteFill>
              <Img
                src={staticFile("assets/scenes/silicon-wafer.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78)" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(9,11,24,0.92) 0%, rgba(9,11,24,0.28) 100%)",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: "#22D3EE" }}>
                  16:9 LONG-FORM · 1920×1080
                </span>
                <div style={{ fontFamily: FONTS.playfair, fontSize: 34, fontWeight: 700, color: "#FFF", maxWidth: 340 }}>
                  Inside The Compute Monopoly
                </div>
              </div>
            </AbsoluteFill>
          </VideoMaskReveal>
        </div>
      </div>
    </ExplainerStage>
  );
};

/**
 * Stage 3 (Requirement 10–13):
 * YouTube Metadata -> YouTube Upload API -> Multiple Channel Nodes + DataStreams + Scheduling Indicators.
 */
const MultiChannelPublishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const curves: readonly { curve: BezierCurveSpec; color: string; delay: number }[] = [
    { curve: { x0: 710, y0: 290, cx1: 920, cy1: 290, cx2: 960, cy2: 110, x1: 1170, y1: 110 }, color: "#8247FF", delay: 32 },
    { curve: { x0: 710, y0: 290, cx1: 920, cy1: 290, cx2: 960, cy2: 290, x1: 1170, y1: 290 }, color: "#22D3EE", delay: 42 },
    { curve: { x0: 710, y0: 290, cx1: 920, cy1: 290, cx2: 960, cy2: 470, x1: 1170, y1: 470 }, color: "#10B981", delay: 52 },
  ];

  const channels = [
    { name: "Capital Briefs", handle: "@capitalbriefs", slot: "12:30 PM IST", y: 110, color: "#8247FF", delay: 42 },
    { name: "AI Frontier", handle: "@aifrontierhq", slot: "06:00 PM IST", y: 290, color: "#22D3EE", delay: 52 },
    { name: "Wealth Signals", handle: "@wealthsignals", slot: "09:15 PM IST", y: 470, color: "#10B981", delay: 62 },
  ];

  return (
    <ExplainerStage padding="72px 86px 140px 86px" accentColor="#10B981">
      <AnimatedHeading
        eyebrow="YOUTUBE DATA API v3 // STAGES 08 → 10"
        title="METADATA, UPLOAD & AUTO-SCHEDULING"
        highlightWords={["AUTO-SCHEDULING"]}
        accentColor="#22D3EE"
        fontFamily={FONTS.spaceGrotesk}
        fontSize={60}
        variant="mask-up"
      />

      <div style={{ position: "relative", width: 1680, height: 590, margin: "0 auto" }}>
        <svg viewBox="0 0 1680 590" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <AnimatedArrow x1={290} y1={290} x2={440} y2={290} delayFrames={16} color="#22D3EE" strokeWidth={3.5} />
          {curves.map((c, idx) => (
            <React.Fragment key={idx}>
              <NetworkConnection curve={c.curve} delayFrames={c.delay} durationFrames={22} color={c.color} />
              <DataStream curve={c.curve} startFrame={c.delay + 12} color={c.color} particleCount={4} cycleFrames={38} />
            </React.Fragment>
          ))}
        </svg>

        {/* Left Node: SEO Metadata Generator */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 175,
            width: 270,
            padding: 24,
            borderRadius: 16,
            background: "rgba(14,18,40,0.92)",
            border: "1.5px solid #8247FF",
          }}
        >
          <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#A78BFA" }}>08 METADATA AI</span>
          <div style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 24, fontWeight: 700, color: "#FFF", marginTop: 8 }}>
            Title · Tags · 4K Thumb
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 15, color: "#10B981", marginTop: 12 }}>
            ✓ CTR-Optimized SEO
          </div>
        </div>

        {/* Center Node: Encrypted YouTube Publisher Hub */}
        <div
          style={{
            position: "absolute",
            left: 445,
            top: 165,
            width: 275,
            padding: 26,
            borderRadius: 18,
            background: "linear-gradient(145deg, rgba(23,20,56,0.96) 0%, rgba(16,19,41,0.94) 100%)",
            border: "2px solid #22D3EE",
            boxShadow: "0 0 36px rgba(34,211,238,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UploadCloud size={26} color="#22D3EE" />
            <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: "#22D3EE" }}>09 YOUTUBE ENGINE</span>
          </div>
          <div style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 26, fontWeight: 700, color: "#FFF", marginTop: 10 }}>
            AES-256-GCM OAuth 2.0
          </div>
          <div style={{ fontFamily: FONTS.inter, fontSize: 15, color: "#9299B0", marginTop: 8 }}>
            Concurrent upload &amp; publish dispatcher
          </div>
        </div>

        {/* Right Nodes: Multi-Channel Distribution + IST Schedules */}
        {channels.map((ch) => {
          const pop = enterSpring(frame, fps, ch.delay, 18, 170);
          return (
            <div
              key={ch.name}
              style={{
                position: "absolute",
                left: 1175,
                top: ch.y,
                width: 470,
                transform: `translateY(-50%) scale(${pop.toFixed(4)})`,
                opacity: interpolate(pop, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
                padding: "18px 22px",
                borderRadius: 14,
                background: "rgba(13, 17, 36, 0.92)",
                border: `1.5px solid ${ch.color}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Tv size={24} color={ch.color} />
                <div>
                  <div style={{ fontFamily: FONTS.spaceGrotesk, fontSize: 22, fontWeight: 700, color: "#FFF" }}>
                    {ch.name}
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#9299B0" }}>{ch.handle}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarClock size={18} color="#22D3EE" />
                <span style={{ fontFamily: FONTS.mono, fontSize: 15, fontWeight: 700, color: "#22D3EE" }}>
                  {ch.slot}
                </span>
                <CheckCircle2 size={18} color="#10B981" />
              </div>
            </div>
          );
        })}
      </div>
    </ExplainerStage>
  );
};

/**
 * Stage 4 (Requirement 14): Cinematic ViralMotionStudio Brand Reveal.
 */
const ExplainerBrandRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  return (
    <ExplainerStage padding="110px 96px 150px 96px" accentColor="#8247FF">
      <LightSweep color="#22D3EE" startFrame={8} durationFrames={50} maxOpacity={0.22} />
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          opacity: fade,
        }}
      >
        <ParallaxLayer depth={1.15}>
          <BrandLogoMark size={132} animate />
        </ParallaxLayer>

        <div
          style={{
            fontFamily: FONTS.spaceGrotesk,
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#F8FAFC",
            textAlign: "center",
          }}
        >
          Viral<span style={{ color: "#A78BFA" }}>Motion</span>
          <span style={{ color: "#22D3EE" }}>Studio</span>
        </div>

        <p
          style={{
            fontFamily: FONTS.inter,
            fontSize: 30,
            color: "#9299B0",
            margin: 0,
            textAlign: "center",
          }}
        >
          Turn Ideas Into Cinematic Experiences — Automatically.
        </p>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: "#22D3EE",
            border: "1px solid rgba(34,211,238,0.34)",
            padding: "10px 22px",
            borderRadius: 999,
          }}
        >
          VIRALMOTIONSTUDIO.TOOLIO.TECH
        </div>
      </div>
    </ExplainerStage>
  );
};

const SCENE_DEFS = [
  { id: "wf-idea", name: "01 Idea -> Script -> Storyboard", transitionAfter: "depth-push" as const, sfx: "whoosh" as const },
  { id: "wf-render", name: "02 Assets, Voice & Dual Formats", transitionAfter: "slide-left" as const, sfx: "shutter" as const },
  { id: "wf-publish", name: "03 YouTube Multi-Channel Sync", transitionAfter: "depth-push" as const, sfx: "switch" as const },
  { id: "wf-brand", name: "04 Brand Reveal", transitionAfter: undefined, sfx: "ding" as const },
];

export const WORKFLOW_EXPLAINER_DURATION =
  SCENE_DEFS.reduce((sum, s) => sum + MANIFEST.scenes[s.id].durationInFrames, 0) -
  (SCENE_DEFS.length - 1) * TRANSITION_FRAMES;

function buildWorkflowSfx(): readonly SfxCue[] {
  const cues: SfxCue[] = [];
  let cursor = 0;
  SCENE_DEFS.forEach((def, idx) => {
    const dur = MANIFEST.scenes[def.id].durationInFrames;
    cues.push({
      id: `wf-sfx-${def.id}`,
      frame: cursor + (idx === 0 ? 2 : 0),
      preset: def.sfx,
      volume: 0.34,
    });
    cursor += dur - (idx < SCENE_DEFS.length - 1 ? TRANSITION_FRAMES : 0);
  });
  return cues;
}

const WORKFLOW_SFX = buildWorkflowSfx();

export const WorkflowAutomationExplainer: React.FC<WorkflowAutomationProps> = ({
  accentColor,
  muted,
}) => {
  const theme = { ...TEMPLATE_PRESETS["ai-technology"], accent: accentColor };

  const renderElement = (id: string) => {
    switch (id) {
      case "wf-idea":
        return <IdeaScriptStoryboardScene />;
      case "wf-render":
        return <AssetVoiceRenderDualScene />;
      case "wf-publish":
        return <MultiChannelPublishScene />;
      case "wf-brand":
      default:
        return <ExplainerBrandRevealScene />;
    }
  };

  const scenes: CompositionSceneItem[] = SCENE_DEFS.map((def) => {
    const audio = MANIFEST.scenes[def.id];
    return {
      id: def.id,
      name: def.name,
      durationInFrames: audio.durationInFrames,
      transitionAfter: def.transitionAfter,
      transitionDuration: TRANSITION_FRAMES,
      voiceoverSrc: audio.audioSrc,
      captions: audio.captions,
      element: renderElement(def.id),
    };
  });

  return (
    <VideoComposition
      theme={theme}
      scenes={scenes}
      sfxCues={WORKFLOW_SFX}
      bgmSrc={MANIFEST.bgmSrc}
      bgmVolume={0.14}
      muted={muted}
      showProgressBar
    />
  );
};

