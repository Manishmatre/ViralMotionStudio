import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import type { CreditPackDefinition, PlanDefinition } from "../../../server/types/automation";
import { formatCreditCapacity } from "../config/viralTemplates";
import { Check, ArrowRight } from "lucide-react";

type PricingPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  onNavigate: (path: string) => void;
};

const COMPARISON_ROWS = [
  { feature: "Monthly Video Credits", starter: "10 credits", creator: "100 credits", studio: "200 credits", agency: "350 credits" },
  { feature: "Estimated Shorts Output", starter: "10 Shorts", creator: "100 Shorts", studio: "200 Shorts", agency: "350 Shorts" },
  { feature: "16:9 Long-Form Renders", starter: "Not included", creator: "Included (3 cr/ea)", studio: "Included (3 cr/ea)", agency: "Included (3 cr/ea)" },
  { feature: "Connected YouTube Channels", starter: "1 channel", creator: "Up to 3 channels", studio: "Up to 6 channels", agency: "Up to 15 channels" },
  { feature: "Daily Automated Releases", starter: "1 upload / day", creator: "3 uploads / day", studio: "6 uploads / day", agency: "15 uploads / day" },
  { feature: "Publishing Scheduling Modes", starter: "Manual & Semi-Auto", creator: "Fully-Automatic", studio: "Fully-Automatic", agency: "Fully-Automatic" },
  { feature: "Resolution & Framerate", starter: "1080p @ 30 FPS", creator: "1080p @ 30 FPS", studio: "1080p @ 30 FPS", agency: "1080p @ 30 FPS" },
  { feature: "Neural TTS & Synced Captions", starter: "Included", creator: "Included", studio: "Included", agency: "Included" },
  { feature: "Automated HD Thumbnails", starter: "Included", creator: "Included", studio: "Included", agency: "Included" },
  { feature: "REST API & Webhooks", starter: "Not included", creator: "Included", studio: "Included", agency: "Included + Priority" },
  { feature: "Duplicate Upload Protection", starter: "100% Guarded", creator: "100% Guarded", studio: "100% Guarded", agency: "100% Guarded" },
  { feature: "Priority GPU Render Queue", starter: "Standard", creator: "Standard", studio: "High Priority", agency: "Maximum Priority" },
];

export const PricingPage: React.FC<PricingPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  plans,
  creditPacks,
  onNavigate,
}) => {
  const [annual, setAnnual] = useState(true);
  const [calcCredits, setCalcCredits] = useState(150);

  const estShorts = calcCredits;
  const estLongForm = Math.floor(calcCredits / 3);
  const mixShorts = Math.round(calcCredits * 0.7);
  const mixLong = Math.floor((calcCredits - mixShorts) / 3);

  function handleSelectPlan(planId: string) {
    if (authenticated) {
      onNavigate(`/app/settings?plan=${encodeURIComponent(planId)}`);
    } else {
      onNavigate(`/register?plan=${encodeURIComponent(planId)}`);
    }
  }

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/pricing"
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
              <span className="vms-kicker">TRANSPARENT PRICING &amp; PLANS</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                Simple Pricing for Individual Creators and Scaled Studios
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                Every plan includes 30 FPS Remotion rendering, neural TTS narration, word-synced captions,
                and direct YouTube Data API v3 publishing. Switch between monthly and annual billing to save 20%.
              </p>

              {/* Billing Toggle */}
              <div className="vms-billing-toggle" role="group" aria-label="Billing interval">
                <button
                  type="button"
                  className={!annual ? "vms-chip active" : "vms-chip"}
                  onClick={() => setAnnual(false)}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  className={annual ? "vms-chip active" : "vms-chip"}
                  onClick={() => setAnnual(true)}
                >
                  Annual Billing · Save 20%
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container">
            <div className="vms-pricing-grid" style={{ gridTemplateColumns: `repeat(${Math.max(3, plans.length)}, 1fr)` }}>
              {plans.map((plan) => {
                const price = annual ? plan.priceYearlyMonthlyUsd : plan.priceMonthlyUsd;
                const isFeatured = plan.id === "creator" || plan.id === "studio";

                return (
                  <article
                    key={plan.id}
                    className={`vms-price-card ${isFeatured ? "featured" : ""}`}
                  >
                    <div className="vms-price-top">
                      <h3>{plan.name}</h3>
                      {plan.badge ? <span className="vms-cyan-tag">{plan.badge}</span> : null}
                    </div>

                    <p className="vms-muted-sm">{plan.tagline}</p>

                    <div className="vms-price-figure">
                      <strong>${price}</strong>
                      <span>/mo {annual && price > 0 ? "billed annually" : ""}</span>
                    </div>

                    <div className="vms-price-capacity-pill">
                      <span>{plan.monthlyCredits} Credits</span>
                      <span>·</span>
                      <span>{formatCreditCapacity(plan.monthlyCredits)}</span>
                    </div>

                    <ul className="vms-price-features">
                      {plan.features.map((feat) => (
                        <li key={feat}>
                          <Check size={15} color="var(--vms-cyan)" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className={isFeatured ? "vms-btn vms-btn-primary" : "vms-btn vms-btn-outline"}
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      <span>{price === 0 ? "Start Free Trial" : `Choose ${plan.name}`}</span>
                      <ArrowRight size={15} />
                    </button>
                  </article>
                );
              })}
            </div>

            {/* Credit Top-up Packs */}
            <div className="vms-packs-strip" style={{ marginTop: 40 }}>
              <span className="vms-mono-tag">ONE-TIME CREDIT REFILLS:</span>
              <div className="vms-packs-list">
                {creditPacks.map((pk) => (
                  <span key={pk.id} className="vms-pack-pill">
                    +{pk.credits} Credits ({pk.credits} Shorts) — <strong>${pk.priceUsd}</strong>
                    {pk.bonusLabel ? <span className="vms-pack-bonus">({pk.bonusLabel})</span> : null}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Credit Calculator */}
            <div className="vms-credit-calc" style={{ marginTop: 52 }}>
              <div className="vms-credit-calc-top">
                <div>
                  <span className="vms-kicker">CAPACITY CALCULATOR</span>
                  <h3 style={{ margin: "6px 0 0" }}>Estimate Your Monthly Video Volume</h3>
                </div>
                <div className="vms-calc-val-box">
                  <strong>{calcCredits}</strong>
                  <span>Credits / Month</span>
                </div>
              </div>

              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={calcCredits}
                onChange={(e) => setCalcCredits(Number(e.target.value))}
                className="vms-slider"
                aria-label="Credit volume slider"
              />

              <div className="vms-calc-results">
                <div className="vms-calc-res-item">
                  <span>If Pure 9:16 Shorts:</span>
                  <strong>{estShorts} Shorts</strong>
                </div>
                <div className="vms-calc-res-item">
                  <span>If Pure 16:9 Long-Form:</span>
                  <strong>{estLongForm} Documentaries</strong>
                </div>
                <div className="vms-calc-res-item">
                  <span>Recommended Studio Mix:</span>
                  <strong>{mixShorts} Shorts + {mixLong} Long-Form</strong>
                </div>
              </div>
            </div>

            {/* Deep Feature Comparison Matrix */}
            <div className="vms-comparison-section" style={{ marginTop: 72 }}>
              <div className="vms-section-header-left" style={{ textAlign: "center", marginBottom: 36 }}>
                <span className="vms-kicker">FEATURE-BY-FEATURE COMPARISON</span>
                <h2 className="vms-h2">Compare Plan Specifications</h2>
              </div>

              <div className="vms-comparison-table-wrap">
                <table className="vms-comparison-table">
                  <thead>
                    <tr>
                      <th style={{ width: "32%" }}>Feature Specification</th>
                      <th>Starter</th>
                      <th>Creator Pro</th>
                      <th>Studio Growth</th>
                      <th>Agency Scale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row) => (
                      <tr key={row.feature}>
                        <td className="feature-name">{row.feature}</td>
                        <td>{row.starter}</td>
                        <td className="highlight">{row.creator}</td>
                        <td className="highlight">{row.studio}</td>
                        <td>{row.agency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
