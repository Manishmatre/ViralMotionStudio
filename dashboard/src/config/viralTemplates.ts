import type { VideoFormat } from "../../../server/types/automation";

export type ViralTemplate = {
  readonly id: string;
  readonly demoVideoId: string;
  readonly title: string;
  readonly niche: string;
  readonly format: VideoFormat;
  readonly styleLabel: string;
  readonly badge: string;
  readonly accentColor: string;
  readonly creditCost: number;
  readonly durationLabel: string;
  readonly prompt: string;
  readonly hook: string;
  readonly scenes: readonly {
    readonly id: string;
    readonly label: string;
    readonly visualDirection: string;
    readonly durationSec: number;
  }[];
};

export const VIRAL_TEMPLATES: readonly ViralTemplate[] = [
  {
    id: "youtube-automation-engine",
    demoVideoId: "workflow-explainer",
    title: "YouTube Automation Engine",
    niche: "AI & technology",
    format: "long-form",
    styleLabel: "Connected Nodes · Autonomous Publish",
    badge: "16:9 Showcase · Engine B",
    accentColor: "#22D3EE",
    creditCost: 3,
    durationLabel: "33s · 30 FPS",
    prompt: "Autonomous AI production pipeline from raw idea to scheduled YouTube release",
    hook: "From a single prompt, ViralMotionStudio generates scripts, voiceovers, and auto-publishes to YouTube.",
    scenes: [
      { id: "idea", label: "01 Prompt & Script", visualDirection: "Idea node sweep -> AI script generation -> 4-beat storyboard", durationSec: 9 },
      { id: "render", label: "02 Multi-Format Render", visualDirection: "Visual assets + voiceover waveform -> 9:16 Shorts & 16:9 Long-form", durationSec: 9 },
      { id: "publish", label: "03 YouTube Auto-Publish", visualDirection: "OAuth 2.0 API conduits -> Multi-channel scheduled release", durationSec: 8 },
      { id: "brand", label: "04 Studio Reveal", visualDirection: "ViralMotionStudio brand reveal & autonomous channel dispatch", durationSec: 7 },
    ],
  },
  {
    id: "faceless-finance",
    demoVideoId: "richest-short",
    title: "Global Capital Documentary",
    niche: "Business stories",
    format: "short",
    styleLabel: "Realistic 35mm Cinematography & Macro Stats",
    badge: "9:16 Short · Engine A",
    accentColor: "#8247FF",
    creditCost: 1,
    durationLabel: "44s · 30 FPS",
    prompt: "5 companies worth more than entire continents ($15.2T combined)",
    hook: "Five corporations command more economic power than entire sovereign nations.",
    scenes: [
      { id: "skyline", label: "01 Manhattan Dusk Open", visualDirection: "35mm Manhattan skyscrapers + $15.2T tabular stats", durationSec: 9 },
      { id: "gdp", label: "02 GDP Scale Pillars", visualDirection: "Trading floor atrium + architectural nation benchmark pillars", durationSec: 6.5 },
      { id: "map", label: "03 Pacific-Gulf Arcs", visualDirection: "Global continent flyover with geodesic capital transfer arcs", durationSec: 8 },
      { id: "shift", label: "04 Silicon vs Crude Oil", visualDirection: "Cleanroom silicon wafer vs deep-sea offshore platform split", durationSec: 8 },
      { id: "outro", label: "05 Editorial CTA", visualDirection: "Company insignia reveal + $5T race forecast", durationSec: 5.5 },
    ],
  },
  {
    id: "geography-atlas",
    demoVideoId: "geo-singapore-short",
    title: "Trade Chokepoint Documentary",
    niche: "Geography explained",
    format: "short",
    styleLabel: "Maritime Aerial & Compound Growth Curve",
    badge: "9:16 Short · Engine A",
    accentColor: "#3677FF",
    creditCost: 1,
    durationLabel: "25s · 30 FPS",
    prompt: "How one tiny island with zero domestic oil out-earned historic empires",
    hook: "Zero oil, zero farmland — how maritime chokepoints minted $88.4K per citizen.",
    scenes: [
      { id: "port", label: "01 Twilight Container Port", visualDirection: "Aerial port drone perspective + $88.4K GDP per capita stat", durationSec: 6 },
      { id: "strait", label: "02 Malacca Shipping Arcs", visualDirection: "Geodesic trade routes linking Europe, Gulf, and East Asia", durationSec: 7.3 },
      { id: "curve", label: "03 171x Area Growth Curve", visualDirection: "Area spline curve tracking 1965 to present compound surge", durationSec: 7.7 },
      { id: "outro", label: "04 Geopolitical Takeaway", visualDirection: "Editorial typography: Geography is destiny", durationSec: 4.3 },
    ],
  },
  {
    id: "wealth-documentary",
    demoVideoId: "richest-longform",
    title: "16:9 Compute Monopoly Essay",
    niche: "Billionaires & money",
    format: "long-form",
    styleLabel: "Widescreen Cinema & Global Footprint",
    badge: "16:9 Long-Form · Engine A",
    accentColor: "#A78BFA",
    creditCost: 3,
    durationLabel: "18s · 30 FPS",
    prompt: "How Apple, NVIDIA, and Microsoft built a $15T compute monopoly",
    hook: "Inside the concentrated silicon and software monopolies reshaping global capital.",
    scenes: [
      { id: "intro", label: "01 Widescreen Thesis", visualDirection: "Manhattan dusk cinema open + AAPL $3.4T anchor badge", durationSec: 9 },
      { id: "map-bars", label: "02 Dual-Pane Map & Bars", visualDirection: "Interactive HQ coordinate map + ranked market cap bars", durationSec: 9 },
    ],
  },
];

export function formatCreditCapacity(credits: number): string {
  const safe = Math.max(0, Math.floor(credits));
  const shorts = safe;
  const longForm = Math.floor(safe / 3);
  return `${shorts} Shorts or ${longForm} Long-form`;
}
