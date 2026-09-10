import { getCreatorDisplayImage } from "@/lib/utilities/media";
import { formatFollowerCount } from "@/lib/utilities/format";
import { resolveMediaUrl } from "@/lib/utilities/storage";
import type { PublicCreator } from "@/types/public";

export type PublicCreatorCard = {
  alt: string;
  category: string;
  city: string | null;
  featured: boolean;
  href: string;
  instagramFollowers: string | null;
  name: string;
  src: string | null;
  youtubeFollowers: string | null;
};

export function toPublicCreatorCard(creator: PublicCreator): PublicCreatorCard {
  return {
    alt: creator.display_name,
    category: creator.primary_category,
    city: creator.city,
    featured: creator.featured,
    href: `/talent/${creator.slug}`,
    instagramFollowers:
      creator.instagram_followers != null
        ? formatFollowerCount(creator.instagram_followers)
        : null,
    name: creator.display_name,
    src: resolveMediaUrl(getCreatorDisplayImage(creator)),
    youtubeFollowers:
      creator.youtube_followers != null
        ? formatFollowerCount(creator.youtube_followers)
        : null,
  };
}
