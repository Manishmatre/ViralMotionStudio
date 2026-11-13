import type { Caption } from "@remotion/captions";

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
> = {
  "RichestCompaniesCinematic": {
    "bgmSrc": "bgm/cinematic-tension.wav",
    "scenes": {
      "hook": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/hook.mp3",
        "durationSec": 8.616,
        "durationInFrames": 275,
        "captions": [
          {
            "text": "Five",
            "startMs": 130,
            "endMs": 413,
            "timestampMs": 272,
            "confidence": 1
          },
          {
            "text": " companies",
            "startMs": 425,
            "endMs": 791,
            "timestampMs": 608,
            "confidence": 1
          },
          {
            "text": " are",
            "startMs": 790,
            "endMs": 910,
            "timestampMs": 850,
            "confidence": 1
          },
          {
            "text": " now",
            "startMs": 873,
            "endMs": 1262,
            "timestampMs": 1068,
            "confidence": 1
          },
          {
            "text": " worth",
            "startMs": 1392,
            "endMs": 1663,
            "timestampMs": 1528,
            "confidence": 1
          },
          {
            "text": " more",
            "startMs": 1675,
            "endMs": 2100,
            "timestampMs": 1888,
            "confidence": 1
          },
          {
            "text": " than",
            "startMs": 2099,
            "endMs": 2219,
            "timestampMs": 2159,
            "confidence": 1
          },
          {
            "text": " entire",
            "startMs": 2205,
            "endMs": 2677,
            "timestampMs": 2441,
            "confidence": 1
          },
          {
            "text": " continents",
            "startMs": 2677,
            "endMs": 3337,
            "timestampMs": 3007,
            "confidence": 1
          },
          {
            "text": " Combined",
            "startMs": 3726,
            "endMs": 4292,
            "timestampMs": 4009,
            "confidence": 1
          },
          {
            "text": " just",
            "startMs": 4552,
            "endMs": 4741,
            "timestampMs": 4647,
            "confidence": 1
          },
          {
            "text": " five",
            "startMs": 4752,
            "endMs": 5047,
            "timestampMs": 4900,
            "confidence": 1
          },
          {
            "text": " corporations",
            "startMs": 5059,
            "endMs": 5672,
            "timestampMs": 5366,
            "confidence": 1
          },
          {
            "text": " command",
            "startMs": 5684,
            "endMs": 6321,
            "timestampMs": 6003,
            "confidence": 1
          },
          {
            "text": " over",
            "startMs": 6486,
            "endMs": 6722,
            "timestampMs": 6604,
            "confidence": 1
          },
          {
            "text": " fifteen",
            "startMs": 6722,
            "endMs": 7312,
            "timestampMs": 7017,
            "confidence": 1
          },
          {
            "text": " trillion",
            "startMs": 7311,
            "endMs": 7688,
            "timestampMs": 7500,
            "confidence": 1
          },
          {
            "text": " dollars",
            "startMs": 7689,
            "endMs": 8255,
            "timestampMs": 7972,
            "confidence": 1
          }
        ]
      },
      "gdp-compare": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/gdp-compare.mp3",
        "durationSec": 6.288,
        "durationInFrames": 206,
        "captions": [
          {
            "text": "That",
            "startMs": 94,
            "endMs": 214,
            "timestampMs": 154,
            "confidence": 1
          },
          {
            "text": " single",
            "startMs": 212,
            "endMs": 542,
            "timestampMs": 377,
            "confidence": 1
          },
          {
            "text": " corporate",
            "startMs": 542,
            "endMs": 943,
            "timestampMs": 743,
            "confidence": 1
          },
          {
            "text": " bloc",
            "startMs": 955,
            "endMs": 1344,
            "timestampMs": 1150,
            "confidence": 1
          },
          {
            "text": " outweighs",
            "startMs": 1498,
            "endMs": 2158,
            "timestampMs": 1828,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 2158,
            "endMs": 2278,
            "timestampMs": 2218,
            "confidence": 1
          },
          {
            "text": " entire",
            "startMs": 2241,
            "endMs": 2831,
            "timestampMs": 2536,
            "confidence": 1
          },
          {
            "text": " economies",
            "startMs": 2830,
            "endMs": 3325,
            "timestampMs": 3078,
            "confidence": 1
          },
          {
            "text": " of",
            "startMs": 3325,
            "endMs": 3445,
            "timestampMs": 3385,
            "confidence": 1
          },
          {
            "text": " Japan",
            "startMs": 3396,
            "endMs": 3938,
            "timestampMs": 3667,
            "confidence": 1
          },
          {
            "text": " Germany",
            "startMs": 4198,
            "endMs": 4705,
            "timestampMs": 4452,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 4894,
            "endMs": 5047,
            "timestampMs": 4971,
            "confidence": 1
          },
          {
            "text": " India",
            "startMs": 5118,
            "endMs": 5436,
            "timestampMs": 5277,
            "confidence": 1
          },
          {
            "text": " combined",
            "startMs": 5436,
            "endMs": 5931,
            "timestampMs": 5684,
            "confidence": 1
          }
        ]
      },
      "map": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/map.mp3",
        "durationSec": 7.92,
        "durationInFrames": 255,
        "captions": [
          {
            "text": "Even",
            "startMs": 83,
            "endMs": 307,
            "timestampMs": 195,
            "confidence": 1
          },
          {
            "text": " crazier",
            "startMs": 307,
            "endMs": 1003,
            "timestampMs": 655,
            "confidence": 1
          },
          {
            "text": " four",
            "startMs": 1203,
            "endMs": 1392,
            "timestampMs": 1298,
            "confidence": 1
          },
          {
            "text": " of",
            "startMs": 1392,
            "endMs": 1512,
            "timestampMs": 1452,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 1439,
            "endMs": 1559,
            "timestampMs": 1499,
            "confidence": 1
          },
          {
            "text": " top",
            "startMs": 1521,
            "endMs": 1792,
            "timestampMs": 1657,
            "confidence": 1
          },
          {
            "text": " six",
            "startMs": 1792,
            "endMs": 2169,
            "timestampMs": 1981,
            "confidence": 1
          },
          {
            "text": " giants",
            "startMs": 2182,
            "endMs": 2595,
            "timestampMs": 2389,
            "confidence": 1
          },
          {
            "text": " sit",
            "startMs": 2606,
            "endMs": 2865,
            "timestampMs": 2736,
            "confidence": 1
          },
          {
            "text": " along",
            "startMs": 2866,
            "endMs": 3220,
            "timestampMs": 3043,
            "confidence": 1
          },
          {
            "text": " one",
            "startMs": 3219,
            "endMs": 3455,
            "timestampMs": 3337,
            "confidence": 1
          },
          {
            "text": " Pacific",
            "startMs": 3467,
            "endMs": 3892,
            "timestampMs": 3680,
            "confidence": 1
          },
          {
            "text": " coastline",
            "startMs": 3903,
            "endMs": 4481,
            "timestampMs": 4192,
            "confidence": 1
          },
          {
            "text": " linked",
            "startMs": 4906,
            "endMs": 5154,
            "timestampMs": 5030,
            "confidence": 1
          },
          {
            "text": " directly",
            "startMs": 5153,
            "endMs": 5731,
            "timestampMs": 5442,
            "confidence": 1
          },
          {
            "text": " to",
            "startMs": 5731,
            "endMs": 5851,
            "timestampMs": 5791,
            "confidence": 1
          },
          {
            "text": " Saudi",
            "startMs": 5825,
            "endMs": 6250,
            "timestampMs": 6038,
            "confidence": 1
          },
          {
            "text": " Aramco",
            "startMs": 6262,
            "endMs": 6934,
            "timestampMs": 6598,
            "confidence": 1
          },
          {
            "text": " in",
            "startMs": 6981,
            "endMs": 7101,
            "timestampMs": 7041,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 7087,
            "endMs": 7207,
            "timestampMs": 7147,
            "confidence": 1
          },
          {
            "text": " Gulf",
            "startMs": 7158,
            "endMs": 7583,
            "timestampMs": 7371,
            "confidence": 1
          }
        ]
      },
      "ranking": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/ranking.mp3",
        "durationSec": 8.472,
        "durationInFrames": 271,
        "captions": [
          {
            "text": "Apple",
            "startMs": 94,
            "endMs": 377,
            "timestampMs": 236,
            "confidence": 1
          },
          {
            "text": " leads",
            "startMs": 377,
            "endMs": 601,
            "timestampMs": 489,
            "confidence": 1
          },
          {
            "text": " at",
            "startMs": 601,
            "endMs": 721,
            "timestampMs": 661,
            "confidence": 1
          },
          {
            "text": " three",
            "startMs": 672,
            "endMs": 967,
            "timestampMs": 820,
            "confidence": 1
          },
          {
            "text": " point",
            "startMs": 967,
            "endMs": 1250,
            "timestampMs": 1109,
            "confidence": 1
          },
          {
            "text": " four",
            "startMs": 1250,
            "endMs": 1498,
            "timestampMs": 1374,
            "confidence": 1
          },
          {
            "text": " trillion",
            "startMs": 1509,
            "endMs": 2028,
            "timestampMs": 1769,
            "confidence": 1
          },
          {
            "text": " followed",
            "startMs": 2394,
            "endMs": 2783,
            "timestampMs": 2589,
            "confidence": 1
          },
          {
            "text": " closely",
            "startMs": 2783,
            "endMs": 3255,
            "timestampMs": 3019,
            "confidence": 1
          },
          {
            "text": " by",
            "startMs": 3255,
            "endMs": 3420,
            "timestampMs": 3338,
            "confidence": 1
          },
          {
            "text": " NVIDIA",
            "startMs": 3420,
            "endMs": 3951,
            "timestampMs": 3686,
            "confidence": 1
          },
          {
            "text": " Microsoft",
            "startMs": 4446,
            "endMs": 5130,
            "timestampMs": 4788,
            "confidence": 1
          },
          {
            "text": " Alphabet",
            "startMs": 5554,
            "endMs": 6049,
            "timestampMs": 5802,
            "confidence": 1
          },
          {
            "text": " Amazon",
            "startMs": 6450,
            "endMs": 6945,
            "timestampMs": 6698,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 7158,
            "endMs": 7278,
            "timestampMs": 7218,
            "confidence": 1
          },
          {
            "text": " Saudi",
            "startMs": 7252,
            "endMs": 7594,
            "timestampMs": 7423,
            "confidence": 1
          },
          {
            "text": " Aramco",
            "startMs": 7594,
            "endMs": 8136,
            "timestampMs": 7865,
            "confidence": 1
          }
        ]
      },
      "shift": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/shift.mp3",
        "durationSec": 7.8,
        "durationInFrames": 251,
        "captions": [
          {
            "text": "For",
            "startMs": 106,
            "endMs": 226,
            "timestampMs": 166,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 165,
            "endMs": 285,
            "timestampMs": 225,
            "confidence": 1
          },
          {
            "text": " first",
            "startMs": 236,
            "endMs": 495,
            "timestampMs": 366,
            "confidence": 1
          },
          {
            "text": " time",
            "startMs": 495,
            "endMs": 719,
            "timestampMs": 607,
            "confidence": 1
          },
          {
            "text": " in",
            "startMs": 719,
            "endMs": 839,
            "timestampMs": 779,
            "confidence": 1
          },
          {
            "text": " modern",
            "startMs": 767,
            "endMs": 1026,
            "timestampMs": 897,
            "confidence": 1
          },
          {
            "text": " history",
            "startMs": 1026,
            "endMs": 1557,
            "timestampMs": 1292,
            "confidence": 1
          },
          {
            "text": " silicon",
            "startMs": 1899,
            "endMs": 2276,
            "timestampMs": 2088,
            "confidence": 1
          },
          {
            "text": " compute",
            "startMs": 2288,
            "endMs": 2701,
            "timestampMs": 2495,
            "confidence": 1
          },
          {
            "text": " has",
            "startMs": 2700,
            "endMs": 2889,
            "timestampMs": 2795,
            "confidence": 1
          },
          {
            "text": " officially",
            "startMs": 2889,
            "endMs": 3585,
            "timestampMs": 3237,
            "confidence": 1
          },
          {
            "text": " overtaken",
            "startMs": 3726,
            "endMs": 4410,
            "timestampMs": 4068,
            "confidence": 1
          },
          {
            "text": " crude",
            "startMs": 4410,
            "endMs": 4811,
            "timestampMs": 4611,
            "confidence": 1
          },
          {
            "text": " oil",
            "startMs": 4894,
            "endMs": 5354,
            "timestampMs": 5124,
            "confidence": 1
          },
          {
            "text": " as",
            "startMs": 5601,
            "endMs": 5721,
            "timestampMs": 5661,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 5731,
            "endMs": 5851,
            "timestampMs": 5791,
            "confidence": 1
          },
          {
            "text": " world's",
            "startMs": 5825,
            "endMs": 6344,
            "timestampMs": 6085,
            "confidence": 1
          },
          {
            "text": " ultimate",
            "startMs": 6356,
            "endMs": 6804,
            "timestampMs": 6580,
            "confidence": 1
          },
          {
            "text": " wealth",
            "startMs": 6804,
            "endMs": 7099,
            "timestampMs": 6952,
            "confidence": 1
          },
          {
            "text": " engine",
            "startMs": 7111,
            "endMs": 7453,
            "timestampMs": 7282,
            "confidence": 1
          }
        ]
      },
      "outro": {
        "audioSrc": "voiceover/RichestCompaniesCinematic/outro.mp3",
        "durationSec": 5.16,
        "durationInFrames": 172,
        "captions": [
          {
            "text": "So",
            "startMs": 94,
            "endMs": 247,
            "timestampMs": 171,
            "confidence": 1
          },
          {
            "text": " which",
            "startMs": 259,
            "endMs": 401,
            "timestampMs": 330,
            "confidence": 1
          },
          {
            "text": " company",
            "startMs": 413,
            "endMs": 731,
            "timestampMs": 572,
            "confidence": 1
          },
          {
            "text": " breaks",
            "startMs": 731,
            "endMs": 1273,
            "timestampMs": 1002,
            "confidence": 1
          },
          {
            "text": " five",
            "startMs": 1415,
            "endMs": 1993,
            "timestampMs": 1704,
            "confidence": 1
          },
          {
            "text": " trillion",
            "startMs": 2193,
            "endMs": 2570,
            "timestampMs": 2382,
            "confidence": 1
          },
          {
            "text": " dollars",
            "startMs": 2571,
            "endMs": 2901,
            "timestampMs": 2736,
            "confidence": 1
          },
          {
            "text": " first",
            "startMs": 2913,
            "endMs": 3373,
            "timestampMs": 3143,
            "confidence": 1
          },
          {
            "text": " Drop",
            "startMs": 3750,
            "endMs": 3939,
            "timestampMs": 3845,
            "confidence": 1
          },
          {
            "text": " your",
            "startMs": 3939,
            "endMs": 4059,
            "timestampMs": 3999,
            "confidence": 1
          },
          {
            "text": " prediction",
            "startMs": 4045,
            "endMs": 4434,
            "timestampMs": 4240,
            "confidence": 1
          },
          {
            "text": " below",
            "startMs": 4434,
            "endMs": 4811,
            "timestampMs": 4623,
            "confidence": 1
          }
        ]
      }
    }
  },
  "AiAgentsHudTech": {
    "bgmSrc": "bgm/cyber-pulse.wav",
    "scenes": {
      "ai-hook": {
        "audioSrc": "voiceover/AiAgentsHudTech/ai-hook.mp3",
        "durationSec": 5.112,
        "durationInFrames": 170,
        "captions": [
          {
            "text": "Traditional",
            "startMs": 69,
            "endMs": 544,
            "timestampMs": 307,
            "confidence": 1
          },
          {
            "text": " apps",
            "startMs": 556,
            "endMs": 857,
            "timestampMs": 707,
            "confidence": 1
          },
          {
            "text": " are",
            "startMs": 868,
            "endMs": 988,
            "timestampMs": 928,
            "confidence": 1
          },
          {
            "text": " quietly",
            "startMs": 995,
            "endMs": 1435,
            "timestampMs": 1215,
            "confidence": 1
          },
          {
            "text": " dying",
            "startMs": 1447,
            "endMs": 1933,
            "timestampMs": 1690,
            "confidence": 1
          },
          {
            "text": " because",
            "startMs": 2188,
            "endMs": 2535,
            "timestampMs": 2362,
            "confidence": 1
          },
          {
            "text": " AI",
            "startMs": 2546,
            "endMs": 2870,
            "timestampMs": 2708,
            "confidence": 1
          },
          {
            "text": " agents",
            "startMs": 2882,
            "endMs": 3287,
            "timestampMs": 3085,
            "confidence": 1
          },
          {
            "text": " don't",
            "startMs": 3299,
            "endMs": 3531,
            "timestampMs": 3415,
            "confidence": 1
          },
          {
            "text": " need",
            "startMs": 3542,
            "endMs": 3750,
            "timestampMs": 3646,
            "confidence": 1
          },
          {
            "text": " buttons",
            "startMs": 3762,
            "endMs": 4132,
            "timestampMs": 3947,
            "confidence": 1
          },
          {
            "text": " or",
            "startMs": 4144,
            "endMs": 4264,
            "timestampMs": 4204,
            "confidence": 1
          },
          {
            "text": " menus",
            "startMs": 4259,
            "endMs": 4768,
            "timestampMs": 4514,
            "confidence": 1
          }
        ]
      },
      "ai-pipe": {
        "audioSrc": "voiceover/AiAgentsHudTech/ai-pipe.mp3",
        "durationSec": 6.432,
        "durationInFrames": 210,
        "captions": [
          {
            "text": "One",
            "startMs": 93,
            "endMs": 371,
            "timestampMs": 232,
            "confidence": 1
          },
          {
            "text": " single",
            "startMs": 382,
            "endMs": 764,
            "timestampMs": 573,
            "confidence": 1
          },
          {
            "text": " prompt",
            "startMs": 775,
            "endMs": 1111,
            "timestampMs": 943,
            "confidence": 1
          },
          {
            "text": " triggers",
            "startMs": 1123,
            "endMs": 1528,
            "timestampMs": 1326,
            "confidence": 1
          },
          {
            "text": " planning",
            "startMs": 1539,
            "endMs": 2048,
            "timestampMs": 1794,
            "confidence": 1
          },
          {
            "text": " API",
            "startMs": 2350,
            "endMs": 2801,
            "timestampMs": 2576,
            "confidence": 1
          },
          {
            "text": " orchestration",
            "startMs": 2813,
            "endMs": 3623,
            "timestampMs": 3218,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 3900,
            "endMs": 4132,
            "timestampMs": 4016,
            "confidence": 1
          },
          {
            "text": " verified",
            "startMs": 4144,
            "endMs": 4700,
            "timestampMs": 4422,
            "confidence": 1
          },
          {
            "text": " execution",
            "startMs": 4711,
            "endMs": 5324,
            "timestampMs": 5018,
            "confidence": 1
          },
          {
            "text": " automatically",
            "startMs": 5336,
            "endMs": 6077,
            "timestampMs": 5707,
            "confidence": 1
          }
        ]
      },
      "ai-bars": {
        "audioSrc": "voiceover/AiAgentsHudTech/ai-bars.mp3",
        "durationSec": 5.976,
        "durationInFrames": 196,
        "captions": [
          {
            "text": "Autonomous",
            "startMs": 58,
            "endMs": 556,
            "timestampMs": 307,
            "confidence": 1
          },
          {
            "text": " agents",
            "startMs": 567,
            "endMs": 1030,
            "timestampMs": 799,
            "confidence": 1
          },
          {
            "text": " now",
            "startMs": 1042,
            "endMs": 1262,
            "timestampMs": 1152,
            "confidence": 1
          },
          {
            "text": " complete",
            "startMs": 1273,
            "endMs": 1724,
            "timestampMs": 1499,
            "confidence": 1
          },
          {
            "text": " ninety",
            "startMs": 1736,
            "endMs": 2049,
            "timestampMs": 1893,
            "confidence": 1
          },
          {
            "text": " one",
            "startMs": 2060,
            "endMs": 2292,
            "timestampMs": 2176,
            "confidence": 1
          },
          {
            "text": " percent",
            "startMs": 2303,
            "endMs": 2754,
            "timestampMs": 2529,
            "confidence": 1
          },
          {
            "text": " of",
            "startMs": 2766,
            "endMs": 2916,
            "timestampMs": 2841,
            "confidence": 1
          },
          {
            "text": " multi-step",
            "startMs": 2928,
            "endMs": 3495,
            "timestampMs": 3212,
            "confidence": 1
          },
          {
            "text": " workflows",
            "startMs": 3507,
            "endMs": 4086,
            "timestampMs": 3797,
            "confidence": 1
          },
          {
            "text": " without",
            "startMs": 4097,
            "endMs": 4444,
            "timestampMs": 4271,
            "confidence": 1
          },
          {
            "text": " a",
            "startMs": 4456,
            "endMs": 4576,
            "timestampMs": 4516,
            "confidence": 1
          },
          {
            "text": " single",
            "startMs": 4514,
            "endMs": 4873,
            "timestampMs": 4694,
            "confidence": 1
          },
          {
            "text": " human",
            "startMs": 4884,
            "endMs": 5173,
            "timestampMs": 5029,
            "confidence": 1
          },
          {
            "text": " click",
            "startMs": 5185,
            "endMs": 5636,
            "timestampMs": 5411,
            "confidence": 1
          }
        ]
      },
      "ai-outro": {
        "audioSrc": "voiceover/AiAgentsHudTech/ai-outro.mp3",
        "durationSec": 5.016,
        "durationInFrames": 167,
        "captions": [
          {
            "text": "Stop",
            "startMs": 81,
            "endMs": 475,
            "timestampMs": 278,
            "confidence": 1
          },
          {
            "text": " clicking",
            "startMs": 486,
            "endMs": 868,
            "timestampMs": 677,
            "confidence": 1
          },
          {
            "text": " through",
            "startMs": 880,
            "endMs": 1088,
            "timestampMs": 984,
            "confidence": 1
          },
          {
            "text": " dozens",
            "startMs": 1100,
            "endMs": 1470,
            "timestampMs": 1285,
            "confidence": 1
          },
          {
            "text": " of",
            "startMs": 1482,
            "endMs": 1602,
            "timestampMs": 1542,
            "confidence": 1
          },
          {
            "text": " tabs",
            "startMs": 1586,
            "endMs": 2118,
            "timestampMs": 1852,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 2350,
            "endMs": 2558,
            "timestampMs": 2454,
            "confidence": 1
          },
          {
            "text": " start",
            "startMs": 2569,
            "endMs": 2916,
            "timestampMs": 2743,
            "confidence": 1
          },
          {
            "text": " orchestrating",
            "startMs": 2940,
            "endMs": 3588,
            "timestampMs": 3264,
            "confidence": 1
          },
          {
            "text": " intelligent",
            "startMs": 3600,
            "endMs": 4132,
            "timestampMs": 3866,
            "confidence": 1
          },
          {
            "text": " systems",
            "startMs": 4144,
            "endMs": 4676,
            "timestampMs": 4410,
            "confidence": 1
          }
        ]
      }
    }
  },
  "GeographySingaporeAnomaly": {
    "bgmSrc": "bgm/atlas-minimal.wav",
    "scenes": {
      "geo-hook": {
        "audioSrc": "voiceover/GeographySingaporeAnomaly/geo-hook.mp3",
        "durationSec": 5.592,
        "durationInFrames": 185,
        "captions": [
          {
            "text": "How",
            "startMs": 100,
            "endMs": 364,
            "timestampMs": 232,
            "confidence": 1
          },
          {
            "text": " did",
            "startMs": 376,
            "endMs": 496,
            "timestampMs": 436,
            "confidence": 1
          },
          {
            "text": " a",
            "startMs": 497,
            "endMs": 617,
            "timestampMs": 557,
            "confidence": 1
          },
          {
            "text": " tiny",
            "startMs": 569,
            "endMs": 978,
            "timestampMs": 774,
            "confidence": 1
          },
          {
            "text": " island",
            "startMs": 989,
            "endMs": 1386,
            "timestampMs": 1188,
            "confidence": 1
          },
          {
            "text": " with",
            "startMs": 1398,
            "endMs": 1530,
            "timestampMs": 1464,
            "confidence": 1
          },
          {
            "text": " zero",
            "startMs": 1542,
            "endMs": 1891,
            "timestampMs": 1717,
            "confidence": 1
          },
          {
            "text": " oil",
            "startMs": 1903,
            "endMs": 2179,
            "timestampMs": 2041,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 2191,
            "endMs": 2311,
            "timestampMs": 2251,
            "confidence": 1
          },
          {
            "text": " zero",
            "startMs": 2312,
            "endMs": 2637,
            "timestampMs": 2475,
            "confidence": 1
          },
          {
            "text": " farmland",
            "startMs": 2648,
            "endMs": 3165,
            "timestampMs": 2907,
            "confidence": 1
          },
          {
            "text": " out-earn",
            "startMs": 3177,
            "endMs": 3550,
            "timestampMs": 3364,
            "confidence": 1
          },
          {
            "text": " historic",
            "startMs": 3562,
            "endMs": 4067,
            "timestampMs": 3815,
            "confidence": 1
          },
          {
            "text": " empires",
            "startMs": 4078,
            "endMs": 4763,
            "timestampMs": 4421,
            "confidence": 1
          }
        ]
      },
      "geo-map": {
        "audioSrc": "voiceover/GeographySingaporeAnomaly/geo-map.mp3",
        "durationSec": 6.816,
        "durationInFrames": 221,
        "captions": [
          {
            "text": "Singapore",
            "startMs": 100,
            "endMs": 677,
            "timestampMs": 389,
            "confidence": 1
          },
          {
            "text": " sits",
            "startMs": 689,
            "endMs": 977,
            "timestampMs": 833,
            "confidence": 1
          },
          {
            "text": " on",
            "startMs": 989,
            "endMs": 1109,
            "timestampMs": 1049,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 1086,
            "endMs": 1206,
            "timestampMs": 1146,
            "confidence": 1
          },
          {
            "text": " Strait",
            "startMs": 1170,
            "endMs": 1458,
            "timestampMs": 1314,
            "confidence": 1
          },
          {
            "text": " of",
            "startMs": 1470,
            "endMs": 1590,
            "timestampMs": 1530,
            "confidence": 1
          },
          {
            "text": " Malacca",
            "startMs": 1566,
            "endMs": 1999,
            "timestampMs": 1783,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 2203,
            "endMs": 2323,
            "timestampMs": 2263,
            "confidence": 1
          },
          {
            "text": " narrow",
            "startMs": 2300,
            "endMs": 2625,
            "timestampMs": 2463,
            "confidence": 1
          },
          {
            "text": " chokepoint",
            "startMs": 2636,
            "endMs": 3165,
            "timestampMs": 2901,
            "confidence": 1
          },
          {
            "text": " connecting",
            "startMs": 3177,
            "endMs": 3658,
            "timestampMs": 3418,
            "confidence": 1
          },
          {
            "text": " Europe",
            "startMs": 3670,
            "endMs": 4079,
            "timestampMs": 3875,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 4271,
            "endMs": 4391,
            "timestampMs": 4331,
            "confidence": 1
          },
          {
            "text": " Middle",
            "startMs": 4355,
            "endMs": 4656,
            "timestampMs": 4506,
            "confidence": 1
          },
          {
            "text": " East",
            "startMs": 4667,
            "endMs": 4943,
            "timestampMs": 4805,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 5160,
            "endMs": 5280,
            "timestampMs": 5220,
            "confidence": 1
          },
          {
            "text": " East",
            "startMs": 5292,
            "endMs": 5568,
            "timestampMs": 5430,
            "confidence": 1
          },
          {
            "text": " Asia",
            "startMs": 5581,
            "endMs": 5990,
            "timestampMs": 5786,
            "confidence": 1
          }
        ]
      },
      "geo-chart": {
        "audioSrc": "voiceover/GeographySingaporeAnomaly/geo-chart.mp3",
        "durationSec": 7.128,
        "durationInFrames": 231,
        "captions": [
          {
            "text": "In",
            "startMs": 100,
            "endMs": 304,
            "timestampMs": 202,
            "confidence": 1
          },
          {
            "text": " just",
            "startMs": 316,
            "endMs": 580,
            "timestampMs": 448,
            "confidence": 1
          },
          {
            "text": " sixty",
            "startMs": 593,
            "endMs": 894,
            "timestampMs": 744,
            "confidence": 1
          },
          {
            "text": " years",
            "startMs": 905,
            "endMs": 1374,
            "timestampMs": 1140,
            "confidence": 1
          },
          {
            "text": " its",
            "startMs": 1530,
            "endMs": 1650,
            "timestampMs": 1590,
            "confidence": 1
          },
          {
            "text": " income",
            "startMs": 1651,
            "endMs": 1976,
            "timestampMs": 1814,
            "confidence": 1
          },
          {
            "text": " per",
            "startMs": 1987,
            "endMs": 2107,
            "timestampMs": 2047,
            "confidence": 1
          },
          {
            "text": " citizen",
            "startMs": 2107,
            "endMs": 2528,
            "timestampMs": 2318,
            "confidence": 1
          },
          {
            "text": " multiplied",
            "startMs": 2540,
            "endMs": 3093,
            "timestampMs": 2817,
            "confidence": 1
          },
          {
            "text": " one",
            "startMs": 3105,
            "endMs": 3309,
            "timestampMs": 3207,
            "confidence": 1
          },
          {
            "text": " hundred",
            "startMs": 3321,
            "endMs": 3609,
            "timestampMs": 3465,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 3622,
            "endMs": 3742,
            "timestampMs": 3682,
            "confidence": 1
          },
          {
            "text": " seventy",
            "startMs": 3706,
            "endMs": 4067,
            "timestampMs": 3887,
            "confidence": 1
          },
          {
            "text": " one",
            "startMs": 4078,
            "endMs": 4330,
            "timestampMs": 4204,
            "confidence": 1
          },
          {
            "text": " times",
            "startMs": 4343,
            "endMs": 4740,
            "timestampMs": 4542,
            "confidence": 1
          },
          {
            "text": " to",
            "startMs": 4751,
            "endMs": 4871,
            "timestampMs": 4811,
            "confidence": 1
          },
          {
            "text": " eighty",
            "startMs": 4872,
            "endMs": 5197,
            "timestampMs": 5035,
            "confidence": 1
          },
          {
            "text": " eight",
            "startMs": 5208,
            "endMs": 5340,
            "timestampMs": 5274,
            "confidence": 1
          },
          {
            "text": " thousand",
            "startMs": 5352,
            "endMs": 5809,
            "timestampMs": 5581,
            "confidence": 1
          },
          {
            "text": " dollars",
            "startMs": 5821,
            "endMs": 6302,
            "timestampMs": 6062,
            "confidence": 1
          }
        ]
      },
      "geo-outro": {
        "audioSrc": "voiceover/GeographySingaporeAnomaly/geo-outro.mp3",
        "durationSec": 4.776,
        "durationInFrames": 160,
        "captions": [
          {
            "text": "Geography",
            "startMs": 100,
            "endMs": 641,
            "timestampMs": 371,
            "confidence": 1
          },
          {
            "text": " sets",
            "startMs": 653,
            "endMs": 917,
            "timestampMs": 785,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 929,
            "endMs": 1049,
            "timestampMs": 989,
            "confidence": 1
          },
          {
            "text": " stage",
            "startMs": 1026,
            "endMs": 1567,
            "timestampMs": 1297,
            "confidence": 1
          },
          {
            "text": " but",
            "startMs": 1783,
            "endMs": 1915,
            "timestampMs": 1849,
            "confidence": 1
          },
          {
            "text": " long-term",
            "startMs": 1927,
            "endMs": 2408,
            "timestampMs": 2168,
            "confidence": 1
          },
          {
            "text": " strategy",
            "startMs": 2420,
            "endMs": 2913,
            "timestampMs": 2667,
            "confidence": 1
          },
          {
            "text": " builds",
            "startMs": 2925,
            "endMs": 3250,
            "timestampMs": 3088,
            "confidence": 1
          },
          {
            "text": " the",
            "startMs": 3261,
            "endMs": 3381,
            "timestampMs": 3321,
            "confidence": 1
          },
          {
            "text": " empire",
            "startMs": 3393,
            "endMs": 3946,
            "timestampMs": 3670,
            "confidence": 1
          }
        ]
      }
    }
  },
  "WorkflowAutomationExplainer": {
    "bgmSrc": "bgm/cyber-pulse.wav",
    "scenes": {
      "wf-idea": {
        "audioSrc": "voiceover/WorkflowAutomationExplainer/wf-idea.mp3",
        "durationSec": 8.64,
        "durationInFrames": 276,
        "captions": [
          {
            "text": "From",
            "startMs": 97,
            "endMs": 321,
            "timestampMs": 209,
            "confidence": 1
          },
          {
            "text": " a",
            "startMs": 333,
            "endMs": 453,
            "timestampMs": 393,
            "confidence": 1
          },
          {
            "text": " single",
            "startMs": 404,
            "endMs": 770,
            "timestampMs": 587,
            "confidence": 1
          },
          {
            "text": " prompt",
            "startMs": 781,
            "endMs": 1194,
            "timestampMs": 988,
            "confidence": 1
          },
          {
            "text": " ViralMotionStudio",
            "startMs": 1371,
            "endMs": 2421,
            "timestampMs": 1896,
            "confidence": 1
          },
          {
            "text": " generates",
            "startMs": 2432,
            "endMs": 2916,
            "timestampMs": 2674,
            "confidence": 1
          },
          {
            "text": " high-retention",
            "startMs": 2927,
            "endMs": 3587,
            "timestampMs": 3257,
            "confidence": 1
          },
          {
            "text": " video",
            "startMs": 3600,
            "endMs": 3918,
            "timestampMs": 3759,
            "confidence": 1
          },
          {
            "text": " scripts",
            "startMs": 3930,
            "endMs": 4390,
            "timestampMs": 4160,
            "confidence": 1
          },
          {
            "text": " visual",
            "startMs": 4649,
            "endMs": 4991,
            "timestampMs": 4820,
            "confidence": 1
          },
          {
            "text": " scenes",
            "startMs": 5003,
            "endMs": 5487,
            "timestampMs": 5245,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 5746,
            "endMs": 5958,
            "timestampMs": 5852,
            "confidence": 1
          },
          {
            "text": " AI",
            "startMs": 5970,
            "endMs": 6359,
            "timestampMs": 6165,
            "confidence": 1
          },
          {
            "text": " storyboards",
            "startMs": 6371,
            "endMs": 7055,
            "timestampMs": 6713,
            "confidence": 1
          },
          {
            "text": " automatically",
            "startMs": 7067,
            "endMs": 7810,
            "timestampMs": 7439,
            "confidence": 1
          }
        ]
      },
      "wf-render": {
        "audioSrc": "voiceover/WorkflowAutomationExplainer/wf-render.mp3",
        "durationSec": 8.76,
        "durationInFrames": 280,
        "captions": [
          {
            "text": "Visual",
            "startMs": 97,
            "endMs": 569,
            "timestampMs": 333,
            "confidence": 1
          },
          {
            "text": " assets",
            "startMs": 581,
            "endMs": 1147,
            "timestampMs": 864,
            "confidence": 1
          },
          {
            "text": " neural",
            "startMs": 1335,
            "endMs": 1689,
            "timestampMs": 1512,
            "confidence": 1
          },
          {
            "text": " voiceovers",
            "startMs": 1701,
            "endMs": 2420,
            "timestampMs": 2061,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 2633,
            "endMs": 2786,
            "timestampMs": 2710,
            "confidence": 1
          },
          {
            "text": " frame-accurate",
            "startMs": 2798,
            "endMs": 3470,
            "timestampMs": 3134,
            "confidence": 1
          },
          {
            "text": " motion",
            "startMs": 3482,
            "endMs": 3836,
            "timestampMs": 3659,
            "confidence": 1
          },
          {
            "text": " graphics",
            "startMs": 3847,
            "endMs": 4283,
            "timestampMs": 4065,
            "confidence": 1
          },
          {
            "text": " assemble",
            "startMs": 4295,
            "endMs": 4696,
            "timestampMs": 4496,
            "confidence": 1
          },
          {
            "text": " directly",
            "startMs": 4708,
            "endMs": 5203,
            "timestampMs": 4956,
            "confidence": 1
          },
          {
            "text": " into",
            "startMs": 5215,
            "endMs": 5392,
            "timestampMs": 5304,
            "confidence": 1
          },
          {
            "text": " vertical",
            "startMs": 5404,
            "endMs": 5805,
            "timestampMs": 5605,
            "confidence": 1
          },
          {
            "text": " Shorts",
            "startMs": 5817,
            "endMs": 6265,
            "timestampMs": 6041,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 6276,
            "endMs": 6429,
            "timestampMs": 6353,
            "confidence": 1
          },
          {
            "text": " widescreen",
            "startMs": 6442,
            "endMs": 7020,
            "timestampMs": 6731,
            "confidence": 1
          },
          {
            "text": " documentaries",
            "startMs": 7031,
            "endMs": 7927,
            "timestampMs": 7479,
            "confidence": 1
          }
        ]
      },
      "wf-publish": {
        "audioSrc": "voiceover/WorkflowAutomationExplainer/wf-publish.mp3",
        "durationSec": 7.776,
        "durationInFrames": 250,
        "captions": [
          {
            "text": "Connect",
            "startMs": 97,
            "endMs": 439,
            "timestampMs": 268,
            "confidence": 1
          },
          {
            "text": " your",
            "startMs": 451,
            "endMs": 593,
            "timestampMs": 522,
            "confidence": 1
          },
          {
            "text": " YouTube",
            "startMs": 604,
            "endMs": 1017,
            "timestampMs": 811,
            "confidence": 1
          },
          {
            "text": " channels",
            "startMs": 1029,
            "endMs": 1406,
            "timestampMs": 1218,
            "confidence": 1
          },
          {
            "text": " securely",
            "startMs": 1418,
            "endMs": 1960,
            "timestampMs": 1689,
            "confidence": 1
          },
          {
            "text": " schedule",
            "startMs": 2208,
            "endMs": 2656,
            "timestampMs": 2432,
            "confidence": 1
          },
          {
            "text": " daily",
            "startMs": 2668,
            "endMs": 2998,
            "timestampMs": 2833,
            "confidence": 1
          },
          {
            "text": " release",
            "startMs": 3010,
            "endMs": 3305,
            "timestampMs": 3158,
            "confidence": 1
          },
          {
            "text": " slots",
            "startMs": 3317,
            "endMs": 3742,
            "timestampMs": 3530,
            "confidence": 1
          },
          {
            "text": " and",
            "startMs": 4000,
            "endMs": 4153,
            "timestampMs": 4077,
            "confidence": 1
          },
          {
            "text": " publish",
            "startMs": 4166,
            "endMs": 4579,
            "timestampMs": 4373,
            "confidence": 1
          },
          {
            "text": " without",
            "startMs": 4590,
            "endMs": 4932,
            "timestampMs": 4761,
            "confidence": 1
          },
          {
            "text": " ever",
            "startMs": 4944,
            "endMs": 5203,
            "timestampMs": 5074,
            "confidence": 1
          },
          {
            "text": " opening",
            "startMs": 5215,
            "endMs": 5533,
            "timestampMs": 5374,
            "confidence": 1
          },
          {
            "text": " YouTube",
            "startMs": 5545,
            "endMs": 5922,
            "timestampMs": 5734,
            "confidence": 1
          },
          {
            "text": " Studio",
            "startMs": 5934,
            "endMs": 6347,
            "timestampMs": 6141,
            "confidence": 1
          },
          {
            "text": " manually",
            "startMs": 6359,
            "endMs": 6960,
            "timestampMs": 6660,
            "confidence": 1
          }
        ]
      },
      "wf-brand": {
        "audioSrc": "voiceover/WorkflowAutomationExplainer/wf-brand.mp3",
        "durationSec": 6.864,
        "durationInFrames": 223,
        "captions": [
          {
            "text": "Turn",
            "startMs": 97,
            "endMs": 356,
            "timestampMs": 227,
            "confidence": 1
          },
          {
            "text": " ideas",
            "startMs": 368,
            "endMs": 804,
            "timestampMs": 586,
            "confidence": 1
          },
          {
            "text": " into",
            "startMs": 817,
            "endMs": 1041,
            "timestampMs": 929,
            "confidence": 1
          },
          {
            "text": " cinematic",
            "startMs": 1052,
            "endMs": 1583,
            "timestampMs": 1318,
            "confidence": 1
          },
          {
            "text": " experiences",
            "startMs": 1595,
            "endMs": 2350,
            "timestampMs": 1973,
            "confidence": 1
          },
          {
            "text": " with",
            "startMs": 2361,
            "endMs": 2481,
            "timestampMs": 2421,
            "confidence": 1
          },
          {
            "text": " ViralMotionStudio",
            "startMs": 2491,
            "endMs": 3588,
            "timestampMs": 3040,
            "confidence": 1
          },
          {
            "text": " your",
            "startMs": 3883,
            "endMs": 4048,
            "timestampMs": 3966,
            "confidence": 1
          },
          {
            "text": " autonomous",
            "startMs": 4059,
            "endMs": 4637,
            "timestampMs": 4348,
            "confidence": 1
          },
          {
            "text": " AI",
            "startMs": 4649,
            "endMs": 5015,
            "timestampMs": 4832,
            "confidence": 1
          },
          {
            "text": " creative",
            "startMs": 5026,
            "endMs": 5462,
            "timestampMs": 5244,
            "confidence": 1
          },
          {
            "text": " studio",
            "startMs": 5475,
            "endMs": 6041,
            "timestampMs": 5758,
            "confidence": 1
          }
        ]
      }
    }
  }
} as const;
