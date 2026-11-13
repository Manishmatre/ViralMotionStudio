import React from "react";
import { ShieldCheck, Tv, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "../BrandLogo";

type FooterProps = {
  appDomain: string;
  onNavigate: (path: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ appDomain, onNavigate }) => {
  function handleNav(e: React.MouseEvent, path: string) {
    e.preventDefault();
    onNavigate(path);
  }

  return (
    <footer className="vms-footer">
      <div className="vms-container">
        <div className="vms-footer-grid">
          <div className="vms-footer-brand-col">
            <BrandLogo size={36} animate showWordmark subtitle={appDomain} />
            <p className="vms-footer-tagline">
              Your AI-powered creative studio for cinematic motion graphics, professional neural voiceovers,
              and automated multi-channel YouTube publishing.
            </p>
            <div className="vms-footer-security-badges">
              <span className="vms-trust-chip">
                <Tv size={13} color="#FF0033" />
                <span>YouTube Data API v3</span>
              </span>
              <span className="vms-trust-chip">
                <ShieldCheck size={13} color="#A78BFA" />
                <span>AES-256-GCM Encrypted</span>
              </span>
            </div>
          </div>

          <div className="vms-footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="/features" onClick={(e) => handleNav(e, "/features")}>
                  Features
                </a>
              </li>
              <li>
                <a href="/how-it-works" onClick={(e) => handleNav(e, "/how-it-works")}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="/showcase" onClick={(e) => handleNav(e, "/showcase")}>
                  Video Showcase
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => handleNav(e, "/pricing")}>
                  Pricing &amp; Plans
                </a>
              </li>
              <li>
                <a href="/faq" onClick={(e) => handleNav(e, "/faq")}>
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          <div className="vms-footer-col">
            <h4>Capabilities</h4>
            <ul>
              <li>
                <a href="/features#engine" onClick={(e) => handleNav(e, "/features")}>
                  Cinematic Motion Graphics
                </a>
              </li>
              <li>
                <a href="/features#voice" onClick={(e) => handleNav(e, "/features")}>
                  Neural Audio &amp; Subtitles
                </a>
              </li>
              <li>
                <a href="/features#automation" onClick={(e) => handleNav(e, "/features")}>
                  Autonomous YouTube Publishing
                </a>
              </li>
              <li>
                <a href="/showcase" onClick={(e) => handleNav(e, "/showcase")}>
                  9:16 Shorts vs 16:9 Cinema
                </a>
              </li>
              <li>
                <a href="/app" onClick={(e) => handleNav(e, "/app")}>
                  Direct API &amp; Webhooks
                </a>
              </li>
            </ul>
          </div>

          <div className="vms-footer-col">
            <h4>Company &amp; Legal</h4>
            <ul>
              <li>
                <a href="/about" onClick={(e) => handleNav(e, "/about")}>
                  About ViralMotionStudio
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleNav(e, "/contact")}>
                  Contact &amp; Support
                </a>
              </li>
              <li>
                <a href="/faq#privacy" onClick={(e) => handleNav(e, "/faq")}>
                  Privacy &amp; Data Security
                </a>
              </li>
              <li>
                <a href="/faq#terms" onClick={(e) => handleNav(e, "/faq")}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  className="vms-footer-ext"
                >
                  <span>YouTube API Terms</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="vms-footer-bottom">
          <div className="vms-footer-copy">
            &copy; {new Date().getFullYear()} ViralMotionStudio. Built for creators and visual storytellers.
          </div>
          <div className="vms-footer-meta">
            <span className="vms-footer-status">
              <span className="vms-pulse-dot" />
              <span>Production Pipeline 100% Operational</span>
            </span>
            <span className="vms-footer-domain">{appDomain}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
