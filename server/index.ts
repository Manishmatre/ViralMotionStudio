import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { CREDIT_PACKS, PLANS, getPlanDefinition } from "./config/plans";
import { provisionWorkspaceInDb, readDb, updateDb } from "./db/store";
import {
  clearSessionCookie,
  createSessionToken,
  optionalAuth,
  requireAuth,
  setSessionCookie,
  verifyOAuthState,
  type AuthenticatedRequest,
} from "./security/auth";
import {
  hashApiKey,
  hashPassword,
  verifyPassword,
} from "./security/crypto";
import { generateAiVideoProject } from "./services/aiEngine";
import {
  applyCreditPackPurchase,
  applyPlanUpgrade,
  assertChannelSlotAvailable,
  assertFormatAllowed,
  createStripeCheckoutUrl,
  isStripeConfigured,
  verifyStripeWebhookSignature,
} from "./services/billingService";
import {
  enqueuePublishingJob,
  processPublishingJob,
  startAutomationScheduler,
} from "./services/queueService";
import {
  renderProjectVideo,
  renderThumbnailForProject,
} from "./services/renderService";
import {
  getGoogleLoginUrl,
  getYouTubeAuthUrl,
  handleGoogleLoginCallback,
  handleYouTubeOAuthCallback,
  isGoogleOAuthConfigured,
} from "./services/youtubeService";
import { getMongoStatus } from "./db/mongoClient";
import { hydrateFromMongo, syncDbToMongo } from "./db/mongoSync";
import { getCloudinaryStatus, uploadMediaToCloudinary } from "./services/cloudinaryService";
import { getSmtpStatus, sendEmail, sendWelcomeEmail } from "./services/emailService";
import { createRazorpayOrder, getRazorpayStatus, verifyRazorpaySignature } from "./services/razorpayService";
import type { BillingInterval, PlanId, UserDoc, WorkspaceDoc } from "./types/automation";

const app = express();
const PORT = Number(process.env.PORT ?? 5000);
const APP_DOMAIN = process.env.APP_DOMAIN || "viralmotionstudio.toolio.tech";

app.set("trust proxy", 1);

// Basic security headers for SaaS deployment behind TLS proxy
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const allowedOrigins = new Set(
  (
    process.env.CORS_ORIGINS ||
    `https://${APP_DOMAIN},https://ViralMotionStudio.toolio.tech,http://localhost:5173,http://localhost:5000`
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.has(origin)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    credentials: true,
  }),
);

// Stripe Webhook requires raw body BEFORE express.json()
app.post(
  "/api/billing/webhook/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : JSON.stringify(req.body);
    const sig = String(req.headers["stripe-signature"] ?? "");
    if (!verifyStripeWebhookSignature(rawBody, sig)) {
      res.status(400).send("Invalid Stripe signature");
      return;
    }

    try {
      const event = JSON.parse(rawBody) as {
        type: string;
        data?: {
          object?: {
            subscription?: string;
            metadata?: Record<string, string>;
          };
        };
      };
      if (event.type === "checkout.session.completed") {
        const meta = event.data?.object?.metadata ?? {};
        const workspaceId = meta.workspaceId;
        if (workspaceId && meta.kind === "plan" && meta.planId) {
          applyPlanUpgrade({
            workspaceId,
            planId: meta.planId as PlanId,
            billingInterval: (meta.billingInterval as BillingInterval) || "monthly",
            provider: "stripe",
            subscriptionId: event.data?.object?.subscription,
          });
        } else if (workspaceId && meta.kind === "credits" && meta.packId) {
          applyCreditPackPurchase({
            workspaceId,
            packId: meta.packId,
            provider: "stripe",
          });
        }
      }
      res.json({ received: true });
    } catch (err) {
      res.status(400).send(err instanceof Error ? err.message : "Webhook error");
    }
  },
);

app.use(express.json({ limit: "2mb" }));
app.use("/media/out", express.static(path.resolve(process.cwd(), "out")));

// Lightweight sliding-window rate limiter on auth endpoints
const authAttempts = new Map<string, number[]>();
function rateLimitAuth(req: Request, res: Response, next: () => void): void {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recent = (authAttempts.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= 60) {
    res.status(429).json({ error: "Too many auth requests. Wait a few minutes." });
    return;
  }
  recent.push(now);
  authAttempts.set(ip, recent);
  next();
}

function sanitizeUser(user: UserDoc) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    hasGoogleLinked: Boolean(user.googleId),
    activeWorkspaceId: user.activeWorkspaceId,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

function resolveSafeRedirectTarget(rawTarget: string | undefined): string {
  if (!rawTarget) return "/";
  if (rawTarget.startsWith("/") && !rawTarget.startsWith("//")) {
    return rawTarget;
  }
  try {
    const parsed = new URL(rawTarget);
    if (allowedOrigins.has(parsed.origin)) {
      return parsed.toString();
    }
  } catch {
    // ignore malformed URL
  }
  return "/";
}

function getRequestPublicOrigin(req: Request): string {
  if (process.env.PUBLIC_APP_URL) {
    return process.env.PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "http");
  const host = String(req.headers["x-forwarded-host"] || req.get("host") || `localhost:${PORT}`);
  return `${proto}://${host}`;
}

// ---------------- PUBLIC & HEALTH ROUTES ----------------

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    domain: APP_DOMAIN,
    oauthConfigured: isGoogleOAuthConfigured(),
    stripeConfigured: isStripeConfigured(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/public/showcase", (req, res) => {
  const outDir = path.resolve(process.cwd(), "out");
  const thumbPng = path.join(outDir, "thumbnails", "RichestCompanies-16x9.png");
  const hasDemoThumb = fs.existsSync(thumbPng);

  const candidates = [
    {
      id: "richest-short",
      file: "RichestCompaniesCinematic.mp4",
      title: "World's Richest Companies (Cinematic)",
      category: "Business Stories · 3D Gold & Black",
      format: "short" as const,
      resolution: "1080x1920",
      durationSec: 44.47,
      highlights: ["3D Monoliths", "GDP Pillars", "Global Map Arcs", "Neural Voice + Captions"],
    },
    {
      id: "ai-hud-short",
      file: "AiAgentsHudTech-proj_ai_hud_02.mp4",
      title: "Why AI Agents Will Replace Apps",
      category: "AI & Tech · Cyberpunk HUD & 3D Core",
      format: "short" as const,
      resolution: "1080x1920",
      durationSec: 23.57,
      highlights: ["3D Wireframe Core", "SVG Agent Flow", "Live Benchmark Bars", "SFX Cues"],
    },
    {
      id: "geo-singapore-short",
      file: "GeographySingaporeAnomaly.mp4",
      title: "How One Tiny Island Out-Earned Empires",
      category: "Financial Geography · Engine A Documentary",
      format: "short" as const,
      resolution: "1080x1920",
      durationSec: 25.37,
      highlights: ["Maritime Aerials", "Strait of Malacca Arcs", "171x GDP Area Curve", "Neural Voice"],
    },
    {
      id: "workflow-explainer",
      file: "WorkflowAutomationExplainer.mp4",
      title: "Autonomous YouTube Workflow Explained (16:9)",
      category: "Product Explainer · Engine B Workflow",
      format: "long-form" as const,
      resolution: "1920x1080",
      durationSec: 33.1,
      highlights: ["10-Stage Node Graph", "Bezier Data Streams", "9:16 + 16:9 Split", "OAuth Publish"],
    },
    {
      id: "richest-longform",
      file: "RichestCompaniesLongForm.mp4",
      title: "How 5 Companies Outgrew Entire Nations (16:9)",
      category: "Long-Form Documentary · 1920×1080",
      format: "long-form" as const,
      resolution: "1920x1080",
      durationSec: 44.47,
      highlights: ["16:9 Documentary Plates", "Global Map & Split Bars", "1280×720 Thumbnail"],
    },
  ];

  const demoVideos = candidates
    .filter((item) => fs.existsSync(path.join(outDir, item.file)))
    .map((item) => ({
      ...item,
      mp4Url: `/media/out/${item.file}`,
      thumbnailUrl: hasDemoThumb ? "/media/out/thumbnails/RichestCompanies-16x9.png" : null,
      fps: 30,
    }));

  res.json({
    brand: "ViralMotionStudio",
    appDomain: APP_DOMAIN,
    publicAppUrl: getRequestPublicOrigin(req),
    oauthConfigured: isGoogleOAuthConfigured(),
    stripeConfigured: isStripeConfigured(),
    plans: Object.values(PLANS),
    creditPacks: CREDIT_PACKS,
    demoVideo: demoVideos[0] ?? null,
    demoVideos,
  });
});

// ---------------- SAAS AUTH ROUTES (GOOGLE SSO + EMAIL) ----------------

app.get("/api/auth/me", optionalAuth, (req: AuthenticatedRequest, res) => {
  if (!req.authUser || !req.workspace) {
    res.json({
      authenticated: false,
      oauthConfigured: isGoogleOAuthConfigured(),
      stripeConfigured: isStripeConfigured(),
      appDomain: APP_DOMAIN,
      plans: Object.values(PLANS),
      creditPacks: CREDIT_PACKS,
    });
    return;
  }

  const db = readDb();
  const workspaces = db.workspaces.filter(
    (w) => w.ownerUserId === req.authUser!._id,
  );

  res.json({
    authenticated: true,
    user: sanitizeUser(req.authUser),
    workspace: req.workspace,
    plan: getPlanDefinition(req.workspace.planId),
    workspaces,
    oauthConfigured: isGoogleOAuthConfigured(),
    stripeConfigured: isStripeConfigured(),
    appDomain: APP_DOMAIN,
    plans: Object.values(PLANS),
    creditPacks: CREDIT_PACKS,
  });
});

app.get("/api/auth/google/start", (req, res) => {
  const returnTo = resolveSafeRedirectTarget(
    typeof req.query.returnTo === "string" ? req.query.returnTo : "/",
  );
  const result = getGoogleLoginUrl(returnTo);
  if (req.query.redirect === "1") {
    if (!result.configured) {
      res.status(503).send("Google OAuth is not configured on this server.");
      return;
    }
    res.redirect(result.authUrl);
    return;
  }
  res.json(result);
});

async function handleUnifiedGoogleOAuthCallback(req: Request, res: Response) {
  const code = String(req.query.code ?? "");
  const rawState = String(req.query.state ?? "");
  const oauthError = String(req.query.error ?? "");

  if (oauthError) {
    res.status(400).send(`Google OAuth cancelled or denied: ${oauthError}`);
    return;
  }
  if (!code) {
    res.status(400).send("Missing OAuth authorization code");
    return;
  }

  const verifiedState = rawState ? verifyOAuthState(rawState) : null;

  try {
    if (verifiedState?.purpose === "login") {
      const loginResult = await handleGoogleLoginCallback(code, verifiedState);
      setSessionCookie(req, res, loginResult.sessionToken);
      const target = resolveSafeRedirectTarget(loginResult.returnTo);
      res.redirect(target);
      return;
    }

    // YouTube Channel connection flow (either signed state or legacy channelKey)
    const channelKey =
      verifiedState?.purpose === "youtube"
        ? verifiedState.channelKey || "channel_A"
        : rawState || "channel_A";
    const workspaceId =
      verifiedState?.purpose === "youtube" && verifiedState.workspaceId
        ? verifiedState.workspaceId
        : "ws_founder";

    const info = await handleYouTubeOAuthCallback(code, channelKey, workspaceId);
    res.send(
      `<html><body style="font-family:Inter,sans-serif;background:#090B18;color:#F8FAFC;padding:48px;max-width:560px;margin:auto;">
        <div style="border:1px solid rgba(167,139,250,0.34);border-radius:16px;padding:28px;background:#151832;">
          <div style="color:#22D3EE;font-weight:700;font-size:13px;letter-spacing:0.08em;">YOUTUBE CHANNEL CONNECTED</div>
          <h2 style="margin:10px 0 8px;color:#A78BFA;">${info.channelTitle}</h2>
          <p style="color:#9299B0;font-size:14px;line-height:1.6;">
            Channel ID <code>${info.channelId}</code> linked to slot <strong>${info.channelKey}</strong> with AES-256-GCM encrypted token storage.
          </p>
          <p style="color:#9299B0;font-size:13px;">You can close this tab and return to your ViralMotionStudio dashboard.</p>
        </div>
      </body></html>`,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).send(`OAuth callback failed: ${msg}`);
  }
}

app.get("/api/auth/google/callback", handleUnifiedGoogleOAuthCallback);
app.get("/api/youtube/oauth/callback", handleUnifiedGoogleOAuthCallback);

app.post("/api/auth/register", rateLimitAuth, (req, res) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };
  const cleanEmail = email?.trim().toLowerCase() ?? "";
  const cleanName = name?.trim() || cleanEmail.split("@")[0] || "Creator";
  if (!cleanEmail || !cleanEmail.includes("@")) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  if (!password || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const existing = readDb().users.find((u) => u.email === cleanEmail);
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const nowIso = new Date().toISOString();
  const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
  const passwordHash = hashPassword(password);
  let createdUser!: UserDoc;
  let createdWorkspace!: WorkspaceDoc;

  updateDb((db) => {
    createdWorkspace = provisionWorkspaceInDb(db, {
      userId,
      name: cleanName,
      email: cleanEmail,
    });
    createdUser = {
      _id: userId,
      email: cleanEmail,
      name: cleanName,
      avatarUrl: null,
      googleId: null,
      passwordHash,
      role: "owner",
      activeWorkspaceId: createdWorkspace._id,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    };
    db.users.push(createdUser);
  });

  const token = createSessionToken(createdUser._id, createdWorkspace._id);
  setSessionCookie(req, res, token);
  void sendWelcomeEmail(cleanEmail, cleanName);
  res.status(201).json({
    user: sanitizeUser(createdUser),
    workspace: createdWorkspace,
    token,
  });
});

app.post("/api/auth/login", rateLimitAuth, (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };
  const cleanEmail = email?.trim().toLowerCase() ?? "";
  const db = readDb();
  const user = db.users.find((u) => u.email === cleanEmail);
  if (!user || !user.passwordHash || !verifyPassword(password ?? "", user.passwordHash)) {
    res.status(401).json({
      error: "Invalid email or password (or sign in with Google if your account uses Google SSO).",
    });
    return;
  }

  const workspace =
    db.workspaces.find((w) => w._id === user.activeWorkspaceId) ??
    db.workspaces.find((w) => w.ownerUserId === user._id);
  if (!workspace) {
    res.status(500).json({ error: "Workspace missing for account" });
    return;
  }

  updateDb((draft) => {
    const idx = draft.users.findIndex((u) => u._id === user._id);
    if (idx >= 0) {
      draft.users[idx] = {
        ...draft.users[idx],
        lastLoginAt: new Date().toISOString(),
      };
    }
  });

  const token = createSessionToken(user._id, workspace._id);
  setSessionCookie(req, res, token);
  res.json({
    user: sanitizeUser(user),
    workspace,
    token,
  });
});

app.post("/api/auth/logout", (req, res) => {
  clearSessionCookie(req, res);
  res.json({ ok: true });
});

app.patch("/api/workspaces/current", requireAuth, (req: AuthenticatedRequest, res) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ error: "Workspace name is required" });
    return;
  }
  let updated!: WorkspaceDoc;
  updateDb((db) => {
    const idx = db.workspaces.findIndex((w) => w._id === req.workspaceId);
    if (idx >= 0) {
      updated = {
        ...db.workspaces[idx],
        name: name.trim(),
        updatedAt: new Date().toISOString(),
      };
      db.workspaces[idx] = updated;
    }
  });
  res.json(updated);
});

// ---------------- BILLING, PLANS & CREDITS ROUTES ----------------

app.get("/api/billing/overview", requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const workspaceId = req.workspaceId!;
  const workspace = db.workspaces.find((w) => w._id === workspaceId)!;

  res.json({
    workspace,
    currentPlan: getPlanDefinition(workspace.planId),
    plans: Object.values(PLANS),
    creditPacks: CREDIT_PACKS,
    stripeConfigured: isStripeConfigured(),
    invoices: db.billing_invoices.filter((i) => i.workspaceId === workspaceId),
    transactions: db.credit_transactions
      .filter((t) => t.workspaceId === workspaceId)
      .slice(0, 40),
  });
});

app.post("/api/billing/checkout", requireAuth, async (req: AuthenticatedRequest, res) => {
  const {
    planId = "creator",
    billingInterval = "monthly",
  } = req.body as {
    planId?: PlanId;
    billingInterval?: BillingInterval;
  };

  if (!PLANS[planId]) {
    res.status(400).json({ error: `Unknown planId: ${planId}` });
    return;
  }

  try {
    const plan = getPlanDefinition(planId);
    const origin = getRequestPublicOrigin(req);
    const amountUsd =
      billingInterval === "yearly"
        ? plan.priceYearlyMonthlyUsd * 12
        : plan.priceMonthlyUsd;

    if (plan.id !== "starter" && isStripeConfigured()) {
      const checkoutUrl = await createStripeCheckoutUrl({
        workspaceId: req.workspaceId!,
        userEmail: req.authUser!.email,
        mode: "subscription",
        itemId: plan.id,
        amountUsd,
        label: `ViralMotionStudio ${plan.name} (${billingInterval})`,
        successUrl: `${origin}/?billing=success`,
        cancelUrl: `${origin}/?billing=cancel`,
        metadata: {
          kind: "plan",
          workspaceId: req.workspaceId!,
          planId: plan.id,
          billingInterval,
        },
      });
      res.json({ mode: "stripe", checkoutUrl });
      return;
    }

    const result = applyPlanUpgrade({
      workspaceId: req.workspaceId!,
      planId,
      billingInterval,
      provider: "sandbox",
    });
    res.json({
      mode: "sandbox",
      workspace: result.workspace,
      invoice: result.invoice,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.post("/api/billing/credits/topup", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { packId = "pack_50" } = req.body as { packId?: string };
  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    res.status(400).json({ error: "Invalid credit pack ID" });
    return;
  }

  try {
    if (isStripeConfigured()) {
      const origin = getRequestPublicOrigin(req);
      const checkoutUrl = await createStripeCheckoutUrl({
        workspaceId: req.workspaceId!,
        userEmail: req.authUser!.email,
        mode: "payment",
        itemId: pack.id,
        amountUsd: pack.priceUsd,
        label: `ViralMotionStudio ${pack.name}`,
        successUrl: `${origin}/?billing=success`,
        cancelUrl: `${origin}/?billing=cancel`,
        metadata: {
          kind: "credits",
          workspaceId: req.workspaceId!,
          packId: pack.id,
        },
      });
      res.json({ mode: "stripe", checkoutUrl });
      return;
    }

    const result = applyCreditPackPurchase({
      workspaceId: req.workspaceId!,
      packId,
      provider: "sandbox",
    });
    res.json({
      mode: "sandbox",
      workspace: result.workspace,
      invoice: result.invoice,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.post("/api/billing/razorpay/order", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { planId, packId, billingInterval = "monthly" } = req.body as {
    planId?: PlanId;
    packId?: string;
    billingInterval?: BillingInterval;
  };

  try {
    let amountUsd = 0;
    let label = "";

    if (planId && PLANS[planId]) {
      const plan = getPlanDefinition(planId);
      amountUsd = billingInterval === "yearly" ? plan.priceYearlyMonthlyUsd * 12 : plan.priceMonthlyUsd;
      label = `ViralMotionStudio ${plan.name} (${billingInterval})`;
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (!pack) {
        res.status(400).json({ error: "Invalid pack ID" });
        return;
      }
      amountUsd = pack.priceUsd;
      label = `ViralMotionStudio ${pack.name}`;
    } else {
      res.status(400).json({ error: "Missing planId or packId" });
      return;
    }

    // Convert USD to estimated INR (e.g. 1 USD ~ 87 INR) for Razorpay INR processing
    const amountInr = Math.max(1, Math.round(amountUsd * 87));
    const receipt = `rcpt_${Date.now().toString(36)}`;

    const rzpOrder = await createRazorpayOrder({
      amountInr,
      receipt,
      notes: {
        workspaceId: req.workspaceId!,
        userEmail: req.authUser!.email,
        item: label,
      },
    });

    if (!rzpOrder.success) {
      // Fallback sandbox if Razorpay test keys reject authentication
      res.json({
        mode: "sandbox_fallback",
        message: "Razorpay order skipped or in test mode. Fallback to instant sandbox activation.",
        amountInr,
        amountUsd,
      });
      return;
    }

    res.json({
      mode: "razorpay",
      orderId: rzpOrder.orderId,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: rzpOrder.keyId,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.post("/api/billing/razorpay/verify", requireAuth, async (req: AuthenticatedRequest, res) => {
  const {
    orderId,
    paymentId,
    signature,
    planId,
    packId,
    billingInterval = "monthly",
  } = req.body as {
    orderId: string;
    paymentId: string;
    signature: string;
    planId?: PlanId;
    packId?: string;
    billingInterval?: BillingInterval;
  };

  const valid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!valid) {
    res.status(400).json({ error: "Invalid Razorpay payment signature." });
    return;
  }

  try {
    if (planId && PLANS[planId]) {
      const result = applyPlanUpgrade({
        workspaceId: req.workspaceId!,
        planId,
        billingInterval,
        provider: "razorpay",
      });
      res.json({ ok: true, workspace: result.workspace, invoice: result.invoice });
    } else if (packId) {
      const result = applyCreditPackPurchase({
        workspaceId: req.workspaceId!,
        packId,
        provider: "razorpay",
      });
      res.json({ ok: true, workspace: result.workspace, invoice: result.invoice });
    } else {
      res.status(400).json({ error: "Missing plan or pack target." });
    }
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// ---------------- DEVELOPER API KEYS & WEBHOOKS ----------------

app.get("/api/developer/keys", requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const keys = db.api_keys
    .filter((k) => k.workspaceId === req.workspaceId)
    .map((k) => ({
      _id: k._id,
      workspaceId: k.workspaceId,
      name: k.name,
      keyPrefix: k.keyPrefix,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));
  const webhooks = db.webhook_endpoints.filter(
    (w) => w.workspaceId === req.workspaceId,
  );
  res.json({ keys, webhooks });
});

app.post("/api/developer/keys", requireAuth, (req: AuthenticatedRequest, res) => {
  const { name = "Production Automation Key" } = req.body as { name?: string };
  const plan = getPlanDefinition(req.workspace!.planId);
  if (!plan.allowApiAndWebhooks) {
    res.status(403).json({
      error: "REST API keys require Creator Pro or Agency Scale. Upgrade in Billing & Plans.",
    });
    return;
  }

  const rawKey = `vms_live_${crypto.randomBytes(24).toString("hex")}`;
  const doc = {
    _id: `key_${crypto.randomUUID().slice(0, 8)}`,
    workspaceId: req.workspaceId!,
    name: name.trim() || "API Key",
    keyPrefix: rawKey.slice(0, 16),
    keyHash: hashApiKey(rawKey),
    lastUsedAt: null,
    createdAt: new Date().toISOString(),
  };

  updateDb((db) => {
    db.api_keys.unshift(doc);
  });

  const safeDoc = {
    _id: doc._id,
    workspaceId: doc.workspaceId,
    name: doc.name,
    keyPrefix: doc.keyPrefix,
    lastUsedAt: doc.lastUsedAt,
    createdAt: doc.createdAt,
  };
  res.status(201).json({ apiKey: safeDoc, rawKey });
});

app.delete("/api/developer/keys/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  updateDb((db) => {
    db.api_keys = db.api_keys.filter(
      (k) => !(k._id === req.params.id && k.workspaceId === req.workspaceId),
    );
  });
  res.json({ ok: true });
});

app.post("/api/developer/webhooks", requireAuth, (req: AuthenticatedRequest, res) => {
  const { url, events = ["video.rendered", "video.published"] } = req.body as {
    url?: string;
    events?: string[];
  };
  const plan = getPlanDefinition(req.workspace!.planId);
  if (!plan.allowApiAndWebhooks) {
    res.status(403).json({
      error: "Webhooks require Creator Pro or Agency Scale.",
    });
    return;
  }
  if (!url?.startsWith("https://") && !url?.startsWith("http://localhost")) {
    res.status(400).json({ error: "Webhook URL must start with https://" });
    return;
  }

  const endpoint = {
    _id: `wh_${crypto.randomUUID().slice(0, 8)}`,
    workspaceId: req.workspaceId!,
    url: url.trim(),
    events,
    signingSecret: `whsec_${crypto.randomBytes(20).toString("hex")}`,
    enabled: true,
    lastDeliveredAt: null,
    lastStatusCode: null,
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => {
    db.webhook_endpoints.unshift(endpoint);
  });
  res.status(201).json(endpoint);
});

app.delete("/api/developer/webhooks/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  updateDb((db) => {
    db.webhook_endpoints = db.webhook_endpoints.filter(
      (w) => !(w._id === req.params.id && w.workspaceId === req.workspaceId),
    );
  });
  res.json({ ok: true });
});

// ---------------- TENANT-SCOPED WORKSPACE AUTOMATION ROUTES ----------------

app.get("/api/state", requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const wsId = req.workspaceId!;
  const settings = db.automation_settings.find((s) => s.workspaceId === wsId);
  const channels = db.youtube_channels.filter((c) => c.workspaceId === wsId);
  const tokens = db.youtube_tokens.filter((t) => t.workspaceId === wsId);

  res.json({
    oauthConfigured: isGoogleOAuthConfigured(),
    stripeConfigured: isStripeConfigured(),
    appDomain: APP_DOMAIN,
    workspace: req.workspace,
    user: sanitizeUser(req.authUser!),
    settings,
    channels: channels.map((ch) => ({
      ...ch,
      hasToken: tokens.some((t) => t.channelKey === ch.channelKey),
    })),
    schedules: db.channel_schedules.filter((s) => s.workspaceId === wsId),
    projects: db.video_projects.filter((p) => p.workspaceId === wsId),
    renderedVideos: db.rendered_videos.filter((v) => v.workspaceId === wsId),
    jobs: db.publishing_jobs.filter((j) => j.workspaceId === wsId),
    history: db.publishing_history.filter((h) => h.workspaceId === wsId),
  });
});

app.patch("/api/settings", requireAuth, (req: AuthenticatedRequest, res) => {
  const body = req.body as Record<string, unknown>;
  const plan = getPlanDefinition(req.workspace!.planId);
  if (body.publishingMode === "fully-automatic" && !plan.allowFullAuto) {
    res.status(403).json({
      error: "Fully-automatic scheduled publishing requires Creator Pro or Agency Scale.",
    });
    return;
  }

  let saved = null;
  updateDb((db) => {
    const idx = db.automation_settings.findIndex(
      (s) => s.workspaceId === req.workspaceId,
    );
    if (idx >= 0) {
      db.automation_settings[idx] = {
        ...db.automation_settings[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      saved = db.automation_settings[idx];
    }
  });
  res.json(saved);
});

app.post("/api/channels", requireAuth, (req: AuthenticatedRequest, res) => {
  const {
    channelTitle,
    niche = "Business stories",
    defaultFormat = "short",
    timeIst = "18:00",
    brandingColor = "#F59E0B",
  } = req.body as {
    channelTitle: string;
    niche?: string;
    defaultFormat?: "short" | "long-form";
    timeIst?: string;
    brandingColor?: string;
  };

  if (!channelTitle?.trim()) {
    res.status(400).json({ error: "channelTitle is required" });
    return;
  }

  try {
    assertChannelSlotAvailable(req.workspaceId!);
  } catch (err) {
    res.status(403).json({ error: err instanceof Error ? err.message : String(err) });
    return;
  }

  const channelKey = `channel_${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  updateDb((db) => {
    db.youtube_channels.push({
      _id: `ch_${crypto.randomUUID().slice(0, 6)}`,
      workspaceId: req.workspaceId!,
      channelKey,
      channelId: null,
      channelTitle: channelTitle.trim(),
      niche,
      language: "en",
      defaultFormat,
      dailyLimit: 1,
      connected: false,
      oauthEmail: null,
      brandingColor,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    db.channel_schedules.push({
      _id: `sched_${crypto.randomUUID().slice(0, 6)}`,
      workspaceId: req.workspaceId!,
      channelKey,
      enabled: true,
      timeIst,
      format: defaultFormat,
      compositionId:
        defaultFormat === "short"
          ? "RichestCompaniesCinematic"
          : "RichestCompaniesLongForm",
      category: "business-stories",
      updatedAt: nowIso,
    });
  });

  res.status(201).json({ channelKey });
});

app.get("/api/youtube/oauth/start", requireAuth, (req: AuthenticatedRequest, res) => {
  const channelKey = String(req.query.channelKey ?? "channel_A");
  const ownsChannel = readDb().youtube_channels.some(
    (c) => c.workspaceId === req.workspaceId && c.channelKey === channelKey,
  );
  if (!ownsChannel) {
    res.status(404).json({ error: "Channel slot not found in active workspace" });
    return;
  }

  const result = getYouTubeAuthUrl({
    channelKey,
    workspaceId: req.workspaceId!,
    userId: req.authUser!._id,
  });
  res.json(result);
});

app.patch("/api/schedules/:id", requireAuth, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const patch = req.body as Record<string, unknown>;
  updateDb((db) => {
    const idx = db.channel_schedules.findIndex(
      (s) => s._id === id && s.workspaceId === req.workspaceId,
    );
    if (idx >= 0) {
      db.channel_schedules[idx] = {
        ...db.channel_schedules[idx],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
    }
  });
  res.json({ ok: true });
});

app.post("/api/ai/generate", requireAuth, (req: AuthenticatedRequest, res) => {
  const {
    niche = "Business stories",
    topic,
    format = "short",
    channelKey = "channel_A",
  } = req.body as {
    niche?: string;
    topic?: string;
    format?: "short" | "long-form";
    channelKey?: string;
  };

  try {
    assertFormatAllowed(req.workspaceId!, format);
  } catch (err) {
    res.status(403).json({ error: err instanceof Error ? err.message : String(err) });
    return;
  }

  const channels = readDb().youtube_channels.filter(
    (c) => c.workspaceId === req.workspaceId,
  );
  const resolvedChannelKey =
    channels.find((c) => c.channelKey === channelKey)?.channelKey ??
    channels[0]?.channelKey ??
    channelKey;

  const project = generateAiVideoProject({
    workspaceId: req.workspaceId!,
    niche,
    topic,
    format,
    channelKey: resolvedChannelKey,
  });
  updateDb((db) => {
    db.video_projects.unshift(project);
  });
  res.status(201).json(project);
});

app.patch("/api/projects/:id/seo", requireAuth, (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  const seoPatch = req.body as Record<string, unknown>;
  let updatedProject = null;
  updateDb((db) => {
    const idx = db.video_projects.findIndex(
      (p) => p._id === id && p.workspaceId === req.workspaceId,
    );
    if (idx >= 0) {
      db.video_projects[idx] = {
        ...db.video_projects[idx],
        seo: {
          ...db.video_projects[idx].seo,
          ...seoPatch,
        },
      };
      updatedProject = db.video_projects[idx];
    }
  });
  if (!updatedProject) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(updatedProject);
});

app.post("/api/render/:projectId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const video = await renderProjectVideo(
      String(req.params.projectId),
      req.workspaceId!,
    );
    res.json(video);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.includes("Insufficient render credits") || msg.includes("requires") ? 403 : 500;
    res.status(status).json({ error: msg });
  }
});

app.post("/api/thumbnail/:projectId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const thumb = await renderThumbnailForProject(
      String(req.params.projectId),
      req.workspaceId!,
    );
    res.json(thumb);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.post("/api/publish/enqueue", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { channelKey, projectId, videoId, publishAt } = req.body as {
      channelKey: string;
      projectId: string;
      videoId: string;
      publishAt?: string;
    };
    const job = enqueuePublishingJob({
      workspaceId: req.workspaceId!,
      channelKey,
      projectId,
      videoId,
      publishAt: publishAt ?? new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.post("/api/publish/run/:jobId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const updatedJob = await processPublishingJob(
      String(req.params.jobId),
      req.workspaceId!,
    );
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// ---------------- PLATFORM PORTAL & AUDIT TELEMETRY (SECURED FOR OWNER) ----------------

app.get("/api/portal/overview", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.authUser?.role !== "owner") {
    res.status(403).json({ error: "Access denied. Platform Portal is restricted to platform owners." });
    return;
  }
  const db = readDb();
  const mongoStatus = await getMongoStatus();
  const cloudinaryStatus = await getCloudinaryStatus();
  const smtpStatus = await getSmtpStatus();
  const razorpayStatus = getRazorpayStatus();

  res.json({
    ok: true,
    domain: APP_DOMAIN,
    system: {
      mongo: mongoStatus,
      cloudinary: cloudinaryStatus,
      smtp: smtpStatus,
      razorpay: razorpayStatus,
      remotionStudio: {
        status: "online",
        port: 3000,
        url: "http://localhost:3000",
      },
      youtubeOAuth: {
        configured: isGoogleOAuthConfigured(),
        clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.slice(0, 16)}...` : null,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || null,
      },
      tenant: {
        id: process.env.PUBLIC_TENANT_ID || "686fb5d8df33e05d1bb9416c",
        organization: process.env.WEBAUTHN_RP_NAME || "ArionexTech Software",
      },
    },
    counts: {
      users: db.users.length,
      workspaces: db.workspaces.length,
      projects: db.video_projects.length,
      renderedVideos: db.rendered_videos.length,
      connectedChannels: db.youtube_channels.filter((c) => c.connected).length,
      totalChannels: db.youtube_channels.length,
      publishingJobs: db.publishing_jobs.length,
      creditTransactions: db.credit_transactions.length,
      circulatingCredits: db.workspaces.reduce((acc, w) => acc + (w.creditsBalance || 0), 0),
    },
    users: db.users.map((u) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    })),
    workspaces: db.workspaces.map((w) => ({
      id: w._id,
      name: w.name,
      planId: w.planId,
      creditsBalance: w.creditsBalance,
      channelsLimit: w.channelsLimit,
      subscriptionStatus: w.subscriptionStatus,
      updatedAt: w.updatedAt,
    })),
    channels: db.youtube_channels.map((c) => ({
      id: c._id,
      channelKey: c.channelKey,
      channelTitle: c.channelTitle,
      niche: c.niche,
      connected: c.connected,
      dailyLimit: c.dailyLimit,
      brandingColor: c.brandingColor,
    })),
    renderedVideos: db.rendered_videos.slice(-10).reverse(),
    publishingJobs: db.publishing_jobs.slice(-10).reverse(),
    creditTransactions: db.credit_transactions.slice(-15).reverse(),
  });
});

app.post("/api/portal/sync-mongo", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.authUser?.role !== "owner") {
    res.status(403).json({ error: "Access denied. Owner authorization required." });
    return;
  }
  try {
    const db = readDb();
    await syncDbToMongo(db);
    res.json({ ok: true, message: "MongoDB Atlas synchronized successfully." });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.post("/api/portal/test-email", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.authUser?.role !== "owner") {
    res.status(403).json({ error: "Access denied. Owner authorization required." });
    return;
  }
  const { to = "arionextech@gmail.com" } = req.body as { to?: string };
  const result = await sendEmail({
    to,
    subject: "ViralMotionStudio Diagnostic Email",
    text: "Diagnostic check: Brevo SMTP is operational on ViralMotionStudio.",
    html: "<p>Diagnostic check: <strong>Brevo SMTP</strong> is configured and operational on <strong>ViralMotionStudio</strong>.</p>",
  });
  res.json(result);
});

app.post("/api/portal/test-cloudinary", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.authUser?.role !== "owner") {
    res.status(403).json({ error: "Access denied. Owner authorization required." });
    return;
  }
  const thumbPng = path.resolve(process.cwd(), "out", "thumbnails", "RichestCompanies-16x9.png");
  if (!fs.existsSync(thumbPng)) {
    res.status(404).json({ error: "No local test asset found in out/thumbnails." });
    return;
  }
  const result = await uploadMediaToCloudinary(thumbPng, {
    folder: "viralmotionstudio/tests",
    publicId: "portal_test_asset",
  });
  res.json(result);
});

// ---------------- SERVE BUILT SAAS FRONTEND IN PRODUCTION ----------------

const DASHBOARD_DIST = path.resolve(process.cwd(), "dashboard", "dist");
if (fs.existsSync(DASHBOARD_DIST)) {
  app.use(express.static(DASHBOARD_DIST));
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api/") &&
      !req.path.startsWith("/media/")
    ) {
      res.sendFile(path.join(DASHBOARD_DIST, "index.html"));
      return;
    }
    next();
  });
}

startAutomationScheduler();

hydrateFromMongo(readDb())
  .then(() => {
    console.log("[Boot] Initialized cloud persistence with MongoDB Atlas.");
  })
  .catch((err) => {
    console.warn("[Boot] MongoDB initial sync deferred:", err instanceof Error ? err.message : String(err));
  });

app.listen(PORT, () => {
  console.log(
    `ViralMotionStudio SaaS Server listening on http://localhost:${PORT} (domain: ${APP_DOMAIN})`,
  );
});
