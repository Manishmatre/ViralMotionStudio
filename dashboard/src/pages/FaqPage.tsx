import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ChevronDown, Search, ArrowRight } from "lucide-react";

type FaqPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

const FAQ_ITEMS = [
  {
    q: "What is ViralMotionStudio and how does it differ from traditional video editors?",
    a: "ViralMotionStudio is an autonomous AI-powered motion graphics and YouTube publishing engine. Instead of manually cutting clips or arranging text on a timeline in Premiere or CapCut, ViralMotionStudio turns a single topic or prompt into an AI script, visual storyboard, neural voiceover, and deterministic Remotion motion graphics video at 30 FPS. It then publishes or schedules directly to your YouTube channel via official OAuth 2.0.",
  },
  {
    q: "How does the AI video generation pipeline work?",
    a: "The pipeline consists of 10 connected stages: 1. Topic research, 2. Hook & script writing, 3. Timed scene breakdown, 4. Photographic plate and 3D visual selection, 5. Neural TTS audio synthesis, 6. Remotion React motion compilation, 7. Word-synced subtitle generation, 8. Hardware-accelerated MP4 rendering, 9. YouTube SEO title & thumbnail generation, and 10. Automated OAuth 2.0 release dispatch.",
  },
  {
    q: "Can I create 9:16 vertical Shorts and 16:9 widescreen long-form videos?",
    a: "Yes. ViralMotionStudio supports both formats natively. 9:16 Shorts (1080×1920, 30 FPS) are calibrated for high-retention feeds like YouTube Shorts and TikTok (using 1 credit). 16:9 Long-Form videos (1920×1080, 30 FPS) are designed for in-depth business essays, documentaries, and explainers (using 3 credits).",
  },
  {
    q: "Can I customize the neural voiceover and vocal narrator?",
    a: "Yes. You can select between different neural voices (e.g. Executive Narrator, Tech Analyst, Documentary Voice). The engine automatically adjusts pacing, inserts natural breath pauses at punctuation, and auto-ducks background score frequencies beneath spoken words.",
  },
  {
    q: "Can I connect multiple YouTube channels independently?",
    a: "Yes. Depending on your plan (Starter: 1, Creator: 3, Studio: 6, Agency: 15), you can link separate YouTube channels using official Google OAuth 2.0. Each channel is isolated with its own niche, default format, daily IST publishing slot, and encrypted refresh token.",
  },
  {
    q: "How does automated publishing and IST scheduling work?",
    a: "ViralMotionStudio features three publishing modes: Manual (you trigger uploads with 1 click), Semi-Automatic (system renders and prepares drafts for approval), and Fully-Automatic (system generates, renders, and publishes at your configured IST daily slots). All uploads use YouTube's resumable upload API and include cryptographic duplicate protection.",
  },
  {
    q: "Can I review videos before they are published to YouTube?",
    a: "Absolutely. In Manual or Semi-Automatic mode, you can inspect full video previews, review the word-by-word script, edit YouTube titles and tags, and check the generated HD thumbnail before triggering upload.",
  },
  {
    q: "What happens if a video render fails?",
    a: "Render credits are deducted only when an MP4 successfully passes rendering and faststart normalization. If an unexpected error occurs during rendering or TTS synthesis, credits are immediately refunded back to your workspace balance automatically.",
  },
  {
    q: "Are the videos created with real motion graphics or static slideshows?",
    a: "ViralMotionStudio uses real programmatic motion graphics powered by Remotion. This includes 2.5D optical camera sweeps, open architectural spline charts, geodesic shipping arcs, kinetic Space Grotesk typography, and photorealistic 35mm photographic backdrops — zero generic slideshow cuts or cartoon stickers.",
  },
  {
    q: "Is my channel authentication secure?",
    a: "Yes. We use the official Google YouTube Data API v3 OAuth 2.0 protocol. Your Google password is never requested or stored. OAuth refresh tokens are encrypted at rest with AES-256-GCM and stored isolated per workspace.",
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/faq"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* Header */}
        <section className="vms-section" style={{ paddingBottom: 28 }}>
          <div className="vms-container">
            <div className="vms-page-head">
              <span className="vms-kicker">KNOWLEDGE BASE &amp; FAQ</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                Frequently Asked Questions
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                Everything you need to know about the ViralMotionStudio creative engine, Remotion rendering,
                neural audio mixing, and YouTube Data API v3 automation.
              </p>

              {/* Search Bar */}
              <div className="vms-faq-search-box">
                <Search size={18} color="var(--vms-text-muted)" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. YouTube OAuth, credits, shorts, rendering)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search FAQ questions"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container" style={{ maxWidth: 900 }}>
            <div className="vms-faq-accordion-list">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className={`vms-faq-card ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="vms-faq-question-btn"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`vms-faq-arrow ${isOpen ? "rotated" : ""}`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="vms-faq-answer-panel">
                        <p>{faq.a}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Bottom Contact Help */}
            <div className="vms-faq-contact-card" style={{ marginTop: 48 }}>
              <div>
                <h3>Have more questions about your setup?</h3>
                <p>Our team and engineering support can guide your multi-channel deployment.</p>
              </div>
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                onClick={() => onNavigate("/contact")}
              >
                <span>Contact Studio Support</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
