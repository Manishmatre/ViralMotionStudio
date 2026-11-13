import type { AnyBulkWriteOperation, Document } from "mongodb";
import { getMongoDb, initMongo } from "./mongoClient";
import type { ViralMotionDatabase } from "../types/automation";

let isSyncing = false;

export async function syncDbToMongo(db: ViralMotionDatabase): Promise<void> {
  const mongo = getMongoDb();
  if (!mongo) return;

  if (isSyncing) return;
  isSyncing = true;

  try {
    const collectionsToSync: Array<{ name: string; items: Array<{ _id: string }> }> = [
      { name: "vms_workspaces", items: db.workspaces },
      { name: "vms_users", items: db.users },
      { name: "vms_video_projects", items: db.video_projects },
      { name: "vms_rendered_videos", items: db.rendered_videos },
      { name: "vms_youtube_channels", items: db.youtube_channels },
      { name: "vms_youtube_tokens", items: db.youtube_tokens },
      { name: "vms_channel_schedules", items: db.channel_schedules },
      { name: "vms_publishing_jobs", items: db.publishing_jobs },
      { name: "vms_publishing_history", items: db.publishing_history },
      { name: "vms_credit_transactions", items: db.credit_transactions },
      { name: "vms_billing_invoices", items: db.billing_invoices },
      { name: "vms_api_keys", items: db.api_keys },
      { name: "vms_webhook_endpoints", items: db.webhook_endpoints },
      { name: "vms_automation_settings", items: db.automation_settings },
    ];

    for (const { name, items } of collectionsToSync) {
      if (!items || items.length === 0) continue;
      const col = mongo.collection(name);
      const operations: AnyBulkWriteOperation<Document>[] = items.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id } as Document,
          update: { $set: doc } as Document,
          upsert: true,
        },
      }));
      await col.bulkWrite(operations, { ordered: false });
    }
  } catch (err: unknown) {
    console.error("[MongoDB Sync Error]:", err instanceof Error ? err.message : String(err));
  } finally {
    isSyncing = false;
  }
}

export async function hydrateFromMongo(
  currentDb: ViralMotionDatabase,
): Promise<{ db: ViralMotionDatabase; loadedFromMongo: boolean }> {
  const mongo = await initMongo();
  if (!mongo) {
    return { db: currentDb, loadedFromMongo: false };
  }

  try {
    const workspaces = await mongo.collection("vms_workspaces").find().toArray();

    // If MongoDB has workspaces, load them and related collections
    if (workspaces && workspaces.length > 0) {
      const users = await mongo.collection("vms_users").find().toArray();
      const video_projects = await mongo.collection("vms_video_projects").find().toArray();
      const rendered_videos = await mongo.collection("vms_rendered_videos").find().toArray();
      const youtube_channels = await mongo.collection("vms_youtube_channels").find().toArray();
      const youtube_tokens = await mongo.collection("vms_youtube_tokens").find().toArray();
      const channel_schedules = await mongo.collection("vms_channel_schedules").find().toArray();
      const publishing_jobs = await mongo.collection("vms_publishing_jobs").find().toArray();
      const publishing_history = await mongo.collection("vms_publishing_history").find().toArray();
      const credit_transactions = await mongo.collection("vms_credit_transactions").find().toArray();
      const billing_invoices = await mongo.collection("vms_billing_invoices").find().toArray();
      const api_keys = await mongo.collection("vms_api_keys").find().toArray();
      const webhook_endpoints = await mongo.collection("vms_webhook_endpoints").find().toArray();
      const automation_settings = await mongo.collection("vms_automation_settings").find().toArray();

      const merged: ViralMotionDatabase = {
        workspaces: (workspaces as unknown) as ViralMotionDatabase["workspaces"],
        users: (users as unknown) as ViralMotionDatabase["users"],
        video_projects: (video_projects as unknown) as ViralMotionDatabase["video_projects"],
        rendered_videos: (rendered_videos as unknown) as ViralMotionDatabase["rendered_videos"],
        youtube_channels: (youtube_channels as unknown) as ViralMotionDatabase["youtube_channels"],
        youtube_tokens: (youtube_tokens as unknown) as ViralMotionDatabase["youtube_tokens"],
        channel_schedules: (channel_schedules as unknown) as ViralMotionDatabase["channel_schedules"],
        publishing_jobs: (publishing_jobs as unknown) as ViralMotionDatabase["publishing_jobs"],
        publishing_history: (publishing_history as unknown) as ViralMotionDatabase["publishing_history"],
        credit_transactions: (credit_transactions as unknown) as ViralMotionDatabase["credit_transactions"],
        billing_invoices: (billing_invoices as unknown) as ViralMotionDatabase["billing_invoices"],
        api_keys: (api_keys as unknown) as ViralMotionDatabase["api_keys"],
        webhook_endpoints: (webhook_endpoints as unknown) as ViralMotionDatabase["webhook_endpoints"],
        automation_settings: (automation_settings as unknown) as ViralMotionDatabase["automation_settings"],
      };

      console.log(`[MongoDB Atlas] Successfully hydrated ${workspaces.length} workspaces and data from Atlas.`);
      return { db: merged, loadedFromMongo: true };
    } else {
      // First time on MongoDB Atlas: Seed current data to Mongo
      console.log("[MongoDB Atlas] Initializing remote Atlas database with seed data...");
      await syncDbToMongo(currentDb);
      return { db: currentDb, loadedFromMongo: true };
    }
  } catch (err: unknown) {
    console.error("[MongoDB Atlas] Failed to hydrate:", err instanceof Error ? err.message : String(err));
    return { db: currentDb, loadedFromMongo: false };
  }
}
