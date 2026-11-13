import React, { useEffect, useState } from "react";
import {
  Activity,
  Cloud,
  Cpu,
  CreditCard,
  Database,
  ExternalLink,
  Film,
  Mail,
  RefreshCw,
  Send,
  Tv,
  Users,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

type PortalOverviewData = {
  ok: boolean;
  domain: string;
  system: {
    mongo: {
      connected: boolean;
      pingMs: number;
      database: string;
      collectionsCount?: number;
      error: string | null;
    };
    cloudinary: {
      connected: boolean;
      cloudName: string;
      error: string | null;
    };
    smtp: {
      configured: boolean;
      host: string;
      from: string;
    };
    razorpay: {
      configured: boolean;
      keyId: string;
      mode: "test" | "live";
    };
    remotionStudio: {
      status: string;
      port: number;
      url: string;
    };
    youtubeOAuth: {
      configured: boolean;
      clientId: string | null;
      redirectUri: string | null;
    };
    tenant: {
      id: string;
      organization: string;
    };
  };
  counts: {
    users: number;
    workspaces: number;
    projects: number;
    renderedVideos: number;
    connectedChannels: number;
    totalChannels: number;
    publishingJobs: number;
    creditTransactions: number;
    circulatingCredits: number;
  };
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    lastLoginAt?: string;
  }>;
  workspaces: Array<{
    id: string;
    name: string;
    planId: string;
    creditsBalance: number;
    channelsLimit: number;
    subscriptionStatus: string;
    updatedAt: string;
  }>;
  channels: Array<{
    id: string;
    channelKey: string;
    channelTitle: string;
    niche: string;
    connected: boolean;
    dailyLimit: number;
    brandingColor: string;
  }>;
  renderedVideos: Array<{
    _id: string;
    title: string;
    compositionId: string;
    format: string;
    resolution: string;
    durationSec: number;
    fps: number;
    fileSizeMb: number;
    mp4Url: string;
    thumbnailUrl?: string;
    renderedAt: string;
  }>;
  publishingJobs: Array<{
    _id: string;
    channelKey: string;
    format: string;
    status: string;
    publishAt: string;
    youtubeVideoId?: string;
    publishedUrl?: string;
    createdAt: string;
  }>;
  creditTransactions: Array<{
    _id: string;
    amount: number;
    balanceAfter: number;
    reason: string;
    createdAt: string;
  }>;
};

type PortalPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

export const PortalPage: React.FC<PortalPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [data, setData] = useState<PortalOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "database" | "media" | "channels" | "billing">("overview");
  const [syncingMongo, setSyncingMongo] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState("arionextech@gmail.com");

  async function fetchOverview() {
    try {
      setLoading(true);
      const res = await fetch("/api/portal/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Portal fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOverview();
  }, []);

  async function handleSyncMongo() {
    setSyncingMongo(true);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/portal/sync-mongo", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setActionFeedback("MongoDB Atlas synchronized successfully!");
        fetchOverview();
      } else {
        setActionFeedback(`Sync failed: ${json.error || "Unknown"}`);
      }
    } catch (err: unknown) {
      setActionFeedback(`Sync error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSyncingMongo(false);
    }
  }

  async function handleTestEmail() {
    setActionFeedback("Sending test email via Brevo SMTP...");
    try {
      const res = await fetch("/api/portal/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailRecipient }),
      });
      const json = await res.json();
      if (json.success) {
        setActionFeedback(`Email successfully sent! MessageId: ${json.messageId}`);
      } else {
        setActionFeedback(`Email notice: ${json.error || "Brevo delivery check"}`);
      }
    } catch (err: unknown) {
      setActionFeedback(`Email error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function handleTestCloudinary() {
    setActionFeedback("Testing Cloudinary upload...");
    try {
      const res = await fetch("/api/portal/test-cloudinary", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setActionFeedback(`Asset uploaded to Cloudinary: ${json.secureUrl}`);
      } else {
        setActionFeedback(`Cloudinary error: ${json.error || "Failed"}`);
      }
    } catch (err: unknown) {
      setActionFeedback(`Cloudinary error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/portal"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main style={{ minHeight: "85vh", padding: "100px 0 60px" }}>
        <div className="vms-container">
          {/* Header Banner */}
          <div className="vms-page-head" style={{ marginBottom: 32 }}>
            <span className="vms-kicker">CENTRAL PLATFORM PORTAL</span>
            <h1 className="vms-h1" style={{ fontSize: "2.4rem", margin: "12px 0" }}>
              Infrastructure, Cloud Database &amp; System Health
            </h1>
            <p className="vms-sub">
              Monitor real-time MongoDB Atlas persistence, Cloudinary CDN assets, Brevo SMTP relays,
              YouTube API v3 publishing pipelines, and active workspace telemetry.
            </p>
          </div>

          {/* Action Feedback Banner */}
          {loading && !data ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--vms-cyan)" }}>
              <div className="vms-pulse-dot" style={{ margin: "0 auto 12px", width: 12, height: 12 }} />
              <span>Connecting to central telemetry &amp; MongoDB Atlas...</span>
            </div>
          ) : null}

          {actionFeedback ? (
            <div
              style={{
                background: "rgba(34, 211, 238, 0.12)",
                border: "1px solid var(--vms-cyan)",
                borderRadius: 8,
                padding: "12px 18px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#F8FAFC",
              }}
            >
              <span>{actionFeedback}</span>
              <button
                type="button"
                className="vms-btn vms-btn-ghost"
                style={{ padding: "4px 8px", fontSize: 11 }}
                onClick={() => setActionFeedback(null)}
              >
                Dismiss
              </button>
            </div>
          ) : null}

          {/* Top 6 KPI Health Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            {/* MongoDB Atlas Card */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Database size={18} color="#10B981" />
                  <strong>MongoDB Atlas</strong>
                </div>
                <span className={data?.system.mongo.connected ? "vms-cyan-tag" : "vms-pack-bonus"}>
                  {data?.system.mongo.connected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 12 }}>
                Database: <strong>{data?.system.mongo.database || "arioFinance"}</strong>
                {data?.system.mongo.pingMs ? ` (${data.system.mongo.pingMs}ms latency)` : ""}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  type="button"
                  className="vms-btn vms-btn-outline"
                  style={{ width: "100%", padding: "6px 10px", fontSize: 12, justifyContent: "center" }}
                  onClick={handleSyncMongo}
                  disabled={syncingMongo}
                >
                  <RefreshCw size={13} className={syncingMongo ? "vms-spin" : ""} />
                  <span>{syncingMongo ? "Syncing..." : "Sync DB Now"}</span>
                </button>
              </div>
            </div>

            {/* Cloudinary CDN Card */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Cloud size={18} color="#3677FF" />
                  <strong>Cloudinary CDN</strong>
                </div>
                <span className={data?.system.cloudinary.connected ? "vms-cyan-tag" : "vms-pack-bonus"}>
                  {data?.system.cloudinary.connected ? "ACTIVE" : "PENDING"}
                </span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 12 }}>
                Cloud Name: <strong>{data?.system.cloudinary.cloudName || "deekt4ncx"}</strong>
              </p>
              <button
                type="button"
                className="vms-btn vms-btn-outline"
                style={{ width: "100%", padding: "6px 10px", fontSize: 12, justifyContent: "center" }}
                onClick={handleTestCloudinary}
              >
                <Cloud size={13} />
                <span>Test Asset Upload</span>
              </button>
            </div>

            {/* Brevo SMTP Card */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={18} color="#C4B5FD" />
                  <strong>Brevo SMTP</strong>
                </div>
                <span className="vms-cyan-tag">CONFIGURED</span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 8, fontSize: 12 }}>
                From: <strong>{data?.system.smtp.from || "ArionexTech Software"}</strong>
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="recipient@domain.com"
                  style={{
                    background: "#090B18",
                    border: "1px solid var(--vms-border)",
                    borderRadius: 6,
                    padding: "6px 10px",
                    color: "#F8FAFC",
                    fontSize: 12,
                    flex: 1,
                  }}
                />
                <button
                  type="button"
                  className="vms-btn vms-btn-outline"
                  style={{ padding: "6px 10px", fontSize: 12 }}
                  onClick={handleTestEmail}
                  title="Send diagnostic email"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>

            {/* Razorpay Billing Card */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={18} color="#8247FF" />
                  <strong>Razorpay Gateway</strong>
                </div>
                <span className="vms-cyan-tag">TEST MODE</span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 12 }}>
                Key ID: <strong>{data?.system.razorpay.keyId || "rzp_test_..."}</strong>
              </p>
              <div className="vms-mono-tag" style={{ fontSize: 11, color: "var(--vms-lavender)" }}>
                INR Checkout · Webhook Signatures Active
              </div>
            </div>

            {/* Remotion 30 FPS Compositor */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Cpu size={18} color="#22D3EE" />
                  <strong>Remotion Engine</strong>
                </div>
                <span className="vms-cyan-tag">ONLINE (30 FPS)</span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 12 }}>
                Studio Port: <strong>3000</strong> · Faststart MP4 Relocation
              </p>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="vms-btn vms-btn-outline"
                style={{ width: "100%", padding: "6px 10px", fontSize: 12, justifyContent: "center", textDecoration: "none" }}
              >
                <span>Open Remotion Studio</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* YouTube Data API v3 OAuth Card */}
            <div className="vms-price-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tv size={18} color="#FF0033" />
                  <strong>YouTube API v3</strong>
                </div>
                <span className={data?.system.youtubeOAuth.configured ? "vms-cyan-tag" : "vms-pack-bonus"}>
                  {data?.system.youtubeOAuth.configured ? "OAUTH READY" : "SETUP NEEDED"}
                </span>
              </div>
              <p className="vms-muted-sm" style={{ marginBottom: 12, fontSize: 12 }}>
                OAuth Redirect: <strong>/api/youtube/oauth/callback</strong>
              </p>
              <div className="vms-mono-tag" style={{ fontSize: 11, color: "var(--vms-lavender)" }}>
                Multi-Channel AES-256-GCM Guard Active
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--vms-border)", paddingBottom: 12, marginBottom: 24, overflowX: "auto" }}>
            {[
              { id: "overview", label: "Studio Overview", icon: Activity },
              { id: "database", label: `Workspaces & Users (${data?.counts.users ?? 0})`, icon: Users },
              { id: "media", label: `Rendered Media (${data?.counts.renderedVideos ?? 0})`, icon: Film },
              { id: "channels", label: `YouTube Channels (${data?.counts.totalChannels ?? 0})`, icon: Tv },
              { id: "billing", label: "Credit Transactions", icon: CreditCard },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`vms-btn ${isActive ? "vms-btn-primary" : "vms-btn-ghost"}`}
                  style={{ padding: "8px 16px", fontSize: 13, gap: 6 }}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview & Counts */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {[
                { label: "Total Registered Users", value: data?.counts.users ?? 0, color: "var(--vms-primary)" },
                { label: "Active Workspaces", value: data?.counts.workspaces ?? 0, color: "var(--vms-secondary)" },
                { label: "Video Projects Created", value: data?.counts.projects ?? 0, color: "var(--vms-cyan)" },
                { label: "30 FPS Videos Rendered", value: data?.counts.renderedVideos ?? 0, color: "#10B981" },
                { label: "YouTube Channels", value: data?.counts.totalChannels ?? 0, color: "#FF0033" },
                { label: "Publishing Jobs Processed", value: data?.counts.publishingJobs ?? 0, color: "#F59E0B" },
                { label: "Total Circulating Credits", value: data?.counts.circulatingCredits ?? 0, color: "var(--vms-lavender)" },
              ].map((stat) => (
                <div key={stat.label} className="vms-price-card" style={{ padding: 18 }}>
                  <span className="vms-mono-tag">{stat.label}</span>
                  <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: 8, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Users & Workspaces */}
          {activeTab === "database" && (
            <div className="vms-price-card" style={{ padding: 24, overflowX: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Workspaces &amp; Real MongoDB Accounts</h3>
                <span className="vms-cyan-tag">COLLECTION: vms_workspaces</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--vms-border)", color: "var(--vms-text-secondary)" }}>
                    <th style={{ padding: "10px 12px" }}>Workspace Name</th>
                    <th style={{ padding: "10px 12px" }}>Plan Tier</th>
                    <th style={{ padding: "10px 12px" }}>Credits</th>
                    <th style={{ padding: "10px 12px" }}>Channels Allowed</th>
                    <th style={{ padding: "10px 12px" }}>Status</th>
                    <th style={{ padding: "10px 12px" }}>Last Synced</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.workspaces || []).map((ws) => (
                    <tr key={ws.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{ws.name}</td>
                      <td style={{ padding: "12px" }}>
                        <span className="vms-purple-pill" style={{ fontSize: 10 }}>{ws.planId.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: 700, color: "var(--vms-cyan)" }}>
                        {ws.creditsBalance}
                      </td>
                      <td style={{ padding: "12px" }}>{ws.channelsLimit}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ color: "#10B981" }}>● {ws.subscriptionStatus}</span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--vms-text-secondary)", fontSize: 11 }}>
                        {new Date(ws.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Rendered Media */}
          {activeTab === "media" && (
            <div className="vms-price-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Rendered 30 FPS Videos &amp; Cloudinary CDN</h3>
                <span className="vms-cyan-tag">COLLECTION: vms_rendered_videos</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                {(data?.renderedVideos || []).map((vid) => (
                  <div
                    key={vid._id}
                    style={{
                      background: "#090B18",
                      border: "1px solid var(--vms-border)",
                      borderRadius: 8,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 14 }}>{vid.title}</strong>
                      <span className="vms-cyan-tag">{vid.resolution}</span>
                    </div>
                    <div className="vms-mono-tag" style={{ fontSize: 11 }}>
                      Duration: {vid.durationSec}s · FPS: {vid.fps} · Size: {vid.fileSizeMb} MB
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      <a
                        href={vid.mp4Url}
                        target="_blank"
                        rel="noreferrer"
                        className="vms-btn vms-btn-primary"
                        style={{ padding: "6px 12px", fontSize: 12, textDecoration: "none" }}
                      >
                        Play Video
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: YouTube Channels */}
          {activeTab === "channels" && (
            <div className="vms-price-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Connected YouTube Channels &amp; Scheduled Slots</h3>
                <span className="vms-cyan-tag">COLLECTION: vms_youtube_channels</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                {(data?.channels || []).map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      background: "#090B18",
                      border: `1px solid ${ch.connected ? "var(--vms-cyan)" : "var(--vms-border)"}`,
                      borderRadius: 8,
                      padding: 18,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <Tv size={18} color="#FF0033" />
                      <strong>{ch.channelTitle}</strong>
                    </div>
                    <p className="vms-muted-sm" style={{ marginBottom: 10 }}>
                      Niche: <strong>{ch.niche}</strong> · Daily Target: {ch.dailyLimit} video/day
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span className={ch.connected ? "vms-pulse-dot" : ""} />
                      <span style={{ color: ch.connected ? "#10B981" : "var(--vms-text-secondary)" }}>
                        {ch.connected ? "OAuth 2.0 Connected" : "Ready for Authorization"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Credit Transactions */}
          {activeTab === "billing" && (
            <div className="vms-price-card" style={{ padding: 24, overflowX: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Credit Ledger &amp; Plan Invoices</h3>
                <span className="vms-cyan-tag">COLLECTION: vms_credit_transactions</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--vms-border)", color: "var(--vms-text-secondary)" }}>
                    <th style={{ padding: "10px 12px" }}>Transaction ID</th>
                    <th style={{ padding: "10px 12px" }}>Credits Added / Deducted</th>
                    <th style={{ padding: "10px 12px" }}>Balance After</th>
                    <th style={{ padding: "10px 12px" }}>Reason</th>
                    <th style={{ padding: "10px 12px" }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.creditTransactions || []).map((tx) => (
                    <tr key={tx._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={{ padding: "12px", fontFamily: "JetBrains Mono", fontSize: 11 }}>{tx._id}</td>
                      <td style={{ padding: "12px", fontWeight: 700, color: tx.amount >= 0 ? "#10B981" : "#EF4444" }}>
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{tx.balanceAfter}</td>
                      <td style={{ padding: "12px" }}>{tx.reason}</td>
                      <td style={{ padding: "12px", color: "var(--vms-text-secondary)", fontSize: 11 }}>
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
