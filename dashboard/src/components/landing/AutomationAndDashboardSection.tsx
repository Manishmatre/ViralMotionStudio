import React, { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  KeyRound,
  Layers,
  ShieldCheck,
  Tv,
} from "lucide-react";
import { BrandLogo } from "../BrandLogo";

type AutomationAndDashboardProps = {
  onNavigate: (path: string) => void;
};

const DASHBOARD_TABS = [
  {
    key: "command",
    label: "Creative Studio",
    badge: "3 VIDEOS / DAY · 90 / MONTH",
    title: "Multi-channel automation & publishing control center",
    desc: "Switch between Manual, Semi-Automatic, and Fully Automatic scheduling across isolated creator workspaces. Track live renders, credit capacity, and upload guardrails.",
    metrics: [
      { label: "Publishing Mode", val: "FULLY-AUTOMATIC" },
      { label: "Daily IST Slots", val: "09:00 · 14:00 · 20:00" },
      { label: "Token Security", val: "AES-256-GCM" },
    ],
  },
  {
    key: "channels",
    label: "YouTube OAuth",
    badge: "ISOLATED PER CHANNEL",
    title: "Official YouTube Data API v3 channel connection",
    desc: "Link multiple brand or client channels independently via Google OAuth 2.0. Refresh tokens are encrypted at rest and never exposed in browser code.",
    metrics: [
      { label: "OAuth Scopes", val: "youtube.upload · readonly" },
      { label: "Private Safety", val: "publishAt Guardrail On" },
      { label: "Upload Engine", val: "Resumable Stream" },
    ],
  },
  {
    key: "scheduler",
    label: "Scheduler & Queue",
    badge: "SMART DUPLICATE GUARD",
    title: "Automated IST schedule execution with duplicate prevention",
    desc: "Every queued upload carries a unique duplicate guard key so retries never double-post to YouTube. Monitor upload progress and YouTube links live.",
    metrics: [
      { label: "Duplicate Guard", val: "100% Protected" },
      { label: "Aspect Ratios", val: "9:16 Shorts + 16:9" },
      { label: "Event Webhooks", val: "rendered · published" },
    ],
  },
  {
    key: "history",
    label: "Publishing History",
    badge: "AUDIT & LINKS",
    title: "Track every published video ID, privacy state, and history log",
    desc: "Audit uploaded YouTube video URLs, privacy states, timestamps, and preview vs. live status directly from your workspace. Live engagement analytics & team seats: Coming Soon.",
    metrics: [
      { label: "Preview Mode", val: "Safe Test Uploads" },
      { label: "Automation API", val: "API Keys + Webhooks" },
      { label: "Team Seats", val: "Coming Soon" },
    ],
  },
] as const;

export const AutomationAndDashboardSection: React.FC<
  AutomationAndDashboardProps
> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] =
    useState<(typeof DASHBOARD_TABS)[number]["key"]>("command");
  const current =
    DASHBOARD_TABS.find((t) => t.key === activeTab) ?? DASHBOARD_TABS[0];

  return (
    <>
      {/* SECTION 9: YOUTUBE AUTOMATION */}
      <section id="automation" className="vms-section vms-band-indigo">
        <div className="vms-container vms-split-grid">
          <div>
            <span className="vms-kicker">YOUTUBE AUTOMATION PIPELINE</span>
            <h2 className="vms-h2">
              Run 3 daily channels automatically — or scale to 15+ on Agency
            </h2>
            <p className="vms-sub" style={{ textAlign: "left", marginLeft: 0 }}>
              Connect multiple YouTube channels using official Google OAuth 2.0.
              Each channel manages its own niche, format (9:16 Shorts or 16:9
              documentaries), daily IST schedule slot, and encrypted refresh token.
            </p>

            <div className="vms-feature-pills">
              <div className="vms-mini-feature">
                <ShieldCheck size={16} color="#22D3EE" />
                <span>Private upload + publishAt scheduling guardrail built in</span>
              </div>
              <div className="vms-mini-feature">
                <KeyRound size={16} color="#8247FF" />
                <span>AES-256-GCM encrypted OAuth tokens isolated per workspace</span>
              </div>
              <div className="vms-mini-feature">
                <CalendarClock size={16} color="#3677FF" />
                <span>Manual, Semi-Automatic, or Fully Automatic modes</span>
              </div>
            </div>
          </div>

          <div className="vms-channels-stack">
            {[
              {
                name: "Capital Briefs",
                handle: "@capitalbriefs",
                subs: "142K subs",
                slot: "09:00 IST",
                format: "Shorts 9:16",
                niche: "Business stories",
                accent: "#8247FF",
              },
              {
                name: "Billionaire Ledger",
                handle: "@billionaireledger",
                subs: "88K subs",
                slot: "14:00 IST",
                format: "Shorts 9:16",
                niche: "Geography & Wealth",
                accent: "#3677FF",
              },
              {
                name: "Future Compute Lab",
                handle: "@futurecomputelab",
                subs: "215K subs",
                slot: "20:00 IST",
                format: "Long-form 16:9",
                niche: "AI & Technology",
                accent: "#22D3EE",
              },
            ].map((ch) => (
              <div key={ch.name} className="vms-channel-row">
                <div className="vms-channel-left">
                  <span
                    className="vms-yt-badge"
                    style={{ borderColor: ch.accent }}
                  >
                    <Tv size={16} color={ch.accent} />
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong>{ch.name}</strong>
                      <span className="vms-verified-badge" title="Verified YouTube Partner">✓</span>
                      <span className="vms-subs-count">{ch.subs}</span>
                    </div>
                    <span>{ch.handle} · {ch.niche} · OAuth 2.0 Connected</span>
                  </div>
                </div>
                <div className="vms-channel-right">
                  <span className="vms-mono-tag">{ch.slot}</span>
                  <span className="vms-cyan-tag">{ch.format}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: PRODUCT INTERFACE PREVIEW */}
      <section className="vms-section">
        <div className="vms-container">
          <div className="vms-editorial-head">
            <div>
              <span className="vms-kicker">PRODUCT INTERFACE PREVIEW</span>
              <h2 className="vms-h2">
                Inside the ViralMotionStudio Creative Workspace
              </h2>
            </div>
            <p className="vms-sub-side">
              Explore script direction, visual storyboard filmstrips, channel
              OAuth management, and publishing telemetry before signing up.
            </p>
          </div>

          <div className="vms-studio-window">
            <div className="vms-window-chrome">
              <div className="vms-window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <BrandLogo size={20} animate={false} />
              <span className="vms-mono-tag">studio / dashboard</span>
            </div>

            <div className="vms-demo-tabs" role="tablist" aria-label="Workspace modules">
              {DASHBOARD_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.key}
                  className={
                    activeTab === t.key ? "vms-demo-tab active" : "vms-demo-tab"
                  }
                  onClick={() => setActiveTab(t.key)}
                >
                  <Layers size={15} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="vms-demo-body">
              <div className="vms-demo-copy">
                <span className="vms-purple-pill">{current.badge}</span>
                <h3>{current.title}</h3>
                <p>{current.desc}</p>
                <button
                  type="button"
                  className="vms-btn vms-btn-primary"
                  onClick={() => onNavigate("/signup")}
                >
                  <span>Open Live Workspace</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="vms-demo-cards">
                {current.metrics.map((m) => (
                  <div key={m.label} className="vms-demo-metric">
                    <span>{m.label}</span>
                    <strong>
                      <CheckCircle2 size={14} color="#22D3EE" />
                      {m.val}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
