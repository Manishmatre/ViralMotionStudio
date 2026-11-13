import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Code2,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Film,
  History,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Tv,
  Wand2,
  X,
} from "lucide-react";
import { CREDIT_PACKS, getRenderCreditCost, PLANS } from "../../server/config/plans";
import type {
  PublishingJobDoc,
  PublishingMode,
  RenderedVideoDoc,
  VideoProjectDoc,
  YoutubeChannelDoc,
} from "../../server/types/automation";
import { BillingView } from "./components/BillingView";
import { BrandLogo } from "./components/BrandLogo";
import { DeveloperView } from "./components/DeveloperView";
import { StudioLoader } from "./components/StudioLoader";
import { AuthPage } from "./components/landing/AuthPage";
import { HomePage } from "./pages/HomePage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ShowcasePage } from "./pages/ShowcasePage";
import { PricingPage } from "./pages/PricingPage";
import { FaqPage } from "./pages/FaqPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PortalPage } from "./pages/PortalPage";
import {
  formatCreditCapacity,
  VIRAL_TEMPLATES,
  type ViralTemplate,
} from "./config/viralTemplates";
import type { AuthMeResponse, DemoVideoItem, PublicShowcaseResponse, StudioState } from "./types/saas";

type TabKey =
  | "overview"
  | "channels"
  | "generator"
  | "library"
  | "thumbnails"
  | "seo"
  | "scheduler"
  | "history"
  | "billing"
  | "developer"
  | "portal";

type NavItem = {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
};

function getNavGroups(role?: string): { label: string; items: NavItem[] }[] {
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: "Creation Studio",
      items: [
        { key: "overview", label: "Studio Overview", icon: <LayoutDashboard size={16} /> },
        { key: "generator", label: "AI Video Creator", icon: <Wand2 size={16} /> },
        { key: "library", label: "Video Library", icon: <Film size={16} /> },
        { key: "thumbnails", label: "Thumbnail Studio", icon: <Image size={16} /> },
        { key: "seo", label: "SEO Metadata", icon: <Search size={16} /> },
      ],
    },
    {
      label: "YouTube & Automation",
      items: [
        { key: "channels", label: "Connected Channels", icon: <Tv size={16} /> },
        { key: "scheduler", label: "Scheduler (IST)", icon: <CalendarClock size={16} /> },
        { key: "history", label: "Publishing History", icon: <History size={16} /> },
      ],
    },
    {
      label: "Account & Scale",
      items: [
        { key: "billing", label: "Billing & Credits", icon: <CreditCard size={16} /> },
        { key: "developer", label: "API & Live Domain", icon: <Code2 size={16} /> },
      ],
    },
  ];

  if (role === "owner") {
    groups[2].items.push({
      key: "portal",
      label: "Platform Portal",
      icon: <ShieldCheck size={16} />,
    });
  }

  return groups;
}

function getChannelDisplay(
  channels: readonly YoutubeChannelDoc[],
  channelKey: string,
): {
  title: string;
  initial: string;
  color: string;
  connected: boolean;
  niche: string;
} {
  const ch = channels.find((c) => c.channelKey === channelKey);
  if (!ch) {
    return {
      title: "Studio Channel",
      initial: "S",
      color: "#8247FF",
      connected: false,
      niche: "Business stories",
    };
  }
  return {
    title: ch.channelTitle,
    initial: ch.channelTitle.trim().charAt(0).toUpperCase() || "C",
    color: ch.brandingColor || "#8247FF",
    connected: ch.connected,
    niche: ch.niche,
  };
}

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(
    () => window.location.pathname || "/",
  );
  const [auth, setAuth] = useState<AuthMeResponse>({
    authenticated: false,
    oauthConfigured: true,
    stripeConfigured: false,
    appDomain: "viralmotionstudio.toolio.tech",
    plans: Object.values(PLANS),
    creditPacks: [...CREDIT_PACKS],
  });
  const [authChecked, setAuthChecked] = useState(false);
  const [state, setState] = useState<StudioState | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [expandedScriptProjectId, setExpandedScriptProjectId] = useState<string | null>(null);
  const [activeSceneByProject, setActiveSceneByProject] = useState<Record<string, number>>({});
  const [busyMsg, setBusyMsg] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // AI Idea Generator form
  const [niche, setNiche] = useState("Business stories");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<"short" | "long-form">("short");
  const [channelKey, setChannelKey] = useState("channel_A");

  // Add channel form
  const [newChannelTitle, setNewChannelTitle] = useState("");
  const [newChannelNiche, setNewChannelNiche] = useState("Motivational stories");
  const [newChannelFormat, setNewChannelFormat] = useState<"short" | "long-form">("short");
  const [newChannelTime, setNewChannelTime] = useState("18:00");

  // Selected project for SEO Manager
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoTags, setSeoTags] = useState("");

  const navigate = useCallback((nextPath: string) => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setPathname(nextPath);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname || "/");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const [demoVideos, setDemoVideos] = useState<DemoVideoItem[]>([]);
  const [systemHealthy, setSystemHealthy] = useState(true);

  useEffect(() => {
    fetch("/api/public/showcase")
      .then((res) => res.json())
      .then((data: PublicShowcaseResponse) => {
        if (Array.isArray(data.demoVideos)) {
          setDemoVideos(data.demoVideos);
        }
      })
      .catch(() => {});

    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { ok?: boolean }) => {
        if (typeof data.ok === "boolean") {
          setSystemHealthy(data.ok);
        }
      })
      .catch(() => setSystemHealthy(false));
  }, []);

  // Pre-load cloned style if user clicked "Clone This Style" from landing showcase
  useEffect(() => {
    if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/app")) return;
    try {
      const tplId = window.localStorage.getItem("vms_selected_template");
      if (tplId) {
        const found = VIRAL_TEMPLATES.find((t) => t.id === tplId);
        if (found) {
          setNiche(found.niche);
          setTopic(found.prompt);
          setFormat(found.format);
          setTab("generator");
        }
        window.localStorage.removeItem("vms_selected_template");
      }
    } catch {
      // Ignore storage failures
    }
  }, [pathname]);

  // Synchronize authenticated studio sub-path with tab
  useEffect(() => {
    if (pathname === "/app/projects" || pathname === "/dashboard/projects" || pathname === "/dashboard/library") {
      setTab("library");
    } else if (
      pathname === "/app/video-studio" ||
      pathname === "/app/voiceovers" ||
      pathname === "/dashboard/generator"
    ) {
      setTab("generator");
    } else if (pathname === "/app/channels" || pathname === "/dashboard/channels") {
      setTab("channels");
    } else if (pathname === "/app/publishing" || pathname === "/dashboard/history") {
      setTab("history");
    } else if (pathname === "/app/scheduler" || pathname === "/dashboard/scheduler") {
      setTab("scheduler");
    } else if (pathname === "/app/settings" || pathname === "/dashboard/billing") {
      setTab("billing");
    } else if (pathname === "/app/developer" || pathname === "/dashboard/developer") {
      setTab("developer");
    } else if (pathname === "/app" || pathname === "/app/dashboard" || pathname === "/dashboard") {
      setTab("overview");
    }
  }, [pathname]);

  const handleSelectTab = useCallback((nextTab: TabKey) => {
    setTab(nextTab);
    const pathMap: Record<TabKey, string> = {
      overview: "/app/dashboard",
      generator: "/app/video-studio",
      library: "/app/projects",
      thumbnails: "/app/projects",
      seo: "/app/projects",
      channels: "/app/channels",
      scheduler: "/app/scheduler",
      history: "/app/publishing",
      billing: "/app/settings",
      developer: "/app/settings",
      portal: "/portal",
    };
    const target = pathMap[nextTab] || "/app";
    if (window.location.pathname !== target) {
      window.history.pushState({}, "", target);
    }
  }, []);

  const refresh = useCallback(async () => {
    const meRes = await fetch("/api/auth/me", { credentials: "include" });
    const meData = (await meRes.json()) as AuthMeResponse;
    setAuth(meData);
    setAuthChecked(true);

    if (!meData.authenticated) {
      setState(null);
      return;
    }

    const res = await fetch("/api/state", { credentials: "include" });
    if (!res.ok) return;
    const data = (await res.json()) as StudioState;
    setState(data);
    if (data.channels.length > 0 && !data.channels.some((c) => c.channelKey === channelKey)) {
      setChannelKey(data.channels[0].channelKey);
    }
    if (!selectedProjectId && data.projects.length > 0) {
      const p = data.projects[0];
      setSelectedProjectId(p._id);
      setSeoTitle(p.seo.title);
      setSeoDescription(p.seo.description);
      setSeoTags(p.seo.tags.join(", "));
    }
  }, [channelKey, selectedProjectId]);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, 6000);
    return () => clearInterval(timer);
  }, [refresh]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setState(null);
    await refresh();
    navigate("/");
  }

  async function updatePublishingMode(mode: PublishingMode) {
    setErrorBanner(null);
    setBusyMsg(`Switching publishing mode to ${mode}...`);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publishingMode: mode }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Unable to switch publishing mode");
        return;
      }
      await refresh();
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleToggleSchedule(scheduleId: string, currentlyEnabled: boolean) {
    setErrorBanner(null);
    setBusyMsg(currentlyEnabled ? "Pausing schedule slot..." : "Enabling schedule slot...");
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ enabled: !currentlyEnabled }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Unable to update schedule slot");
        return;
      }
      await refresh();
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleConnectChannel(chKey: string) {
    const res = await fetch(
      `/api/youtube/oauth/start?channelKey=${encodeURIComponent(chKey)}`,
      { credentials: "include" },
    );
    const data = (await res.json()) as { configured?: boolean; authUrl?: string; error?: string };
    if (!res.ok || !data.configured || !data.authUrl) {
      setErrorBanner(
        data.error || "Google OAuth client credentials are not configured.",
      );
      return;
    }
    window.open(data.authUrl, "_blank", "noopener,noreferrer");
  }

  async function handleAddChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!newChannelTitle.trim()) return;
    setErrorBanner(null);
    setBusyMsg("Adding YouTube channel...");
    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          channelTitle: newChannelTitle,
          niche: newChannelNiche,
          defaultFormat: newChannelFormat,
          timeIst: newChannelTime,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Failed to add channel");
        return;
      }
      setNewChannelTitle("");
      await refresh();
    } finally {
      setBusyMsg(null);
    }
  }

  async function generateProject(params: {
    niche: string;
    topic: string;
    format: "short" | "long-form";
    channelKey: string;
  }) {
    setErrorBanner(null);
    setBusyMsg("Directing AI script, visual scene filmstrip & SEO package...");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Generation blocked by plan quota");
        return;
      }
      setTopic("");
      await refresh();
      setTab("library");
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleGenerateIdea(e: React.FormEvent) {
    e.preventDefault();
    await generateProject({ niche, topic, format, channelKey });
  }

  async function handleCloneTemplate(tpl: ViralTemplate) {
    await generateProject({
      niche: tpl.niche,
      topic: tpl.prompt,
      format: tpl.format,
      channelKey,
    });
  }

  async function handleRenderVideo(projectId: string) {
    setErrorBanner(null);
    setOpenMenuProjectId(null);
    setBusyMsg("Rendering 3D motion scenes, voiceover audio & HD thumbnail...");
    try {
      const res = await fetch(`/api/render/${projectId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Render failed");
        return;
      }
      await refresh();
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleRenderThumbnail(projectId: string) {
    setErrorBanner(null);
    setOpenMenuProjectId(null);
    setBusyMsg("Designing HD YouTube thumbnail...");
    try {
      const res = await fetch(`/api/thumbnail/${projectId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setErrorBanner(body.error || "Thumbnail render failed");
        return;
      }
      await refresh();
    } finally {
      setBusyMsg(null);
    }
  }

  async function handleQueueAndPublish(project: VideoProjectDoc, video: RenderedVideoDoc) {
    setErrorBanner(null);
    setOpenMenuProjectId(null);
    setBusyMsg(`Queueing & uploading ${project.title}...`);
    try {
      const enqueueRes = await fetch("/api/publish/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          channelKey: project.channelKey,
          projectId: project._id,
          videoId: video._id,
          publishAt: project.seo.publishAtIso ?? new Date(Date.now() + 3600_000).toISOString(),
        }),
      });
      const job = (await enqueueRes.json()) as PublishingJobDoc;
      await fetch(`/api/publish/run/${job._id}`, {
        method: "POST",
        credentials: "include",
      });
      await refresh();
      setTab("history");
    } finally {
      setBusyMsg(null);
    }
  }

  function openProjectSeo(project: VideoProjectDoc) {
    setSelectedProjectId(project._id);
    setSeoTitle(project.seo.title);
    setSeoDescription(project.seo.description);
    setSeoTags(project.seo.tags.join(", "));
    setOpenMenuProjectId(null);
    setTab("seo");
  }

  async function handleSaveSeo(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProjectId) return;
    setBusyMsg("Saving SEO metadata...");
    await fetch(`/api/projects/${selectedProjectId}/seo`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: seoTitle,
        description: seoDescription,
        tags: seoTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    await refresh();
    setBusyMsg(null);
  }

  useEffect(() => {
    if (!authChecked) return;
    if ((pathname === "/login" || pathname === "/signup" || pathname === "/register") && auth.authenticated && state) {
      navigate("/app");
    } else if ((pathname.startsWith("/dashboard") || pathname.startsWith("/app")) && !auth.authenticated) {
      navigate("/login");
    }
  }, [authChecked, auth, state, pathname, navigate]);

  const isAppRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/app");

  if (isAppRoute && !authChecked) {
    return <StudioLoader label="Restoring Creative Studio..." />;
  }

  if (isAppRoute && !auth.authenticated) {
    return (
      <AuthPage
        mode="login"
        oauthConfigured={auth.oauthConfigured}
        appDomain={auth.appDomain}
        onNavigate={navigate}
        onAuthSuccess={refresh}
      />
    );
  }

  if (pathname === "/login") {
    if (auth.authenticated) {
      navigate("/app");
      return <StudioLoader label="Opening Creative Studio..." />;
    }
    return (
      <AuthPage
        mode="login"
        oauthConfigured={auth.oauthConfigured}
        appDomain={auth.appDomain}
        onNavigate={navigate}
        onAuthSuccess={refresh}
      />
    );
  }

  if (pathname === "/signup" || pathname === "/register") {
    if (auth.authenticated) {
      navigate("/app");
      return <StudioLoader label="Opening Creative Studio..." />;
    }
    return (
      <AuthPage
        mode="signup"
        oauthConfigured={auth.oauthConfigured}
        appDomain={auth.appDomain}
        onNavigate={navigate}
        onAuthSuccess={refresh}
      />
    );
  }

  if (pathname === "/features") {
    return (
      <FeaturesPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/how-it-works") {
    return (
      <HowItWorksPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/showcase") {
    return (
      <ShowcasePage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        demoVideos={demoVideos}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/pricing") {
    return (
      <PricingPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        plans={auth.plans}
        creditPacks={auth.creditPacks}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/faq") {
    return (
      <FaqPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/about") {
    return (
      <AboutPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/contact") {
    return (
      <ContactPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (pathname === "/portal") {
    if (!auth.authenticated || auth.user.role !== "owner") {
      return (
        <AuthPage
          mode="login"
          oauthConfigured={auth.oauthConfigured}
          appDomain={auth.appDomain}
          onNavigate={navigate}
          onAuthSuccess={refresh}
        />
      );
    }
    return (
      <PortalPage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        onNavigate={navigate}
      />
    );
  }

  if (!isAppRoute || !auth.authenticated || !state) {
    return (
      <HomePage
        authenticated={auth.authenticated}
        appDomain={auth.appDomain}
        systemHealthy={systemHealthy}
        plans={auth.plans}
        creditPacks={auth.creditPacks}
        demoVideos={demoVideos}
        onNavigate={navigate}
      />
    );
  }

  const userInitial = (state.user.name || state.user.email || "C").charAt(0).toUpperCase();
  const creditSummary = formatCreditCapacity(state.workspace.creditsBalance);

  return (
    <div className="layout">
      <div
        className={drawerOpen ? "drawer-backdrop open" : "drawer-backdrop"}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className={drawerOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <BrandLogo size={32} animate showWordmark subtitle={state.appDomain} />
          {drawerOpen ? (
            <button
              type="button"
              className="mobile-drawer-btn"
              style={{ marginLeft: "auto" }}
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <nav className="nav" aria-label="Studio workspace navigation">
          {getNavGroups(state.user.role).map((group) => (
            <div key={group.label} className="nav-group">
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={tab === item.key ? "active" : ""}
                  onClick={() => {
                    handleSelectTab(item.key);
                    setDrawerOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn secondary"
            style={{ width: "100%", marginBottom: 6 }}
            onClick={() => navigate("/")}
          >
            <ExternalLink size={14} />
            <span>View Public Showcase</span>
          </button>
          <div className="pill purple" style={{ alignSelf: "flex-start" }}>
            {state.workspace.planId.toUpperCase()} · {state.workspace.creditsBalance} CREDITS
          </div>
          <div className="muted" style={{ fontSize: 11.5 }}>
            {creditSummary} remaining
          </div>
          <div className="pill green" style={{ fontSize: 11 }}>
            <span className="status-dot online" />
            <span>System Operational</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar card">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-drawer-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <strong style={{ fontSize: 15 }}>{state.workspace.name}</strong>
              <div className="muted">
                {state.channels.length}/{state.workspace.channelsLimit} channels ·{" "}
                {state.workspace.dailyPublishLimit}/day target · {creditSummary}
              </div>
            </div>
          </div>

          <div className="row">
            <button
              type="button"
              className="btn sm"
              onClick={() => setTab("generator")}
            >
              <Plus size={15} />
              <span>New AI Video</span>
            </button>

            <button
              type="button"
              className="pill purple"
              style={{ cursor: "pointer" }}
              onClick={() => setTab("billing")}
              title={`1 Short = 1 credit · 1 Long-form = 3 credits (${creditSummary})`}
            >
              {state.workspace.creditsBalance} Credits · ~{state.workspace.creditsBalance} Shorts
            </button>

            <div className="row" style={{ gap: 8 }}>
              {state.user.avatarUrl ? (
                <img
                  src={state.user.avatarUrl}
                  alt={state.user.name}
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <span className="avatar-circle" aria-hidden="true">
                  {userInitial}
                </span>
              )}
              <div style={{ fontSize: 12 }}>
                <strong>{state.user.name}</strong>
                <div className="muted" style={{ fontSize: 11 }}>
                  {state.user.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn secondary sm"
              onClick={() => void handleLogout()}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {busyMsg ? (
          <div className="card" style={{ borderColor: "var(--vms-purple)", padding: "14px 18px" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong style={{ color: "var(--vms-lavender)" }}>{busyMsg}</strong>
              <span className="pill purple">
                <span className="status-dot pulse-cyan" />
                Processing
              </span>
            </div>
            <div className="progress-banner-track">
              <div className="progress-banner-fill" />
            </div>
            <div className="skeleton-line" style={{ width: "68%" }} />
          </div>
        ) : null}

        {errorBanner ? (
          <div
            className="card"
            style={{
              borderColor: "#ef4444",
              padding: "12px 16px",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong style={{ color: "#f87171", fontSize: 13 }}>{errorBanner}</strong>
            <div className="row">
              <button type="button" className="btn sm" onClick={() => setTab("billing")}>
                Upgrade Plan
              </button>
              <button
                type="button"
                className="btn secondary sm"
                onClick={() => setErrorBanner(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        {tab === "overview" ? (
          <>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>AI Production &amp; Publishing Overview</h2>
                <span className="muted">
                  Obsidian Studio · {state.settings.dailyProductionTarget} videos/day ·{" "}
                  {state.settings.monthlyTarget} videos/month · {state.settings.formatScope}
                </span>
              </div>
              <div className="row">
                {(["manual", "semi-automatic", "fully-automatic"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={state.settings.publishingMode === m ? "btn sm" : "btn secondary sm"}
                    onClick={() => void updatePublishingMode(m)}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid">
              <div
                className="card vms-kpi-card"
                style={{ "--kpi-accent": "linear-gradient(90deg, #8247FF, #22D3EE)" } as React.CSSProperties}
              >
                <span className="muted">Connected Channels</span>
                <div className="kpi">
                  {state.channels.length} / {state.workspace.channelsLimit}
                </div>
                <span className="pill cyan">{state.settings.channelMode} mode</span>
              </div>
              <div
                className="card vms-kpi-card"
                style={{ "--kpi-accent": "linear-gradient(90deg, #3677FF, #22D3EE)" } as React.CSSProperties}
              >
                <span className="muted">Daily / Monthly Target</span>
                <div className="kpi">
                  {state.settings.dailyProductionTarget} / {state.settings.monthlyTarget}
                </div>
                <span className="pill cyan">{state.settings.formatScope}</span>
              </div>
              <div
                className="card vms-kpi-card"
                style={{ "--kpi-accent": "linear-gradient(90deg, #34D399, #22D3EE)" } as React.CSSProperties}
              >
                <span className="muted">Videos Ready to Upload</span>
                <div className="kpi">{state.renderedVideos.length}</div>
                <span className="pill green">
                  <span className="status-dot rendered" />
                  <span>H.264 30 FPS Studio Mix</span>
                </span>
              </div>
              <div
                className="card vms-kpi-card"
                style={{ "--kpi-accent": "linear-gradient(90deg, #8247FF, #A78BFA)" } as React.CSSProperties}
              >
                <span className="muted">Render Credits Balance</span>
                <div className="kpi">{state.workspace.creditsBalance}</div>
                <span className="pill purple">{creditSummary} remaining</span>
              </div>
            </div>

            <div className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ margin: 0 }}>Daily IST Publishing Slots</h3>
                <span className="muted">Toggle individual daily release slots live</span>
              </div>
              <div className="grid">
                {state.schedules.map((sch) => {
                  const chInfo = getChannelDisplay(state.channels, sch.channelKey);
                  return (
                    <div key={sch._id} className="card" style={{ background: "rgba(9,9,14,0.8)" }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <strong style={{ color: chInfo.color }}>{sch.timeIst} IST</strong>
                        <span className="pill cyan">{sch.format}</span>
                      </div>
                      <div className="channel-badge">
                        <span
                          className="channel-avatar"
                          style={{ background: chInfo.color }}
                        >
                          {chInfo.initial}
                        </span>
                        <div>
                          <strong>{chInfo.title}</strong>
                          <div className="muted" style={{ fontSize: 11.5 }}>
                            {chInfo.niche} · {sch.category}
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ justifyContent: "space-between", marginTop: "auto" }}>
                        <span className={sch.enabled ? "pill green" : "pill slate"}>
                          <span className={sch.enabled ? "status-dot rendered" : "status-dot"} />
                          <span>{sch.enabled ? "Active Slot" : "Paused"}</span>
                        </span>
                        <button
                          type="button"
                          className="btn secondary sm"
                          onClick={() => void handleToggleSchedule(sch._id, sch.enabled)}
                        >
                          {sch.enabled ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                          <span>{sch.enabled ? "Pause" : "Resume"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        {tab === "channels" ? (
          <>
            <h2 style={{ margin: 0 }}>Connected YouTube Channels</h2>
            <div className="grid">
              {state.channels.map((ch) => (
                <div key={ch._id} className="card">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="channel-badge">
                      <span
                        className="channel-avatar"
                        style={{ background: ch.brandingColor || "#8247FF" }}
                      >
                        {ch.channelTitle.trim().charAt(0).toUpperCase() || "Y"}
                      </span>
                      <strong style={{ color: ch.brandingColor }}>{ch.channelTitle}</strong>
                    </div>
                    <span className={ch.connected ? "pill green" : "pill slate"}>
                      <span className={ch.connected ? "status-dot rendered" : "status-dot"} />
                      {ch.connected ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>YouTube Verified</span>
                        </>
                      ) : (
                        <span>Not Linked</span>
                      )}
                    </span>
                  </div>
                  <div className="muted">
                    Niche: <strong>{ch.niche}</strong> · Default Format:{" "}
                    <strong>{ch.defaultFormat}</strong>
                  </div>
                  <div className="muted">
                    OAuth Security:{" "}
                    {ch.hasToken
                      ? `AES-256-GCM Encrypted (${ch.oauthEmail ?? "Authorized"})`
                      : "Authorize via Google YouTube Data API v3"}
                  </div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => void handleConnectChannel(ch.channelKey)}
                  >
                    {ch.connected ? "Reconnect YouTube Channel" : "Connect YouTube (OAuth 2.0)"}
                  </button>
                </div>
              ))}
            </div>

            <form className="card" onSubmit={(e) => void handleAddChannel(e)}>
              <h3 style={{ margin: 0 }}>
                Add New Channel ({state.channels.length}/{state.workspace.channelsLimit} used)
              </h3>
              <div className="grid">
                <input
                  placeholder="Channel Title (e.g. Wealth Mindset)"
                  value={newChannelTitle}
                  onChange={(e) => setNewChannelTitle(e.target.value)}
                />
                <input
                  placeholder="Niche"
                  value={newChannelNiche}
                  onChange={(e) => setNewChannelNiche(e.target.value)}
                />
                <select
                  value={newChannelFormat}
                  onChange={(e) => setNewChannelFormat(e.target.value as "short" | "long-form")}
                >
                  <option value="short">Shorts (9:16 Vertical)</option>
                  <option value="long-form">Long-form (16:9 Widescreen)</option>
                </select>
                <input
                  placeholder="IST Slot (HH:mm)"
                  value={newChannelTime}
                  onChange={(e) => setNewChannelTime(e.target.value)}
                />
              </div>
              <button className="btn" type="submit" style={{ alignSelf: "flex-start" }}>
                Create Channel Slot
              </button>
            </form>
          </>
        ) : null}

        {tab === "generator" ? (
          <>
            <div className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ margin: 0 }}>Clone a Viral Motion Style</h2>
                  <span className="muted">
                    Launch a proven scene architecture &amp; storyboard in one click
                  </span>
                </div>
                <span className="pill purple">{creditSummary} remaining</span>
              </div>
              <div className="template-strip">
                {VIRAL_TEMPLATES.map((tpl) => (
                  <div key={tpl.id} className="template-card">
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <strong style={{ color: tpl.accentColor, fontSize: 13.5 }}>
                        {tpl.title}
                      </strong>
                      <span className="pill slate">{tpl.creditCost} cr</span>
                    </div>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {tpl.styleLabel} · {tpl.durationLabel}
                    </span>
                    <button
                      type="button"
                      className="btn secondary sm"
                      onClick={() => {
                        setNiche(tpl.niche);
                        setTopic(tpl.prompt);
                        setFormat(tpl.format);
                      }}
                    >
                      <Copy size={13} />
                      <span>Use Style Prompt</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form className="card" onSubmit={(e) => void handleGenerateIdea(e)}>
              <h2 style={{ margin: 0 }}>AI Video Idea, Script &amp; Storyboard Creator</h2>
              <div className="grid">
                <div>
                  <label className="muted">Target Channel</label>
                  <select value={channelKey} onChange={(e) => setChannelKey(e.target.value)}>
                    {state.channels.map((ch) => (
                      <option key={ch._id} value={ch.channelKey}>
                        {ch.channelTitle} ({ch.niche})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="muted">Content Niche</label>
                  <select value={niche} onChange={(e) => setNiche(e.target.value)}>
                    <option>Business stories</option>
                    <option>Billionaires &amp; money</option>
                    <option>AI &amp; technology</option>
                    <option>Geography explained</option>
                  </select>
                </div>
                <div>
                  <label className="muted">Video Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as "short" | "long-form")}
                  >
                    <option value="short">YouTube Shorts (1080×1920 · 1 Credit)</option>
                    <option value="long-form">Long-form Documentary (1920×1080 · 3 Credits)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="muted">Custom Topic (optional — leave blank for AI pick)</label>
                <input
                  placeholder="e.g. How NVIDIA Built a $3.3T Compute Monopoly"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <button className="btn" type="submit" style={{ alignSelf: "flex-start" }}>
                <Wand2 size={15} />
                <span>
                  Generate Storyboard &amp; SEO (Renders for {getRenderCreditCost(format)}{" "}
                  {getRenderCreditCost(format) === 1 ? "Credit" : "Credits"})
                </span>
              </button>
            </form>
          </>
        ) : null}

        {tab === "library" ? (
          <>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>Video Library &amp; Storyboard Filmstrips</h2>
                <span className="muted">
                  Clone a viral preset below or render directly with clear credit pricing
                </span>
              </div>
              <button type="button" className="btn sm" onClick={() => setTab("generator")}>
                <Plus size={14} />
                <span>Custom AI Video</span>
              </button>
            </div>

            {/* One-Click Clone Viral Style Gallery */}
            <div className="template-strip">
              {VIRAL_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="template-card">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong style={{ color: tpl.accentColor, fontSize: 13 }}>{tpl.title}</strong>
                    <span className="pill purple">{tpl.badge}</span>
                  </div>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {tpl.styleLabel}
                  </span>
                  <button
                    type="button"
                    className="btn secondary sm"
                    onClick={() => void handleCloneTemplate(tpl)}
                  >
                    <Copy size={13} />
                    <span>Clone Style Immediately</span>
                  </button>
                </div>
              ))}
            </div>

            {state.projects.length === 0 ? (
              <div className="card" style={{ alignItems: "flex-start" }}>
                <strong>No video projects in this workspace yet</strong>
                <span className="muted">
                  Click any viral style card above or build a custom prompt — generate AI scripts,
                  storyboard filmstrips, voiceovers, and YouTube SEO in under 30 seconds.
                </span>
                <button type="button" className="btn" onClick={() => setTab("generator")}>
                  <Wand2 size={15} />
                  <span>Create Your First AI Video</span>
                </button>
              </div>
            ) : null}

            <div className="grid">
              {state.projects.map((p) => {
                const video = state.renderedVideos.find((v) => v.projectId === p._id);
                const chInfo = getChannelDisplay(state.channels, p.channelKey);
                const creditCost = getRenderCreditCost(p.format);
                const activeSceneIdx = activeSceneByProject[p._id] ?? 0;
                const activeScene = p.scenes[activeSceneIdx] ?? p.scenes[0];
                const totalSceneSec = p.scenes.reduce((acc, s) => acc + s.durationSec, 0) || 1;
                const isMenuOpen = openMenuProjectId === p._id;
                const showScript = expandedScriptProjectId === p._id;

                return (
                  <div key={p._id} className="card">
                    {/* Branded Channel Identity + Status Badge */}
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div className="channel-badge">
                        <span
                          className="channel-avatar"
                          style={{ background: chInfo.color }}
                        >
                          {chInfo.initial}
                        </span>
                        <div>
                          <strong style={{ fontSize: 12.5 }}>{chInfo.title}</strong>
                          <div className="muted" style={{ fontSize: 11 }}>
                            {chInfo.connected ? "YouTube Verified" : chInfo.niche}
                          </div>
                        </div>
                      </div>

                      <span
                        className={
                          p.status === "published" || video
                            ? "pill green"
                            : "pill slate"
                        }
                      >
                        <span
                          className={
                            p.status === "published" || video
                              ? "status-dot rendered"
                              : "status-dot"
                          }
                        />
                        <span>{video ? (p.status === "published" ? "Published" : "Rendered") : "Draft"}</span>
                      </span>
                    </div>

                    <strong style={{ fontSize: 15 }}>{p.title}</strong>

                    {video ? (
                      <div className="video-stage-wrap">
                        <div className="video-stage-glow" aria-hidden="true" />
                        <video
                          src={video.mp4Url}
                          controls
                          poster={video.thumbnailUrl ?? undefined}
                          style={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            maxHeight: 260,
                            borderRadius: 12,
                            display: "block",
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Visual Storyboard Horizontal Filmstrip Preview */}
                    <div className="filmstrip-wrap">
                      <div className="filmstrip-header">
                        <span>{p.scenes.length} AI SCENES FILMSTRIP</span>
                        <span>
                          {p.format} · {Math.round(totalSceneSec)}s
                        </span>
                      </div>
                      <div className="filmstrip-track">
                        {p.scenes.map((sc, sIdx) => (
                          <button
                            key={sc.id}
                            type="button"
                            className={
                              activeSceneIdx === sIdx
                                ? "filmstrip-segment active"
                                : "filmstrip-segment"
                            }
                            style={{ flex: Math.max(1, sc.durationSec) }}
                            onClick={() =>
                              setActiveSceneByProject((prev) => ({ ...prev, [p._id]: sIdx }))
                            }
                          >
                            <strong>{sc.label}</strong>
                            <span>{sc.durationSec}s</span>
                          </button>
                        ))}
                      </div>
                      {activeScene ? (
                        <div className="filmstrip-caption">
                          <strong style={{ color: "var(--vms-cyan)" }}>Cue:</strong>{" "}
                          {activeScene.visualDirection}
                        </div>
                      ) : null}
                    </div>

                    {showScript ? (
                      <div className="storyboard-box">
                        <strong style={{ fontSize: 12, color: "var(--vms-lavender)" }}>
                          Opening Hook: {p.hook}
                        </strong>
                        <span className="muted">{p.script}</span>
                      </div>
                    ) : null}

                    {/* Standardized Action Hierarchy */}
                    <div className="action-row">
                      {video ? (
                        <button
                          type="button"
                          className="btn action-primary"
                          onClick={() => void handleQueueAndPublish(p, video)}
                        >
                          Upload to YouTube
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn action-primary"
                          onClick={() => void handleRenderVideo(p._id)}
                        >
                          Render Video ({creditCost} {creditCost === 1 ? "Credit" : "Credits"})
                        </button>
                      )}

                      <div className="action-icon-group">
                        {video ? (
                          <a
                            href={video.mp4Url}
                            download
                            className="icon-btn"
                            title="Download HD MP4"
                            aria-label="Download HD MP4"
                          >
                            <Download size={15} />
                          </a>
                        ) : null}

                        <button
                          type="button"
                          className="icon-btn"
                          title="More actions"
                          aria-label="More project actions"
                          onClick={() =>
                            setOpenMenuProjectId(isMenuOpen ? null : p._id)
                          }
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {isMenuOpen ? (
                          <div className="action-popover" role="menu">
                            <button
                              type="button"
                              onClick={() => void handleRenderVideo(p._id)}
                            >
                              <Film size={14} />
                              <span>
                                {video ? "Re-render" : "Render"} ({creditCost} cr)
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleRenderThumbnail(p._id)}
                            >
                              <Image size={14} />
                              <span>Generate HD Thumbnail</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openProjectSeo(p)}
                            >
                              <Search size={14} />
                              <span>Edit YouTube SEO</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedScriptProjectId(showScript ? null : p._id);
                                setOpenMenuProjectId(null);
                              }}
                            >
                              <Wand2 size={14} />
                              <span>{showScript ? "Hide Script" : "View Full Script"}</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {tab === "thumbnails" ? (
          <>
            <h2 style={{ margin: 0 }}>AI Thumbnail Studio</h2>
            <div className="grid">
              {state.projects.map((p) => {
                const video = state.renderedVideos.find((v) => v.projectId === p._id);
                const chInfo = getChannelDisplay(state.channels, p.channelKey);
                return (
                  <div key={p._id} className="card">
                    <div className="channel-badge">
                      <span
                        className="channel-avatar"
                        style={{ background: chInfo.color }}
                      >
                        {chInfo.initial}
                      </span>
                      <span className="muted">{chInfo.title}</span>
                    </div>
                    <strong>{p.title}</strong>
                    {video?.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={p.title}
                        style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
                      />
                    ) : (
                      <div className="muted">No thumbnail rendered yet.</div>
                    )}
                    <button
                      type="button"
                      className="btn"
                      onClick={() => void handleRenderThumbnail(p._id)}
                    >
                      Generate HD Thumbnail
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {tab === "seo" ? (
          <form className="card" onSubmit={(e) => void handleSaveSeo(e)}>
            <h2 style={{ margin: 0 }}>YouTube SEO Metadata Manager</h2>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedProjectId(id);
                const found = state.projects.find((p) => p._id === id);
                if (found) {
                  setSeoTitle(found.seo.title);
                  setSeoDescription(found.seo.description);
                  setSeoTags(found.seo.tags.join(", "));
                }
              }}
            >
              {state.projects.map((p) => {
                const chInfo = getChannelDisplay(state.channels, p.channelKey);
                return (
                  <option key={p._id} value={p._id}>
                    {p.title} · {chInfo.title}
                  </option>
                );
              })}
            </select>
            <label className="muted">YouTube Title</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <label className="muted">Description</label>
            <textarea
              rows={4}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
            <label className="muted">Tags (comma separated)</label>
            <input value={seoTags} onChange={(e) => setSeoTags(e.target.value)} />
            <button className="btn" type="submit" style={{ alignSelf: "flex-start" }}>
              Save SEO Metadata
            </button>
          </form>
        ) : null}

        {tab === "scheduler" ? (
          <div className="card">
            <h2 style={{ margin: 0 }}>Publishing Scheduler (IST Slots &amp; Upload Queue)</h2>
            <div className="grid">
              {state.jobs.map((job) => {
                const chInfo = getChannelDisplay(state.channels, job.channelKey);
                return (
                  <div key={job._id} className="card" style={{ background: "rgba(16, 19, 41, 0.72)" }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className={job.status === "published" ? "pill green" : "pill purple"}>
                        <span className={job.status === "published" ? "status-dot rendered" : "status-dot pulse-cyan"} />
                        <span>{job.status}</span>
                      </span>
                      <span className="pill cyan">{job.format}</span>
                    </div>
                    <strong>{job.metadata.title}</strong>
                    <div className="channel-badge">
                      <span
                        className="channel-avatar"
                        style={{ background: chInfo.color }}
                      >
                        {chInfo.initial}
                      </span>
                      <span className="muted">
                        {chInfo.title} · {new Date(job.publishAt).toLocaleString()}
                      </span>
                    </div>
                    {job.status !== "published" ? (
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          void fetch(`/api/publish/run/${job._id}`, {
                            method: "POST",
                            credentials: "include",
                          }).then(refresh)
                        }
                      >
                        Execute Upload Now
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === "history" ? (
          <div className="card">
            <h2 style={{ margin: 0 }}>Publishing History &amp; Links</h2>
            {state.history.length === 0 ? (
              <span className="muted">
                No uploads executed yet. Click &ldquo;Upload to YouTube&rdquo; in Video Library or
                Scheduler to publish or schedule.
              </span>
            ) : (
              <div className="grid">
                {state.history.map((item) => (
                  <div key={item._id} className="card" style={{ background: "rgba(16, 19, 41, 0.72)" }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <strong>{item.channelTitle}</strong>
                      <span className={item.simulated ? "pill purple" : "pill green"}>
                        <span className={item.simulated ? "status-dot pulse-cyan" : "status-dot rendered"} />
                        <span>{item.simulated ? "Preview Mode" : "Uploaded to YouTube"}</span>
                      </span>
                    </div>
                    <div>{item.title}</div>
                    <div className="muted">
                      Video ID: {item.youtubeVideoId} · Privacy: {item.privacyStatus}
                    </div>
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--vms-cyan)", fontSize: 13 }}
                    >
                      {item.youtubeUrl}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {tab === "billing" ? (
          <BillingView onWorkspaceUpdated={refresh} setBusyMsg={setBusyMsg} />
        ) : null}

        {tab === "developer" ? (
          <DeveloperView
            appDomain={state.appDomain}
            oauthConfigured={state.oauthConfigured}
            stripeConfigured={state.stripeConfigured}
          />
        ) : null}

        {tab === "portal" && state.user.role === "owner" ? (
          <PortalPage
            authenticated={auth.authenticated}
            appDomain={auth.appDomain}
            systemHealthy={systemHealthy}
            onNavigate={navigate}
          />
        ) : null}
      </main>
    </div>
  );
};
