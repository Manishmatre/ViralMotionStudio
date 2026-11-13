# ViralMotionStudio — YouTube Automation Setup Guide

Your studio is pre-configured for **Multiple YouTube Channels**, **3 videos/day** (**90 videos/month**), **Fully Automatic** scheduling, and **Both Shorts (9:16) & Long-form (16:9)**.

## 1. Google Cloud Console Setup (Official YouTube Data API v3)
1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project named **`ViralMotionStudio`**.
2. Go to **APIs & Services → Library** and enable **YouTube Data API v3**.
3. Configure **OAuth consent screen** (External/Internal, app name `ViralMotionStudio`, add your test Google accounts while in Testing mode).
4. Create **Credentials → OAuth client ID** (`Web application`).
5. Add Authorized Redirect URI:
   - Local dev: `http://localhost:5000/api/youtube/oauth/callback`
   - Production: `https://yourdomain.com/api/youtube/oauth/callback`
6. Copy `.env.example` to `.env` inside `ViralMotionStudio/` and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a strong `TOKEN_ENCRYPTION_KEY`.

## 2. Connecting Multiple Channels Safely
- Each channel (`Channel A`, `Channel B`, `Channel C`, etc.) must click **Connect YouTube** independently and sign in as an account authorized for that channel.
- Refresh tokens are encrypted at rest via **AES-256-GCM** (`server/security/crypto.ts`) in `youtube_tokens` and are never shared across channels.
- **Compliance Safety:** New/unverified YouTube API projects keep uploads `private` (`privacyStatus: "private"` + `publishAt` future UTC timestamp) until YouTube API audit approval.

## 3. Running ViralMotionStudio
- **Remotion Studio (video editor):** `npm run dev` → `http://localhost:3000`
- **Automation API Server:** `npm run server` → `http://localhost:5000`
- **AI YouTube Dashboard UI:** `npm run dashboard` → `http://localhost:5173`
- **Run API + Dashboard together:** `npm run studio:all`

