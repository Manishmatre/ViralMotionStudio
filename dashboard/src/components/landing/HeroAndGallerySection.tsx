import React, { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Box,
  Compass,
  Copy,
  Layers,
  Play,
  PlayCircle,
  ShieldCheck,
  Tv,
} from "lucide-react";
import { VIRAL_TEMPLATES } from "../../config/viralTemplates";
import type { DemoVideoItem } from "../../types/saas";
import { LazyVideoPreview } from "./LazyVideoPreview";

gsap.registerPlugin(ScrollTrigger);

type HeroAndGalleryProps = {
  demoVideos: DemoVideoItem[];
  authenticated: boolean;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

type StageTab = "prompt" | "storyboard" | "video";

// Isolated Timeline Scrubber so parent HeroAndGallerySection never re-renders on a timer
const TimelineProgressBar: React.FC = memo(() => {
  const [timelineProgress, setTimelineProgress] = useState(32);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const playheadTimer = window.setInterval(() => {
      setTimelineProgress((prev) => (prev >= 100 ? 0 : prev + 1.4));
    }, 110);
    return () => window.clearInterval(playheadTimer);
  }, []);

  return (
    <div className="vms-timeline-strip" aria-hidden="true">
      <div className="vms-timeline-track">
        <div
          className="vms-timeline-fill"
          style={{ width: `${timelineProgress}%` }}
        />
        <div
          className="vms-timeline-head"
          style={{ left: `${timelineProgress}%` }}
        />
      </div>
    </div>
  );
});

export const HeroAndGallerySection: React.FC<HeroAndGalleryProps> = ({
  demoVideos,
  authenticated,
  systemHealthy,
  onNavigate,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    VIRAL_TEMPLATES[0].id,
  );
  const [stageTab, setStageTab] = useState<StageTab>("video");

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vms-hero-stagger",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );

      gsap.from(".vms-bento-item", {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.72,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#capabilities",
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  function handleCloneStyle(templateId: string) {
    try {
      window.localStorage.setItem("vms_selected_template", templateId);
    } catch {
      // Ignore storage failure
    }
    onNavigate(authenticated ? "/dashboard" : "/signup");
  }

  const activeTemplate =
    VIRAL_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? VIRAL_TEMPLATES[0];
  const showcaseVideo =
    demoVideos.find((v) => v.id === activeTemplate.demoVideoId) ??
    demoVideos[0] ??
    null;
  const explainerVideo =
    demoVideos.find((v) => v.id === "workflow-explainer") ??
    demoVideos.find((v) => v.file?.includes("WorkflowAutomationExplainer")) ??
    demoVideos.find((v) => v.format === "long-form") ??
    demoVideos[0] ??
    null;

  return (
    <div ref={rootRef}>
      {/* SECTION 2: AUTONOMOUS YOUTUBE AUTOMATION STUDIO HERO */}
      <section id="hero" className="vms-hero">
        <div className="vms-cosmic-mesh" aria-hidden="true" />

        <div className="vms-container vms-hero-grid">
          <div className="vms-hero-copy">
            <div className="vms-eyebrow vms-hero-stagger">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#FF0033" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>AUTONOMOUS AI YOUTUBE CHANNEL STUDIO</span>
            </div>

            <h1 className="vms-hero-title vms-hero-stagger">
              <span className="vms-hero-line">AUTONOMOUS YOUTUBE VIDEOS.</span>
              <span className="vms-hero-line vms-grad-purple-blue">FROM SCRIPT TO UPLOAD.</span>
              <span className="vms-hero-line vms-grad-blue-cyan">ON PURE AUTOPILOT.</span>
            </h1>

            <p className="vms-hero-desc vms-hero-stagger">
              Produce high-retention documentary scripts, realistic cinematic motion graphics,
              neural voiceovers, and auto-publish directly to your YouTube channels via official
              Google OAuth 2.0 — without ever opening YouTube Studio manually.
            </p>

            <div className="vms-hero-cta-row vms-hero-stagger">
              <button
                type="button"
                className="vms-btn vms-btn-primary vms-btn-lg"
                onClick={() => onNavigate(authenticated ? "/app" : "/register")}
              >
                <span>Connect YouTube &amp; Start Free</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="vms-btn vms-btn-outline vms-btn-lg"
                onClick={() => {
                  document
                    .querySelector("#showcase")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <PlayCircle size={17} />
                <span>Watch Platform Engine</span>
              </button>
            </div>

            <div className="vms-trust-strip vms-hero-stagger">
              <span className="vms-trust-chip">
                <span className={systemHealthy ? "vms-status-dot online" : "vms-status-dot"} />
                Studio Pipeline Online
              </span>
              <span className="vms-trust-chip">
                <Tv size={13} color="#FF0033" />
                YouTube Data API v3 OAuth
              </span>
              <span className="vms-trust-chip">
                <ShieldCheck size={13} color="#A78BFA" />
                AES-256-GCM Guardrail
              </span>
            </div>
          </div>

          {/* Autonomous YouTube Automation Engine — Single Cinema Showcase */}
          <div className="vms-hero-single-cinema vms-hero-stagger">
            <div className="vms-cinema-glow" aria-hidden="true" />

            {/* Top Bar */}
            <div className="vms-cinema-topbar">
              <div className="vms-cinema-badge-group">
                <div className="vms-yt-icon-box" title="YouTube Verified Integration">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0033" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <div className="vms-cinema-title-row">
                    <strong>YouTube Automation Engine</strong>
                    <span className="vms-verified-badge" title="Official YouTube Data API v3 Verified">✓</span>
                  </div>
                  <div className="vms-cinema-subtitle-row">
                    <span className="vms-pulse-dot" />
                    <span>Autonomous Remotion Video Pipeline · 30 FPS Render</span>
                  </div>
                </div>
              </div>

              <div className="vms-cinema-tech-pill">
                <span className="vms-pill-accent">4K Mastered</span>
                <span>1920×1080 30FPS</span>
              </div>
            </div>

            {/* Cinematic 16:9 Video Viewport */}
            <div className="vms-cinema-viewport">
              <LazyVideoPreview
                src={explainerVideo?.mp4Url || "/media/out/WorkflowAutomationExplainer.mp4"}
                poster={explainerVideo?.thumbnailUrl || "/media/out/thumbnails/RichestCompanies-16x9.png"}
                aspectRatio="16 / 9"
                title="YouTube Automation Engine Explainer"
              />
            </div>

            {/* Bottom Meta & Telemetry Strip — Zero Hashtags */}
            <div className="vms-cinema-footer">
              <div className="vms-cinema-info">
                <div className="vms-cinema-label">AUTONOMOUS VIDEO SYSTEM</div>
                <h3 className="vms-cinema-headline">
                  From Prompt to 30 FPS Motion Graphics &amp; Direct YouTube Upload
                </h3>
                <p className="vms-cinema-desc">
                  Zero manual keyframing. Neural voice synthesis, custom animated infographics, sound design and official OAuth 2.0 multi-channel publishing in one unified workflow.
                </p>
              </div>

              <div className="vms-cinema-bottom-bar">
                <div className="vms-hero-equalizer" title="Neural Audio Signal Sync">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="vms-eq-bar" />
                  ))}
                </div>

                <div className="vms-cinema-chips">
                  <span className="vms-chip-item">
                    <Tv size={12} color="#FF0033" />
                    <span>Google OAuth 2.0</span>
                  </span>
                  <span className="vms-chip-item">
                    <ShieldCheck size={12} color="#22D3EE" />
                    <span>No Duplicates Guard</span>
                  </span>
                  <span className="vms-chip-item">
                    <Activity size={12} color="#34D399" />
                    <span>Live Pipeline</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ANIMATED VIDEO SHOWCASE (ASYMMETRIC THEATER) */}
      <section id="showcase" className="vms-section vms-band-secondary">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">ANIMATED VIDEO SHOWCASE</span>
              <h2 className="vms-h2">
                Inspect every prompt from raw idea to rendered motion video
              </h2>
            </div>
            <p className="vms-sub-side">
              Switch compositions on the right to inspect the 1-sentence input
              prompt, AI scene breakdown, and rendered HD output with audio.
            </p>
          </div>

          <div className="vms-theater-grid">
            <div className="vms-theater-stage">
              <div className="vms-stage-topbar">
                <div className="vms-stage-tabs" role="tablist" aria-label="Before and after stage">
                  {(
                    [
                      { key: "prompt", label: "1. Prompt" },
                      { key: "storyboard", label: "2. Storyboard" },
                      { key: "video", label: "3. Rendered Video" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={stageTab === tab.key}
                      className={stageTab === tab.key ? "vms-stage-tab active" : "vms-stage-tab"}
                      onClick={() => setStageTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="vms-mono-tag">{activeTemplate.durationLabel}</span>
              </div>

              {stageTab === "prompt" ? (
                <div className="vms-theater-panel">
                  <span className="vms-cyan-tag">1-SENTENCE PROMPT INPUT</span>
                  <h3>&ldquo;{activeTemplate.prompt}&rdquo;</h3>
                  <p className="vms-hook-line">
                    Generated Hook: &ldquo;{activeTemplate.hook}&rdquo;
                  </p>
                  <div className="vms-panel-actions">
                    <button
                      type="button"
                      className="vms-btn vms-btn-primary"
                      onClick={() => setStageTab("storyboard")}
                    >
                      Inspect AI Storyboard
                      <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="vms-btn vms-btn-outline"
                      onClick={() => handleCloneStyle(activeTemplate.id)}
                    >
                      <Copy size={14} />
                      <span>Clone Style ({activeTemplate.creditCost} cr)</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {stageTab === "storyboard" ? (
                <div className="vms-theater-panel">
                  <span className="vms-purple-pill">
                    {activeTemplate.scenes.length} AUTO-TIMED VISUAL SCENES
                  </span>
                  <div className="vms-scene-list">
                    {activeTemplate.scenes.map((sc, idx) => (
                      <div key={sc.id} className="vms-scene-list-item">
                        <div>
                          <strong>
                            0{idx + 1} · {sc.label}
                          </strong>
                          <span>{sc.visualDirection}</span>
                        </div>
                        <span className="vms-mono-tag">{sc.durationSec}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {stageTab === "video" && showcaseVideo ? (
                <div className="vms-theater-video">
                  <LazyVideoPreview
                    key={showcaseVideo.mp4Url}
                    src={showcaseVideo.mp4Url}
                    poster={showcaseVideo.thumbnailUrl}
                    aspectRatio={showcaseVideo.format === "long-form" ? "16 / 9" : "9 / 16"}
                    title={showcaseVideo.title}
                  />
                </div>
              ) : null}

              {/* Animated Keyframe Timeline Scrubber */}
              <TimelineProgressBar />
            </div>

            {/* Interactive Composition Reel Rail */}
            <aside className="vms-theater-rail" aria-label="Motion video styles">
              {VIRAL_TEMPLATES.map((tpl) => {
                const isSelected = tpl.id === activeTemplate.id;
                return (
                  <div
                    key={tpl.id}
                    className={isSelected ? "vms-rail-item active" : "vms-rail-item"}
                  >
                    <button
                      type="button"
                      className="vms-rail-select"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                    >
                      <div className="vms-rail-meta">
                        <span className="vms-cyan-tag">{tpl.badge}</span>
                        <Play size={14} color={isSelected ? "#22D3EE" : "#9299B0"} />
                      </div>
                      <strong>{tpl.title}</strong>
                      <span>{tpl.styleLabel}</span>
                    </button>
                    <button
                      type="button"
                      className="vms-rail-clone"
                      onClick={() => handleCloneStyle(tpl.id)}
                    >
                      <Copy size={13} />
                      <span>Clone This Style</span>
                    </button>
                  </div>
                );
              })}
            </aside>
          </div>
        </div>
      </section>

      {/* SECTION 4: CREATIVE CAPABILITIES (ASYMMETRICAL BENTO SHOWCASE) */}
      <section id="capabilities" className="vms-section">
        <div className="vms-container">
          <div className="vms-section-header-left">
            <span className="vms-kicker">CREATIVE CAPABILITIES</span>
            <h2 className="vms-h2">
              Motion design architecture, engineered for attention
            </h2>
          </div>

          <div className="vms-bento-grid">
            {/* Large Vertical Highlight */}
            <article className="vms-bento-item vms-bento-tall">
              <span className="vms-purple-pill">
                <Box size={13} />
                <span>DIMENSIONAL 3D SCENES</span>
              </span>
              <h3>Kinetic typography, floating monoliths &amp; depth camera sweeps</h3>
              <p>
                Every headline animates with spring momentum across parallax
                planes, glowing orbital rings, and dynamic camera zoom arcs.
              </p>
              <div className="vms-bento-visual-3d" aria-hidden="true">
                <div className="vms-mini-tower t1" />
                <div className="vms-mini-tower t2" />
                <div className="vms-mini-tower t3" />
              </div>
            </article>

            {/* Wide Top Module */}
            <article className="vms-bento-item vms-bento-wide">
              <div className="vms-bento-split">
                <div>
                  <span className="vms-cyan-tag">
                    <Compass size={13} />
                    <span>GEOGRAPHY &amp; VECTORS</span>
                  </span>
                  <h3>3D geodesic globes &amp; animated trade corridors</h3>
                  <p>
                    Highlight shipping straits, nation comparisons, and global
                    capital flows synchronized automatically to your voiceover.
                  </p>
                </div>
                <div className="vms-bento-globe" aria-hidden="true">
                  <svg viewBox="0 0 180 120" width="180" height="120">
                    <circle cx="90" cy="60" r="46" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1.5" />
                    <ellipse cx="90" cy="60" rx="46" ry="18" fill="none" stroke="#3677FF" strokeWidth="1.5" />
                    <ellipse cx="90" cy="60" rx="20" ry="46" fill="none" stroke="#8247FF" strokeWidth="1.5" />
                    <path d="M 52 55 Q 90 18 128 65" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeDasharray="4 4" />
                    <circle cx="52" cy="55" r="4" fill="#22D3EE" />
                    <circle cx="128" cy="65" r="4" fill="#8247FF" />
                  </svg>
                </div>
              </div>
            </article>

            {/* Bottom Dual Compact Modules */}
            <article className="vms-bento-item">
              <span className="vms-blue-tag">
                <BarChart3 size={13} />
                <span>DATA STORYTELLING</span>
              </span>
              <h3>Spring charts &amp; number tickers</h3>
              <p>
                Animate $15T market rankings, speed comparisons, and multi-era
                timelines with crisp legibility on mobile screens.
              </p>
            </article>

            <article className="vms-bento-item">
              <span className="vms-purple-pill">
                <Layers size={13} />
                <span>CYBERNETIC HUDS</span>
              </span>
              <h3>Frame-locked telemetry overlays</h3>
              <p>
                Clean grid hairlines, node flow diagrams, and word-synced
                highlighted captions locked to every vocal transient.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

