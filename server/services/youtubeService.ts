import crypto from "node:crypto";
import fs from "node:fs";
import { google } from "googleapis";
import { provisionWorkspaceInDb, readDb, updateDb } from "../db/store";
import {
  createSessionToken,
  signOAuthState,
  type OAuthStateClaims,
} from "../security/auth";
import { decryptSecret, encryptSecret } from "../security/crypto";
import type {
  PublishingJobDoc,
  UserDoc,
  WorkspaceDoc,
} from "../types/automation";

const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
];

const GOOGLE_LOGIN_SCOPES = ["openid", "email", "profile"];

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      (process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_AUTH_REDIRECT_URI),
  );
}

function getYouTubeRedirectUri(): string {
  return (
    process.env.GOOGLE_REDIRECT_URI ??
    "http://localhost:5000/api/youtube/oauth/callback"
  );
}

function getGoogleLoginRedirectUri(): string {
  return (
    process.env.GOOGLE_AUTH_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/api/youtube/oauth/callback"
  );
}

function createOAuthClient(redirectUri = getYouTubeRedirectUri()) {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleLoginUrl(returnTo = "/"): {
  readonly configured: boolean;
  readonly authUrl: string;
} {
  if (!isGoogleOAuthConfigured()) {
    return { configured: false, authUrl: "" };
  }
  const oauth2Client = createOAuthClient(getGoogleLoginRedirectUri());
  const state = signOAuthState({
    purpose: "login",
    returnTo,
  });
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    prompt: "select_account",
    scope: GOOGLE_LOGIN_SCOPES,
    state,
  });
  return { configured: true, authUrl };
}

export async function handleGoogleLoginCallback(
  code: string,
  state?: OAuthStateClaims,
): Promise<{
  readonly user: UserDoc;
  readonly workspace: WorkspaceDoc;
  readonly sessionToken: string;
  readonly returnTo: string;
}> {
  const oauth2Client = createOAuthClient(getGoogleLoginRedirectUri());
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const profileRes = await oauth2.userinfo.get();
  const profile = profileRes.data;

  const email = profile.email?.trim().toLowerCase();
  const googleId = profile.id ?? null;
  if (!email) {
    throw new Error("Google account did not return a verified email address.");
  }
  const displayName = profile.name?.trim() || email.split("@")[0];
  const avatarUrl = profile.picture ?? null;
  const nowIso = new Date().toISOString();

  let signedInUser!: UserDoc;
  let activeWorkspace!: WorkspaceDoc;

  updateDb((db) => {
    const existingIdx = db.users.findIndex(
      (u) => (googleId && u.googleId === googleId) || u.email === email,
    );

    if (existingIdx >= 0) {
      const existing = db.users[existingIdx];
      let ws =
        db.workspaces.find((w) => w._id === existing.activeWorkspaceId) ??
        db.workspaces.find((w) => w.ownerUserId === existing._id);
      if (!ws) {
        ws = provisionWorkspaceInDb(db, {
          userId: existing._id,
          name: displayName,
          email,
        });
      }
      signedInUser = {
        ...existing,
        name: displayName,
        avatarUrl: avatarUrl ?? existing.avatarUrl,
        googleId: googleId ?? existing.googleId,
        activeWorkspaceId: ws._id,
        lastLoginAt: nowIso,
      };
      db.users[existingIdx] = signedInUser;
      activeWorkspace = ws;
    } else {
      const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
      activeWorkspace = provisionWorkspaceInDb(db, {
        userId,
        name: displayName,
        email,
      });
      signedInUser = {
        _id: userId,
        email,
        name: displayName,
        avatarUrl,
        googleId,
        passwordHash: null,
        role: "owner",
        activeWorkspaceId: activeWorkspace._id,
        createdAt: nowIso,
        lastLoginAt: nowIso,
      };
      db.users.push(signedInUser);
    }
  });

  const sessionToken = createSessionToken(signedInUser._id, activeWorkspace._id);
  return {
    user: signedInUser,
    workspace: activeWorkspace,
    sessionToken,
    returnTo: state?.returnTo || "/",
  };
}

export function getYouTubeAuthUrl(input: {
  readonly channelKey: string;
  readonly workspaceId: string;
  readonly userId: string;
}): {
  readonly configured: boolean;
  readonly authUrl: string;
} {
  if (!isGoogleOAuthConfigured()) {
    return {
      configured: false,
      authUrl: "",
    };
  }
  const oauth2Client = createOAuthClient(getYouTubeRedirectUri());
  const state = signOAuthState({
    purpose: "youtube",
    channelKey: input.channelKey,
    workspaceId: input.workspaceId,
    userId: input.userId,
  });
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: YOUTUBE_SCOPES,
    state,
  });
  return { configured: true, authUrl };
}

export async function handleYouTubeOAuthCallback(
  code: string,
  channelKey: string,
  workspaceId: string,
): Promise<{
  readonly workspaceId: string;
  readonly channelKey: string;
  readonly channelId: string;
  readonly channelTitle: string;
}> {
  const oauth2Client = createOAuthClient(getYouTubeRedirectUri());
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh_token. Revoke prior app access or ensure prompt=consent & access_type=offline.",
    );
  }
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const me = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });
  const ch = me.data.items?.[0];
  const channelId = ch?.id ?? `yt_${channelKey}`;
  const channelTitle = ch?.snippet?.title ?? channelKey;
  const nowIso = new Date().toISOString();

  const encryptedRefreshToken = encryptSecret(tokens.refresh_token);

  updateDb((db) => {
    const existingTokIdx = db.youtube_tokens.findIndex(
      (t) => t.workspaceId === workspaceId && t.channelKey === channelKey,
    );
    const tokenDoc = {
      _id: `tok_${workspaceId}_${channelKey}`,
      workspaceId,
      channelKey,
      encryptedRefreshToken,
      scope: tokens.scope ?? YOUTUBE_SCOPES.join(" "),
      tokenType: tokens.token_type ?? "Bearer",
      updatedAt: nowIso,
    };
    if (existingTokIdx >= 0) {
      db.youtube_tokens[existingTokIdx] = tokenDoc;
    } else {
      db.youtube_tokens.push(tokenDoc);
    }

    const chIdx = db.youtube_channels.findIndex(
      (c) => c.workspaceId === workspaceId && c.channelKey === channelKey,
    );
    if (chIdx >= 0) {
      db.youtube_channels[chIdx] = {
        ...db.youtube_channels[chIdx],
        channelId,
        channelTitle,
        connected: true,
        updatedAt: nowIso,
      };
    }
  });

  return { workspaceId, channelKey, channelId, channelTitle };
}

export async function uploadVideoToYouTube(
  job: PublishingJobDoc,
  mp4Path: string,
  thumbnailPath: string | null,
  onProgress?: (pct: number) => void,
): Promise<{
  readonly youtubeVideoId: string;
  readonly youtubeUrl: string;
  readonly simulated: boolean;
}> {
  const db = readDb();
  const tokenDoc = db.youtube_tokens.find(
    (t) =>
      t.workspaceId === job.workspaceId && t.channelKey === job.channelKey,
  );
  const settings = db.automation_settings.find(
    (s) => s.workspaceId === job.workspaceId,
  );

  // Safety enforcement: unverified Google projects require private visibility when scheduling publishAt
  const privacyStatus =
    settings?.enforcePrivateUntilVerified || job.publishAt
      ? "private"
      : job.metadata.privacyStatus;

  if (!isGoogleOAuthConfigured() || !tokenDoc) {
    if (onProgress) {
      onProgress(35);
      await new Promise((r) => setTimeout(r, 250));
      onProgress(75);
      await new Promise((r) => setTimeout(r, 250));
      onProgress(100);
    }
    const simulatedId = `SIM_${job.channelKey}_${Date.now().toString(36).toUpperCase()}`;
    return {
      youtubeVideoId: simulatedId,
      youtubeUrl: `https://studio.youtube.com/video/${simulatedId}/edit`,
      simulated: true,
    };
  }

  if (!fs.existsSync(mp4Path)) {
    throw new Error(`Rendered MP4 not found at ${mp4Path}`);
  }

  const refreshToken = decryptSecret(tokenDoc.encryptedRefreshToken);
  const oauth2Client = createOAuthClient(getYouTubeRedirectUri());
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const fileSize = fs.statSync(mp4Path).size;

  const publishAtFuture =
    job.publishAt && new Date(job.publishAt).getTime() > Date.now() + 60_000
      ? new Date(job.publishAt).toISOString()
      : undefined;

  const res = await youtube.videos.insert(
    {
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: job.metadata.title,
          description: job.metadata.description,
          tags: [...job.metadata.tags],
          categoryId: job.metadata.categoryId || "27",
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
          ...(publishAtFuture ? { publishAt: publishAtFuture } : {}),
        },
      },
      media: {
        body: fs.createReadStream(mp4Path),
      },
    },
    {
      onUploadProgress: (evt) => {
        if (onProgress && fileSize > 0) {
          onProgress(Math.min(99, Math.round((evt.bytesRead / fileSize) * 100)));
        }
      },
    },
  );

  const youtubeVideoId = res.data.id;
  if (!youtubeVideoId) {
    throw new Error("YouTube videos.insert succeeded without returning a video ID");
  }

  if (thumbnailPath && fs.existsSync(thumbnailPath)) {
    await youtube.thumbnails.set({
      videoId: youtubeVideoId,
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(thumbnailPath),
      },
    });
  }

  if (onProgress) {
    onProgress(100);
  }

  return {
    youtubeVideoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
    simulated: false,
  };
}
