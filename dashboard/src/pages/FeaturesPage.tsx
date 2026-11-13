import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  Sparkles,
  Clapperboard,
  Mic,
  Film,
  Tv,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

type FeaturesPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

const FEATURE_GROUPS = [
  {
    id: "intelligence",
    label: "A. AI Content Intelligence",
    icon: Sparkles,
    accent: "#8247FF",
    tagline: "Algorithmic topic research, retention hook crafting & storyboard direction",
    items: [
      {
        title: "Curiosity & Retention Hook Generator",
        desc: "Engineered around the crucial first 3 seconds of viewer attention. Generates provocative thesis questions and counter-intuitive facts calibrated for mobile feeds.",
        metrics: "Sub-second generation · 4-beat structure",
      },
      {
        title: "Automated Script Architecture",
        desc: "Transforms complex business documents, earnings reports, or factual events into tightly rhythmic narration scripts with natural vocal pauses.",
        metrics: "Calibrated pacing: 145-160 WPM",
      },
      {
        title: "Scene-by-Scene Visual Director",
        desc: "Breaks scripts into timed visual sequences, assigning camera motion, typographic scale, and backdrop imagery to match vocal inflection points.",
        metrics: "Auto-timestamped to 30 FPS frames",
      },
      {
        title: "Trending Niche Presets",
        desc: "Pre-trained prompts for business stories, tech monopolies, macroeconomic anomalies, billionaire biographies, and psychological principles.",
        metrics: "Instant template cloning with 1 click",
      },
    ],
  },
  {
    id: "motion",
    label: "B. Motion Graphics Production",
    icon: Clapperboard,
    accent: "#3677FF",
    tagline: "Kinetic typography, macroeconomic charts, 2.5D camera rigs & vector maps",
    items: [
      {
        title: "Open-Air Architectural Financial Charts",
        desc: "Animate $15T market cap pillars, spline growth curves with tracking reticles, and split comparison bar meters with clean tabular numerals.",
        metrics: "SVG spline curves & spring momentum",
      },
      {
        title: "Geodesic Trade Corridor Maps",
        desc: "Vector continent flyovers with animated geodesic shipping arcs, harbor coordinate pins, and capital transfer trajectories.",
        metrics: "Frame-locked SVG path animations",
      },
      {
        title: "2.5D Camera Dolly & Parallax Sweeps",
        desc: "CameraRig2D orchestrates dollies, tilts, horizontal tracking sweeps, and subtle floating movements across multi-plane photographic depth.",
        metrics: "Zero cartoon blobs · True optical parallax",
      },
      {
        title: "Kinetic Typography & Staggered Headers",
        desc: "Space Grotesk and tabular mono numerals that build word-by-word with spring physics, gradient highlights, and hairline dividers.",
        metrics: "30 FPS deterministic Remotion rendering",
      },
    ],
  },
  {
    id: "audio",
    label: "C. AI Audio Studio",
    icon: Mic,
    accent: "#22D3EE",
    tagline: "Neural text-to-speech, word-synced subtitles & auto-ducked music mixing",
    items: [
      {
        title: "Natural Neural Voice Synthesis",
        desc: "Synthesizes expressive executive, analytical, and documentary narrators using edge neural speech engines with zero robotic cadence.",
        metrics: "Ultra-low latency · Broadcast fidelity",
      },
      {
        title: "Word-Level Subtitle Synchronization",
        desc: "Frame-locked kinetic captions that illuminate the exact word being spoken in real-time. Formatted for maximum mobile eye retention.",
        metrics: "Sub-frame timestamp precision",
      },
      {
        title: "Intelligent Audio Ducking",
        desc: "Background scores automatically attenuate beneath vocal frequencies and swell during cinematic transitions and dramatic pauses.",
        metrics: "Dynamic gain compression & stereo mix",
      },
      {
        title: "Synchronized Motion SFX",
        desc: "Subtle sub-bass impacts, riser sweeps, and telemetry accents placed deterministically at key visual transitions.",
        metrics: "Time-aligned to scene keyframes",
      },
    ],
  },
  {
    id: "production",
    label: "D. Multi-Format Video Production",
    icon: Film,
    accent: "#A78BFA",
    tagline: "9:16 Vertical Shorts & 16:9 Widescreen Documentaries from a single engine",
    items: [
      {
        title: "9:16 Vertical Shorts Engine",
        desc: "1080×1920 vertical format engineered for YouTube Shorts, Instagram Reels, and TikTok algorithms. Fast-paced, high-contrast, high retention.",
        metrics: "1 render credit per Short",
      },
      {
        title: "16:9 Widescreen Documentary Engine",
        desc: "1920×1080 cinematic landscape format designed for deep-dive business essays, YouTube long-form videos, and client explainers.",
        metrics: "3 render credits per Documentary",
      },
      {
        title: "Faststart MP4 Moov Relocation",
        desc: "Every rendered video undergoes automated moov-atom relocation so playback begins instantly in browsers without waiting for full download.",
        metrics: "Optimized for web & mobile streaming",
      },
      {
        title: "Automated HD Thumbnail Generation",
        desc: "Renders crisp 1280×720 and 1080×1920 cover artwork with high-CTR typography and branded frame overlays natively.",
        metrics: "Bundled alongside every render",
      },
    ],
  },
  {
    id: "automation",
    label: "E. YouTube Automation Engine",
    icon: Tv,
    accent: "#FF0033",
    tagline: "Official Google OAuth 2.0, multi-channel scheduling & hands-free publishing",
    items: [
      {
        title: "Official YouTube Data API v3",
        desc: "Direct integration using sanctioned Google OAuth 2.0. Upload videos directly to your channels without third-party scrapers or browser extensions.",
        metrics: "Official Google Partner Integration",
      },
      {
        title: "Isolated Multi-Channel Workspaces",
        desc: "Connect and manage up to 15 YouTube channels independently. Each channel retains its own niche, default format, and publishing slot.",
        metrics: "AES-256-GCM encrypted tokens at rest",
      },
      {
        title: "Automated Daily Scheduling (IST / UTC)",
        desc: "Configure fixed daily release slots (e.g. 09:00, 14:00, 18:00 IST). The automation engine uploads in private mode and schedules publication.",
        metrics: "Manual, Semi-Auto & Full-Auto modes",
      },
      {
        title: "Duplicate Upload Prevention Guard",
        desc: "Cryptographic deduplication keys ensure that server restarts or retries never result in duplicate videos posted to your YouTube channels.",
        metrics: "100% duplicate protection guaranteed",
      },
    ],
  },
];

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [activeTabId, setActiveTabId] = useState(FEATURE_GROUPS[0].id);
  const activeGroup = FEATURE_GROUPS.find((g) => g.id === activeTabId) ?? FEATURE_GROUPS[0];
  const ActiveIcon = activeGroup.icon;

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/features"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* Features Hero */}
        <section className="vms-section vms-features-hero">
          <div className="vms-container">
            <div className="vms-page-head">
              <span className="vms-kicker">COMPLETE PRODUCT ARCHITECTURE</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                Built For Creators Who Want Cinematic Motion, Not Text Slides.
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                Explore the five integrated systems powering ViralMotionStudio: AI content intelligence,
                Remotion motion graphics, neural audio synthesis, dual-format video compilation, and autonomous YouTube distribution.
              </p>
              <div className="vms-hero-cta-row" style={{ justifyContent: "center" }}>
                <button
                  type="button"
                  className="vms-btn vms-btn-primary vms-btn-lg"
                  onClick={() => onNavigate(authenticated ? "/app" : "/register")}
                >
                  <span>Start Creating Free</span>
                  <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  className="vms-btn vms-btn-outline vms-btn-lg"
                  onClick={() => onNavigate("/showcase")}
                >
                  <span>Inspect Live Video Demos</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Group Navigation Tabs */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container">
            <div className="vms-features-nav-strip" role="tablist">
              {FEATURE_GROUPS.map((grp) => {
                const Icon = grp.icon;
                const isSelected = grp.id === activeGroup.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={isSelected ? "vms-feat-tab active" : "vms-feat-tab"}
                    onClick={() => setActiveTabId(grp.id)}
                  >
                    <Icon size={16} color={isSelected ? grp.accent : "var(--vms-text-secondary)"} />
                    <span>{grp.label.split(". ")[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Group Showcase */}
            <div className="vms-feat-group-display">
              <div className="vms-feat-group-header">
                <div className="vms-feat-badge" style={{ borderColor: `${activeGroup.accent}66`, color: activeGroup.accent }}>
                  <ActiveIcon size={16} />
                  <span>{activeGroup.label}</span>
                </div>
                <h2>{activeGroup.tagline}</h2>
              </div>

              <div className="vms-feat-grid">
                {activeGroup.items.map((item, idx) => (
                  <article key={item.title} className="vms-feat-card">
                    <div className="vms-feat-card-num">0{idx + 1}</div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="vms-feat-meta">
                      <CheckCircle2 size={14} color="var(--vms-cyan)" />
                      <span>{item.metrics}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="vms-section vms-band-indigo">
          <div className="vms-container vms-split-grid" style={{ alignItems: "center" }}>
            <div>
              <span className="vms-kicker">READY TO AUTOMATE YOUR CHANNEL?</span>
              <h2 className="vms-h2">Create your first video in under 60 seconds</h2>
              <p className="vms-sub" style={{ textAlign: "left", marginLeft: 0 }}>
                Sign in with Google, connect your YouTube channel securely, and launch your first AI video
                production pipeline with free trial credits.
              </p>
            </div>
            <div style={{ display: "flex", gap: "14px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="vms-btn vms-btn-primary vms-btn-lg"
                onClick={() => onNavigate(authenticated ? "/app" : "/register")}
              >
                <span>Launch Free Studio</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
