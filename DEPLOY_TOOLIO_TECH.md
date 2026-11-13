# Go-Live Guide: ViralMotionStudio SaaS on `ViralMotionStudio.toolio.tech`

Your ViralMotionStudio SaaS app serves **both the React SaaS frontend (`dashboard/dist/`) and the Node/Express API + Google OAuth + Remotion engine** from **one single port (`5000`)**.

---

## Option 1: Fastest Go-Live via Cloudflare Tunnel (Works from your PC OR any VPS, instant HTTPS)

1. Install `cloudflared` and sign in:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create viralmotionstudio
   ```
2. Route your subdomain in Cloudflare DNS for `toolio.tech`:
   ```bash
   cloudflared tunnel route dns viralmotionstudio viralmotionstudio.toolio.tech
   ```
3. Run the tunnel pointing to port `5000`:
   ```bash
   cloudflared tunnel run --url http://localhost:5000 viralmotionstudio
   ```
4. Build & start ViralMotionStudio in single-port production mode:
   ```bash
   cd ViralMotionStudio
   npm run build:dashboard
   npm run start:prod
   ```

---

## Option 2: Ubuntu / Linux VPS (Docker + Caddy automatic SSL)

1. Point DNS for `toolio.tech`:
   - Type: `A` · Name: `viralmotionstudio` · Value: `<YOUR_VPS_PUBLIC_IP>`
2. Copy `.env.example` → `.env` and set production URLs:
   ```env
   APP_DOMAIN=viralmotionstudio.toolio.tech
   PUBLIC_APP_URL=https://viralmotionstudio.toolio.tech
   GOOGLE_REDIRECT_URI=https://viralmotionstudio.toolio.tech/api/youtube/oauth/callback
   ```
3. Start the SaaS container:
   ```bash
   docker compose up -d --build
   ```
4. Start Caddy (auto-provisions Let's Encrypt TLS certificate for `viralmotionstudio.toolio.tech`):
   ```bash
   caddy run --config Caddyfile
   ```

---

## Required Google Cloud OAuth 2.0 Settings (For Both Google Sign-In & YouTube Channels)

1. Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your **Web application** OAuth 2.0 Client (`980222986460-...`).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`
   - `http://localhost:5000`
   - `https://viralmotionstudio.toolio.tech`
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:5000/api/youtube/oauth/callback`
   - `https://viralmotionstudio.toolio.tech/api/youtube/oauth/callback`
   - `https://viralmotionstudio.toolio.tech/api/auth/google/callback`
5. Under **OAuth consent screen / Audience**:
   - While in *Testing*, add test user Gmail accounts under **Test users**, OR click **Publish App** + submit YouTube scopes (`youtube.upload`, `youtube.readonly`) so any public SaaS customer can sign in & link their YouTube channel.

---

## Required Stripe Settings (Live SaaS Monetization)

1. Get your `STRIPE_SECRET_KEY` (`sk_live_...` or `sk_test_...`) from Stripe Dashboard.
2. Add a Stripe Webhook pointing to:
   `https://viralmotionstudio.toolio.tech/api/billing/webhook/stripe`
   Subscribe to event: `checkout.session.completed`.
3. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to `.env`.
   (Until those are set, built-in **Sandbox SaaS Checkout** handles upgrades, credit packs, and invoices seamlessly.)

