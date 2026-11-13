import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioLines, Globe2, Monitor, Smartphone, Subtitles, Volume2 } from "lucide-react";
import type { DemoVideoItem } from "../../types/saas";
import { LazyVideoPreview } from "./LazyVideoPreview";

gsap.registerPlugin(ScrollTrigger);

type EngineAndAudioProps = {
  shortVideo: DemoVideoItem | null;
  longVideo: DemoVideoItem | null;
  thumbnailUrl: string | null;
};

const FINANCE_BARS = [
  { ticker: "AAPL", value: 3.4, pct: 100, color: "#8247FF" },
  { ticker: "NVDA", value: 3.3, pct: 97, color: "#3677FF" },
  { ticker: "MSFT", value: 3.1, pct: 91, color: "#22D3EE" },
  { ticker: "GOOGL", value: 2.2, pct: 65, color: "#A78BFA" },
  { ticker: "AMZN", value: 2.1, pct: 62, color: "#C4B5FD" },
];

const VOICE_PRESETS = [
  {
    id: "executive",
    label: "Executive Narrator",
    words: ["Five", "corporations", "now", "outweigh", "entire", "continents", "combined."],
  },
  {
    id: "analyst",
    label: "Tech Analyst",
    words: ["Autonomous", "AI", "agents", "route", "workflows", "in", "milliseconds."],
  },
  {
    id: "atlas",
    label: "Documentary Voice",
    words: ["Maritime", "geography", "transformed", "an", "island", "into", "power."],
  },
];

export const EngineAndAudioSection: React.FC<EngineAndAudioProps> = ({
  shortVideo,
  longVideo,
  thumbnailUrl,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [formatTab, setFormatTab] = useState<"short" | "long">("short");
  const [voiceId, setVoiceId] = useState(VOICE_PRESETS[0].id);
  const [activeWord, setActiveWord] = useState(0);

  const activeVoice =
    VOICE_PRESETS.find((v) => v.id === voiceId) ?? VOICE_PRESETS[0];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".vms-chart-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#engine",
          start: "top 78%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setActiveWord((prev) => (prev + 1) % activeVoice.words.length);
    }, 440);
    return () => window.clearInterval(t);
  }, [activeVoice.words.length]);

  return (
    <div ref={sectionRef}>
      {/* SECTION 6: MOTION GRAPHICS ENGINE */}
      <section id="engine" className="vms-section">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">MOTION GRAPHICS ENGINE</span>
              <h2 className="vms-h2">
                Dynamic rankings, 3D globes &amp; telemetry built to retain attention
              </h2>
            </div>
            <p className="vms-sub-side">
              Turn numbers and maps into kinetic storytelling — rendered natively at
              30 FPS without static slideshow cuts.
            </p>
          </div>

          <div className="vms-engine-split">
            <div className="vms-telemetry-panel">
              <div className="vms-blueprint-head">
                <span className="vms-purple-pill">SPRING MARKET CAP RACE</span>
                <span className="vms-mono-tag">VALUATION INDEX</span>
              </div>
              <div className="vms-bar-list">
                {FINANCE_BARS.map((item) => (
                  <div key={item.ticker} className="vms-bar-row">
                    <span className="vms-mono-tag">{item.ticker}</span>
                    <div className="vms-bar-track">
                      <div
                        className="vms-chart-fill"
                        style={{
                          width: `${item.pct}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                    <strong style={{ fontSize: 13 }}>${item.value}T</strong>
                  </div>
                ))}
              </div>
              <p className="vms-muted-sm">
                Dimensionally lit charts and live milestone counters calibrated for high completion rates.
              </p>
            </div>

            <div className="vms-map-console">
              <div className="vms-blueprint-head">
                <span className="vms-cyan-tag">CAPITAL CORRIDOR VECTORS</span>
                <span className="vms-mono-tag">SVG ROUTE ENGINE</span>
              </div>
              <div className="vms-map-stage">
                <svg
                  viewBox="0 0 420 180"
                  className="vms-map-svg"
                  aria-label="Animated global capital corridor map"
                >
                  <path
                    d="M25,115 Q110,45 190,92 T365,78"
                    fill="none"
                    stroke="rgba(167,139,250,0.16)"
                    strokeWidth="2"
                  />
                  <path
                    d="M65,85 Q185,20 345,105"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="2.5"
                    strokeDasharray="6 5"
                    className="vms-map-arc"
                  />
                  <path
                    d="M120,120 Q230,55 310,75"
                    fill="none"
                    stroke="#8247FF"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="vms-map-arc"
                  />
                  <circle cx="65" cy="85" r="5" fill="#22D3EE" />
                  <circle cx="215" cy="70" r="5" fill="#3677FF" />
                  <circle cx="345" cy="105" r="6" fill="#8247FF" />
                  <text x="48" y="108" fill="#9299B0" fontSize="10">CUPERTINO</text>
                  <text x="195" y="55" fill="#F8FAFC" fontSize="10">RIYADH</text>
                  <text x="315" y="128" fill="#22D3EE" fontSize="10">SINGAPORE</text>
                </svg>
              </div>
              <p className="vms-muted-sm">
                <Globe2
                  size={14}
                  color="#22D3EE"
                  style={{ verticalAlign: "text-bottom", marginRight: 6 }}
                />
                Synchronized trade trajectories, geopolitical pins, and camera zoom sweeps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: AI VOICEOVER STUDIO */}
      <section className="vms-section vms-band-secondary">
        <div className="vms-container vms-split-grid">
          <div className="vms-voice-console">
            <div className="vms-blueprint-head">
              <span className="vms-cyan-tag">
                <AudioLines size={13} />
                <span>AI VOICEOVER STUDIO</span>
              </span>
              <span className="vms-mono-tag">
                <Volume2 size={13} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />
                STEREO DUCKING
              </span>
            </div>

            <div className="vms-voice-pills" role="group" aria-label="Voice profiles">
              {VOICE_PRESETS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={voiceId === v.id ? "vms-chip active" : "vms-chip"}
                  onClick={() => {
                    setVoiceId(v.id);
                    setActiveWord(0);
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="vms-waveform" aria-hidden="true">
              {Array.from({ length: 32 }, (_, idx) => (
                <span
                  key={idx}
                  className="vms-wave-bar"
                  style={{
                    animationDelay: `${(idx % 8) * 0.1}s`,
                    background:
                      idx % 3 === 0
                        ? "#8247FF"
                        : idx % 2 === 0
                          ? "#3677FF"
                          : "#22D3EE",
                  }}
                />
              ))}
            </div>

            <div className="vms-caption-box" aria-live="off">
              <Subtitles size={15} color="#A78BFA" />
              <div className="vms-caption-words">
                {activeVoice.words.map((word, idx) => (
                  <span
                    key={`${word}-${idx}`}
                    className={
                      idx === activeWord ? "vms-cap-word active" : "vms-cap-word"
                    }
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="vms-kicker">VOICEOVER, SUBTITLES &amp; SOUND DESIGN</span>
            <h2 className="vms-h2">
              Studio narration mixed with music &amp; frame-synced captions
            </h2>
            <p className="vms-sub" style={{ textAlign: "left", marginLeft: 0 }}>
              Switch between vocal styles, align word-level highlights automatically,
              and balance background ambiance beneath every spoken syllable.
            </p>
            <ul className="vms-check-list">
              <li>Word-by-word kinetic retention subtitles calibrated to pacing</li>
              <li>Auto-ducked atmospheric score paired with narration peaks</li>
              <li>Scene transition audio accents synchronized to motion beats</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 8: SHORTS AND LONG-FORM */}
      <section className="vms-section">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">MULTI-FORMAT RENDERING</span>
              <h2 className="vms-h2">
                Produce 9:16 Vertical Shorts &amp; 16:9 Documentaries from one workspace
              </h2>
            </div>
            <div className="vms-filter-row" role="tablist" aria-label="Format comparison">
              <button
                type="button"
                role="tab"
                aria-selected={formatTab === "short"}
                className={formatTab === "short" ? "vms-chip active" : "vms-chip"}
                onClick={() => setFormatTab("short")}
              >
                <Smartphone size={14} />
                <span>9:16 Shorts (1 Credit)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={formatTab === "long"}
                className={formatTab === "long" ? "vms-chip active" : "vms-chip"}
                onClick={() => setFormatTab("long")}
              >
                <Monitor size={14} />
                <span>16:9 Documentaries (3 Credits)</span>
              </button>
            </div>
          </div>

          <div
            className={
              formatTab === "long"
                ? "vms-format-grid vms-format-grid-wide"
                : "vms-format-grid"
            }
          >
            <div className="vms-format-preview">
              {formatTab === "short" && shortVideo ? (
                <LazyVideoPreview
                  src={shortVideo.mp4Url}
                  poster={shortVideo.thumbnailUrl}
                  aspectRatio="9 / 16"
                  title={shortVideo.title}
                />
              ) : formatTab === "long" && longVideo ? (
                <LazyVideoPreview
                  src={longVideo.mp4Url}
                  poster={longVideo.thumbnailUrl}
                  aspectRatio="16 / 9"
                  title={longVideo.title}
                />
              ) : null}
            </div>

            <div className="vms-format-details">
              <span className="vms-purple-pill">
                {formatTab === "short" ? "1080×1920 VERTICAL" : "1920×1080 WIDESCREEN"}
              </span>
              <h3>
                {formatTab === "short"
                  ? "Engineered for YouTube Shorts, Reels & TikTok feeds"
                  : "Built for deep-dive YouTube Essays & Broadcast Explainers"}
              </h3>
              <p className="vms-muted">
                {formatTab === "short"
                  ? "Fast 3-second kinetic hook, vertical split comparisons, large high-contrast word captions, and automated daily publishing."
                  : "Expansive horizontal 16:9 composition canvas with panoramic world maps, chapter timelines, and paired HD YouTube thumbnails."}
              </p>

              {thumbnailUrl ? (
                <div className="vms-thumb-card">
                  <span className="vms-mono-tag">GENERATED HD THUMBNAIL OUTPUT</span>
                  <img
                    src={thumbnailUrl}
                    alt="Generated YouTube thumbnail composition"
                    loading="lazy"
                    className="vms-thumb-img"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
