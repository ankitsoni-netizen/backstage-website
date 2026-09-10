import "server-only";

import { cookies, headers } from "next/headers";

const MIN_SUBMIT_MS = 2_000;
const COOKIE_WINDOW_MS = 45_000;
const COOKIE_NAME = "bs_enquiry_submit";
const IP_WINDOW_MS = 10 * 60 * 1_000;
const IP_MAX_HITS = 5;

const recentHits = new Map<string, number[]>();

export type EnquiryGuardResult =
  | { ok: true; ignore: boolean }
  | { ok: false; error: string };

export function evaluateHoneypot(website: string | undefined): boolean {
  return Boolean(website?.trim());
}

export function evaluateSubmissionTiming(startedAt: number): boolean {
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return false;
  }

  return Date.now() - startedAt >= MIN_SUBMIT_MS;
}

export async function getRequestIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip")?.trim() ||
    "unknown";

  return candidate.slice(0, 128);
}

export function isIpThrottled(ip: string): boolean {
  const now = Date.now();
  const recent = (recentHits.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < IP_WINDOW_MS,
  );

  if (recent.length >= IP_MAX_HITS) {
    recentHits.set(ip, recent);
    return true;
  }

  recent.push(now);
  recentHits.set(ip, recent);
  return false;
}

export async function isCookieThrottled(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  const last = raw ? Number(raw) : Number.NaN;

  if (!Number.isFinite(last)) {
    return false;
  }

  return Date.now() - last < COOKIE_WINDOW_MS;
}

export async function markEnquirySubmitted(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, String(Date.now()), {
    httpOnly: true,
    maxAge: Math.ceil(COOKIE_WINDOW_MS / 1000),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function guardPublicEnquiry(input: {
  started_at: number;
  website?: string;
}): Promise<EnquiryGuardResult> {
  if (evaluateHoneypot(input.website)) {
    return { ok: true, ignore: true };
  }

  if (!evaluateSubmissionTiming(input.started_at)) {
    return {
      ok: false,
      error: "Give the form a moment, then send again.",
    };
  }

  if (await isCookieThrottled()) {
    return {
      ok: false,
      error: "Please wait a moment before sending another enquiry.",
    };
  }

  const ip = await getRequestIp();

  if (isIpThrottled(ip)) {
    return {
      ok: false,
      error: "Too many enquiries from this network. Try again shortly.",
    };
  }

  return { ok: true, ignore: false };
}
