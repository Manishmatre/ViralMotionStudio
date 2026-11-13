import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, Track, staticFile } from "remotion";
import type { SfxCue, SfxPreset } from "../types/video";

const SFX_URLS: Record<SfxPreset, string> = {
  whoosh: "https://remotion.media/whoosh.wav",
  whip: "https://remotion.media/whip.wav",
  ding: "https://remotion.media/ding.wav",
  boom: "https://remotion.media/dramatic-boomer.wav",
  shutter: "https://remotion.media/shutter-modern.wav",
  switch: "https://remotion.media/switch.wav",
  click: "https://remotion.media/mouse-click.wav",
  pageTurn: "https://remotion.media/page-turn.wav",
};

type AudioManagerProps = {
  readonly sfxCues: readonly SfxCue[];
  readonly voiceoverSrc?: string;
  readonly voiceoverVolume?: number;
  readonly bgmSrc?: string;
  readonly bgmVolume?: number;
  readonly muted?: boolean;
};

const resolveAudioSrc = (src: string): string => {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return staticFile(src);
};

export const AudioManager: React.FC<AudioManagerProps> = ({
  sfxCues,
  voiceoverSrc,
  voiceoverVolume = 1,
  bgmSrc,
  bgmVolume = 0.16,
  muted = false,
}) => {
  if (muted) {
    return null;
  }

  return (
    <>
      {bgmSrc ? (
        <Track name="Background Music">
          <Audio src={resolveAudioSrc(bgmSrc)} volume={bgmVolume} loop />
        </Track>
      ) : null}

      {voiceoverSrc ? (
        <Track name="Voiceover">
          <Audio src={resolveAudioSrc(voiceoverSrc)} volume={voiceoverVolume} />
        </Track>
      ) : null}

      {sfxCues.map((cue) => (
        <Sequence
          key={cue.id}
          name={`SFX: ${cue.preset}`}
          from={Math.max(0, cue.frame)}
          durationInFrames={45}
        >
          <Audio src={SFX_URLS[cue.preset]} volume={cue.volume ?? 0.36} />
        </Sequence>
      ))}
    </>
  );
};
