import type { MetadataRoute } from "next";

import { getMetadataBaseUrl } from "@/lib/utilities/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getMetadataBaseUrl().origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
