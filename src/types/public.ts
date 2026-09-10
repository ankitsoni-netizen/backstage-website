export type PublicCreator = {
  bio: string | null;
  categories: string[];
  city: string | null;
  cover_image_path: string | null;
  display_name: string;
  featured: boolean;
  headline: string | null;
  hero_image_path: string | null;
  id: string;
  instagram_followers: number | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  primary_category: string;
  profile_image_path: string | null;
  published_at: string | null;
  seo_description: string | null;
  seo_title: string | null;
  short_bio: string | null;
  slug: string;
  sort_order: number;
  tiktok_followers: number | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  youtube_followers: number | null;
  youtube_url: string | null;
};

export type PublicCreatorSocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "linkedin";

export type PublicCreatorSocialLink = {
  followers: number | null;
  href: string;
  label: string;
  platform: PublicCreatorSocialPlatform;
};
