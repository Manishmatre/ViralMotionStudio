import React, { useEffect, useState } from "react";
import type { DeveloperOverview } from "../types/saas";

type DeveloperViewProps = {
  appDomain: string;
  oauthConfigured: boolean;
  stripeConfigured: boolean;
};

export const DeveloperView: React.FC<DeveloperViewProps> = ({
  appDomain,
  oauthConfigured,
  stripeConfigured,
}) => {
  const [data, setData] = useState<DeveloperOverview | null>(null);
  const [keyName, setKeyName] = useState("n8n / Production Cron");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("https://viralmotionstudio.toolio.tech/webhook");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadDev() {
    const res = await fetch("/api/developer/keys", { credentials: "include" });
    if (res.ok) {
      setData((await res.json()) as DeveloperOverview);
    }
  }

  useEffect(() => {
    void loadDev();
  }, []);

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const res = await fetch("/api/developer/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: keyName }),
    });
    const body = (await res.json()) as { rawKey?: string; error?: string };
    if (!res.ok) {
      setErrorMsg(body.error || "Could not create key");
      return;
    }
    setRevealedKey(body.rawKey || null);
    await loadDev();
  }

  async function handleRevokeKey(id: string) {
    await fetch(`/api/developer/keys/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await loadDev();
  }

  async function handleAddWebhook(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const res = await fetch("/api/developer/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        url: webhookUrl,
        events: ["video.rendered", "video.published", "credits.low"],
      }),
    });
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErrorMsg(body.error || "Could not create webhook");
      return;
    }
    await loadDev();
  }

  async function handleDeleteWebhook(id: string) {
    await fetch(`/api/developer/webhooks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await loadDev();
  }

  return (
    <>
      <h2 style={{ margin: 0 }}>API Keys, Webhooks &amp; Live Domain Deployment</h2>

      {errorMsg ? (
        <div className="card" style={{ borderColor: "#ef4444" }}>
          <strong style={{ color: "#f87171" }}>{errorMsg}</strong>
        </div>
      ) : null}

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Live Domain Checklist ({appDomain})</h3>
          <span className="pill cyan">Single-Port Studio Server (:5000)</span>
        </div>
        <div className="grid">
          <div className="card" style={{ background: "rgba(9,10,15,0.65)" }}>
            <strong>1. DNS CNAME / A Record</strong>
            <span className="muted">
              Point <code>{appDomain}</code> to your server public IP or Cloudflare Tunnel.
            </span>
          </div>
          <div className="card" style={{ background: "rgba(9,10,15,0.65)" }}>
            <strong>2. Google Cloud OAuth URIs</strong>
            <span className="pill green">
              {oauthConfigured ? "Credentials Active" : "Needs Google Client"}
            </span>
            <span className="muted">
              Add <code>https://{appDomain}/api/youtube/oauth/callback</code> &amp;{" "}
              <code>https://{appDomain}/api/auth/google/callback</code> to Authorized Redirect URIs.
            </span>
          </div>
          <div className="card" style={{ background: "rgba(9,10,15,0.65)" }}>
            <strong>3. Stripe Live Payments</strong>
            <span className={stripeConfigured ? "pill green" : "pill purple"}>
              {stripeConfigured ? "Live Stripe Active" : "Preview Mode"}
            </span>
            <span className="muted">
              Set <code>STRIPE_SECRET_KEY</code> &amp; webhook{" "}
              <code>https://{appDomain}/api/billing/webhook/stripe</code> in <code>.env</code>.
            </span>
          </div>
        </div>
      </div>

      <form className="card" onSubmit={(e) => void handleCreateKey(e)}>
        <h3 style={{ margin: 0 }}>REST API Keys</h3>
        <div className="row">
          <input
            style={{ flex: 1 }}
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Key label"
          />
          <button className="btn" type="submit">
            Generate API Key
          </button>
        </div>
        {revealedKey ? (
          <div className="card" style={{ borderColor: "var(--vms-cyan)", background: "var(--vms-bg-primary)" }}>
            <strong style={{ color: "var(--vms-cyan)" }}>Copy now — shown once:</strong>
            <code style={{ wordBreak: "break-all", fontSize: 13 }}>{revealedKey}</code>
            <code style={{ wordBreak: "break-all", fontSize: 12, color: "#a1a1aa" }}>
              curl -X POST https://{appDomain}/api/ai/generate -H &quot;x-api-key: {revealedKey}&quot; -H &quot;Content-Type: application/json&quot; -d &apos;&#123;&quot;niche&quot;:&quot;Business stories&quot;&#125;&apos;
            </code>
          </div>
        ) : null}

        {data?.keys.map((k) => (
          <div
            key={k._id}
            className="row"
            style={{
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 10,
            }}
          >
            <div>
              <strong>{k.name}</strong>
              <div className="muted">
                Prefix: <code>{k.keyPrefix}…</code> · Created{" "}
                {new Date(k.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              type="button"
              className="btn secondary"
              onClick={() => void handleRevokeKey(k._id)}
            >
              Revoke
            </button>
          </div>
        ))}
      </form>

      <form className="card" onSubmit={(e) => void handleAddWebhook(e)}>
        <h3 style={{ margin: 0 }}>Signed Outbound Webhooks</h3>
        <div className="row">
          <input
            style={{ flex: 1 }}
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-webhook-receiver.com/events"
          />
          <button className="btn" type="submit">
            Add Endpoint
          </button>
        </div>
        {data?.webhooks.map((w) => (
          <div
            key={w._id}
            className="row"
            style={{
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 10,
            }}
          >
            <div>
              <strong>{w.url}</strong>
              <div className="muted">
                Events: {w.events.join(", ")} · Secret: <code>{w.signingSecret}</code>
              </div>
            </div>
            <button
              type="button"
              className="btn secondary"
              onClick={() => void handleDeleteWebhook(w._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </form>
    </>
  );
};

