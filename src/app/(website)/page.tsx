import type { Metadata } from "next";
import { Suspense } from "react";

import { EditorialTicker } from "@/components/motion/EditorialTicker";
import { FeaturedCreators, FeaturedCreatorsFallback } from "@/components/website/home/FeaturedCreators";
import { FinalCta } from "@/components/website/home/FinalCta";
import { HomeHero } from "@/components/website/home/HomeHero";
import { Ownership } from "@/components/website/home/Ownership";
import { Positioning } from "@/components/website/home/Positioning";
import { Services } from "@/components/website/home/Services";
import { getPublicSiteSettings } from "@/lib/data/settings";

const defaultTitle = "Backstage";
const defaultDescription =
  "Backstage builds creator careers into enduring businesses across content, commerce and culture.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const title = settings?.site_title || defaultTitle;
  const description = settings?.site_description || defaultDescription;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function HomePage() {
  return (
    <main id="main-content">
      <HomeHero />
      <Suspense fallback={<FeaturedCreatorsFallback />}>
        <FeaturedCreators />
      </Suspense>
      <Positioning />
      <Services />
      <EditorialTicker />
      <Ownership />
      <FinalCta />
    </main>
  );
}
