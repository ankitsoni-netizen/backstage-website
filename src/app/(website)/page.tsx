import type { Metadata } from "next";

import { GreenRoom } from "@/components/website/home/GreenRoom";
import { HomeHero } from "@/components/website/home/HomeHero";
import { HomeImpact } from "@/components/website/home/HomeImpact";
import { HomeNameMarquee } from "@/components/website/home/HomeNameMarquee";
import { HomeWhatWeDo } from "@/components/website/home/HomeWhatWeDo";
import { HomeWhy } from "@/components/website/home/HomeWhy";
import { listHomepageCreators, listPublishedCreators } from "@/lib/data/creators";
import { getPublicSiteSettings } from "@/lib/data/settings";
import { toPublicCreatorCard } from "@/lib/utilities/creator-card";
import type { PublicCreator } from "@/types/public";

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

export default async function HomePage() {
  let featured: PublicCreator[] = [];
  let roster: PublicCreator[] = [];

  try {
    const homepage = await listHomepageCreators();
    featured = homepage.creators;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load homepage creators", message);
  }

  try {
    roster = await listPublishedCreators();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load published creators", message);
  }

  const featuredCards = featured.map(toPublicCreatorCard);
  const rosterCards = roster.map(toPublicCreatorCard);
  const marqueeCards = rosterCards.length > 0 ? rosterCards : featuredCards;
  const heroCards =
    featuredCards.length > 0
      ? [...featuredCards, ...rosterCards]
      : marqueeCards;

  return (
    <main id="main-content">
      <HomeHero creators={heroCards} />
      <HomeWhatWeDo />
      <HomeNameMarquee creators={marqueeCards} />
      <GreenRoom creators={featuredCards} />
      <HomeWhy />
      <HomeImpact />
    </main>
  );
}
