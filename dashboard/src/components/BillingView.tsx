import React, { useEffect, useState } from "react";
import type { BillingInterval, PlanId } from "../../../server/types/automation";
import { formatCreditCapacity } from "../config/viralTemplates";
import type { BillingOverview } from "../types/saas";

type BillingViewProps = {
  onWorkspaceUpdated: () => Promise<void>;
  setBusyMsg: (msg: string | null) => void;
};

export const BillingView: React.FC<BillingViewProps> = ({
  onWorkspaceUpdated,
  setBusyMsg,
}) => {
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [notice, setNotice] = useState<string | null>(null);

  async function loadBilling() {
    const res = await fetch("/api/billing/overview", { credentials: "include" });
    if (res.ok) {
      const data = (await res.json()) as BillingOverview;
      setOverview(data);
    }
  }

  useEffect(() => {
    void loadBilling();
  }, []);

  async function handleSelectPlan(planId: PlanId) {
    setNotice(null);
    setBusyMsg(`Processing subscription change to ${planId}...`);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId, billingInterval: interval }),
      });
      const data = (await res.json()) as {
        mode?: "stripe" | "sandbox";
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        setNotice(data.error || "Checkout failed");
        return;
      }
      if (data.mode === "stripe" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      await loadBilling();
      await onWorkspaceUpdated();
      setNotice(`Workspace upgraded to ${planId.toUpperCase()} (${interval})!`);
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleBuyPack(packId: string) {
    setNotice(null);
    setBusyMsg("Adding render credits...");
    try {
      const res = await fetch("/api/billing/credits/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packId }),
      });
      const data = (await res.json()) as {
        mode?: "stripe" | "sandbox";
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        setNotice(data.error || "Top-up failed");
        return;
      }
      if (data.mode === "stripe" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      await loadBilling();
      await onWorkspaceUpdated();
      setNotice("Credit pack added to workspace balance and invoice generated.");
    } finally {
      setBusyMsg(null);
    }
  }

  if (!overview) {
    return <div className="muted">Loading billing &amp; subscription telemetry...</div>;
  }

  const ws = overview.workspace;
  const pct = Math.min(
    100,
    Math.round((ws.creditsBalance / Math.max(1, ws.creditsMonthlyAllowance)) * 100),
  );

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0 }}>Billing, Plans &amp; Render Credits</h2>
          <span className="muted">
            Checkout mode:{" "}
            {overview.stripeConfigured
              ? "Live Stripe Checkout"
              : "Instant Preview Upgrade (connect live Stripe keys to accept cards)"}
          </span>
        </div>
        <div className="row">
          <button
            className={interval === "monthly" ? "btn" : "btn secondary"}
            onClick={() => setInterval("monthly")}
          >
            Monthly
          </button>
          <button
            className={interval === "yearly" ? "btn" : "btn secondary"}
            onClick={() => setInterval("yearly")}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {notice ? (
        <div className="card" style={{ borderColor: "#10b981" }}>
          <strong style={{ color: "#34d399" }}>{notice}</strong>
        </div>
      ) : null}

      <div className="grid">
        <div className="card">
          <span className="muted">Active Plan</span>
          <div className="kpi">{overview.currentPlan.name}</div>
          <span className="pill green">Status: {ws.subscriptionStatus}</span>
        </div>
        <div className="card">
          <span className="muted">Available Render Credits</span>
          <div className="kpi">{ws.creditsBalance}</div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="pill purple">{formatCreditCapacity(ws.creditsBalance)} remaining</span>
          <span className="muted">1 credit = 1 Short · 3 credits = 1 Long-form</span>
        </div>
        <div className="card">
          <span className="muted">Plan Quotas</span>
          <div className="kpi">
            {ws.channelsLimit} ch · {ws.dailyPublishLimit}/day
          </div>
          <span className="pill cyan">Renews {new Date(ws.currentPeriodEnd).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid">
        {overview.plans.map((plan) => {
          const isCurrent = ws.planId === plan.id;
          const price = interval === "yearly" ? plan.priceYearlyMonthlyUsd : plan.priceMonthlyUsd;
          return (
            <div
              key={plan.id}
              className="card"
              style={{
                borderColor: isCurrent ? "var(--vms-cyan)" : "var(--vms-border)",
              }}
            >
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{plan.name}</strong>
                {isCurrent ? <span className="pill green">CURRENT</span> : null}
              </div>
              <div className="kpi">${price}/mo</div>
              <span className="muted">{plan.tagline}</span>
              <ul className="feature-list">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                className={isCurrent ? "btn secondary" : "btn"}
                disabled={isCurrent}
                onClick={() => void handleSelectPlan(plan.id)}
              >
                {isCurrent ? "Active Plan" : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 style={{ margin: 0 }}>One-Time Render Credit Top-Ups</h3>
        <div className="grid">
          {overview.creditPacks.map((pack) => (
            <div key={pack.id} className="card" style={{ background: "rgba(9,10,15,0.65)" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{pack.name}</strong>
                {pack.bonusLabel ? <span className="pill cyan">{pack.bonusLabel}</span> : null}
              </div>
              <div className="kpi">+{pack.credits} Credits</div>
              <span className="muted">${pack.priceUsd} one-time</span>
              <button className="btn" onClick={() => void handleBuyPack(pack.id)}>
                Buy for ${pack.priceUsd}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3 style={{ margin: 0 }}>Invoices</h3>
          {overview.invoices.length === 0 ? (
            <span className="muted">No paid invoices yet.</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {overview.invoices.map((inv) => (
                <div
                  key={inv._id}
                  className="row"
                  style={{
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: 8,
                  }}
                >
                  <div>
                    <strong>{inv.invoiceNumber}</strong>
                    <div className="muted">{inv.description}</div>
                  </div>
                  <div className="row">
                    <span className="pill green">{inv.status}</span>
                    <strong>${inv.amountUsd}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ margin: 0 }}>Credit Ledger</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {overview.transactions.slice(0, 8).map((tx) => (
              <div
                key={tx._id}
                className="row"
                style={{
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 13 }}>{tx.reason}</div>
                  <div className="muted">{new Date(tx.createdAt).toLocaleString()}</div>
                </div>
                <strong style={{ color: tx.amount >= 0 ? "var(--vms-cyan)" : "var(--vms-lavender)" }}>
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

