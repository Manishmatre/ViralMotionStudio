# ViralMotionStudio

> **AI-Powered Cinematic Video Creation & Autonomous YouTube Channel Automation Platform**  
> *Turn Ideas Into Cinematic Experiences.*

Live Production Domain: [viralmotionstudio.toolio.tech](https://viralmotionstudio.toolio.tech)

---

## ⚡ Overview

**ViralMotionStudio** is a full-stack SaaS platform designed for high-retention video creators, media agencies, and faceless YouTube automation operators. It integrates AI scriptwriting, programmatic motion graphics rendering via Remotion, neural audio synthesis, and automated multi-channel YouTube publishing via Google OAuth 2.0.

### 🌟 Core Capabilities

- **Autonomous YouTube Publishing Engine:** Direct scheduled uploads using Google YouTube Data API v3 OAuth 2.0 with zero manual intervention required.
- **Remotion 30 FPS Motion Graphics:** Dual-format rendering for **9:16 Shorts (1080×1920)** and **16:9 Documentary (1920×1080)**.
- **Neural Voice & Sound Design:** Built-in synthesis with realistic audio waveform visualization and faststart MP4 delivery.
- **Duplicate Prevention & Guardrails:** AES-256-GCM token encryption and atomic lock keys preventing accidental double-posts.
- **Secured Platform Portal:** Real-time infrastructure telemetry (MongoDB Atlas, Cloudinary CDN, Brevo SMTP, Razorpay, Remotion Studio).

---

## 🛠 Technology Stack

- **Frontend:** React 19, TypeScript, Vite, GSAP (GreenSock), Lucide Icons
- **Video Rendering:** Remotion 4.0 (Faststart H.264 MP4)
- **Backend:** Node.js, Express, TypeScript
- **Cloud Database:** MongoDB Atlas (Mongoose & Native Driver sync)
- **Media CDN:** Cloudinary SDK
- **Email Relay:** Brevo SMTP (Nodemailer)
- **Payments:** Razorpay Payments Gateway (INR & Global Checkout)
- **Auth:** WebAuthn Passkeys, JWT Sessions, Google OAuth 2.0

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+ installed
- Chrome / Chromium for Remotion video previewing & rendering

### 2. Installation
```bash
git clone https://github.com/Manishmatre/ViralMotionStudio.git
cd ViralMotionStudio
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in your MongoDB URI, Cloudinary keys, Razorpay credentials, and Google OAuth client credentials.

### 4. Running the Platform
Run both backend server and frontend dashboard concurrently:
```bash
npm run studio:all
```
- **Backend API & Production Server:** `http://localhost:4000`
- **Vite Developer Dashboard:** `http://localhost:5173`
- **Remotion Studio Compositor:** `npm run dev` (`http://localhost:3000`)

---

## 🔒 Security & Architecture

- **Owner-Protected Portal:** `/portal` and `/api/portal/*` endpoints are protected by `role === "owner"` middleware.
- **Token Security:** YouTube refresh tokens and API secrets are encrypted using AES-256-GCM prior to database storage.
- **Environment Isolation:** Secrets and `.env` are excluded from version control.

---

## 📄 License

MIT © [ArionexTech Software / ViralMotionStudio](https://viralmotionstudio.toolio.tech)
