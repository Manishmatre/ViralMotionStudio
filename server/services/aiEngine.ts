import crypto from "node:crypto";
import type { VideoFormat, VideoProjectDoc } from "../types/automation";

type GenerateIdeaInput = {
  readonly workspaceId: string;
  readonly niche: string;
  readonly topic?: string;
  readonly format: VideoFormat;
  readonly channelKey: string;
};

const NICHE_TOPIC_BANK: Record<
  string,
  readonly {
    readonly topic: string;
    readonly hook: string;
    readonly tags: readonly string[];
    readonly compositionShort: string;
    readonly compositionLong: string;
  }[]
> = {
  "Business stories": [
    {
      topic: "How NVIDIA Became a $3.3 Trillion AI Monopoly",
      hook: "One decision in 2006 turned a gaming chip maker into the backbone of global AI.",
      tags: ["nvidia", "business story", "ai chips", "tech monopoly", "finance"],
      compositionShort: "RichestCompaniesCinematic",
      compositionLong: "RichestCompaniesLongForm",
    },
    {
      topic: "Why Costco Makes Money Without Selling Products at a Markup",
      hook: "Costco barely profits on what it sells — its real business is hidden in plain sight.",
      tags: ["costco", "business model", "retail", "economics", "strategy"],
      compositionShort: "RichestCompaniesCinematic",
      compositionLong: "RichestCompaniesLongForm",
    },
  ],
  "Billionaires & money": [
    {
      topic: "How Compounding Built 90% of Warren Buffett's Wealth After Age 65",
      hook: "Time, not stock picking, created nearly all of Warren Buffett's net worth.",
      tags: ["warren buffett", "compounding", "billionaires", "investing", "wealth"],
      compositionShort: "TemplatePlayground",
      compositionLong: "RichestCompaniesLongForm",
    },
    {
      topic: "Why Sovereign Wealth Funds Quietly Own Half of Modern Tech",
      hook: "Behind the world's biggest startups sits trillions in state-backed capital.",
      tags: ["wealth", "finance", "sovereign funds", "capital", "economics"],
      compositionShort: "RichestCompaniesCinematic",
      compositionLong: "RichestCompaniesLongForm",
    },
  ],
  "AI & technology": [
    {
      topic: "Why AI Agents Will Replace Traditional Apps",
      hook: "Traditional apps are dying because AI agents don't need buttons or menus.",
      tags: ["ai", "ai agents", "automation", "software", "tech 2026"],
      compositionShort: "AiAgentsHudTech",
      compositionLong: "RichestCompaniesLongForm",
    },
    {
      topic: "The Hidden Bottleneck Inside Every Data Center",
      hook: "AI isn't limited by code anymore — it's limited by copper, transformers, and power.",
      tags: ["ai infrastructure", "energy", "chips", "technology", "future"],
      compositionShort: "AiAgentsHudTech",
      compositionLong: "RichestCompaniesLongForm",
    },
  ],
  "Geography explained": [
    {
      topic: "How One Tiny Island Out-Earned Empires",
      hook: "Zero oil, zero farmland — how Singapore turned geography into an economic moat.",
      tags: ["singapore", "geography", "trade routes", "economics", "history"],
      compositionShort: "GeographySingaporeAnomaly",
      compositionLong: "RichestCompaniesLongForm",
    },
  ],
};

export function generateAiVideoProject({
  workspaceId,
  niche,
  topic,
  format,
  channelKey,
}: GenerateIdeaInput): VideoProjectDoc {
  const bank = NICHE_TOPIC_BANK[niche] ?? NICHE_TOPIC_BANK["Business stories"];
  const picked = bank[Math.floor(Math.random() * bank.length)];
  const finalTopic = topic?.trim() ? topic.trim() : picked.topic;
  const isShort = format === "short";
  const compositionId = isShort
    ? picked.compositionShort
    : picked.compositionLong;

  const titleSuffix = isShort ? " #Shorts" : " — Full Documentary";
  const seoTitle = `${finalTopic}${titleSuffix}`.slice(0, 98);
  const nowIso = new Date().toISOString();
  const id = `proj_${crypto.randomUUID().slice(0, 8)}`;

  return {
    _id: id,
    workspaceId,
    title: finalTopic,
    topic: finalTopic,
    niche,
    format,
    compositionId,
    channelKey,
    hook: picked.hook,
    script: `${picked.hook} In this breakdown, we trace the numbers, global map footprint, and turning points behind ${finalTopic}.`,
    scenes: isShort
      ? [
          { id: "hook", label: "3D Visual Hook", visualDirection: "3D hero stage + kinetic headline + stat card", durationSec: 6 },
          { id: "data", label: "Data & Map Proof", visualDirection: "Animated map flyover + market chart", durationSec: 12 },
          { id: "insight", label: "Turning Point Duel", visualDirection: "Split comparison cards + sparkline", durationSec: 10 },
          { id: "outro", label: "Cinematic CTA", visualDirection: "3D camera pullback + comment prompt", durationSec: 5 },
        ]
      : [
          { id: "intro", label: "Widescreen 3D Cold Open", visualDirection: "16:9 3D skyline + documentary thesis", durationSec: 15 },
          { id: "context", label: "Global Map & Ranked Comparison", visualDirection: "Dual-pane map + market cap bars", durationSec: 25 },
        ],
    seo: {
      title: seoTitle,
      description: `${picked.hook}\n\nDeep dive on ${finalTopic} — produced automatically with ViralMotionStudio (Remotion + AI Motion Graphics).\n\n#${niche.replace(/[^a-zA-Z0-9]/g, "")} #MotionDesign #ViralMotionStudio`,
      tags: [...picked.tags, format === "short" ? "shorts" : "documentary"],
      categoryId: niche === "AI & technology" ? "28" : "27",
      privacyStatus: "private",
      publishAtIso: null,
    },
    status: "draft",
    createdAt: nowIso,
  };
}
