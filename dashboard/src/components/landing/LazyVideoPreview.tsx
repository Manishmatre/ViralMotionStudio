import React, { useEffect, useRef, useState, memo } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

type LazyVideoPreviewProps = {
  src: string;
  poster?: string | null;
  aspectRatio?: "9 / 16" | "16 / 9";
  title: string;
  showSoundToggle?: boolean;
  className?: string;
  autoPlay?: boolean;
};

const LazyVideoPreviewComponent: React.FC<LazyVideoPreviewProps> = ({
  src,
  poster,
  aspectRatio = "9 / 16",
  title,
  showSoundToggle = true,
  className = "",
  autoPlay = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const hasAttemptedPlay = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            if (autoPlay && videoRef.current && !hasAttemptedPlay.current) {
              hasAttemptedPlay.current = true;
              videoRef.current.play().catch(() => {
                // Autoplay policy prevented playback until user interaction
              });
            }
          } else {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              hasAttemptedPlay.current = false;
            }
          }
        }
      },
      { rootMargin: "300px 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  // Synchronize muted DOM property directly to satisfy browser autoplay requirements
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.play().catch(() => undefined);
      }
    }
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setIsPaused(false);
    } else {
      v.pause();
      setIsPaused(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`vms-video-frame ${className}`}
      style={{
        aspectRatio,
        backgroundColor: "#090B18",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={togglePlay}
      role="region"
      aria-label={`Motion preview: ${title}`}
    >
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          autoPlay={autoPlay}
          muted={muted}
          loop
          playsInline
          preload="auto"
          className="vms-video-el"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            backgroundColor: "#090B18",
          }}
          onLoadedData={() => {
            if (autoPlay && videoRef.current && muted) {
              videoRef.current.play().catch(() => undefined);
            }
          }}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        />
      ) : (
        <div
          className="vms-video-placeholder"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#090B18",
            color: "#9299B0",
            fontSize: "12px",
          }}
        >
          <span>Loading Remotion Preview…</span>
        </div>
      )}

      {isPaused ? (
        <button
          type="button"
          className="vms-video-center-play"
          aria-label={`Play ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <Play size={22} fill="currentColor" />
        </button>
      ) : null}

      {showSoundToggle ? (
        <button
          type="button"
          className={muted ? "vms-sound-btn" : "vms-sound-btn live"}
          onClick={toggleMute}
          aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}
          title={muted ? "Click to unmute and listen to neural voiceover & SFX" : "Click to mute audio"}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{muted ? "Unmute & Listen" : "Audio Playing"}</span>
        </button>
      ) : null}
    </div>
  );
};

export const LazyVideoPreview = memo(LazyVideoPreviewComponent);


