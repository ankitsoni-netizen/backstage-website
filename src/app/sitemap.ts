import type { MetadataRoute } from "next";

import { listPublishedCreators } from "@/lib/data/creators";
import { getMetadataBaseUrl } from "@/lib/utilities/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getMetadataBaseUrl().origin;
  const entries: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/talent`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${origin}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${origin}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const creators = await listPublishedCreators();

    for (const creator of creators) {
      entries.push({
        url: `${origin}/talent/${creator.slug}`,
        lastModified: creator.published_at
          ? new Date(creator.published_at)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Public sitemap still ships the static routes if the roster is unavailable.
  }

  return entries;
}
