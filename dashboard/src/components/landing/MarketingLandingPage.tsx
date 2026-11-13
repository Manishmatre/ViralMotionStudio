import React, { useEffect, useState } from "react";
import type { CreditPackDefinition, PlanDefinition } from "../../../../server/types/automation";
import type { DemoVideoItem, PublicShowcaseResponse } from "../../types/saas";
import { AutomationAndDashboardSection } from "./AutomationAndDashboardSection";
import { EngineAndAudioSection } from "./EngineAndAudioSection";
import { HeroAndGallerySection } from "./HeroAndGallerySection";
import { LandingNav } from "./LandingNav";
import { PricingFaqFooterSection } from "./PricingFaqFooterSection";
import { WorkflowAndAiSection } from "./WorkflowAndAiSection";

type MarketingLandingPageProps = {
  authenticated: boolean;
  appDomain: string;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  onNavigate: (path: string) => void;
};

export const MarketingLandingPage: React.FC<MarketingLandingPageProps> = ({
  authenticated,
  appDomain,
  plans,
  creditPacks,
  onNavigate,
}) => {
  const [demoVideos, setDemoVideos] = useState<DemoVideoItem[]>([]);
  const [systemHealthy, setSystemHealthy] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    fetch("/api/public/showcase")
      .then((res) => res.json())
      .then((data: PublicShowcaseResponse) => {
        if (active && Array.isArray(data.demoVideos)) {
          setDemoVideos(data.demoVideos);
        }
      })
      .catch(() => {
        // Ignore transient showcase fetch issues; UI stays resilient
      });

    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { ok?: boolean }) => {
        if (active && typeof data.ok === "boolean") {
          setSystemHealthy(data.ok);
        }
      })
      .catch(() => {
        if (active) setSystemHealthy(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const shortVideo =
    demoVideos.find((v) => v.id === "richest-short") ??
    demoVideos.find((v) => v.format === "short") ??
    null;
  const longVideo =
    demoVideos.find((v) => v.format === "long-form") ?? shortVideo;
  const thumbnailUrl = shortVideo?.thumbnailUrl ?? null;

  return (
    <div className="vms-landing-root">
      <LandingNav
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        <HeroAndGallerySection
          demoVideos={demoVideos}
          authenticated={authenticated}
          systemHealthy={systemHealthy}
          onNavigate={onNavigate}
        />
        <WorkflowAndAiSection />
        <EngineAndAudioSection
          shortVideo={shortVideo}
          longVideo={longVideo}
          thumbnailUrl={thumbnailUrl}
        />
        <AutomationAndDashboardSection onNavigate={onNavigate} />
        <PricingFaqFooterSection
          appDomain={appDomain}
          plans={plans}
          creditPacks={creditPacks}
          onNavigate={onNavigate}
        />
      </main>
    </div>
  );
};
