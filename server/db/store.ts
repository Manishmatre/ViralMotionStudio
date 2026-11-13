import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getPlanDefinition } from "../config/plans";
import { syncDbToMongo } from "./mongoSync";
import type {
  ViralMotionDatabase,
  WorkspaceDoc,
} from "../types/automation";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "viralmotion-db.json");
export const FOUNDER_WORKSPACE_ID = "ws_founder";

export function nextIstIso(timeIst: string, addDays = 0): string {
  const [hh, mm] = timeIst.split(":").map(Number);
  const now = new Date();
  const istOffsetMs = 330 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffsetMs);
  istNow.setUTCDate(istNow.getUTCDate() + addDays);
  istNow.setUTCHours(hh, mm, 0, 0);
  const utcDate = new Date(istNow.getTime() - istOffsetMs);
  return utcDate.toISOString();
}

function createFounderWorkspace(nowIso: string, ownerUserId = "pending_owner"): WorkspaceDoc {
  const creatorPlan = getPlanDefinition("creator");
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return {
    _id: FOUNDER_WORKSPACE_ID,
    name: "ViralMotionStudio HQ",
    slug: "viralmotionstudio-hq",
    ownerUserId,
    planId: "creator",
    subscriptionStatus: "active",
    billingInterval: "monthly",
    creditsBalance: creatorPlan.monthlyCredits,
    creditsMonthlyAllowance: creatorPlan.monthlyCredits,
    channelsLimit: creatorPlan.maxChannels,
    dailyPublishLimit: creatorPlan.maxDailyPublishes,
    billingCustomerId: null,
    subscriptionId: null,
    currentPeriodEnd: periodEnd,
    customDomain: process.env.APP_DOMAIN || "viralmotionstudio.toolio.tech",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

function createInitialDb(): ViralMotionDatabase {
  const nowIso = new Date().toISOString();
  const outMp4 = path.resolve(process.cwd(), "out", "RichestCompaniesCinematic.mp4");
  const thumbPng = path.resolve(process.cwd(), "out", "thumbnails", "RichestCompanies-16x9.png");
  const hasExistingMp4 = fs.existsSync(outMp4);
  const hasExistingThumb = fs.existsSync(thumbPng);
  const sizeMb = hasExistingMp4
    ? Number((fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2))
    : 16.81;

  const founderWs = createFounderWorkspace(nowIso);

  return {
    users: [],
    workspaces: [founderWs],
    credit_transactions: [
      {
        _id: "tx_init_founder",
        workspaceId: FOUNDER_WORKSPACE_ID,
        amount: 100,
        balanceAfter: 100,
        reason: "Creator Pro monthly render credit allowance",
        referenceId: founderWs._id,
        createdAt: nowIso,
      },
    ],
    billing_invoices: [],
    api_keys: [],
    webhook_endpoints: [],
    automation_settings: [
      {
        _id: "global_settings",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelMode: "multiple",
        dailyProductionTarget: 3,
        monthlyTarget: 90,
        publishingMode: "fully-automatic",
        formatScope: "both",
        defaultPrivacyStatus: "private",
        enforcePrivateUntilVerified: true,
        schedulerRunning: true,
        updatedAt: nowIso,
      },
    ],
    youtube_channels: [
      {
        _id: "ch_a",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_A",
        channelId: null,
        channelTitle: "Capital Briefs (Channel A)",
        niche: "Business stories",
        language: "en",
        defaultFormat: "short",
        dailyLimit: 1,
        connected: false,
        oauthEmail: null,
        brandingColor: "#8247FF",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      {
        _id: "ch_b",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_B",
        channelId: null,
        channelTitle: "Billionaire Ledger (Channel B)",
        niche: "Billionaires & money",
        language: "en",
        defaultFormat: "short",
        dailyLimit: 1,
        connected: false,
        oauthEmail: null,
        brandingColor: "#10B981",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      {
        _id: "ch_c",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_C",
        channelId: null,
        channelTitle: "Future Compute Lab (Channel C)",
        niche: "AI & technology",
        language: "en",
        defaultFormat: "long-form",
        dailyLimit: 1,
        connected: false,
        oauthEmail: null,
        brandingColor: "#00E5FF",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ],
    youtube_tokens: [],
    channel_schedules: [
      {
        _id: "sched_a",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_A",
        enabled: true,
        timeIst: "09:00",
        format: "short",
        compositionId: "RichestCompaniesCinematic",
        category: "business-stories",
        updatedAt: nowIso,
      },
      {
        _id: "sched_b",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_B",
        enabled: true,
        timeIst: "14:00",
        format: "short",
        compositionId: "GeographySingaporeAnomaly",
        category: "geography-explained",
        updatedAt: nowIso,
      },
      {
        _id: "sched_c",
        workspaceId: FOUNDER_WORKSPACE_ID,
        channelKey: "channel_C",
        enabled: true,
        timeIst: "20:00",
        format: "long-form",
        compositionId: "RichestCompaniesLongForm",
        category: "ai-technology",
        updatedAt: nowIso,
      },
    ],
    video_projects: [
      {
        _id: "proj_richest_01",
        workspaceId: FOUNDER_WORKSPACE_ID,
        title: "World's Richest Companies (Cinematic)",
        topic: "World's richest companies worth more than continents",
        niche: "Business stories",
        format: "short",
        compositionId: "RichestCompaniesCinematic",
        channelKey: "channel_A",
        hook: "Five companies are now worth more than entire continents.",
        script:
          "Five companies are now worth more than entire continents. Combined, just five corporations command over fifteen trillion dollars — outweighing Japan, Germany, and India combined.",
        scenes: [
          { id: "hook", label: "3D Monoliths Hook", visualDirection: "3D gold towers + $15.2T counter", durationSec: 9 },
          { id: "gdp-compare", label: "GDP Scale Comparison", visualDirection: "Pillar comparison vs Japan/Germany/India", durationSec: 6.5 },
          { id: "map", label: "Global Capital Map", visualDirection: "Pacific tech corridor to Riyadh arcs", durationSec: 7.5 },
          { id: "ranking", label: "Top 6 Titans", visualDirection: "Ranked market cap bars", durationSec: 9 },
          { id: "shift", label: "Silicon vs Oil", visualDirection: "Compute chip vs crude oil duel", durationSec: 8 },
          { id: "outro", label: "3D $5T Race Outro", visualDirection: "3D orbital ring + CTA", durationSec: 5.5 },
        ],
        seo: {
          title: "5 Companies Worth More Than Entire Continents ($15.2T) #Shorts",
          description:
            "How Apple, NVIDIA, Microsoft, Alphabet, and Amazon built a $15+ trillion monopoly bigger than entire nations. Built with ViralMotionStudio.",
          tags: ["business", "richest companies", "nvidia", "apple", "finance", "shorts"],
          categoryId: "27",
          privacyStatus: "private",
          publishAtIso: nextIstIso("09:00", 1),
        },
        status: hasExistingMp4 ? "rendered" : "draft",
        createdAt: nowIso,
      },
      {
        _id: "proj_ai_hud_02",
        workspaceId: FOUNDER_WORKSPACE_ID,
        title: "Why AI Agents Will Replace Apps",
        topic: "Why AI agents replace traditional software UI",
        niche: "AI & technology",
        format: "short",
        compositionId: "AiAgentsHudTech",
        channelKey: "channel_C",
        hook: "Traditional apps are quietly dying because AI agents don't need buttons.",
        script:
          "Traditional apps are quietly dying because AI agents don't need buttons. One prompt triggers planning, API orchestration, and verified execution automatically.",
        scenes: [
          { id: "ai-hook", label: "3D Neural Core", visualDirection: "3D wireframe icosahedron + 91% index", durationSec: 5.5 },
          { id: "ai-pipe", label: "Agent Pipeline", visualDirection: "Animated SVG workflow path", durationSec: 7 },
          { id: "ai-bars", label: "Benchmark Bars", visualDirection: "Manual vs Copilot vs Agents", durationSec: 6.5 },
          { id: "ai-outro", label: "Cyber Outro", visualDirection: "3D core pull-back + CTA", durationSec: 5.5 },
        ],
        seo: {
          title: "Why AI Agents Will Replace Every App You Use #Shorts",
          description:
            "Autonomous AI agents complete 91% of multi-step workflows without clicking buttons.",
          tags: ["ai", "ai agents", "technology", "automation", "software"],
          categoryId: "28",
          privacyStatus: "private",
          publishAtIso: nextIstIso("20:00", 1),
        },
        status: "draft",
        createdAt: nowIso,
      },
      {
        _id: "proj_sg_geo_03",
        workspaceId: FOUNDER_WORKSPACE_ID,
        title: "How One Tiny Island Out-Earned Empires",
        topic: "Singapore's geographic and economic rise",
        niche: "Geography explained",
        format: "short",
        compositionId: "GeographySingaporeAnomaly",
        channelKey: "channel_B",
        hook: "How did a tiny island with zero oil out-earn historic empires?",
        script:
          "Singapore sits on the Strait of Malacca, turning maritime geography and long-term strategy into 171x GDP per capita growth.",
        scenes: [
          { id: "geo-hook", label: "3D Globe Hub", visualDirection: "3D geodesic globe + $88.4K counter", durationSec: 6 },
          { id: "geo-map", label: "Trade Chokepoint", visualDirection: "Strait of Malacca shipping arcs", durationSec: 7.3 },
          { id: "geo-chart", label: "GDP Trajectory", visualDirection: "1965 to present curve", durationSec: 7.7 },
          { id: "geo-outro", label: "Atlas Outro", visualDirection: "3D globe + strategic takeaway", durationSec: 5.3 },
        ],
        seo: {
          title: "How One Tiny Island Out-Earned Empires (171x Growth) #Shorts",
          description:
            "Zero oil, zero farmland — how Singapore leveraged maritime geography into one of the richest nations on Earth.",
          tags: ["geography", "singapore", "economics", "wealth", "history"],
          categoryId: "27",
          privacyStatus: "private",
          publishAtIso: nextIstIso("14:00", 1),
        },
        status: "draft",
        createdAt: nowIso,
      },
    ],
    rendered_videos: hasExistingMp4
      ? [
          {
            _id: "vid_richest_01",
            workspaceId: FOUNDER_WORKSPACE_ID,
            projectId: "proj_richest_01",
            compositionId: "RichestCompaniesCinematic",
            format: "short",
            mp4Path: outMp4,
            mp4Url: "/media/out/RichestCompaniesCinematic.mp4",
            thumbnailPath: hasExistingThumb ? thumbPng : null,
            thumbnailUrl: hasExistingThumb ? "/media/out/thumbnails/RichestCompanies-16x9.png" : null,
            fileSizeMb: sizeMb,
            durationSec: 44.47,
            resolution: "1080x1920",
            fps: 30,
            renderedAt: nowIso,
          },
        ]
      : [],
    publishing_jobs: [
      {
        _id: "job_001",
        workspaceId: FOUNDER_WORKSPACE_ID,
        jobKey: "channel_A:vid_richest_01:2026-11-13T09:00:00+05:30",
        channelKey: "channel_A",
        projectId: "proj_richest_01",
        videoId: "vid_richest_01",
        format: "short",
        status: hasExistingMp4 ? "ready" : "queued",
        publishAt: nextIstIso("09:00", 1),
        metadata: {
          title: "5 Companies Worth More Than Entire Continents ($15.2T) #Shorts",
          description:
            "How Apple, NVIDIA, Microsoft, Alphabet, and Amazon built a $15+ trillion monopoly bigger than entire nations.",
          tags: ["business", "richest companies", "nvidia", "apple", "finance"],
          categoryId: "27",
          privacyStatus: "private",
        },
        youtubeVideoId: null,
        youtubeUrl: null,
        retryCount: 0,
        uploadProgressPct: 0,
        lastError: null,
        simulated: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ],
    publishing_history: [],
  };
}

function migrateLegacyDb(rawObj: Record<string, unknown>): {
  db: ViralMotionDatabase;
  changed: boolean;
} {
  let changed = false;
  const nowIso = new Date().toISOString();

  const ensureArray = <T>(key: string): T[] => {
    const val = rawObj[key];
    if (!Array.isArray(val)) {
      changed = true;
      return [];
    }
    return val as T[];
  };

  const attachWorkspaceId = <T extends Record<string, unknown>>(items: T[]): T[] =>
    items.map((item) => {
      if (typeof item.workspaceId === "string" && item.workspaceId) {
        return item;
      }
      changed = true;
      return { ...item, workspaceId: FOUNDER_WORKSPACE_ID };
    });

  const workspaces = ensureArray<WorkspaceDoc>("workspaces");
  if (workspaces.length === 0) {
    workspaces.push(createFounderWorkspace(nowIso));
    changed = true;
  }

  const creditTx = ensureArray<ViralMotionDatabase["credit_transactions"][number]>(
    "credit_transactions",
  );
  if (creditTx.length === 0) {
    creditTx.push({
      _id: "tx_init_founder",
      workspaceId: FOUNDER_WORKSPACE_ID,
      amount: 100,
      balanceAfter: 100,
      reason: "Creator Pro monthly render credit allowance",
      referenceId: FOUNDER_WORKSPACE_ID,
      createdAt: nowIso,
    });
    changed = true;
  }

  const db: ViralMotionDatabase = {
    users: ensureArray("users"),
    workspaces,
    credit_transactions: creditTx,
    billing_invoices: ensureArray("billing_invoices"),
    api_keys: ensureArray("api_keys"),
    webhook_endpoints: ensureArray("webhook_endpoints"),
    youtube_channels: attachWorkspaceId(ensureArray("youtube_channels")) as ViralMotionDatabase["youtube_channels"],
    youtube_tokens: attachWorkspaceId(ensureArray("youtube_tokens")) as ViralMotionDatabase["youtube_tokens"],
    channel_schedules: attachWorkspaceId(ensureArray("channel_schedules")) as ViralMotionDatabase["channel_schedules"],
    video_projects: attachWorkspaceId(ensureArray("video_projects")) as ViralMotionDatabase["video_projects"],
    rendered_videos: attachWorkspaceId(ensureArray("rendered_videos")) as ViralMotionDatabase["rendered_videos"],
    publishing_jobs: attachWorkspaceId(ensureArray("publishing_jobs")) as ViralMotionDatabase["publishing_jobs"],
    publishing_history: attachWorkspaceId(ensureArray("publishing_history")) as ViralMotionDatabase["publishing_history"],
    automation_settings: attachWorkspaceId(ensureArray("automation_settings")) as ViralMotionDatabase["automation_settings"],
  };

  return { db, changed };
}

export function readDb(): ViralMotionDatabase {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialDb();
    writeDb(initial);
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, "utf8");
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const { db, changed } = migrateLegacyDb(parsed);
  if (changed) {
    writeDb(db);
  }
  return db;
}

export function writeDb(db: ViralMotionDatabase): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmpFile, DB_FILE);
  syncDbToMongo(db).catch(() => {});
}

export function updateDb(
  mutator: (db: ViralMotionDatabase) => void,
): ViralMotionDatabase {
  const db = readDb();
  mutator(db);
  writeDb(db);
  return db;
}

export function provisionWorkspaceInDb(
  db: ViralMotionDatabase,
  input: {
    readonly userId: string;
    readonly name: string;
    readonly email: string;
  },
): WorkspaceDoc {
  const ownerEmailEnv = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const founderWsIdx = db.workspaces.findIndex(
    (w) => w._id === FOUNDER_WORKSPACE_ID,
  );
  const founderUnclaimed =
    founderWsIdx >= 0 && db.workspaces[founderWsIdx].ownerUserId === "pending_owner";

  // First user OR configured OWNER_EMAIL automatically claims the seeded Founder HQ workspace
  if (
    founderWsIdx >= 0 &&
    (founderUnclaimed ||
      (ownerEmailEnv && input.email.toLowerCase() === ownerEmailEnv))
  ) {
    const nowIso = new Date().toISOString();
    const updated: WorkspaceDoc = {
      ...db.workspaces[founderWsIdx],
      ownerUserId: input.userId,
      updatedAt: nowIso,
    };
    db.workspaces[founderWsIdx] = updated;
    return updated;
  }

  const starterPlan = getPlanDefinition("starter");
  const nowIso = new Date().toISOString();
  const wsId = `ws_${crypto.randomUUID().slice(0, 8)}`;
  const slugBase = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "studio";
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const workspace: WorkspaceDoc = {
    _id: wsId,
    name: `${input.name}'s Studio`,
    slug: `${slugBase}-${wsId.slice(-4)}`,
    ownerUserId: input.userId,
    planId: "starter",
    subscriptionStatus: "trialing",
    billingInterval: "monthly",
    creditsBalance: starterPlan.monthlyCredits,
    creditsMonthlyAllowance: starterPlan.monthlyCredits,
    channelsLimit: starterPlan.maxChannels,
    dailyPublishLimit: starterPlan.maxDailyPublishes,
    billingCustomerId: null,
    subscriptionId: null,
    currentPeriodEnd: periodEnd,
    customDomain: process.env.APP_DOMAIN || "viralmotionstudio.toolio.tech",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  db.workspaces.push(workspace);

  db.credit_transactions.unshift({
    _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
    workspaceId: wsId,
    amount: starterPlan.monthlyCredits,
    balanceAfter: starterPlan.monthlyCredits,
    reason: "Starter Trial welcome credits",
    referenceId: wsId,
    createdAt: nowIso,
  });

  db.automation_settings.push({
    _id: `set_${wsId}`,
    workspaceId: wsId,
    channelMode: "single",
    dailyProductionTarget: 1,
    monthlyTarget: 30,
    publishingMode: "semi-automatic",
    formatScope: "shorts",
    defaultPrivacyStatus: "private",
    enforcePrivateUntilVerified: true,
    schedulerRunning: true,
    updatedAt: nowIso,
  });

  const defaultChannelKey = `channel_${wsId.slice(-4)}`;
  db.youtube_channels.push({
    _id: `ch_${crypto.randomUUID().slice(0, 6)}`,
    workspaceId: wsId,
    channelKey: defaultChannelKey,
    channelId: null,
    channelTitle: `${input.name} Main Channel`,
    niche: "Business stories",
    language: "en",
    defaultFormat: "short",
    dailyLimit: 1,
    connected: false,
    oauthEmail: null,
    brandingColor: "#8247FF",
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  db.channel_schedules.push({
    _id: `sched_${crypto.randomUUID().slice(0, 6)}`,
    workspaceId: wsId,
    channelKey: defaultChannelKey,
    enabled: false,
    timeIst: "09:00",
    format: "short",
    compositionId: "RichestCompaniesCinematic",
    category: "business-stories",
    updatedAt: nowIso,
  });

  return workspace;
}
