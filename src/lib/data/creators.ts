import { requireAdmin } from "@/lib/auth/session";
import { compareHomepageFeatured } from "@/lib/content/homepage-featured";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import {
  comparePublicCreators,
  toPublicCreator,
  type PublicCreatorSource,
} from "@/lib/utilities/creators";
import {
  requireSupabaseRow,
  unwrapSupabaseResult,
} from "@/lib/utilities/errors";
import { parseCategoriesText, type CreatorFormOutput } from "@/lib/validation/creator";
import { mergeOtherSocialLinks } from "@/lib/utilities/social-links";
import { instagramHandleFromUrl } from "@/lib/utilities/urls";
import type { Creator, CreatorInsert } from "@/types/database";
import type { PublicCreator } from "@/types/public";

const HOMEPAGE_CREATOR_LIMIT = 8;

const PUBLIC_CREATOR_SELECT = `
  id,
  slug,
  display_name,
  primary_category,
  categories,
  city,
  full_bio,
  short_bio,
  profile_image_path,
  hero_image_path,
  instagram_url,
  instagram_handle,
  instagram_followers,
  youtube_url,
  youtube_subscribers,
  other_social_links,
  featured,
  sort_order,
  published_at,
  seo_title,
  seo_description
` as const;

export type HomepageCreators = {
  creators: PublicCreator[];
  source: "featured" | "published";
};

function mapPublicCreators(rows: PublicCreatorSource[]): PublicCreator[] {
  return rows.map(toPublicCreator).sort(comparePublicCreators);
}

async function queryPublishedCreators(options?: {
  featured?: boolean;
  limit?: number;
  slug?: string;
}): Promise<PublicCreatorSource[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("creators")
    .select(PUBLIC_CREATOR_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("display_name", { ascending: true });

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  if (options?.slug) {
    query = query.eq("slug", options.slug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  return unwrapSupabaseResult(
    data ?? [],
    error,
    "Failed to load published creators",
  );
}

async function listLatestPublishedCreators(
  limit: number,
): Promise<PublicCreator[]> {
  const rows = await queryPublishedCreators({ limit });
  return mapPublicCreators(rows).slice(0, limit);
}

export async function listPublishedCreators(): Promise<PublicCreator[]> {
  const rows = await queryPublishedCreators();
  return mapPublicCreators(rows);
}

export async function listHomepageCreators(): Promise<HomepageCreators> {
  try {
    const featuredRows = await queryPublishedCreators({
      featured: true,
      limit: HOMEPAGE_CREATOR_LIMIT,
    });

    if (featuredRows.length > 0) {
      const creators = mapPublicCreators(featuredRows)
        .sort((left, right) => {
          const featuredOrder = compareHomepageFeatured(left.slug, right.slug);

          if (featuredOrder !== 0) {
            return featuredOrder;
          }

          return comparePublicCreators(left, right);
        })
        .slice(0, HOMEPAGE_CREATOR_LIMIT);

      return {
        creators,
        source: "featured",
      };
    }
  } catch {
    // Fall through to the latest published roster.
  }

  return {
    creators: await listLatestPublishedCreators(HOMEPAGE_CREATOR_LIMIT),
    source: "published",
  };
}

export async function getPublishedCreatorBySlug(
  slug: string,
): Promise<PublicCreator | null> {
  const rows = await queryPublishedCreators({ slug });
  return rows[0] ? toPublicCreator(rows[0]) : null;
}

export async function getPublishedCreatorById(
  id: string,
): Promise<PublicCreator | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("creators")
    .select(PUBLIC_CREATOR_SELECT)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  const row = unwrapSupabaseResult(data, error, "Failed to load creator");
  return row ? toPublicCreator(row) : null;
}

export async function listCreators(): Promise<Creator[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("updated_at", { ascending: false });

  return unwrapSupabaseResult(data ?? [], error, "Failed to load creators");
}

export async function getCreatorById(id: string): Promise<Creator | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return unwrapSupabaseResult(data, error, "Failed to load creator");
}

function statusFromIntent(intent: CreatorFormOutput["intent"]) {
  if (intent === "publish") {
    return "published" as const;
  }

  if (intent === "archive") {
    return "archived" as const;
  }

  return "draft" as const;
}

export function toCreatorRecord(
  input: CreatorFormOutput,
  current?: Pick<Creator, "other_social_links" | "published_at"> | null,
): CreatorInsert {
  const categories = parseCategoriesText(input.categories_text);
  const status = statusFromIntent(input.intent);
  const publishedAt =
    status === "published"
      ? (current?.published_at ?? new Date().toISOString())
      : (current?.published_at ?? null);

  return {
    categories,
    city: input.city,
    display_name: input.display_name,
    featured: input.featured,
    full_bio: input.full_bio,
    hero_image_path: input.hero_image_path,
    instagram_followers: input.instagram_followers,
    instagram_handle: instagramHandleFromUrl(input.instagram_url),
    instagram_url: input.instagram_url,
    manager_name: input.manager_name,
    other_social_links: mergeOtherSocialLinks(current?.other_social_links, {
      linkedin_url: input.linkedin_url,
      tiktok_followers: input.tiktok_followers,
      tiktok_url: input.tiktok_url,
      twitter_url: input.twitter_url,
    }),
    primary_category: input.primary_category,
    profile_image_path: input.profile_image_path,
    published_at: publishedAt,
    seo_description: input.seo_description,
    seo_title: input.seo_title,
    short_bio: input.short_bio,
    slug: input.slug,
    sort_order: input.sort_order,
    status,
    youtube_subscribers: input.youtube_followers,
    youtube_url: input.youtube_url,
  };
}

export async function creatorSlugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase.from("creators").select("id").eq("slug", slug).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;
  unwrapSupabaseResult(data ?? [], error, "Failed to check slug");
  return (data ?? []).length > 0;
}

export async function createCreator(input: CreatorFormOutput): Promise<Creator> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .insert(toCreatorRecord(input))
    .select("*")
    .single();

  return requireSupabaseRow(data, error, "Failed to create creator");
}

export async function updateCreator(
  id: string,
  input: CreatorFormOutput,
  current?: Pick<Creator, "other_social_links" | "published_at"> | null,
): Promise<Creator> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .update(toCreatorRecord(input, current))
    .eq("id", id)
    .select("*")
    .single();

  return requireSupabaseRow(data, error, "Failed to update creator");
}

export async function archiveCreator(id: string): Promise<Creator> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creators")
    .update({ status: "archived", featured: false })
    .eq("id", id)
    .select("*")
    .single();

  return requireSupabaseRow(data, error, "Failed to archive creator");
}

export async function deleteCreator(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("creators").delete().eq("id", id);
  unwrapSupabaseResult(null, error, "Failed to delete creator");
}

export type DashboardSnapshot = {
  draftCreators: number;
  featuredCreators: number;
  newEnquiries: number;
  publishedCreators: number;
  recentCreators: Creator[];
  recentEnquiries: import("@/types/database").Enquiry[];
};

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  await requireAdmin();
  const supabase = await createClient();
  const [creatorsResult, enquiriesResult] = await Promise.all([
    supabase.from("creators").select("*").order("updated_at", { ascending: false }),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
  ]);

  const creators = unwrapSupabaseResult(
    creatorsResult.data ?? [],
    creatorsResult.error,
    "Failed to load creators",
  );
  const enquiries = unwrapSupabaseResult(
    enquiriesResult.data ?? [],
    enquiriesResult.error,
    "Failed to load enquiries",
  );

  return {
    draftCreators: creators.filter((creator) => creator.status === "draft").length,
    featuredCreators: creators.filter((creator) => creator.featured).length,
    newEnquiries: enquiries.filter((enquiry) => enquiry.status === "new").length,
    publishedCreators: creators.filter((creator) => creator.status === "published")
      .length,
    recentCreators: creators.slice(0, 6),
    recentEnquiries: enquiries.slice(0, 6),
  };
}
