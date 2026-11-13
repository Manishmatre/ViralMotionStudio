import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, Clapperboard, FileText, Share2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NICHE_SAMPLES: Record<
  string,
  {
    styleBadge: string;
    hook: string;
    seoTitle: string;
    tags: string[];
    scenes: { label: string; visual: string; duration: string }[];
  }
> = {
  "Business stories": {
    styleBadge: "Dimensional 3D · Indigo & Purple",
    hook: "Five companies are now worth more than entire continents.",
    seoTitle: "5 Companies Worth More Than Entire Continents ($15.2T) #Shorts",
    tags: ["business", "richest companies", "nvidia", "apple", "shorts"],
    scenes: [
      { label: "01 · 3D Monoliths Hook", visual: "Dimensional skyscrapers + $15.2T counter", duration: "9.0s" },
      { label: "02 · GDP Scale Pillars", visual: "Compare valuation vs major economies", duration: "6.5s" },
      { label: "03 · Global Capital Map", visual: "Animated HQ flight arcs + glow markers", duration: "7.5s" },
      { label: "04 · Silicon vs Oil Duel", visual: "Parallax 3D comparison card", duration: "8.0s" },
    ],
  },
  "AI & technology": {
    styleBadge: "Cybernetic HUD · Electric Blue & Cyan",
    hook: "Traditional apps are quietly dying because AI agents don't need buttons.",
    seoTitle: "Why AI Agents Will Replace Every App You Use #Shorts",
    tags: ["ai", "ai agents", "automation", "software", "tech"],
    scenes: [
      { label: "01 · 3D Neural Core", visual: "Wireframe 3D core + 91% automation KPI", duration: "5.5s" },
      { label: "02 · Agent Flow Diagram", visual: "Prompt -> Planner -> API -> Verified trace", duration: "7.0s" },
      { label: "03 · Speed Benchmark Bars", visual: "Manual vs Copilot vs Autonomous speed", duration: "6.5s" },
    ],
  },
  "Geography explained": {
    styleBadge: "Orbital Atlas · Deep Violet & Cyan",
    hook: "How did a tiny island with zero oil out-earn historic empires?",
    seoTitle: "How One Tiny Island Out-Earned Empires (171x Growth) #Shorts",
    tags: ["geography", "singapore", "economics", "trade routes"],
    scenes: [
      { label: "01 · 3D Geodesic Globe", visual: "Rotating globe + $88.4K GDP per capita", duration: "6.0s" },
      { label: "02 · Strait of Malacca", visual: "Animated maritime chokepoint shipping arcs", duration: "7.3s" },
      { label: "03 · 171x Growth Curve", visual: "1965 to present trajectory chart", duration: "7.7s" },
    ],
  },
  "Billionaires & money": {
    styleBadge: "Broadcast Essay · Blue & Lavender",
    hook: "Time, not stock picking, created nearly all of Warren Buffett's net worth.",
    seoTitle: "The Math Behind Exponential Compounding #Shorts",
    tags: ["wealth", "compounding", "billionaires", "investing"],
    scenes: [
      { label: "01 · Editorial Thesis", visual: "Geometric prism frame + kinetic headline", duration: "5.0s" },
      { label: "02 · Compounding Curve", visual: "Exponential trendline reveal animation", duration: "6.0s" },
      { label: "03 · Strategic Takeaway", visual: "Parallax breakdown + CTA", duration: "4.0s" },
    ],
  },
};

export const WorkflowAndAiSection: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string>("Business stories");
  const sample = NICHE_SAMPLES[selectedNiche] ?? NICHE_SAMPLES["Business stories"];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !wrapRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(".vms-timeline-node", {
        y: 26,
        opacity: 0,
        stagger: 0.12,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#workflow",
          start: "top 78%",
          once: true,
        },
      });
      gsap.from(".vms-svg-flow-path", {
        strokeDashoffset: 400,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#workflow",
          start: "top 78%",
          once: true,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef}>
      {/* SECTION 5: AI WORKFLOW (EDITORIAL TIMELINE + BLUEPRINT) */}
      <section id="workflow" className="vms-section vms-band-indigo">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">AI CREATIVE WORKFLOW</span>
              <h2 className="vms-h2">
                From one prompt to autonomous channel distribution
              </h2>
            </div>
            <p className="vms-sub-side">
              Direct your entire pipeline in one continuous sequence: AI script
              architecture, 3D scene compilation, voice + captions, and OAuth
              publishing.
            </p>
          </div>

          <div className="vms-flow-svg-wrap" aria-hidden="true">
            <svg viewBox="0 0 1000 32" className="vms-flow-svg">
              <path
                d="M 40 16 L 960 16"
                fill="none"
                stroke="rgba(167,139,250,0.18)"
                strokeWidth="2"
              />
              <path
                d="M 40 16 L 960 16"
                fill="none"
                stroke="url(#vmsCosmicFlow)"
                strokeWidth="3"
                strokeDasharray="400"
                className="vms-svg-flow-path"
              />
              <defs>
                <linearGradient id="vmsCosmicFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8247FF" />
                  <stop offset="52%" stopColor="#3677FF" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="vms-timeline-row">
            {[
              {
                num: "01",
                icon: Bot,
                color: "#8247FF",
                title: "Script & Visual Direction",
                desc: "Turns any topic into an attention-grabbing hook, timed visual cues, and SEO tags.",
              },
              {
                num: "02",
                icon: Clapperboard,
                color: "#3677FF",
                title: "3D Motion Compilation",
                desc: "Assembles dimensional stages, animated data bars, and corridor maps at 30 FPS.",
              },
              {
                num: "03",
                icon: FileText,
                color: "#22D3EE",
                title: "Neural Voice & Subtitles",
                desc: "Produces natural voice narration, stereo ducked music, and synced retention captions.",
              },
              {
                num: "04",
                icon: Share2,
                color: "#A78BFA",
                title: "Scheduled YouTube Sync",
                desc: "Pushes videos and HD thumbnails directly to connected channels on your IST schedule.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="vms-timeline-node">
                  <div className="vms-node-head">
                    <span className="vms-node-num" style={{ color: step.color }}>
                      {step.num}
                    </span>
                    <span className="vms-icon-box" style={{ borderColor: `${step.color}44` }}>
                      <Icon size={17} color={step.color} />
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Storyboard Blueprint Split */}
          <div className="vms-blueprint-split">
            <div>
              <span className="vms-kicker">STORYBOARD DIRECTOR</span>
              <h3 className="vms-h3">
                Preview how AI directs every scene for your niche
              </h3>
              <p className="vms-muted">
                Every script maps exact narration beats to visual animations,
                sound transitions, and YouTube search optimization.
              </p>

              <div className="vms-niche-selector" role="group" aria-label="Preview AI script niches">
                {Object.keys(NICHE_SAMPLES).map((niche) => (
                  <button
                    key={niche}
                    type="button"
                    className={selectedNiche === niche ? "vms-chip active" : "vms-chip"}
                    onClick={() => setSelectedNiche(niche)}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>

            <div className="vms-blueprint-console">
              <div className="vms-blueprint-head">
                <span className="vms-purple-pill">{sample.styleBadge}</span>
                <span className="vms-mono-tag">SCENE BLUEPRINT</span>
              </div>
              <p className="vms-hook-quote">&ldquo;{sample.hook}&rdquo;</p>
              <div className="vms-scene-list">
                {sample.scenes.map((sc) => (
                  <div key={sc.label} className="vms-scene-list-item">
                    <div>
                      <strong>{sc.label}</strong>
                      <span>{sc.visual}</span>
                    </div>
                    <span className="vms-mono-tag">{sc.duration}</span>
                  </div>
                ))}
              </div>
              <div className="vms-seo-strip">
                <strong>{sample.seoTitle}</strong>
                <div className="vms-tag-list">
                  {sample.tags.map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
