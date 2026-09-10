import { getPrimaryCategory } from "@/lib/utilities/media";
import { getSafeHttpUrl } from "@/lib/utilities/urls";
import type {
  PublicCreator,
  PublicCreatorSocialLink,
} from "@/types/public";

export type PublicCreatorSource = {
  categories: string[] | null;
  city?: string | null;
  display_name?: string | null;
  featured: boolean;
  full_bio?: string | null;
  hero_image_path: string | null;
  id: string;
  instagram_followers?: number | null;
  instagram_url: string | null;
  primary_category?: string | null;
  profile_image_path: string | null;
  published_at: string | null;
  seo_description?: string | null;
  seo_title?: string | null;
  short_bio?: string | null;
  slug: string;
  sort_order?: number | null;
  youtube_subscribers?: number | null;
  youtube_url: string | null;
};

export function toPublicCreator(row: PublicCreatorSource): PublicCreator {
  const categories = (row.categories ?? []).filter(
    (category) => category.trim().length > 0,
  );
  const displayName = row.display_name?.trim() || "";

  return {
    bio: row.full_bio ?? null,
    categories,
    city: row.city?.trim() || null,
    cover_image_path: null,
    display_name: displayName,
    featured: row.featured,
    headline: row.short_bio ?? null,
    hero_image_path: row.hero_image_path,
    id: row.id,
    instagram_followers: normaliseFollowerCount(row.instagram_followers),
    instagram_url: row.instagram_url,
    linkedin_url: null,
    primary_category:
      row.primary_category?.trim() || getPrimaryCategory(categories),
    profile_image_path: row.profile_image_path,
    published_at: row.published_at,
    seo_description: row.seo_description ?? null,
    seo_title: row.seo_title ?? null,
    short_bio: row.short_bio ?? null,
    slug: row.slug,
    sort_order: row.sort_order ?? 0,
    tiktok_followers: null,
    tiktok_url: null,
    twitter_url: null,
    youtube_followers: normaliseFollowerCount(row.youtube_subscribers),
    youtube_url: row.youtube_url,
  };
}

export function comparePublicCreators(
  a: PublicCreator,
  b: PublicCreator,
): number {
  if (a.sort_order !== b.sort_order) {
    return a.sort_order - b.sort_order;
  }

  return a.display_name.localeCompare(b.display_name, "en", {
    sensitivity: "base",
  });
}

export function getCreatorProfileImage(creator: PublicCreator): string | null {
  return creator.profile_image_path ?? creator.hero_image_path ?? creator.cover_image_path;
}

export function getCreatorHeroImage(creator: PublicCreator): string | null {
  return creator.hero_image_path ?? creator.profile_image_path ?? creator.cover_image_path;
}

export function getCreatorCategoryLabels(creator: PublicCreator): string[] {
  const labels = [creator.primary_category, ...creator.categories]
    .map((category) => category.trim())
    .filter(Boolean);

  return uniqueLabels(labels);
}

export function collectRosterCategories(creators: PublicCreator[]): string[] {
  const labels = creators.flatMap((creator) => getCreatorCategoryLabels(creator));
  return uniqueLabels(labels).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );
}

export function filterPublicCreators(
  creators: PublicCreator[],
  query: string,
  category: string,
): PublicCreator[] {
  const normalisedQuery = query.trim().toLowerCase();
  const normalisedCategory = category.trim().toLowerCase();

  return creators.filter((creator) => {
    if (
      normalisedCategory &&
      !getCreatorCategoryLabels(creator).some(
        (label) => label.toLowerCase() === normalisedCategory,
      )
    ) {
      return false;
    }

    if (!normalisedQuery) {
      return true;
    }

    const haystack = [
      creator.display_name,
      creator.primary_category,
      ...creator.categories,
      creator.city ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalisedQuery);
  });
}

export function getNextPublicCreator(
  creators: PublicCreator[],
  slug: string,
): PublicCreator | null {
  if (creators.length < 2) {
    return null;
  }

  const index = creators.findIndex((creator) => creator.slug === slug);

  if (index === -1) {
    return creators[0] ?? null;
  }

  return creators[(index + 1) % creators.length] ?? null;
}

export function getCreatorEnquiryHref(slug: string): string {
  const params = new URLSearchParams({ creator: slug });
  return `/contact?${params.toString()}`;
}

export function getApprovedCreatorSocials(
  creator: PublicCreator,
): PublicCreatorSocialLink[] {
  const links: Array<[string | null, PublicCreatorSocialLink["platform"], string, number | null]> =
    [
      [creator.instagram_url, "instagram", "Instagram", creator.instagram_followers],
      [creator.youtube_url, "youtube", "YouTube", creator.youtube_followers],
      [creator.tiktok_url, "tiktok", "TikTok", creator.tiktok_followers],
      [creator.twitter_url, "twitter", "X", null],
      [creator.linkedin_url, "linkedin", "LinkedIn", null],
    ];

  return links.flatMap(([href, platform, label, followers]) => {
    const safeHref = getSafeHttpUrl(href);

    return safeHref
      ? [
          {
            followers,
            href: safeHref,
            label,
            platform,
          },
        ]
      : [];
  });
}

export function getCreatorMetaDescription(creator: PublicCreator): string {
  const seo = creator.seo_description?.trim();

  if (seo) {
    return seo;
  }

  const shortBio = creator.short_bio?.trim() || creator.headline?.trim();

  if (shortBio) {
    return shortBio;
  }

  const bio = creator.bio?.replace(/\s+/g, " ").trim();

  if (bio) {
    return bio.length > 160 ? `${bio.slice(0, 157).trimEnd()}…` : bio;
  }

  const city = creator.city ? ` in ${creator.city}` : "";
  return `${creator.display_name} is a ${creator.primary_category} represented by Backstage${city}.`;
}

function normaliseFollowerCount(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.trunc(value);
}

function uniqueLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const label of labels) {
    const key = label.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(label);
  }

  return unique;
}
