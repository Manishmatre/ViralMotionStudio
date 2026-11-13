import type {
  CreditPackDefinition,
  PlanDefinition,
  PlanId,
  VideoFormat,
} from "../types/automation";

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: "starter",
    name: "Starter Trial",
    tagline: "Validate your first AI motion channel with neural voiceovers.",
    priceMonthlyUsd: 0,
    priceYearlyMonthlyUsd: 0,
    monthlyCredits: 10,
    maxChannels: 1,
    maxDailyPublishes: 1,
    allowedFormats: ["short"],
    allowFullAuto: false,
    allowApiAndWebhooks: false,
    features: [
      "1 connected YouTube channel",
      "10 render credits / month (10 Shorts)",
      "1080x1920 30 FPS Remotion + 3D scenes",
      "Neural TTS voiceover + synced captions",
      "Manual & Semi-Automatic YouTube upload",
    ],
  },
  creator: {
    id: "creator",
    name: "Creator Pro",
    tagline: "Automate 3 channels & 90 videos/month in Shorts + Long-form.",
    priceMonthlyUsd: 49,
    priceYearlyMonthlyUsd: 39,
    monthlyCredits: 100,
    maxChannels: 3,
    maxDailyPublishes: 3,
    allowedFormats: ["short", "long-form"],
    allowFullAuto: true,
    allowApiAndWebhooks: true,
    badge: "MOST POPULAR",
    features: [
      "Up to 3 YouTube channels (OAuth 2.0 isolated)",
      "100 render credits / month (~90 Shorts)",
      "Both 9:16 Shorts & 16:9 Long-form renders",
      "Fully-automatic IST daily scheduler (3/day)",
      "AI SEO, <Still> PNG Thumbnails & REST API",
    ],
  },
  studio: {
    id: "studio",
    name: "Studio Growth",
    tagline: "Professional channel empire: 6 channels, 200 credits & priority rendering.",
    priceMonthlyUsd: 89,
    priceYearlyMonthlyUsd: 69,
    monthlyCredits: 200,
    maxChannels: 6,
    maxDailyPublishes: 6,
    allowedFormats: ["short", "long-form"],
    allowFullAuto: true,
    allowApiAndWebhooks: true,
    badge: "PRO STUDIO",
    features: [
      "Up to 6 connected YouTube channels (isolated)",
      "200 render credits / month (~180 Shorts)",
      "Multi-format 9:16 Shorts & 16:9 Documentaries",
      "Priority GPU render queue & dual IST slots",
      "Signed outbound webhooks & API automation keys",
    ],
  },
  agency: {
    id: "agency",
    name: "Agency Scale",
    tagline: "Multi-brand network automation, webhooks & priority GPU queue.",
    priceMonthlyUsd: 149,
    priceYearlyMonthlyUsd: 119,
    monthlyCredits: 350,
    maxChannels: 15,
    maxDailyPublishes: 15,
    allowedFormats: ["short", "long-form"],
    allowFullAuto: true,
    allowApiAndWebhooks: true,
    badge: "SCALE",
    features: [
      "Up to 15 connected YouTube channels",
      "350 render credits / month",
      "Unlimited automated Shorts & Long-form schedules",
      "Signed outbound webhooks + API automation keys",
      "Custom branding subdomain & priority queue",
    ],
  },
};

export const CREDIT_PACKS: readonly CreditPackDefinition[] = [
  {
    id: "pack_50",
    name: "Boost 50 Pack",
    credits: 50,
    priceUsd: 19,
  },
  {
    id: "pack_200",
    name: "Studio 200 Pack",
    credits: 200,
    priceUsd: 59,
    bonusLabel: "Save 22%",
  },
  {
    id: "pack_600",
    name: "Network 600 Pack",
    credits: 600,
    priceUsd: 149,
    bonusLabel: "Best Value",
  },
];

export function getPlanDefinition(planId: PlanId): PlanDefinition {
  return PLANS[planId] ?? PLANS.starter;
}

export function getRenderCreditCost(format: VideoFormat): number {
  return format === "long-form" ? 3 : 1;
}

