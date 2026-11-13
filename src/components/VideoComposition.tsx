import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import type { SfxCue, ThemePalette } from "../types/video";
import { AudioManager } from "./AudioManager";
import { HudOverlay } from "./HudOverlay";
import { ParticleBackground } from "./ParticleBackground";
import { ProgressBar } from "./ProgressBar";
import {
  getTransitionPresentation,
  getTransitionTiming,
  type TransitionKind,
} from "./SceneTransition";
import { SubtitleRenderer } from "./SubtitleRenderer";

export type CompositionSceneItem = {
  readonly id: string;
  readonly name: string;
  readonly durationInFrames: number;
  readonly transitionAfter?: TransitionKind;
  readonly transitionDuration?: number;
  readonly voiceoverSrc?: string;
  readonly captions?: readonly Caption[];
  readonly element: React.ReactNode;
};

type VideoCompositionProps = {
  readonly theme: ThemePalette;
  readonly scenes: readonly CompositionSceneItem[];
  readonly captions?: readonly Caption[];
  readonly sfxCues?: readonly SfxCue[];
  readonly voiceoverSrc?: string;
  readonly bgmSrc?: string;
  readonly bgmVolume?: number;
  readonly muted?: boolean;
  readonly showProgressBar?: boolean;
  readonly showHudOverlay?: boolean;
  readonly hudLeftLabel?: string;
  readonly hudRightLabel?: string;
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  theme,
  scenes,
  captions = [],
  sfxCues = [],
  voiceoverSrc,
  bgmSrc,
  bgmVolume = 0.16,
  muted = false,
  showProgressBar = true,
  showHudOverlay = false,
  hudLeftLabel,
  hudRightLabel,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bgPrimary }}>
      <ParticleBackground
        bgPrimary={theme.bgPrimary}
        bgSecondary={theme.bgSecondary}
        accentColor={theme.accent}
        visualStyle={theme.style}
      />

      <TransitionSeries>
        {scenes.map((scene, idx) => {
          const isLast = idx === scenes.length - 1;
          const transitionKind = scene.transitionAfter ?? "fade";
          const transitionDur = scene.transitionDuration ?? 12;

          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence
                name={scene.name}
                durationInFrames={scene.durationInFrames}
              >
                {scene.element}

                {!muted && scene.voiceoverSrc ? (
                  <Audio src={staticFile(scene.voiceoverSrc)} volume={1} />
                ) : null}

                {scene.captions && scene.captions.length > 0 ? (
                  <SubtitleRenderer
                    captions={scene.captions}
                    accentColor={theme.accent}
                    textColor={theme.textPrimary}
                    fontFamily={theme.bodyFont}
                  />
                ) : null}
              </TransitionSeries.Sequence>

              {!isLast ? (
                <TransitionSeries.Transition
                  presentation={getTransitionPresentation(
                    transitionKind,
                    width,
                    height,
                  )}
                  timing={getTransitionTiming(transitionKind, transitionDur)}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {showHudOverlay ? (
        <HudOverlay
          accentColor={theme.accent}
          topLeftLabel={hudLeftLabel}
          topRightLabel={hudRightLabel}
        />
      ) : null}

      {showProgressBar ? <ProgressBar accentColor={theme.accent} /> : null}

      {captions.length > 0 ? (
        <SubtitleRenderer
          captions={captions}
          accentColor={theme.accent}
          textColor={theme.textPrimary}
          fontFamily={theme.bodyFont}
        />
      ) : null}

      <AudioManager
        sfxCues={sfxCues}
        voiceoverSrc={voiceoverSrc}
        bgmSrc={bgmSrc}
        bgmVolume={bgmVolume}
        muted={muted}
      />
    </AbsoluteFill>
  );
};
