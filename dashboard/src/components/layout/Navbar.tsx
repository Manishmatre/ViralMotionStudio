import React, { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "../BrandLogo";

type NavbarProps = {
  currentPath: string;
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

const NAV_LINKS = [
  { path: "/features", label: "Features" },
  { path: "/how-it-works", label: "How It Works" },
  { path: "/showcase", label: "Showcase" },
  { path: "/pricing", label: "Pricing" },
  { path: "/faq", label: "FAQ" },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLinkClick(e: React.MouseEvent, path: string) {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  }

  return (
    <header className={scrolled ? "vms-nav-wrap scrolled" : "vms-nav-wrap"}>
      <nav className="vms-nav" aria-label="Main navigation">
        <a
          href="/"
          className="vms-brand-link"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          <BrandLogo size={32} animate showWordmark subtitle={appDomain} />
          <span className="vms-status-pill" title="Live Studio API & Renderer Health">
            <span className={systemHealthy ? "vms-status-dot online" : "vms-status-dot"} />
            <span>{systemHealthy ? "Studio Online" : "Syncing"}</span>
          </span>
        </a>

        <div className="vms-nav-links">
          {NAV_LINKS.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                className={isActive ? "vms-nav-link active" : "vms-nav-link"}
                onClick={(e) => handleLinkClick(e, link.path)}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="vms-nav-actions">
          {authenticated ? (
            <button
              type="button"
              className="vms-btn vms-btn-primary"
              onClick={() => onNavigate("/app")}
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
                onClick={() => onNavigate("/register")}
              >
                <span>Start Creating Free</span>
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
          <div className="vms-mobile-links">
            <a
              href="/"
              className={currentPath === "/" ? "vms-mobile-link active" : "vms-mobile-link"}
              onClick={(e) => handleLinkClick(e, "/")}
            >
              Home
            </a>
            {NAV_LINKS.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={currentPath === link.path ? "vms-mobile-link active" : "vms-mobile-link"}
                onClick={(e) => handleLinkClick(e, link.path)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/about"
              className={currentPath === "/about" ? "vms-mobile-link active" : "vms-mobile-link"}
              onClick={(e) => handleLinkClick(e, "/about")}
            >
              About Studio
            </a>
            <a
              href="/contact"
              className={currentPath === "/contact" ? "vms-mobile-link active" : "vms-mobile-link"}
              onClick={(e) => handleLinkClick(e, "/contact")}
            >
              Contact Support
            </a>
          </div>

          <div className="vms-mobile-cta-row">
            {authenticated ? (
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  setMobileOpen(false);
                  onNavigate("/app");
                }}
              >
                Open Studio
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="vms-btn vms-btn-ghost"
                  style={{ width: "100%" }}
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigate("/login");
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="vms-btn vms-btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigate("/register");
                  }}
                >
                  <span>Start Creating Free</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
