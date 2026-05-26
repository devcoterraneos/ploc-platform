/**
 * Flow payment integration — https://www.flow.cl
 *
 * Required env vars (add to .env.local):
 *   FLOW_API_KEY=your-api-key
 *   FLOW_SECRET_KEY=your-secret-key
 *   FLOW_MODE=sandbox | production
 *   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
 *
 * Endpoints used:
 *   POST /payment/create       → one-time donation
 *   POST /subscription/create  → monthly membership
 *   POST /payment/getStatus    → check payment status (webhook)
 */

export const FLOW_URLS = {
  sandbox: "https://sandbox.flow.cl/api",
  production: "https://www.flow.cl/api",
} as const;

export interface FlowPaymentRequest {
  subject: string;
  amount: number;
  email: string;
  name: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: Record<string, string>;
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export interface FlowSubscriptionRequest {
  planId: string;
  name: string;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  trialPeriodDays?: number;
}

// ─── One-time donation ────────────────────────────────────────────────────────

export async function createFlowPayment(
  data: FlowPaymentRequest
): Promise<FlowPaymentResponse> {
  const mode = (process.env.FLOW_MODE as "sandbox" | "production") ?? "sandbox";
  const baseUrl = FLOW_URLS[mode];
  const apiKey = process.env.FLOW_API_KEY ?? "";
  const secretKey = process.env.FLOW_SECRET_KEY ?? "";

  if (!apiKey || !secretKey) {
    throw new Error(
      "Flow API credentials not configured. Add FLOW_API_KEY and FLOW_SECRET_KEY to .env.local"
    );
  }

  const params = new URLSearchParams({
    apiKey,
    subject: data.subject,
    amount: String(data.amount),
    email: data.email,
    urlConfirmation: data.urlConfirmation,
    urlReturn: data.urlReturn,
  });

  const signature = await signFlowParams(params, secretKey);
  params.append("s", signature);

  const response = await fetch(`${baseUrl}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Flow payment creation failed: ${error}`);
  }

  const result = await response.json();
  return {
    url: `${result.url}?token=${result.token}`,
    token: result.token,
    flowOrder: result.flowOrder,
  };
}

// ─── HMAC-SHA256 signature ────────────────────────────────────────────────────

async function signFlowParams(
  params: URLSearchParams,
  secretKey: string
): Promise<string> {
  const sortedKeys = Array.from(params.keys()).sort();
  const message = sortedKeys.map((k) => `${k}=${params.get(k)}`).join("&");

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
