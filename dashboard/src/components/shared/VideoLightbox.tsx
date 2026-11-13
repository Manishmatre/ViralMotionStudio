import React, { useEffect } from "react";
import { X, Copy, ArrowRight } from "lucide-react";
import type { DemoVideoItem } from "../../types/saas";
import type { ViralTemplate } from "../../config/viralTemplates";

type VideoLightboxProps = {
  video: DemoVideoItem | null;
  template?: ViralTemplate | null;
  onClose: () => void;
  onCloneStyle: (templateId: string) => void;
};

export const VideoLightbox: React.FC<VideoLightboxProps> = ({
  video,
  template,
  onClose,
  onCloneStyle,
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!video) return null;

  const isLongForm = video.format === "long-form";

  return (
    <div
      className="vms-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${video.title}`}
    >
      <div
        className={`vms-lightbox-dialog ${isLongForm ? "wide" : "portrait"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="vms-lightbox-close"
          onClick={onClose}
          aria-label="Close video player"
        >
          <X size={20} />
        </button>

        <div className="vms-lightbox-player-wrap" style={{ aspectRatio: isLongForm ? "16 / 9" : "9 / 16" }}>
          <video
            src={video.mp4Url}
            poster={video.thumbnailUrl ?? undefined}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="vms-lightbox-video"
          />
        </div>

        <div className="vms-lightbox-info">
          <div className="vms-lightbox-header">
            <div className="vms-lightbox-tags">
              <span className={isLongForm ? "vms-purple-pill" : "vms-cyan-tag"}>
                {isLongForm ? "16:9 WIDESCREEN DOCUMENTARY" : "9:16 VERTICAL SHORTS ENGINE"}
              </span>
              <span className="vms-mono-tag">{video.resolution} · 30 FPS</span>
              <span className="vms-mono-tag">{video.durationSec}s</span>
            </div>
            <h3>{video.title}</h3>
            <p className="vms-lightbox-cat">{video.category}</p>
          </div>

          {template ? (
            <div className="vms-lightbox-blueprint">
              <div className="vms-blueprint-hook">
                <span className="vms-cyan-tag">AI GENERATED HOOK</span>
                <p>&ldquo;{template.hook}&rdquo;</p>
              </div>

              <div className="vms-lightbox-scenes">
                <span className="vms-mono-tag">SCENE DIRECTION ({template.scenes.length} BEATS)</span>
                <div className="vms-lightbox-scene-list">
                  {template.scenes.map((sc, idx) => (
                    <div key={sc.id} className="vms-lightbox-scene-item">
                      <span className="vms-sc-num">0{idx + 1}</span>
                      <div>
                        <strong>{sc.label}</strong>
                        <span>{sc.visualDirection}</span>
                      </div>
                      <span className="vms-mono-tag">{sc.durationSec}s</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="vms-lightbox-actions">
            {template ? (
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                onClick={() => {
                  onClose();
                  onCloneStyle(template.id);
                }}
              >
                <Copy size={15} />
                <span>Clone This Style in Studio ({template.creditCost} credits)</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="vms-btn vms-btn-primary"
                onClick={() => {
                  onClose();
                  onCloneStyle("youtube-automation-engine");
                }}
              >
                <span>Launch in Creative Studio</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
