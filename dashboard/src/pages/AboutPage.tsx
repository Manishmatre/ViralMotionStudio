import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ArrowRight, Code2, Film, Cpu, Tv, Compass } from "lucide-react";

type AboutPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

export const AboutPage: React.FC<AboutPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/about"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* About Hero */}
        <section className="vms-section" style={{ paddingBottom: 28 }}>
          <div className="vms-container">
            <div className="vms-page-head">
              <span className="vms-kicker">OUR CREATIVE PHILOSOPHY</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                Why Programmatic Motion Design Beats Static Slideshows
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                ViralMotionStudio was born from a simple realization: the internet does not need more
                generic text-on-black slides. Viewers demand cinematic visual storytelling, real depth,
                and animated infographics that command attention.
              </p>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container" style={{ maxWidth: 940 }}>
            <div className="vms-about-story-grid">
              <article className="vms-about-card">
                <span className="vms-cyan-tag">
                  <Film size={13} />
                  <span>THE PROBLEM WITH AI VIDEO</span>
                </span>
                <h3>The Illusion of Video Generators</h3>
                <p>
                  Most &ldquo;AI video generators&rdquo; are simply slideshow tools with basic crossfades
                  and decorative glowing stickers. They place text on flat dark backgrounds, add an
                  uncalibrated voiceover, and call it a finished production. The result? Immediate viewer drop-off
                  within the first three seconds.
                </p>
              </article>

              <article className="vms-about-card">
                <span className="vms-purple-pill">
                  <Cpu size={13} />
                  <span>THE CODE-DRIVEN SOLUTION</span>
                </span>
                <h3>Deterministic Remotion Compositing</h3>
                <p>
                  We treat video production as software engineering. Every frame in ViralMotionStudio is
                  compiled deterministically using React and Remotion. Charts grow via spring equations,
                  camera moves use smooth Bezier interpolation, and subtitles lock to exact audio transients
                  at 30 FPS without dropped frames.
                </p>
              </article>
            </div>

            {/* Core Architectural Pillars */}
            <div className="vms-about-pillars" style={{ marginTop: 64 }}>
              <div className="vms-section-header-left" style={{ marginBottom: 32 }}>
                <span className="vms-kicker">ENGINEERING PILLARS</span>
                <h2 className="vms-h2">The Three Principles Guiding Our Engine</h2>
              </div>

              <div className="vms-bento-grid">
                <div className="vms-bento-item">
                  <span className="vms-blue-tag">
                    <Compass size={13} />
                    <span>01 // REALISTIC CINEMATOGRAPHY</span>
                  </span>
                  <h3>Zero cartoon shapes. Real photographic depth.</h3>
                  <p>
                    We prioritize 35mm photorealistic backdrops, clean micro-dust pinpoints, and optical 2.5D
                    camera dollies over decorative glowing circles and synthetic mockups.
                  </p>
                </div>

                <div className="vms-bento-item">
                  <span className="vms-purple-pill">
                    <Code2 size={13} />
                    <span>02 // SYNCED MULTI-TRACK AUDIO</span>
                  </span>
                  <h3>Paced narration with intelligent ducking.</h3>
                  <p>
                    Audio is not an afterthought. Vocal inflection points, background score dynamics, and
                    kinetic caption reveals are synchronized to sub-frame accuracy.
                  </p>
                </div>

                <div className="vms-bento-item">
                  <span className="vms-cyan-tag">
                    <Tv size={13} />
                    <span>03 // SANCTIONED AUTOMATION</span>
                  </span>
                  <h3>Official OAuth 2.0 with zero scrapers.</h3>
                  <p>
                    We never use fragile browser automation or headless scrapers for YouTube uploads. Every
                    publishing job routes through the official YouTube Data API v3 with cryptographic security.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="vms-about-cta-strip" style={{ marginTop: 72 }}>
              <div>
                <h3>Experience the difference in motion.</h3>
                <p>Launch your studio account and produce your first high-retention video today.</p>
              </div>
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                onClick={() => onNavigate(authenticated ? "/app" : "/register")}
              >
                <span>Launch Creative Studio</span>
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
