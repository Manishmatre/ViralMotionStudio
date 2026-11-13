import fs from "node:fs";
import path from "node:path";
import { parseFile } from "music-metadata";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const ROOT = process.cwd();
const VOICEOVER_DIR = path.join(ROOT, "public", "voiceover");
const BGM_DIR = path.join(ROOT, "public", "bgm");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "voiceoverManifest.ts");

fs.mkdirSync(VOICEOVER_DIR, { recursive: true });
fs.mkdirSync(BGM_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

// Clean up any temporary test folder
const testTtsDir = path.join(ROOT, "public", "test-tts");
if (fs.existsSync(testTtsDir)) {
  fs.rmSync(testTtsDir, { recursive: true, force: true });
}

/**
 * Generates a warm, atmospheric stereo WAV background music track
 * with sub-bass drone, minor chord pads, and gentle rhythmic pulse.
 */
function generateAmbientWav(filePath, { durationSec, baseFreq, pulseBpm, brightness }) {
  const sampleRate = 44100;
  const numChannels = 2;
  const numSamples = Math.floor(sampleRate * durationSec);
  const bytesPerSample = 2;
  const dataSize = numSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Minor 9th / cinematic intervals
  const chordRoots = [1, 0.8909, 0.7937, 0.8409]; // i - VII - VI - bVII feel
  const beatSec = 60 / pulseBpm;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const barIdx = Math.floor(t / (beatSec * 4)) % chordRoots.length;
    const root = baseFreq * chordRoots[barIdx];

    // Sub bass + fifth + minor third + ninth pad
    const sub = Math.sin(2 * Math.PI * root * t) * 0.38;
    const fifth = Math.sin(2 * Math.PI * (root * 1.5) * t) * 0.22;
    const minor3rd = Math.sin(2 * Math.PI * (root * 2 * 1.1892) * t) * 0.16;
    const ninth = Math.sin(2 * Math.PI * (root * 2 * 2.2449) * t) * (0.08 * brightness);

    // Subtle rhythmic cinematic pulse every half-beat
    const beatPhase = (t % beatSec) / beatSec;
    const pulseEnv = Math.exp(-beatPhase * 7.5);
    const pulse =
      Math.sin(2 * Math.PI * (root * 2) * t) * pulseEnv * 0.14 +
      Math.sin(2 * Math.PI * (root * 4) * t) * Math.exp(-beatPhase * 14) * 0.05 * brightness;

    // Slow stereo shimmer
    const panL = 0.85 + 0.15 * Math.sin(t * 0.6);
    const panR = 0.85 + 0.15 * Math.cos(t * 0.6);

    // Fade in / fade out
    const fadeIn = Math.min(1, t / 1.2);
    const fadeOut = Math.min(1, (durationSec - t) / 1.5);
    const master = 0.42 * fadeIn * fadeOut;

    const rawL = (sub + fifth + minor3rd + ninth + pulse) * panL * master;
    const rawR = (sub + fifth + minor3rd * 0.96 + ninth * 1.05 + pulse) * panR * master;

    const sampleL = Math.max(-1, Math.min(1, rawL));
    const sampleR = Math.max(-1, Math.min(1, rawR));

    const offset = 44 + i * 4;
    buffer.writeInt16LE(Math.round(sampleL * 32767), offset);
    buffer.writeInt16LE(Math.round(sampleR * 32767), offset + 2);
  }

  fs.writeFileSync(filePath, buffer);
}

const SCRIPTS = [
  {
    compId: "RichestCompaniesCinematic",
    voice: "en-US-AndrewMultilingualNeural",
    rate: 1.06,
    bgmFile: "cinematic-tension.wav",
    scenes: [
      {
        id: "hook",
        text: "Five companies are now worth more than entire continents. Combined, just five corporations command over fifteen trillion dollars.",
      },
      {
        id: "gdp-compare",
        text: "That single corporate bloc outweighs the entire economies of Japan, Germany, and India combined.",
      },
      {
        id: "map",
        text: "Even crazier, four of the top six giants sit along one Pacific coastline, linked directly to Saudi Aramco in the Gulf.",
      },
      {
        id: "ranking",
        text: "Apple leads at three point four trillion, followed closely by NVIDIA, Microsoft, Alphabet, Amazon, and Saudi Aramco.",
      },
      {
        id: "shift",
        text: "For the first time in modern history, silicon compute has officially overtaken crude oil as the world's ultimate wealth engine.",
      },
      {
        id: "outro",
        text: "So which company breaks five trillion dollars first? Drop your prediction below.",
      },
    ],
  },
  {
    compId: "AiAgentsHudTech",
    voice: "en-US-BrianNeural",
    rate: 1.08,
    bgmFile: "cyber-pulse.wav",
    scenes: [
      {
        id: "ai-hook",
        text: "Traditional apps are quietly dying, because AI agents don't need buttons or menus.",
      },
      {
        id: "ai-pipe",
        text: "One single prompt triggers planning, API orchestration, and verified execution automatically.",
      },
      {
        id: "ai-bars",
        text: "Autonomous agents now complete ninety one percent of multi-step workflows without a single human click.",
      },
      {
        id: "ai-outro",
        text: "Stop clicking through dozens of tabs, and start orchestrating intelligent systems.",
      },
    ],
  },
  {
    compId: "GeographySingaporeAnomaly",
    voice: "en-GB-RyanNeural",
    rate: 1.04,
    bgmFile: "atlas-minimal.wav",
    scenes: [
      {
        id: "geo-hook",
        text: "How did a tiny island with zero oil and zero farmland out-earn historic empires?",
      },
      {
        id: "geo-map",
        text: "Singapore sits on the Strait of Malacca, the narrow chokepoint connecting Europe, the Middle East, and East Asia.",
      },
      {
        id: "geo-chart",
        text: "In just sixty years, its income per citizen multiplied one hundred and seventy one times to eighty eight thousand dollars.",
      },
      {
        id: "geo-outro",
        text: "Geography sets the stage, but long-term strategy builds the empire.",
      },
    ],
  },
  {
    compId: "WorkflowAutomationExplainer",
    voice: "en-US-ChristopherNeural",
    rate: 1.06,
    bgmFile: "cyber-pulse.wav",
    scenes: [
      {
        id: "wf-idea",
        text: "From a single prompt, ViralMotionStudio generates high-retention video scripts, visual scenes, and AI storyboards automatically.",
      },
      {
        id: "wf-render",
        text: "Visual assets, neural voiceovers, and frame-accurate motion graphics assemble directly into vertical Shorts and widescreen documentaries.",
      },
      {
        id: "wf-publish",
        text: "Connect your YouTube channels securely, schedule daily release slots, and publish without ever opening YouTube Studio manually.",
      },
      {
        id: "wf-brand",
        text: "Turn ideas into cinematic experiences with ViralMotionStudio, your autonomous AI creative studio.",
      },
    ],
  },
];

async function synthesizeSceneWithRetry(voice, rateStr, text, tempDir, maxRetries = 5) {
  const fallbackVoices = [voice, "en-US-GuyNeural", "en-US-AriaNeural"];
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const activeVoice = fallbackVoices[Math.min(attempt - 1, fallbackVoices.length - 1)];
    const tts = new MsEdgeTTS({ connectionTimeoutMs: 15000, synthesisTimeoutMs: 30000 });
    try {
      await tts.setMetadata(activeVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
        wordBoundaryEnabled: true,
      });
      const result = await tts.toFile(tempDir, text, { rate: rateStr });
      tts.close();
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`  Retry ${attempt}/${maxRetries} (${activeVoice}): ${err?.message ?? err}`);
      try {
        tts.close();
      } catch {
        // ignore close errors
      }
      await new Promise((r) => setTimeout(r, 1200 * attempt));
    }
  }
  throw lastError;
}

async function synthesizeAll() {
  console.log("Generating atmospheric stereo BGM tracks...");
  generateAmbientWav(path.join(BGM_DIR, "cinematic-tension.wav"), {
    durationSec: 45,
    baseFreq: 55, // A1 deep cinematic bass
    pulseBpm: 92,
    brightness: 0.9,
  });
  generateAmbientWav(path.join(BGM_DIR, "cyber-pulse.wav"), {
    durationSec: 36,
    baseFreq: 65.41, // C2 cyber pulse
    pulseBpm: 118,
    brightness: 1.4,
  });
  generateAmbientWav(path.join(BGM_DIR, "atlas-minimal.wav"), {
    durationSec: 36,
    baseFreq: 73.42, // D2 editorial atlas
    pulseBpm: 86,
    brightness: 0.75,
  });

  const manifest = {};

  for (const comp of SCRIPTS) {
    console.log(`\nSynthesizing neural voiceover for ${comp.compId} (${comp.voice})...`);
    const compDir = path.join(VOICEOVER_DIR, comp.compId);
    fs.mkdirSync(compDir, { recursive: true });

    const sceneEntries = {};
    for (const scene of comp.scenes) {
      const tempDir = path.join(compDir, `_tmp_${scene.id}`);
      fs.mkdirSync(tempDir, { recursive: true });

      const { audioFilePath, metadataFilePath } = await synthesizeSceneWithRetry(
        comp.voice,
        `+${Math.round((comp.rate - 1) * 100)}%`,
        scene.text,
        tempDir,
      );
      await new Promise((r) => setTimeout(r, 700));

      const finalMp3 = path.join(compDir, `${scene.id}.mp3`);
      fs.copyFileSync(audioFilePath, finalMp3);

      const audioMeta = await parseFile(finalMp3);
      const durationSec = audioMeta.format.duration ?? 3.5;

      const rawMeta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
      const wordEvents = (rawMeta.Metadata ?? []).filter(
        (m) => m.Type === "WordBoundary" && m.Data?.text?.Text,
      );

      const captions = wordEvents.map((evt, idx) => {
        const startMs = Math.round(evt.Data.Offset / 10000);
        const durMs = Math.round(evt.Data.Duration / 10000);
        const endMs = startMs + Math.max(120, durMs);
        const word = evt.Data.text.Text;
        return {
          text: `${idx === 0 ? "" : " "}${word}`,
          startMs,
          endMs,
          timestampMs: Math.round((startMs + endMs) / 2),
          confidence: 1,
        };
      });

      fs.rmSync(tempDir, { recursive: true, force: true });

      // Add small breathing room (0.45s) + overlap compensation for crisp pacing
      const fps = 30;
      const durationInFrames = Math.max(90, Math.ceil((durationSec + 0.55) * fps));

      sceneEntries[scene.id] = {
        audioSrc: `voiceover/${comp.compId}/${scene.id}.mp3`,
        durationSec: Number(durationSec.toFixed(3)),
        durationInFrames,
        captions,
      };
      console.log(
        `  ✓ ${scene.id}.mp3 (${durationSec.toFixed(2)}s -> ${durationInFrames} frames, ${captions.length} synced words)`,
      );
    }

    manifest[comp.compId] = {
      bgmSrc: `bgm/${comp.bgmFile}`,
      scenes: sceneEntries,
    };
  }

  const tsContent = `import type { Caption } from "@remotion/captions";

export type VoiceoverSceneAsset = {
  readonly audioSrc: string;
  readonly durationSec: number;
  readonly durationInFrames: number;
  readonly captions: readonly Caption[];
};

export type CompositionAudioManifest = {
  readonly bgmSrc: string;
  readonly scenes: Record<string, VoiceoverSceneAsset>;
};

export const VOICEOVER_MANIFEST: Record<
  "RichestCompaniesCinematic" | "AiAgentsHudTech" | "GeographySingaporeAnomaly" | "WorkflowAutomationExplainer",
  CompositionAudioManifest
> = ${JSON.stringify(manifest, null, 2)} as const;
`;

  fs.writeFileSync(MANIFEST_PATH, tsContent, "utf8");
  console.log(`\nWrote manifest -> ${MANIFEST_PATH}`);
}

synthesizeAll().catch((err) => {
  console.error("Failed generating voiceover assets:", err);
  process.exit(1);
});
