export type PublishingMode = "manual" | "semi-automatic" | "fully-automatic";
export type VideoFormat = "short" | "long-form";
export type FormatScope = "shorts" | "long-form" | "both";
export type PrivacyStatus = "private" | "unlisted" | "public";
export type PlanId = "starter" | "creator" | "studio" | "agency";
export type BillingInterval = "monthly" | "yearly";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export type JobStatus =
  | "queued"
  | "rendering"
  | "ready"
  | "uploading"
  | "scheduled"
  | "published"
  | "failed";

export type PlanDefinition = {
  readonly id: PlanId;
  readonly name: string;
  readonly tagline: string;
  readonly priceMonthlyUsd: number;
  readonly priceYearlyMonthlyUsd: number;
  readonly monthlyCredits: number;
  readonly maxChannels: number;
  readonly maxDailyPublishes: number;
  readonly allowedFormats: readonly VideoFormat[];
  readonly allowFullAuto: boolean;
  readonly allowApiAndWebhooks: boolean;
  readonly badge?: string;
  readonly features: readonly string[];
};

export type CreditPackDefinition = {
  readonly id: string;
  readonly name: string;
  readonly credits: number;
  readonly priceUsd: number;
  readonly bonusLabel?: string;
};

/** Collection: users */
export type UserDoc = {
  readonly _id: string;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl: string | null;
  readonly googleId: string | null;
  readonly passwordHash: string | null;
  readonly role: "owner" | "member" | "admin";
  readonly activeWorkspaceId: string;
  readonly createdAt: string;
  readonly lastLoginAt: string;
};

/** Collection: workspaces (Multi-tenant SaaS accounts) */
export type WorkspaceDoc = {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly ownerUserId: string;
  readonly planId: PlanId;
  readonly subscriptionStatus: SubscriptionStatus;
  readonly billingInterval: BillingInterval;
  readonly creditsBalance: number;
  readonly creditsMonthlyAllowance: number;
  readonly channelsLimit: number;
  readonly dailyPublishLimit: number;
  readonly billingCustomerId: string | null;
  readonly subscriptionId: string | null;
  readonly currentPeriodEnd: string;
  readonly customDomain: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

/** Collection: credit_transactions */
export type CreditTransactionDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly amount: number;
  readonly balanceAfter: number;
  readonly reason: string;
  readonly referenceId: string | null;
  readonly createdAt: string;
};

/** Collection: billing_invoices */
export type BillingInvoiceDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly invoiceNumber: string;
  readonly amountUsd: number;
  readonly currency: "USD";
  readonly status: "paid" | "open" | "void";
  readonly description: string;
  readonly planId: PlanId | null;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly provider: "stripe" | "sandbox" | "razorpay";
  readonly createdAt: string;
};

/** Collection: api_keys */
export type ApiKeyDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly lastUsedAt: string | null;
  readonly createdAt: string;
};

/** Collection: webhook_endpoints */
export type WebhookEndpointDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly url: string;
  readonly events: readonly string[];
  readonly signingSecret: string;
  readonly enabled: boolean;
  readonly lastDeliveredAt: string | null;
  readonly lastStatusCode: number | null;
  readonly createdAt: string;
};

/** Collection: youtube_channels */
export type YoutubeChannelDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly channelKey: string;
  readonly channelId: string | null;
  readonly channelTitle: string;
  readonly niche: string;
  readonly language: string;
  readonly defaultFormat: VideoFormat;
  readonly dailyLimit: number;
  readonly connected: boolean;
  readonly oauthEmail: string | null;
  readonly brandingColor: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

/** Collection: youtube_tokens (Encrypted at rest, isolated per workspace + channel) */
export type YoutubeTokenDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly channelKey: string;
  readonly encryptedRefreshToken: string;
  readonly scope: string;
  readonly tokenType: string;
  readonly updatedAt: string;
};

/** Collection: channel_schedules */
export type ChannelScheduleDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly channelKey: string;
  readonly enabled: boolean;
  readonly timeIst: string; // HH:mm in Asia/Kolkata (+05:30)
  readonly format: VideoFormat;
  readonly compositionId: string;
  readonly category: string;
  readonly updatedAt: string;
};

/** Collection: video_projects */
export type VideoProjectDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly topic: string;
  readonly niche: string;
  readonly format: VideoFormat;
  readonly compositionId: string;
  readonly channelKey: string;
  readonly hook: string;
  readonly script: string;
  readonly scenes: readonly {
    readonly id: string;
    readonly label: string;
    readonly visualDirection: string;
    readonly durationSec: number;
  }[];
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly tags: readonly string[];
    readonly categoryId: string;
    readonly privacyStatus: PrivacyStatus;
    readonly publishAtIso: string | null;
  };
  readonly status: "draft" | "rendered" | "queued" | "published";
  readonly createdAt: string;
};

/** Collection: rendered_videos */
export type RenderedVideoDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly compositionId: string;
  readonly format: VideoFormat;
  readonly mp4Path: string;
  readonly mp4Url: string;
  readonly thumbnailPath: string | null;
  readonly thumbnailUrl: string | null;
  readonly fileSizeMb: number;
  readonly durationSec: number;
  readonly resolution: string;
  readonly fps: number;
  readonly renderedAt: string;
};

/** Collection: publishing_jobs */
export type PublishingJobDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly jobKey: string; // Unique idempotency key preventing duplicate uploads
  readonly channelKey: string;
  readonly projectId: string;
  readonly videoId: string;
  readonly format: VideoFormat;
  readonly status: JobStatus;
  readonly publishAt: string; // ISO-8601
  readonly metadata: {
    readonly title: string;
    readonly description: string;
    readonly tags: readonly string[];
    readonly categoryId: string;
    readonly privacyStatus: PrivacyStatus;
  };
  readonly youtubeVideoId: string | null;
  readonly youtubeUrl: string | null;
  readonly retryCount: number;
  readonly uploadProgressPct: number;
  readonly lastError: string | null;
  readonly simulated: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

/** Collection: publishing_history */
export type PublishingHistoryDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly jobId: string;
  readonly channelKey: string;
  readonly channelTitle: string;
  readonly title: string;
  readonly format: VideoFormat;
  readonly youtubeVideoId: string;
  readonly youtubeUrl: string;
  readonly privacyStatus: PrivacyStatus;
  readonly publishAt: string | null;
  readonly publishedAt: string;
  readonly simulated: boolean;
  readonly analytics: {
    readonly views: number;
    readonly likes: number;
    readonly comments: number;
    readonly ctrPercent: number;
  };
};

/** Collection: automation_settings */
export type AutomationSettingsDoc = {
  readonly _id: string;
  readonly workspaceId: string;
  readonly channelMode: "single" | "multiple";
  readonly dailyProductionTarget: number;
  readonly monthlyTarget: number;
  readonly publishingMode: PublishingMode;
  readonly formatScope: FormatScope;
  readonly defaultPrivacyStatus: PrivacyStatus;
  readonly enforcePrivateUntilVerified: boolean;
  readonly schedulerRunning: boolean;
  readonly updatedAt: string;
};

export type ViralMotionDatabase = {
  users: UserDoc[];
  workspaces: WorkspaceDoc[];
  credit_transactions: CreditTransactionDoc[];
  billing_invoices: BillingInvoiceDoc[];
  api_keys: ApiKeyDoc[];
  webhook_endpoints: WebhookEndpointDoc[];
  youtube_channels: YoutubeChannelDoc[];
  youtube_tokens: YoutubeTokenDoc[];
  channel_schedules: ChannelScheduleDoc[];
  video_projects: VideoProjectDoc[];
  rendered_videos: RenderedVideoDoc[];
  publishing_jobs: PublishingJobDoc[];
  publishing_history: PublishingHistoryDoc[];
  automation_settings: AutomationSettingsDoc[];
};
