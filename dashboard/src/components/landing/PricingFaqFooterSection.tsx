import React, { useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { CreditPackDefinition, PlanDefinition } from "../../../../server/types/automation";
import { BrandLogo } from "../BrandLogo";

type PricingFaqFooterProps = {
  appDomain: string;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  onNavigate: (path: string) => void;
};

const FAQS = [
  {
    q: "How does Google Sign-In & YouTube Channel OAuth work safely?",
    a: "Signing in uses standard Google OpenID Connect (email & profile). Linking YouTube channels uses official YouTube Data API v3 OAuth 2.0 per channel with AES-256-GCM encrypted refresh tokens stored isolated per workspace.",
  },
  {
    q: "Are the motion previews on this page created with the actual engine?",
    a: "Yes. Every looping video preview in the Hero, Video Showcase, and Format Comparison is a real 30 FPS HD video exported by the ViralMotionStudio 3D scene engine, neural voiceover, and sound mix pipeline.",
  },
  {
    q: "How are render credits counted for Shorts vs. Long-form videos?",
    a: "Each 9:16 vertical Short (1080×1920, 30 FPS) uses 1 render credit, and each 16:9 Long-form documentary (1920×1080) uses 3 render credits. Failed renders refund credits automatically.",
  },
  {
    q: "Can I host and run ViralMotionStudio on my own domain?",
    a: "Yes. Your studio runs cleanly behind TLS on custom domains such as viralmotionstudio.toolio.tech with verified Google Sign-In and YouTube OAuth callback routing.",
  },
  {
    q: "How do plan upgrades and credit packs work?",
    a: "Stripe Checkout handles live card billing, subscriptions, and credit packs automatically. Until live Stripe keys are activated, built-in Instant Preview Upgrade lets you test plans, packs, and invoices immediately.",
  },
];

export const PricingFaqFooterSection: React.FC<PricingFaqFooterProps> = ({
  appDomain,
  plans,
  creditPacks,
  onNavigate,
}) => {
  const [annual, setAnnual] = useState(true);
  const [calcCredits, setCalcCredits] = useState(100);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const estShorts = calcCredits;
  const estLongForm = Math.floor(calcCredits / 3);
  const mixShorts = Math.round(calcCredits * 0.7);
  const mixLong = Math.floor((calcCredits - mixShorts) / 3);

  return (
    <>
      {/* SECTION 11: PRICING + CREDIT CALCULATOR */}
      <section id="pricing" className="vms-section vms-band-secondary">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">CREATOR &amp; STUDIO PLANS</span>
              <h2 className="vms-h2">Scale from your first channel to an automated network</h2>
            </div>

            <div className="vms-billing-toggle" role="group" aria-label="Billing interval">
              <button
                type="button"
                className={!annual ? "vms-chip active" : "vms-chip"}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                type="button"
                className={annual ? "vms-chip active" : "vms-chip"}
                onClick={() => setAnnual(true)}
              >
                Annual · Save 20%
              </button>
            </div>
          </div>

          <div className="vms-pricing-grid">
            {plans.map((plan) => {
              const price = annual
                ? plan.priceYearlyMonthlyUsd
                : plan.priceMonthlyUsd;
              const highlighted = plan.id === "creator";
              return (
                <article
                  key={plan.id}
                  className={
                    highlighted ? "vms-price-card featured" : "vms-price-card"
                  }
                >
                  <div className="vms-price-top">
                    <h3>{plan.name}</h3>
                    {plan.badge ? (
                      <span className="vms-cyan-tag">{plan.badge}</span>
                    ) : null}
                  </div>
                  <p className="vms-muted-sm">{plan.tagline}</p>

                  <div className="vms-price-figure">
                    <strong>${price}</strong>
                    <span>/mo {annual && price > 0 ? "billed yearly" : ""}</span>
                  </div>

                  <ul className="vms-price-features">
                    {plan.features.map((feat) => (
                      <li key={feat}>
                        <Check size={15} color="#22D3EE" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={
                      highlighted
                        ? "vms-btn vms-btn-primary"
                        : "vms-btn vms-btn-outline"
                    }
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => onNavigate("/signup")}
                  >
                    <span>
                      {price === 0 ? "Start Creating for Free" : `Get ${plan.name}`}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>

          <div className="vms-packs-strip">
            <span className="vms-mono-tag">TOP-UP CREDIT PACKS:</span>
            <div className="vms-packs-list">
              {creditPacks.map((pk) => (
                <span key={pk.id} className="vms-pack-pill">
                  +{pk.credits} Credits ({pk.credits} Shorts) — <strong>${pk.priceUsd}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Transparent Interactive Credit Calculator */}
          <div className="vms-credit-calc">
            <div className="vms-credit-calc-top">
              <div>
                <span className="vms-kicker">TRANSPARENT CREDIT CALCULATOR</span>
                <h3>See what {calcCredits} studio credits produces</h3>
                <p className="vms-muted-sm">
                  1 Short (9:16) = <strong>1 Credit</strong> · 1 Long-form Essay (16:9) ={" "}
                  <strong>3 Credits</strong>
                </p>
              </div>
              <div className="vms-calc-presets">
                {[10, 50, 100, 200, 350].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={calcCredits === val ? "vms-chip active" : "vms-chip"}
                    onClick={() => setCalcCredits(val)}
                  >
                    {val} Credits
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={10}
              max={600}
              step={10}
              value={calcCredits}
              aria-label="Select credit volume"
              className="vms-calc-slider"
              onChange={(e) => setCalcCredits(Number(e.target.value))}
            />

            <div className="vms-calc-breakdown">
              <div className="vms-calc-stat">
                <span>All 9:16 Vertical Shorts</span>
                <strong>Up to {estShorts} Shorts</strong>
              </div>
              <div className="vms-calc-stat">
                <span>Balanced Multi-Channel Mix</span>
                <strong>{mixShorts} Shorts + {mixLong} Long-form</strong>
              </div>
              <div className="vms-calc-stat">
                <span>All 16:9 Long-Form Essays</span>
                <strong>Up to {estLongForm} Documentaries</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ (TWO-COLUMN EDITORIAL SPLIT) */}
      <section className="vms-section">
        <div className="vms-container vms-faq-split">
          <div className="vms-faq-intro">
            <span className="vms-kicker">CLARITY &amp; SECURITY</span>
            <h2 className="vms-h2">Frequently asked questions</h2>
            <p className="vms-muted">
              Everything you need to know about AI rendering credits, YouTube
              OAuth safety, custom domains, and voice generation.
            </p>
          </div>

          <div className="vms-faq-list">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="vms-faq-item">
                  <button
                    type="button"
                    className="vms-faq-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>
                  {isOpen ? <p className="vms-faq-answer">{item.a}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 13: FINAL COSMIC CONVERSION CTA */}
      <section className="vms-section">
        <div className="vms-container">
          <div className="vms-final-cta">
            <div className="vms-final-sphere" aria-hidden="true" />
            <BrandLogo size={54} animate />
            <h2>Create Videos That Move The Internet.</h2>
            <p>
              Launch your creative studio in one click — direct 3D motion
              compositions, synthesize voiceovers, and publish across YouTube
              automatically.
            </p>
            <div className="vms-hero-cta-row">
              <button
                type="button"
                className="vms-btn vms-btn-primary vms-btn-lg"
                onClick={() => onNavigate("/signup")}
              >
                <span>Start Creating for Free</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="vms-btn vms-btn-outline vms-btn-lg"
                onClick={() => onNavigate("/login")}
              >
                Login to Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: FOOTER */}
      <footer className="vms-footer">
        <div className="vms-container vms-footer-grid">
          <div>
            <BrandLogo size={32} animate={false} showWordmark subtitle={appDomain} />
            <p className="vms-muted-sm" style={{ maxWidth: 340, marginTop: 12 }}>
              Your AI-powered creative studio for cinematic motion graphics,
              stunning 3D videos, voiceovers, and multi-channel YouTube automation.
            </p>
          </div>

          <div className="vms-footer-col">
            <strong>Studio</strong>
            <a href="#hero">Home</a>
            <a href="#showcase">Showcase</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="vms-footer-col">
            <strong>Workspace</strong>
            <button type="button" onClick={() => onNavigate("/login")}>
              Login
            </button>
            <button type="button" onClick={() => onNavigate("/signup")}>
              Start Creating Free
            </button>
            <button type="button" onClick={() => onNavigate("/dashboard")}>
              Creative Studio
            </button>
          </div>
        </div>

        <div className="vms-container vms-footer-bottom">
          <span>© 2026 ViralMotionStudio · {appDomain}</span>
          <span>Vibrant Creative Futurism · 3D Motion &amp; YouTube Data API v3</span>
        </div>
      </footer>
    </>
  );
};
