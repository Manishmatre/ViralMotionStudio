import crypto from "node:crypto";
import {
  CREDIT_PACKS,
  getPlanDefinition,
  getRenderCreditCost,
} from "../config/plans";
import { readDb, updateDb } from "../db/store";
import type {
  BillingInterval,
  BillingInvoiceDoc,
  PlanId,
  VideoFormat,
  WorkspaceDoc,
} from "../types/automation";
import { dispatchWorkspaceWebhook } from "./webhookService";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function assertChannelSlotAvailable(workspaceId: string): void {
  const db = readDb();
  const ws = db.workspaces.find((w) => w._id === workspaceId);
  if (!ws) throw new Error("Workspace not found");
  const count = db.youtube_channels.filter(
    (c) => c.workspaceId === workspaceId,
  ).length;
  if (count >= ws.channelsLimit) {
    throw new Error(
      `Your ${getPlanDefinition(ws.planId).name} plan allows up to ${ws.channelsLimit} channel(s). Upgrade your plan in Billing & Plans to connect more channels.`,
    );
  }
}

export function assertFormatAllowed(
  workspaceId: string,
  format: VideoFormat,
): void {
  const db = readDb();
  const ws = db.workspaces.find((w) => w._id === workspaceId);
  if (!ws) throw new Error("Workspace not found");
  const plan = getPlanDefinition(ws.planId);
  if (!plan.allowedFormats.includes(format)) {
    throw new Error(
      `Long-form (16:9) rendering requires Creator Pro or Agency Scale. Upgrade in Billing & Plans.`,
    );
  }
}

export function consumeRenderCredits(
  workspaceId: string,
  format: VideoFormat,
  referenceId: string,
): number {
  const cost = getRenderCreditCost(format);
  let remaining = 0;

  updateDb((db) => {
    const idx = db.workspaces.findIndex((w) => w._id === workspaceId);
    if (idx < 0) throw new Error("Workspace not found");
    const ws = db.workspaces[idx];
    if (ws.creditsBalance < cost) {
      throw new Error(
        `Insufficient render credits (need ${cost}, available ${ws.creditsBalance}). Upgrade your plan or top up credits in Billing & Plans.`,
      );
    }
    remaining = ws.creditsBalance - cost;
    const nowIso = new Date().toISOString();
    db.workspaces[idx] = {
      ...ws,
      creditsBalance: remaining,
      updatedAt: nowIso,
    };
    db.credit_transactions.unshift({
      _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
      workspaceId,
      amount: -cost,
      balanceAfter: remaining,
      reason: `Remotion ${format === "long-form" ? "Long-form 16:9" : "Shorts 9:16"} MP4 render`,
      referenceId,
      createdAt: nowIso,
    });
  });

  if (remaining <= 3) {
    void dispatchWorkspaceWebhook(workspaceId, "credits.low", {
      creditsBalance: remaining,
    });
  }

  return cost;
}

export function refundRenderCredits(
  workspaceId: string,
  amount: number,
  referenceId: string,
  reason = "Automatic refund after failed render",
): void {
  if (amount <= 0) return;
  updateDb((db) => {
    const idx = db.workspaces.findIndex((w) => w._id === workspaceId);
    if (idx < 0) return;
    const ws = db.workspaces[idx];
    const nowIso = new Date().toISOString();
    const balanceAfter = ws.creditsBalance + amount;
    db.workspaces[idx] = {
      ...ws,
      creditsBalance: balanceAfter,
      updatedAt: nowIso,
    };
    db.credit_transactions.unshift({
      _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
      workspaceId,
      amount,
      balanceAfter,
      reason,
      referenceId,
      createdAt: nowIso,
    });
  });
}

export function applyPlanUpgrade(input: {
  readonly workspaceId: string;
  readonly planId: PlanId;
  readonly billingInterval: BillingInterval;
  readonly provider: "stripe" | "sandbox" | "razorpay";
  readonly subscriptionId?: string;
}): { readonly workspace: WorkspaceDoc; readonly invoice: BillingInvoiceDoc | null } {
  const plan = getPlanDefinition(input.planId);
  const nowIso = new Date().toISOString();
  const periodDays = input.billingInterval === "yearly" ? 365 : 30;
  const periodEnd = new Date(
    Date.now() + periodDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  let updatedWs!: WorkspaceDoc;
  let createdInvoice: BillingInvoiceDoc | null = null;

  updateDb((db) => {
    const idx = db.workspaces.findIndex((w) => w._id === input.workspaceId);
    if (idx < 0) throw new Error("Workspace not found");
    const current = db.workspaces[idx];

    const topup = Math.max(0, plan.monthlyCredits - current.creditsBalance);
    const nextCredits =
      plan.id === "starter"
        ? Math.max(current.creditsBalance, plan.monthlyCredits)
        : current.creditsBalance + plan.monthlyCredits;

    updatedWs = {
      ...current,
      planId: plan.id,
      subscriptionStatus: plan.id === "starter" ? "trialing" : "active",
      billingInterval: input.billingInterval,
      creditsBalance: nextCredits,
      creditsMonthlyAllowance: plan.monthlyCredits,
      channelsLimit: plan.maxChannels,
      dailyPublishLimit: plan.maxDailyPublishes,
      subscriptionId: input.subscriptionId ?? current.subscriptionId,
      currentPeriodEnd: periodEnd,
      updatedAt: nowIso,
    };
    db.workspaces[idx] = updatedWs;

    const setIdx = db.automation_settings.findIndex(
      (s) => s.workspaceId === input.workspaceId,
    );
    if (setIdx >= 0) {
      db.automation_settings[setIdx] = {
        ...db.automation_settings[setIdx],
        channelMode: plan.maxChannels > 1 ? "multiple" : "single",
        dailyProductionTarget: plan.maxDailyPublishes,
        monthlyTarget: plan.maxDailyPublishes * 30,
        formatScope: plan.allowedFormats.includes("long-form")
          ? "both"
          : "shorts",
        publishingMode: plan.allowFullAuto
          ? db.automation_settings[setIdx].publishingMode
          : "semi-automatic",
        updatedAt: nowIso,
      };
    }

    if (plan.id !== "starter") {
      db.credit_transactions.unshift({
        _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
        workspaceId: input.workspaceId,
        amount: plan.monthlyCredits,
        balanceAfter: nextCredits,
        reason: `${plan.name} (${input.billingInterval}) plan credits added`,
        referenceId: plan.id,
        createdAt: nowIso,
      });

      const amountUsd =
        input.billingInterval === "yearly"
          ? plan.priceYearlyMonthlyUsd * 12
          : plan.priceMonthlyUsd;

      createdInvoice = {
        _id: `inv_${crypto.randomUUID().slice(0, 8)}`,
        workspaceId: input.workspaceId,
        invoiceNumber: `VMS-${new Date().getFullYear()}-${String(
          db.billing_invoices.length + 1001,
        )}`,
        amountUsd,
        currency: "USD",
        status: "paid",
        description: `${plan.name} Subscription (${input.billingInterval})`,
        planId: plan.id,
        periodStart: nowIso,
        periodEnd,
        provider: input.provider,
        createdAt: nowIso,
      };
      db.billing_invoices.unshift(createdInvoice);
    } else if (topup > 0) {
      db.credit_transactions.unshift({
        _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
        workspaceId: input.workspaceId,
        amount: topup,
        balanceAfter: updatedWs.creditsBalance,
        reason: "Starter plan baseline top-up",
        referenceId: plan.id,
        createdAt: nowIso,
      });
    }
  });

  void dispatchWorkspaceWebhook(input.workspaceId, "subscription.updated", {
    planId: plan.id,
    billingInterval: input.billingInterval,
    creditsBalance: updatedWs.creditsBalance,
  });

  return { workspace: updatedWs, invoice: createdInvoice };
}

export function applyCreditPackPurchase(input: {
  readonly workspaceId: string;
  readonly packId: string;
  readonly provider: "stripe" | "sandbox" | "razorpay";
}): { readonly workspace: WorkspaceDoc; readonly invoice: BillingInvoiceDoc } {
  const pack = CREDIT_PACKS.find((p) => p.id === input.packId);
  if (!pack) {
    throw new Error(`Unknown credit pack: ${input.packId}`);
  }
  const nowIso = new Date().toISOString();
  let updatedWs!: WorkspaceDoc;
  let createdInvoice!: BillingInvoiceDoc;

  updateDb((db) => {
    const idx = db.workspaces.findIndex((w) => w._id === input.workspaceId);
    if (idx < 0) throw new Error("Workspace not found");
    const ws = db.workspaces[idx];
    const nextBalance = ws.creditsBalance + pack.credits;

    updatedWs = {
      ...ws,
      creditsBalance: nextBalance,
      updatedAt: nowIso,
    };
    db.workspaces[idx] = updatedWs;

    db.credit_transactions.unshift({
      _id: `tx_${crypto.randomUUID().slice(0, 8)}`,
      workspaceId: input.workspaceId,
      amount: pack.credits,
      balanceAfter: nextBalance,
      reason: `Purchased ${pack.name} (+${pack.credits} credits)`,
      referenceId: pack.id,
      createdAt: nowIso,
    });

    createdInvoice = {
      _id: `inv_${crypto.randomUUID().slice(0, 8)}`,
      workspaceId: input.workspaceId,
      invoiceNumber: `VMS-${new Date().getFullYear()}-${String(
        db.billing_invoices.length + 1001,
      )}`,
      amountUsd: pack.priceUsd,
      currency: "USD",
      status: "paid",
      description: `${pack.name} (+${pack.credits} Render Credits)`,
      planId: null,
      periodStart: nowIso,
      periodEnd: nowIso,
      provider: input.provider,
      createdAt: nowIso,
    };
    db.billing_invoices.unshift(createdInvoice);
  });

  return { workspace: updatedWs, invoice: createdInvoice };
}

export async function createStripeCheckoutUrl(input: {
  readonly workspaceId: string;
  readonly userEmail: string;
  readonly mode: "subscription" | "payment";
  readonly itemId: string;
  readonly amountUsd: number;
  readonly label: string;
  readonly successUrl: string;
  readonly cancelUrl: string;
  readonly metadata: Record<string, string>;
}): Promise<string | null> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return null;

  const params = new URLSearchParams();
  params.set("mode", input.mode);
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("customer_email", input.userEmail);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(input.amountUsd * 100)),
  );
  params.set("line_items[0][price_data][product_data][name]", input.label);
  if (input.mode === "subscription") {
    params.set(
      "line_items[0][price_data][recurring][interval]",
      input.metadata.billingInterval === "yearly" ? "year" : "month",
    );
  }
  for (const [k, v] of Object.entries(input.metadata)) {
    params.set(`metadata[${k}]`, v);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !data.url) {
    throw new Error(data.error?.message || "Stripe checkout session failed");
  }
  return data.url;
}

export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => kv.split("=")),
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const a = Buffer.from(v1);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

