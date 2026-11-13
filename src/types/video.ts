import type { Caption } from "@remotion/captions";

export type TemplateCategory =
  | "business-stories"
  | "billionaire-facts"
  | "ai-technology"
  | "psychology-facts"
  | "geography-explained"
  | "motivational-stories"
  | "interesting-facts"
  | "financial-education";

export type VisualStyle =
  | "cinematic-editorial"
  | "futuristic-hud"
  | "editorial-atlas"
  | "noir-luxury"
  | "clean-keynote";

export type SfxPreset =
  | "whoosh"
  | "whip"
  | "ding"
  | "boom"
  | "shutter"
  | "switch"
  | "click"
  | "pageTurn";

export type SfxCue = {
  readonly id: string;
  readonly frame: number;
  readonly preset: SfxPreset;
  readonly volume?: number;
};

export type ThemePalette = {
  readonly bgPrimary: string;
  readonly bgSecondary: string;
  readonly surface: string;
  readonly surfaceBorder: string;
  readonly textPrimary: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly accentSecondary: string;
  readonly headingFont: string;
  readonly bodyFont: string;
  readonly monoFont: string;
  readonly style: VisualStyle;
};

export type MapMarker = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  /** Normalized map coordinates [0..1000, 0..500] on equirectangular projection */
  readonly x: number;
  readonly y: number;
  readonly color?: string;
};

export type MapArc = {
  readonly fromId: string;
  readonly toId: string;
  readonly color?: string;
};

export type ChartDatum = {
  readonly label: string;
  readonly ticker?: string;
  readonly value: number;
  readonly formattedValue: string;
  readonly sublabel?: string;
  readonly color?: string;
};

export type SceneType =
  | "hook"
  | "stat-reveal"
  | "ranking-chart"
  | "map-story"
  | "hud-breakdown"
  | "outro";

export type VisualEngineKind = "documentary" | "explainer";

export type StoryboardScene = {
  readonly id: string;
  readonly title: string;
  readonly type: SceneType;
  readonly durationInFrames: number;
  readonly objective?: string;
  readonly narration?: string;
  readonly mainVisual?: string;
  readonly secondaryGraphics?: string;
  readonly cameraMovement?: string;
  readonly photoAsset?: string;
  readonly transition?: string;
  readonly bgmCue?: string;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly subheadline?: string;
  readonly accentWords?: readonly string[];
  readonly metric?: {
    readonly value: number;
    readonly prefix?: string;
    readonly suffix?: string;
    readonly decimals?: number;
    readonly delta?: string;
    readonly caption?: string;
  };
  readonly chartData?: readonly ChartDatum[];
  readonly mapData?: {
    readonly markers: readonly MapMarker[];
    readonly arcs: readonly MapArc[];
    readonly focusCenter?: readonly [number, number];
    readonly zoom?: number;
  };
  readonly hudTags?: readonly string[];
  readonly sfx?: SfxPreset;
};

export type Storyboard = {
  readonly id: string;
  readonly engine?: VisualEngineKind;
  readonly topic: string;
  readonly category: TemplateCategory;
  readonly visualStyle: VisualStyle;
  readonly fps: number;
  readonly width: number;
  readonly height: number;
  readonly scenes: readonly StoryboardScene[];
  readonly captions: readonly Caption[];
  readonly sfxCues: readonly SfxCue[];
};

