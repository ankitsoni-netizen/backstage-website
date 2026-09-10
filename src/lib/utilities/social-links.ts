import type { Json } from "@/types/database";

export type CreatorSocialLinks = {
  linkedin_url: string | null;
  tiktok_followers: number | null;
  tiktok_url: string | null;
  twitter_url: string | null;
};

function asRecord(value: Json | null | undefined): Record<string, Json | undefined> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, Json | undefined>;
  }

  return {};
}

function readText(record: Record<string, Json | undefined>, key: string): string | null {
  const value = record[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return null;
}

function readCount(record: Record<string, Json | undefined>, key: string): number | null {
  const value = record[key];

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value);
  }

  return null;
}

export function parseOtherSocialLinks(
  value: Json | null | undefined,
): CreatorSocialLinks {
  const record = asRecord(value);

  return {
    linkedin_url: readText(record, "linkedin_url"),
    tiktok_followers: readCount(record, "tiktok_followers"),
    tiktok_url: readText(record, "tiktok_url"),
    twitter_url: readText(record, "twitter_url"),
  };
}

const FORM_SOCIAL_KEYS = [
  "linkedin_url",
  "tiktok_followers",
  "tiktok_url",
  "twitter_url",
] as const;

export function toOtherSocialLinks(input: {
  linkedin_url?: string | null;
  tiktok_followers?: number | null;
  tiktok_url?: string | null;
  twitter_url?: string | null;
}): Record<string, string | number> {
  const next: Record<string, string | number> = {};

  if (input.tiktok_url) {
    next.tiktok_url = input.tiktok_url;
  }

  if (input.tiktok_followers != null) {
    next.tiktok_followers = input.tiktok_followers;
  }

  if (input.twitter_url) {
    next.twitter_url = input.twitter_url;
  }

  if (input.linkedin_url) {
    next.linkedin_url = input.linkedin_url;
  }

  return next;
}

export function mergeOtherSocialLinks(
  existing: Json | null | undefined,
  input: {
    linkedin_url?: string | null;
    tiktok_followers?: number | null;
    tiktok_url?: string | null;
    twitter_url?: string | null;
  },
): Record<string, Json | undefined> {
  const next = { ...asRecord(existing) };

  for (const key of FORM_SOCIAL_KEYS) {
    delete next[key];
  }

  return {
    ...next,
    ...toOtherSocialLinks(input),
  };
}
