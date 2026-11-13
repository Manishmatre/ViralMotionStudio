import crypto from "node:crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_S6GKiQ11vD62CF";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "X5Qab40z5wiSPgy3k51mqZoN";

let rzpInstance: Razorpay | null = null;
try {
  if (keyId && keySecret) {
    rzpInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
} catch (err: unknown) {
  console.warn("[Razorpay Init Warning]:", err instanceof Error ? err.message : String(err));
}

export async function createRazorpayOrder(options: {
  amountInr: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId: string;
  error?: string;
}> {
  if (!rzpInstance) {
    return {
      success: false,
      keyId,
      error: "Razorpay client not initialized",
    };
  }

  try {
    const order = await rzpInstance.orders.create({
      amount: Math.round(options.amountInr * 100), // convert to paise
      currency: "INR",
      receipt: options.receipt,
      notes: options.notes,
    });

    return {
      success: true,
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return {
      success: false,
      keyId,
      error: msg,
    };
  }
}

export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!keySecret) return false;
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === params.signature;
}

export function getRazorpayStatus(): {
  configured: boolean;
  keyId: string;
  mode: "test" | "live";
} {
  return {
    configured: Boolean(keyId && keySecret),
    keyId: keyId ? `${keyId.slice(0, 8)}...` : "none",
    mode: keyId.startsWith("rzp_live") ? "live" : "test",
  };
}

