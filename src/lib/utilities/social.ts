import type { SiteSettings } from "@/types/database";
import { getSafeHttpUrl } from "@/lib/utilities/urls";

export type PublicSocialLink = {
  href: string;
  label: string;
};

export function getPublicSocialLinks(
  settings: SiteSettings | null,
): PublicSocialLink[] {
  if (!settings) {
    return [];
  }

  const links: Array<[string | null, string]> = [
    [settings.instagram_url, "Instagram"],
    [settings.youtube_url, "YouTube"],
    [settings.twitter_url, "X"],
    [settings.linkedin_url, "LinkedIn"],
  ];

  return links.flatMap(([href, label]) => {
    const safeHref = getSafeHttpUrl(href);
    return safeHref ? [{ href: safeHref, label }] : [];
  });
}
