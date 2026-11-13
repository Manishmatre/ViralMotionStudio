import type {
  AutomationSettingsDoc,
  BillingInvoiceDoc,
  ChannelScheduleDoc,
  CreditPackDefinition,
  CreditTransactionDoc,
  PlanDefinition,
  PublishingHistoryDoc,
  PublishingJobDoc,
  RenderedVideoDoc,
  VideoProjectDoc,
  WebhookEndpointDoc,
  WorkspaceDoc,
  YoutubeChannelDoc,
} from "../../../server/types/automation";

export type SafeUser = {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: "owner" | "member" | "admin";
  hasGoogleLinked: boolean;
  activeWorkspaceId: string;
  createdAt: string;
  lastLoginAt: string;
};

export type SafeApiKey = {
  _id: string;
  workspaceId: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

export type AuthMeResponse =
  | {
      authenticated: false;
      oauthConfigured: boolean;
      stripeConfigured: boolean;
      appDomain: string;
      plans: PlanDefinition[];
      creditPacks: CreditPackDefinition[];
    }
  | {
      authenticated: true;
      user: SafeUser;
      workspace: WorkspaceDoc;
      plan: PlanDefinition;
      workspaces: WorkspaceDoc[];
      oauthConfigured: boolean;
      stripeConfigured: boolean;
      appDomain: string;
      plans: PlanDefinition[];
      creditPacks: CreditPackDefinition[];
    };

export type ChannelWithToken = YoutubeChannelDoc & { hasToken: boolean };

export type StudioState = {
  oauthConfigured: boolean;
  stripeConfigured: boolean;
  appDomain: string;
  workspace: WorkspaceDoc;
  user: SafeUser;
  settings: AutomationSettingsDoc;
  channels: ChannelWithToken[];
  schedules: ChannelScheduleDoc[];
  projects: VideoProjectDoc[];
  renderedVideos: RenderedVideoDoc[];
  jobs: PublishingJobDoc[];
  history: PublishingHistoryDoc[];
};

export type BillingOverview = {
  workspace: WorkspaceDoc;
  currentPlan: PlanDefinition;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  stripeConfigured: boolean;
  invoices: BillingInvoiceDoc[];
  transactions: CreditTransactionDoc[];
};

export type DeveloperOverview = {
  keys: SafeApiKey[];
  webhooks: WebhookEndpointDoc[];
};

export type DemoVideoItem = {
  id: string;
  file: string;
  title: string;
  category: string;
  format: "short" | "long-form";
  resolution: string;
  durationSec: number;
  fps: number;
  mp4Url: string;
  thumbnailUrl: string | null;
  highlights: string[];
};

export type PublicShowcaseResponse = {
  brand: string;
  appDomain: string;
  publicAppUrl: string;
  oauthConfigured: boolean;
  stripeConfigured: boolean;
  plans: PlanDefinition[];
  creditPacks: CreditPackDefinition[];
  demoVideo: DemoVideoItem | null;
  demoVideos: DemoVideoItem[];
};
