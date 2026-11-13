import React from "react";
import { BrandLogo } from "./BrandLogo";

type StudioLoaderProps = {
  label?: string;
};

export const StudioLoader: React.FC<StudioLoaderProps> = ({
  label = "Initializing Creative Studio...",
}) => {
  return (
    <div className="vms-loader-screen" role="status" aria-live="polite">
      <div className="vms-loader-ambient" aria-hidden="true" />
      <div className="vms-loader-particles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, idx) => (
          <span
            key={idx}
            className="vms-loader-dot"
            style={{
              left: `${12 + ((idx * 17) % 76)}%`,
              top: `${16 + ((idx * 23) % 68)}%`,
              animationDelay: `${idx * 0.18}s`,
            }}
          />
        ))}
      </div>

      <div className="vms-loader-center">
        <div className="vms-loader-ring-wrap">
          <span className="vms-loader-halo" aria-hidden="true" />
          <BrandLogo size={76} animate />
        </div>

        <strong className="vms-loader-brand">
          Viral<span className="vms-logo-accent">Motion</span>Studio
        </strong>
        <span className="vms-loader-label">{label}</span>

        <div className="vms-loader-track" aria-hidden="true">
          <div className="vms-loader-bar" />
        </div>
      </div>
    </div>
  );
};

