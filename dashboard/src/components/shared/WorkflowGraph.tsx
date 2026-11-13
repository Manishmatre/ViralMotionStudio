import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Clapperboard,
  Image,
  Mic,
  Activity,
  Subtitles,
  Film,
  Search,
  Share2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export type WorkflowStep = {
  id: string;
  num: string;
  label: string;
  short: string;
  desc: string;
  input: string;
  output: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
  speed: string;
};

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    id: "idea",
    num: "01",
    label: "Video Idea & Topic",
    short: "IDEA",
    desc: "AI researches trending business stories, macroeconomic shifts, tech monopolies, and high-CTR curiosity angles.",
    input: "Niche + 1-Sentence Concept",
    output: "Validated high-retention angle & target audience",
    icon: Sparkles,
    accent: "#8247FF",
    speed: "0.2s",
  },
  {
    id: "script",
    num: "02",
    label: "3-Second Hook & Script",
    short: "SCRIPT",
    desc: "Structures the narrative with an immediate 3-second hook, exponential escalation, and crisp conclusion.",
    input: "Curiosity premise",
    output: "Word-for-word rhythmic voice narration script",
    icon: FileText,
    accent: "#A78BFA",
    speed: "0.8s",
  },
  {
    id: "storyboard",
    num: "03",
    label: "Visual Storyboard",
    short: "STORYBOARD",
    desc: "Breaks script into 4 to 8 distinct visual scenes with exact millisecond timestamps and cinematography directions.",
    input: "Narration beats",
    output: "Scene filmstrip with camera pan & zoom vectors",
    icon: Clapperboard,
    accent: "#3677FF",
    speed: "0.4s",
  },
  {
    id: "assets",
    num: "04",
    label: "Visual Asset Pairing",
    short: "ASSETS",
    desc: "Assigns 35mm photographic plates, macroeconomic charts, 3D globes, and corporate insignia layers to every scene.",
    input: "Scene directions",
    output: "High-res photorealistic plates & vector models",
    icon: Image,
    accent: "#22D3EE",
    speed: "0.5s",
  },
  {
    id: "voiceover",
    num: "05",
    label: "Neural TTS Audio",
    short: "VOICEOVER",
    desc: "Synthesizes human-like narration using neural models with automatic pause cadences and audio ducking over music.",
    input: "Narration script",
    output: "Broadcast-quality WAV/MP3 speech stream",
    icon: Mic,
    accent: "#8247FF",
    speed: "1.2s",
  },
  {
    id: "motion",
    num: "06",
    label: "Remotion Engine",
    short: "MOTION",
    desc: "Renders smooth 30 FPS kinetic typography, 2.5D camera dolly pans, spline area charts, and geodesic arcs natively.",
    input: "Code composition",
    output: "Frame-perfect React-rendered visual elements",
    icon: Activity,
    accent: "#3677FF",
    speed: "Real-time",
  },
  {
    id: "subtitles",
    num: "07",
    label: "Retention Subtitles",
    short: "SUBTITLES",
    desc: "Generates word-level timestamps and applies spring-animated kinetic highlight styles calibrated for mobile eyes.",
    input: "Audio transcript",
    output: "Frame-locked dynamic subtitle overlays",
    icon: Subtitles,
    accent: "#22D3EE",
    speed: "0.3s",
  },
  {
    id: "render",
    num: "08",
    label: "Faststart MP4 Render",
    short: "RENDER",
    desc: "Encodes pristine 1080×1920 (Shorts) or 1920×1080 (Documentary) video with faststart moov-atom relocation.",
    input: "Remotion timeline",
    output: "High-bitrate, streamable MP4 file",
    icon: Film,
    accent: "#A78BFA",
    speed: "Cloud GPU",
  },
  {
    id: "metadata",
    num: "09",
    label: "AI YouTube SEO & Thumbnail",
    short: "METADATA",
    desc: "Creates high-CTR YouTube title variants, keyword descriptions, ranked tags, and paired 16:9 thumbnail artwork.",
    input: "Video thesis",
    output: "Search-optimized metadata & still PNG graphic",
    icon: Search,
    accent: "#8247FF",
    speed: "0.6s",
  },
  {
    id: "youtube",
    num: "10",
    label: "OAuth Auto-Publish",
    short: "YOUTUBE",
    desc: "Uploads directly to your connected YouTube channel via official OAuth 2.0 with duplicate prevention and IST scheduling.",
    input: "MP4 + Metadata + Channel Key",
    output: "Live or scheduled YouTube video URL",
    icon: Share2,
    accent: "#22D3EE",
    speed: "Instant",
  },
];

export const WorkflowGraph: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("idea");
  const active = WORKFLOW_STEPS.find((s) => s.id === selectedId) ?? WORKFLOW_STEPS[0];
  const ActiveIcon = active.icon;

  return (
    <div className="vms-workflow-module">
      {/* 10-Node Horizontal Flow Bar */}
      <div className="vms-workflow-track" role="tablist" aria-label="10-stage creation pipeline">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isSelected = step.id === active.id;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "vms-wf-node active" : "vms-wf-node"}
                onClick={() => setSelectedId(step.id)}
              >
                <div
                  className="vms-wf-node-icon"
                  style={{
                    borderColor: isSelected ? step.accent : "var(--vms-border)",
                    boxShadow: isSelected ? `0 0 16px ${step.accent}55` : "none",
                  }}
                >
                  <Icon size={16} color={isSelected ? step.accent : "var(--vms-text-secondary)"} />
                </div>
                <span className="vms-wf-node-num">{step.num}</span>
                <span className="vms-wf-node-label">{step.short}</span>
              </button>
              {idx < WORKFLOW_STEPS.length - 1 ? (
                <div className="vms-wf-connector" aria-hidden="true">
                  <div className="vms-wf-con-line" />
                  <div
                    className="vms-wf-con-dot"
                    style={{ animationDelay: `${idx * 0.18}s` }}
                  />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Deep Dive Inspector */}
      <div className="vms-wf-card">
        <div className="vms-wf-card-header">
          <div className="vms-wf-card-title">
            <span
              className="vms-wf-badge"
              style={{
                borderColor: `${active.accent}66`,
                background: `${active.accent}14`,
                color: active.accent,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ActiveIcon size={14} />
              <span>STAGE {active.num} · {active.short}</span>
            </span>
            <h3>{active.label}</h3>
          </div>
          <span className="vms-mono-tag">AUTOMATED IN {active.speed}</span>
        </div>

        <p className="vms-wf-desc">{active.desc}</p>

        <div className="vms-wf-io-grid">
          <div className="vms-wf-io-col">
            <span className="vms-wf-io-label">INPUT REQUIREMENT</span>
            <div className="vms-wf-io-box">
              <span className="vms-pulse-dot" />
              <span>{active.input}</span>
            </div>
          </div>
          <div className="vms-wf-io-arrow" aria-hidden="true">
            <ArrowRight size={18} color="var(--vms-cyan)" />
          </div>
          <div className="vms-wf-io-col">
            <span className="vms-wf-io-label">AUTONOMOUS OUTPUT</span>
            <div className="vms-wf-io-box out">
              <CheckCircle2 size={15} color="var(--vms-cyan)" />
              <strong>{active.output}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
