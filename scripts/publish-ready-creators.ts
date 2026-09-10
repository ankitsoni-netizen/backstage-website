import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { HOMEPAGE_FEATURED_SLUGS } from "../src/lib/content/homepage-featured";
import type { Creator, Database } from "../src/types/database";

const PLACEHOLDER_CATEGORY = "Needs classification";
const HOMEPAGE_FEATURED_LIMIT = HOMEPAGE_FEATURED_SLUGS.length;

type CategoryRule = {
  label: string;
  patterns: string[];
};

const CATEGORY_RULES: CategoryRule[] = [
  { label: "Sport", patterns: ["wrestl", "athlete"] },
  { label: "Acting", patterns: ["actress", "actor", "television"] },
  { label: "Comedy", patterns: ["comedy"] },
  { label: "Travel", patterns: ["travel"] },
  { label: "Fitness", patterns: ["fitness", "workout"] },
  { label: "Food", patterns: ["food"] },
  { label: "Beauty", patterns: ["beauty", "skincare", "fragrance", "makeup"] },
  { label: "Fashion", patterns: ["fashion", "styling"] },
  { label: "Entertainment", patterns: ["entertainment"] },
  { label: "Lifestyle", patterns: ["lifestyle"] },
];

function createServiceClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local for this local script only.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function tidyText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/â€™/g, "'")
    .replace(/â/g, "'")
    .replace(/â/g, '"')
    .replace(/â/g, '"')
    .replace(/â/g, "–")
    .replace(/â/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text: string): string | null {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (cleaned.length < 12) {
    return null;
  }

  const match = cleaned.match(/[.!?](?:\s|$)/);
  const sentence = (match?.index != null ? cleaned.slice(0, match.index + 1) : cleaned).trim();
  return sentence.slice(0, 280) || null;
}

function categoryFromBio(bio: string): string {
  const haystack = bio.toLowerCase();
  let bestLabel = "Creator";
  let bestIndex = Number.POSITIVE_INFINITY;

  for (const rule of CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      const index = haystack.indexOf(pattern);

      if (index >= 0 && index < bestIndex) {
        bestIndex = index;
        bestLabel = rule.label;
      }
    }
  }

  return bestLabel;
}

function displayName(value: string | null): string {
  const name = (value ?? "").trim();

  if (name.toLowerCase() === "simran sehgal") {
    return "Simran Sehgal";
  }

  return name;
}

function isPublishReady(creator: Creator): boolean {
  const bio = tidyText(creator.full_bio);
  return Boolean(creator.profile_image_path) && bio.length >= 12;
}

async function main() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load creators: ${error.message}`);
  }

  const creators = data ?? [];
  const ready = creators.filter(isPublishReady);
  const readyBySlug = new Map(ready.map((creator) => [creator.slug, creator]));
  const featuredSlugs = new Set<string>(
    HOMEPAGE_FEATURED_SLUGS.filter((slug) => readyBySlug.has(slug)).slice(
      0,
      HOMEPAGE_FEATURED_LIMIT,
    ),
  );

  if (featuredSlugs.size < HOMEPAGE_FEATURED_LIMIT) {
    for (const creator of ready) {
      featuredSlugs.add(creator.slug);

      if (featuredSlugs.size >= HOMEPAGE_FEATURED_LIMIT) {
        break;
      }
    }
  }
  const publishedAt = new Date().toISOString();

  console.log("Backstage publish-ready creators");
  console.log("================================");
  console.log(`Loaded: ${creators.length}`);
  console.log(`Ready to publish (image + bio): ${ready.length}`);
  console.log("");

  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (const creator of creators) {
    if (!isPublishReady(creator)) {
      skipped += 1;
      console.log(
        `  SKIP ${creator.slug}  image=${Boolean(creator.profile_image_path)}  bio=${tidyText(creator.full_bio).length}`,
      );
      continue;
    }

    const fullBio = tidyText(creator.full_bio);
    const category = categoryFromBio(fullBio);
    const name = displayName(creator.display_name);
    const featured = featuredSlugs.has(creator.slug);

    const { error: updateError } = await supabase
      .from("creators")
      .update({
        display_name: name,
        featured,
        full_bio: fullBio,
        primary_category: category === PLACEHOLDER_CATEGORY ? "Creator" : category,
        published_at: creator.published_at ?? publishedAt,
        short_bio: tidyText(creator.short_bio) || firstSentence(fullBio),
        status: "published",
      })
      .eq("id", creator.id);

    if (updateError) {
      failed += 1;
      console.error(`  FAIL ${creator.slug}: ${updateError.message}`);
      continue;
    }

    succeeded += 1;
    console.log(
      `  OK ${name}  category=${category}  featured=${featured ? "yes" : "no"}`,
    );
  }

  console.log("");
  console.log(`Published: ${succeeded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Publish aborted: ${message}`);
  process.exit(1);
});
