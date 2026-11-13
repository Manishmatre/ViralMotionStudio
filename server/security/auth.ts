import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { readDb, updateDb } from "../db/store";
import type { UserDoc, WorkspaceDoc } from "../types/automation";
import { hashApiKey, signPayload, verifySignedPayload } from "./crypto";

export const SESSION_COOKIE_NAME = "vms_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export type SessionClaims = {
  readonly userId: string;
  readonly workspaceId: string;
  readonly nonce: string;
};

export type OAuthStateClaims = {
  readonly purpose: "login" | "youtube";
  readonly channelKey?: string;
  readonly workspaceId?: string;
  readonly userId?: string;
  readonly returnTo?: string;
  readonly nonce: string;
};

export type AuthenticatedRequest = Request & {
  authUser?: UserDoc;
  workspaceId?: string;
  workspace?: WorkspaceDoc;
  authMethod?: "cookie" | "api-key";
};

export function createSessionToken(userId: string, workspaceId: string): string {
  return signPayload<SessionClaims>(
    {
      userId,
      workspaceId,
      nonce: crypto.randomBytes(8).toString("hex"),
    },
    SESSION_TTL_SECONDS,
  );
}

export function signOAuthState(
  claims: Omit<OAuthStateClaims, "nonce">,
): string {
  return signPayload<OAuthStateClaims>(
    {
      ...claims,
      nonce: crypto.randomBytes(8).toString("hex"),
    },
    15 * 60,
  );
}

export function verifyOAuthState(stateToken: string): OAuthStateClaims | null {
  return verifySignedPayload<OAuthStateClaims>(stateToken);
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    try {
      result[key] = decodeURIComponent(val);
    } catch {
      result[key] = val;
    }
  }
  return result;
}

function isSecureRequest(req: Request): boolean {
  if (req.secure) return true;
  const proto = String(req.headers["x-forwarded-proto"] ?? "");
  if (proto.toLowerCase().includes("https")) return true;
  const publicUrl = process.env.PUBLIC_APP_URL ?? "";
  return publicUrl.startsWith("https://");
}

export function setSessionCookie(
  req: Request,
  res: Response,
  token: string,
): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (isSecureRequest(req)) {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(req: Request, res: Response): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isSecureRequest(req)) {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function resolveAuthContext(req: Request): {
  user?: UserDoc;
  workspace?: WorkspaceDoc;
  method?: "cookie" | "api-key";
} {
  const db = readDb();

  // 1. Check API Key (x-api-key header or Authorization: Bearer vms_live_...)
  const rawApiKeyHeader = String(req.headers["x-api-key"] ?? "").trim();
  const authHeader = String(req.headers.authorization ?? "").trim();
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const candidateApiKey = rawApiKeyHeader || (bearerToken.startsWith("vms_") ? bearerToken : "");

  if (candidateApiKey) {
    const keyHash = hashApiKey(candidateApiKey);
    const keyDoc = db.api_keys.find((k) => k.keyHash === keyHash);
    if (keyDoc) {
      const ws = db.workspaces.find((w) => w._id === keyDoc.workspaceId);
      const owner = ws
        ? db.users.find((u) => u._id === ws.ownerUserId)
        : undefined;
      if (ws && owner) {
        updateDb((draft) => {
          const idx = draft.api_keys.findIndex((k) => k._id === keyDoc._id);
          if (idx >= 0) {
            draft.api_keys[idx] = {
              ...draft.api_keys[idx],
              lastUsedAt: new Date().toISOString(),
            };
          }
        });
        return { user: owner, workspace: ws, method: "api-key" };
      }
    }
  }

  // 2. Check signed session cookie or Bearer session token
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken =
    cookies[SESSION_COOKIE_NAME] ||
    (!bearerToken.startsWith("vms_") ? bearerToken : "");
  if (!sessionToken) return {};

  const claims = verifySignedPayload<SessionClaims>(sessionToken);
  if (!claims) return {};

  const user = db.users.find((u) => u._id === claims.userId);
  if (!user) return {};

  const workspace =
    db.workspaces.find((w) => w._id === claims.workspaceId && w.ownerUserId === user._id) ??
    db.workspaces.find((w) => w._id === user.activeWorkspaceId) ??
    db.workspaces.find((w) => w.ownerUserId === user._id);

  if (!workspace) return {};
  return { user, workspace, method: "cookie" };
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const ctx = resolveAuthContext(req);
  req.authUser = ctx.user;
  req.workspace = ctx.workspace;
  req.workspaceId = ctx.workspace?._id;
  req.authMethod = ctx.method;
  next();
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const ctx = resolveAuthContext(req);
  if (!ctx.user || !ctx.workspace) {
    res.status(401).json({
      error: "Authentication required. Please sign in with Google or email.",
      code: "UNAUTHORIZED",
    });
    return;
  }
  req.authUser = ctx.user;
  req.workspace = ctx.workspace;
  req.workspaceId = ctx.workspace._id;
  req.authMethod = ctx.method;
  next();
}

