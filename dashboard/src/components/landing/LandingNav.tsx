import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "../BrandLogo";

type LandingNavProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

export const LandingNav: React.FC<LandingNavProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  function goToSection(hash: string) {
    setMobileOpen(false);
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <header className="vms-nav-wrap">
      <nav className="vms-nav" aria-label="Main navigation">
        <a
          href="/"
          className="vms-brand-link"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <BrandLogo size={34} animate showWordmark subtitle={appDomain} />
          <span className="vms-status-pill" title="Live Studio API & Renderer Health">
            <span className={systemHealthy ? "vms-status-dot online" : "vms-status-dot"} />
            <span>{systemHealthy ? "Studio Online" : "Syncing"}</span>
          </span>
        </a>

        <div className="vms-nav-links">
          <a href="#showcase" onClick={(e) => { e.preventDefault(); goToSection("#showcase"); }}>
            Showcase
          </a>
          <a href="#automation" onClick={(e) => { e.preventDefault(); goToSection("#automation"); }}>
            YouTube Automation
          </a>
          <a href="#capabilities" onClick={(e) => { e.preventDefault(); goToSection("#capabilities"); }}>
            Capabilities
          </a>
          <a href="#workflow" onClick={(e) => { e.preventDefault(); goToSection("#workflow"); }}>
            Workflow
          </a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); goToSection("#pricing"); }}>
            Pricing
          </a>
        </div>

        <div className="vms-nav-actions">
          {authenticated ? (
            <button
              type="button"
              className="vms-btn vms-btn-primary"
              onClick={() => onNavigate("/dashboard")}
            >
              <span>Open Studio</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="vms-btn vms-btn-ghost"
                onClick={() => onNavigate("/login")}
              >
                Login
              </button>
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                onClick={() => onNavigate("/signup")}
              >
                <span>Connect YouTube &amp; Start</span>
                <ArrowRight size={15} />
              </button>
            </>
          )}

          <button
            type="button"
            className="vms-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="vms-mobile-drawer">
          <a href="#showcase" onClick={(e) => { e.preventDefault(); goToSection("#showcase"); }}>
            Showcase
          </a>
          <a href="#automation" onClick={(e) => { e.preventDefault(); goToSection("#automation"); }}>
            YouTube Automation
          </a>
          <a href="#capabilities" onClick={(e) => { e.preventDefault(); goToSection("#capabilities"); }}>
            Capabilities
          </a>
          <a href="#workflow" onClick={(e) => { e.preventDefault(); goToSection("#workflow"); }}>
            Workflow
          </a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); goToSection("#pricing"); }}>
            Pricing
          </a>
          <div className="vms-mobile-cta-row">
            {authenticated ? (
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                style={{ width: "100%" }}
                onClick={() => onNavigate("/dashboard")}
              >
                Open Studio
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="vms-btn vms-btn-ghost"
                  onClick={() => onNavigate("/login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="vms-btn vms-btn-primary"
                  onClick={() => onNavigate("/signup")}
                >
                  Start Creating for Free
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
