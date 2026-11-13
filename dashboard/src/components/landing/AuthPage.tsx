import React, { useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import { BrandLogo } from "../BrandLogo";

type AuthPageProps = {
  mode: "login" | "signup";
  oauthConfigured: boolean;
  appDomain: string;
  onNavigate: (path: string) => void;
  onAuthSuccess: () => Promise<void>;
};

export const AuthPage: React.FC<AuthPageProps> = ({
  mode,
  oauthConfigured,
  appDomain,
  onNavigate,
  onAuthSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startGoogleOAuth() {
    const returnTo = `${window.location.origin}/dashboard`;
    window.location.href = `/api/auth/google/start?redirect=1&returnTo=${encodeURIComponent(returnTo)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const endpoint =
        mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          mode === "signup" ? { name, email, password } : { email, password },
        ),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErrorMsg(data.error || "Authentication failed. Please verify your details.");
        return;
      }
      await onAuthSuccess();
      onNavigate("/dashboard");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vms-auth-shell">
      <div className="vms-auth-glow vms-auth-glow-a" aria-hidden="true" />
      <div className="vms-auth-glow vms-auth-glow-b" aria-hidden="true" />

      <div className="vms-auth-topbar">
        <button
          type="button"
          className="vms-btn vms-btn-ghost"
          onClick={() => onNavigate("/")}
        >
          <ArrowLeft size={16} />
          <span>Back to {appDomain}</span>
        </button>
      </div>

      <main className="vms-auth-card" aria-labelledby="auth-heading">
        <BrandLogo size={38} animate showWordmark subtitle="AI Creative & Motion Studio" />

        <h1 id="auth-heading" className="vms-auth-title">
          {mode === "signup"
            ? "Launch your Creative Studio"
            : "Welcome back to ViralMotionStudio"}
        </h1>
        <p className="vms-auth-sub">
          {mode === "signup"
            ? "Create dynamic 3D motion videos, neural voiceovers, and multi-channel YouTube automation."
            : "Sign in to direct renders, YouTube channels, and automated schedules."}
        </p>

        <button
          type="button"
          className="vms-btn vms-btn-google"
          onClick={startGoogleOAuth}
          disabled={!oauthConfigured}
        >
          <span>Continue with Google</span>
        </button>

        {!oauthConfigured ? (
          <p className="vms-auth-hint">
            Google Sign-In is not configured on this server yet — email access is active below.
          </p>
        ) : null}

        <div className="vms-divider">
          <span>or continue with email</span>
        </div>

        <form className="vms-auth-form" onSubmit={(e) => void handleSubmit(e)}>
          {mode === "signup" ? (
            <label className="vms-field">
              <span>Studio or Full Name</span>
              <div className="vms-input-wrap">
                <User size={15} className="vms-input-icon" />
                <input
                  type="text"
                  placeholder="Alex Mercer / Future Labs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </label>
          ) : null}

          <label className="vms-field">
            <span>Work Email</span>
            <div className="vms-input-wrap">
              <Mail size={15} className="vms-input-icon" />
              <input
                type="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label className="vms-field">
            <span>Password</span>
            <div className="vms-input-wrap">
              <Lock size={15} className="vms-input-icon" />
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </label>

          {errorMsg ? (
            <div className="vms-error-box" role="alert">
              {errorMsg}
            </div>
          ) : null}

          <button
            type="submit"
            className="vms-btn vms-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={submitting}
          >
            {submitting
              ? "Authenticating..."
              : mode === "signup"
                ? "Launch Creative Workspace"
                : "Sign In to Studio"}
          </button>
        </form>

        <div className="vms-auth-switch">
          {mode === "signup" ? (
            <>
              <span>Already have an account?</span>
              <button type="button" onClick={() => onNavigate("/login")}>
                Sign In
              </button>
            </>
          ) : (
            <>
              <span>New to ViralMotionStudio?</span>
              <button type="button" onClick={() => onNavigate("/signup")}>
                Start Creating for Free
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
