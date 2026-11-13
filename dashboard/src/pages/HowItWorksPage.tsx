import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
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
  ChevronRight,
} from "lucide-react";

type HowItWorksProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

const STEP_DETAILS = [
  {
    step: 1,
    title: "Select or Generate Video Topic",
    kicker: "STEP 01 // TOPIC INTELLIGENCE",
    icon: Sparkles,
    accent: "#8247FF",
    headline: "Curate a high-CTR topic in high-retention niches",
    body: "Enter a custom 1-sentence prompt or pick from curated niches including Business stories, Tech monopolies, Global financial geography, or Wealth compounding. ViralMotionStudio identifies curiosity gaps that keep viewers watching beyond the first swipe.",
    inputLabel: "USER PROMPT INPUT",
    sampleInput: "How 5 tech corporations command more valuation than entire continents combined ($15.2T)",
    outputLabel: "VALIDATED TOPIC THESIS",
    sampleOutput: "Market capitalization concentration vs GDP of Europe and Latin America. Target retention: 85%+ at 30 seconds.",
    uiSnippet: {
      type: "Topic Analysis",
      metrics: ["High Curiosity Score: 96/100", "Estimated Retention: 82%", "Optimal Format: 9:16 Shorts"],
    },
  },
  {
    step: 2,
    title: "Generate Viral Script & Hook",
    kicker: "STEP 02 // SCRIPT ARCHITECTURE",
    icon: FileText,
    accent: "#A78BFA",
    headline: "Engineered around the crucial first 3-second hook",
    body: "The script engine writes word-for-word voiceover narration formatted in punchy, declarative sentences. It front-loads the most striking statistic to eliminate drop-off, maintaining a rhythmic cadence of 145 to 160 words per minute.",
    inputLabel: "AI SCRIPT DIRECTIVE",
    sampleInput: "Write a 45-second high-energy script with an instant hook, 3 comparison beats, and an editorial conclusion.",
    outputLabel: "WORD-FOR-WORD SCRIPT",
    sampleOutput: "Five corporations now command more economic power than entire sovereign continents combined. Apple, NVIDIA, Microsoft, Alphabet, and Amazon hold an astounding $15.2 trillion in market valuation...",
    uiSnippet: {
      type: "Script Telemetry",
      metrics: ["Word Count: 108 words", "Est. Narration Time: 44.4s", "Hook Duration: 3.1s"],
    },
  },
  {
    step: 3,
    title: "Review & Refine AI Storyboard",
    kicker: "STEP 03 // SCENE FILMSTRIP",
    icon: Clapperboard,
    accent: "#3677FF",
    headline: "Automated scene breakdown with millisecond precision",
    body: "Every sentence maps to a distinct visual scene in the storyboard. The system assigns cinematic visual direction, camera motion arcs (dolly-in, lateral pan, tilt-up), typography scale, and background depth planes.",
    inputLabel: "STORYBOARD TIMELINE",
    sampleInput: "Segment script into 5 cinematic beats matched to vocal transients.",
    outputLabel: "SCENE FILMSTRIP",
    sampleOutput: "Scene 1: Manhattan dusk open (9s) -> Scene 2: GDP nation pillars (6.5s) -> Scene 3: Global capital arcs (8s) -> Scene 4: Silicon vs Crude duel (8s) -> Scene 5: Corporate insignia CTA (5.5s)",
    uiSnippet: {
      type: "Scene Breakdown",
      metrics: ["Total Scenes: 5", "Average Scene: 7.2s", "Visual Transitions: 4 Optical Pushes"],
    },
  },
  {
    step: 4,
    title: "Assign Photographic & 3D Assets",
    kicker: "STEP 04 // ASSET COMPOSITION",
    icon: Image,
    accent: "#22D3EE",
    headline: "Photorealistic plates, clean silicon macros & vector maps",
    body: "Rather than cartoonish floating stickers, ViralMotionStudio pairs real 35mm photographic backdrops (blue-hour dusk skylines, cleanroom silicon wafer macros, offshore deep-sea platforms, institutional trading atriums) with 2.5D optical parallax depth.",
    inputLabel: "ASSET SELECTION",
    sampleInput: "Match scene concepts with high-resolution photographic and architectural vector elements.",
    outputLabel: "RESOLVED SCENE PLATES",
    sampleOutput: "manhattan-skyline.jpg (dusk skyscrapers) + silicon-wafer.jpg (cleanroom macro) + trading-atrium.jpg (dark institutional reflections)",
    uiSnippet: {
      type: "Asset Resolution",
      metrics: ["Resolution: 4K Source Plates", "Color Grade: Cinematic Cool Indigo", "Depth Layers: 3 Planes"],
    },
  },
  {
    step: 5,
    title: "Synthesize Neural TTS Voiceover",
    kicker: "STEP 05 // NEURAL AUDIO",
    icon: Mic,
    accent: "#8247FF",
    headline: "Broadcast-quality human narration with zero robotic tone",
    body: "Audio is synthesized via high-fidelity neural models (e.g. ChristopherNeural, GuyNeural, SoniaNeural). The engine automatically calibrates vocal pauses at punctuation marks and balances narration volume over atmospheric background music.",
    inputLabel: "NEURAL TTS DIRECTIVE",
    sampleInput: "Synthesize narration using Executive Narrator (en-US-ChristopherNeural) at +2% pitch and -1% speed.",
    outputLabel: "AUDIO STREAM",
    sampleOutput: "Output: 44.47s 48kHz stereo WAV narration with auto-ducked ambient score (-18dB under speech).",
    uiSnippet: {
      type: "Audio Telemetry",
      metrics: ["Sample Rate: 48 kHz", "Vocal Ducking: -18 dB Active", "Audio Clarity: 100% Broadcast Standard"],
    },
  },
  {
    step: 6,
    title: "Render Kinetic Motion Graphics",
    kicker: "STEP 06 // REMOTION ENGINE",
    icon: Activity,
    accent: "#3677FF",
    headline: "Deterministic 30 FPS React motion graphics in Remotion",
    body: "Remotion compiles every visual element programmatically. Financial charts grow with spring physics, geodesic trade arcs draw across continents, and tabular numerals count smoothly up to $15.2T without dropped frames.",
    inputLabel: "REMOTION COMPOSITION",
    sampleInput: "Composition: RichestCompaniesCinematic (1080x1920 @ 30 FPS, durationInFrames: 1334).",
    outputLabel: "RENDERED GRAPHICS",
    sampleOutput: "1,334 frames rendered deterministically with CameraRig2D dolly and ParallaxLayer tracking.",
    uiSnippet: {
      type: "Compositor Stats",
      metrics: ["Engine: Remotion v4", "Framerate: 30.00 FPS", "Frame Drop: 0.00%"],
    },
  },
  {
    step: 7,
    title: "Synchronize Retention Subtitles",
    kicker: "STEP 07 // CAPTION SYNC",
    icon: Subtitles,
    accent: "#22D3EE",
    headline: "Word-by-word kinetic highlight captions locked to audio",
    body: "Subtitles are generated with millisecond word timestamps. Active words illuminate in electric cyan or lavender with subtle scale pops exactly as they are uttered, eliminating visual fatigue and keeping viewer eyes locked to the screen.",
    inputLabel: "AUDIO TRANSCRIPT",
    sampleInput: "Extract word-level start/end offsets from neural audio waveform.",
    outputLabel: "SYNCHRONIZED CAPTIONS",
    sampleOutput: "108 words mapped to frame indices. Display format: 2-3 word clusters with current-word active glow.",
    uiSnippet: {
      type: "Caption Sync",
      metrics: ["Word Accuracy: 100%", "Display Pacing: 0.38s/word", "Mobile Readability: Optimized"],
    },
  },
  {
    step: 8,
    title: "Faststart MP4 Compilation",
    kicker: "STEP 08 // ENCODING PIPELINE",
    icon: Film,
    accent: "#A78BFA",
    headline: "Hardware-accelerated encoding with web streaming optimization",
    body: "Remotion renders and encodes high-bitrate H.264 video with AAC stereo audio. The pipeline relocates the MP4 moov-atom to the beginning of the file so users and YouTube servers can start streaming video before the entire file finishes downloading.",
    inputLabel: "FRAME BUNDLE",
    sampleInput: "Encode 1,334 frames with CRF 18, preset fast, AAC 192kbps audio.",
    outputLabel: "FASTSTART MP4",
    sampleOutput: "RichestCompaniesCinematic.mp4 (28.6 MB, faststart moov atom at byte offset 48).",
    uiSnippet: {
      type: "Render Output",
      metrics: ["File Size: 28.6 MB", "Codec: H.264 / AAC", "Moov Relocation: Completed"],
    },
  },
  {
    step: 9,
    title: "Generate AI YouTube Metadata & Thumbnail",
    kicker: "STEP 09 // SEO & THUMBNAIL",
    icon: Search,
    accent: "#8247FF",
    headline: "High-CTR title variants, description tags & 16:9 Still cover",
    body: "AI synthesizes YouTube-optimized titles, keyword-dense descriptions, and categorized hashtag bundles. In addition, Remotion extracts a pristine high-resolution still frame with branded typographic title overlays for your video thumbnail.",
    inputLabel: "VIDEO THESIS",
    sampleInput: "Generate YouTube title, description, tags, and capture 1280x720 PNG thumbnail.",
    outputLabel: "SEO PACKAGE",
    sampleOutput: "Title: How 5 Corporations Command More Economic Power Than Entire Continents ($15.2T) #Shorts. Tags: #business, #richest, #nvidia, #apple. Thumbnail: RichestCompanies-16x9.png",
    uiSnippet: {
      type: "SEO Package",
      metrics: ["SEO Score: 98/100", "Thumbnail: 1280×720 PNG", "Keyword Density: High"],
    },
  },
  {
    step: 10,
    title: "OAuth 2.0 Upload & Scheduled Release",
    kicker: "STEP 10 // AUTONOMOUS DISPATCH",
    icon: Share2,
    accent: "#22D3EE",
    headline: "Direct YouTube Data API v3 upload on your exact IST schedule",
    body: "The publishing daemon takes over. Using encrypted OAuth 2.0 refresh tokens, it streams the MP4 and thumbnail to YouTube, sets privacy to private or scheduled (e.g. 18:00 IST), and stores the live video URL in your dashboard history.",
    inputLabel: "PUBLISHING JOB",
    sampleInput: "Channel: Capital Briefs (@capitalbriefs), Slot: 18:00 IST, Mode: Fully-Automatic.",
    outputLabel: "LIVE YOUTUBE RELEASE",
    sampleOutput: "Status: 200 OK. Video ID: dQw4w9WgXcQ. URL: https://youtu.be/dQw4w9WgXcQ. Scheduled publication time: 2026-11-13T12:30:00Z.",
    uiSnippet: {
      type: "YouTube Status",
      metrics: ["Upload Stream: 100% Resumable", "OAuth: AES-256-GCM Verified", "Live URL: Created"],
    },
  },
];

export const HowItWorksPage: React.FC<HowItWorksProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [selectedStep, setSelectedStep] = useState(1);
  const activeDetail = STEP_DETAILS.find((d) => d.step === selectedStep) ?? STEP_DETAILS[0];
  const ActiveIcon = activeDetail.icon;

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/how-it-works"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* Header */}
        <section className="vms-section" style={{ paddingBottom: 32 }}>
          <div className="vms-container">
            <div className="vms-page-head">
              <span className="vms-kicker">END-TO-END AUTONOMOUS JOURNEY</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                From A Raw Idea To A Published YouTube Video in 10 Steps
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                Explore the complete production journey. Every single step runs inside ViralMotionStudio
                without manual third-party tools, timeline exports, or opening YouTube Studio.
              </p>
            </div>
          </div>
        </section>

        {/* Step Selector & Detail View */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container">
            <div className="vms-hiw-layout">
              {/* Left Step Rail */}
              <aside className="vms-hiw-rail">
                {STEP_DETAILS.map((st) => {
                  const Icon = st.icon;
                  const isSelected = st.step === selectedStep;
                  return (
                    <button
                      key={st.step}
                      type="button"
                      className={isSelected ? "vms-hiw-rail-btn active" : "vms-hiw-rail-btn"}
                      onClick={() => setSelectedStep(st.step)}
                    >
                      <div
                        className="vms-hiw-rail-icon"
                        style={{
                          borderColor: isSelected ? st.accent : "var(--vms-border)",
                          color: isSelected ? st.accent : "var(--vms-text-secondary)",
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="vms-hiw-rail-copy">
                        <span className="vms-hiw-rail-num">STEP 0{st.step}</span>
                        <strong>{st.title}</strong>
                      </div>
                      <ChevronRight size={15} className="vms-hiw-rail-arrow" />
                    </button>
                  );
                })}
              </aside>

              {/* Right Step Presentation */}
              <div className="vms-hiw-content-panel">
                <div className="vms-hiw-panel-head">
                  <div className="vms-hiw-kicker" style={{ color: activeDetail.accent }}>
                    <ActiveIcon size={16} />
                    <span>{activeDetail.kicker}</span>
                  </div>
                  <h2>{activeDetail.headline}</h2>
                  <p>{activeDetail.body}</p>
                </div>

                <div className="vms-hiw-io-split">
                  <div className="vms-hiw-io-box">
                    <span className="vms-cyan-tag">{activeDetail.inputLabel}</span>
                    <p>{activeDetail.sampleInput}</p>
                  </div>

                  <div className="vms-hiw-io-box result">
                    <span className="vms-purple-pill">{activeDetail.outputLabel}</span>
                    <p>{activeDetail.sampleOutput}</p>
                  </div>
                </div>

                <div className="vms-hiw-telemetry-strip">
                  <div className="vms-hiw-telemetry-head">
                    <span className="vms-mono-tag">SYSTEM METRICS // {activeDetail.uiSnippet.type}</span>
                  </div>
                  <div className="vms-hiw-metrics-row">
                    {activeDetail.uiSnippet.metrics.map((m) => (
                      <span key={m} className="vms-hiw-metric-pill">
                        <CheckCircle2 size={13} color="var(--vms-cyan)" />
                        <span>{m}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="vms-hiw-panel-footer">
                  {selectedStep < 10 ? (
                    <button
                      type="button"
                      className="vms-btn vms-btn-outline"
                      onClick={() => setSelectedStep((prev) => Math.min(10, prev + 1))}
                    >
                      <span>Next Step: Step 0{selectedStep + 1}</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="vms-btn vms-btn-primary"
                    onClick={() => onNavigate(authenticated ? "/app" : "/register")}
                  >
                    <span>Try This In Live Studio</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
