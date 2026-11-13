import React, { useState } from "react";
import type { CreditPackDefinition, PlanDefinition } from "../../../server/types/automation";
import type { DemoVideoItem } from "../types/saas";
import type { ViralTemplate } from "../config/viralTemplates";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { VideoLightbox } from "../components/shared/VideoLightbox";
import { HeroAndGallerySection } from "../components/landing/HeroAndGallerySection";
import { WorkflowAndAiSection } from "../components/landing/WorkflowAndAiSection";
import { EngineAndAudioSection } from "../components/landing/EngineAndAudioSection";
import { AutomationAndDashboardSection } from "../components/landing/AutomationAndDashboardSection";
import { PricingFaqFooterSection } from "../components/landing/PricingFaqFooterSection";
import { WorkflowGraph } from "../components/shared/WorkflowGraph";
import { ArrowRight, Sparkles } from "lucide-react";

type HomePageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  demoVideos: DemoVideoItem[];
  onNavigate: (path: string) => void;
};

export const HomePage: React.FC<HomePageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  plans,
  creditPacks,
  demoVideos,
  onNavigate,
}) => {
  const [activeLightboxVideo, setActiveLightboxVideo] = useState<DemoVideoItem | null>(null);
  const [activeLightboxTemplate, setActiveLightboxTemplate] = useState<ViralTemplate | null>(null);

  const shortVideo =
    demoVideos.find((v) => v.id === "richest-short") ??
    demoVideos.find((v) => v.format === "short") ??
    null;
  const longVideo =
    demoVideos.find((v) => v.id === "workflow-explainer") ??
    demoVideos.find((v) => v.format === "long-form") ??
    shortVideo;
  const thumbnailUrl = shortVideo?.thumbnailUrl ?? null;

  function handleCloneStyle(templateId: string) {
    try {
      window.localStorage.setItem("vms_selected_template", templateId);
    } catch {
      // Ignore storage failure
    }
    onNavigate(authenticated ? "/app" : "/register");
  }

  return (
    <div className="vms-landing-root">
      {/* SECTION A: PREMIUM RESPONSIVE NAVBAR */}
      <Navbar
        currentPath="/"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* SECTION B: IMMERSIVE HERO & LIVE SHOWCASE */}
        <HeroAndGallerySection
          demoVideos={demoVideos}
          authenticated={authenticated}
          systemHealthy={systemHealthy}
          onNavigate={onNavigate}
        />

        {/* SECTION D: INTERACTIVE 10-NODE CONNECTED WORKFLOW */}
        <section className="vms-section vms-band-indigo">
          <div className="vms-container">
            <div className="vms-editorial-head">
              <div>
                <span className="vms-kicker">AUTONOMOUS PRODUCTION PIPELINE</span>
                <h2 className="vms-h2">From One Idea To A Finished Video</h2>
              </div>
              <p className="vms-sub-side">
                Every stage in the production pipeline connects seamlessly. Click any node below to inspect
                its automated input requirement and generated output.
              </p>
            </div>

            <WorkflowGraph />
          </div>
        </section>

        {/* SECTION E: CREATIVE CAPABILITIES & AI WORKFLOW */}
        <WorkflowAndAiSection />

        {/* SECTION F & G: MOTION GRAPHICS ENGINE & DUAL FORMATS */}
        <EngineAndAudioSection
          shortVideo={shortVideo}
          longVideo={longVideo}
          thumbnailUrl={thumbnailUrl}
        />

        {/* SECTION H: YOUTUBE AUTOMATION & WORKSPACE PREVIEW */}
        <AutomationAndDashboardSection onNavigate={onNavigate} />

        {/* SECTION I: PRICING PREVIEW */}
        <PricingFaqFooterSection
          appDomain={appDomain}
          plans={plans}
          creditPacks={creditPacks}
          onNavigate={onNavigate}
        />

        {/* SECTION J: FINAL CONVERSION CTA */}
        <section className="vms-section vms-final-cta-section">
          <div className="vms-container">
            <div className="vms-final-cta-box">
              <span className="vms-cyan-tag">START CREATING TODAY</span>
              <h2 className="vms-h2" style={{ margin: "16px 0" }}>
                Your Next Video Starts Here.
              </h2>
              <p className="vms-final-cta-desc">
                Turn your creative ideas into cinematic motion graphics and automated YouTube releases
                with one intelligent studio. No complex video editors, no timeline lag.
              </p>
              <div className="vms-final-cta-buttons">
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
                  onClick={() => onNavigate("/features")}
                >
                  <Sparkles size={17} color="#22D3EE" />
                  <span>Explore All Features</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION K: COMPLETE FOOTER */}
      <Footer appDomain={appDomain} onNavigate={onNavigate} />

      {/* Video Lightbox Modal */}
      {activeLightboxVideo ? (
        <VideoLightbox
          video={activeLightboxVideo}
          template={activeLightboxTemplate}
          onClose={() => {
            setActiveLightboxVideo(null);
            setActiveLightboxTemplate(null);
          }}
          onCloneStyle={handleCloneStyle}
        />
      ) : null}
    </div>
  );
};
