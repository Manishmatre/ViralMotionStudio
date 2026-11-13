import { readDb, updateDb } from "../db/store";
import { signWebhookBody } from "../security/crypto";

export async function dispatchWorkspaceWebhook(
  workspaceId: string,
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  const db = readDb();
  const targets = db.webhook_endpoints.filter(
    (w) =>
      w.workspaceId === workspaceId &&
      w.enabled &&
      (w.events.includes("*") || w.events.includes(event)),
  );
  if (targets.length === 0) return;

  const payload = JSON.stringify({
    event,
    workspaceId,
    timestamp: new Date().toISOString(),
    data,
  });

  await Promise.allSettled(
    targets.map(async (endpoint) => {
      const signature = signWebhookBody(payload, endpoint.signingSecret);
      let statusCode: number | null = null;
      try {
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-ViralMotion-Event": event,
            "X-ViralMotion-Signature": `sha256=${signature}`,
          },
          body: payload,
          signal: AbortSignal.timeout(5000),
        });
        statusCode = res.status;
      } catch {
        statusCode = 0;
      }

      updateDb((draft) => {
        const idx = draft.webhook_endpoints.findIndex(
          (w) => w._id === endpoint._id,
        );
        if (idx >= 0) {
          draft.webhook_endpoints[idx] = {
            ...draft.webhook_endpoints[idx],
            lastDeliveredAt: new Date().toISOString(),
            lastStatusCode: statusCode,
          };
        }
      });
    }),
  );
}

