import type { Metadata } from "next";
import { notFound, unstable_rethrow } from "next/navigation";

import { CreatorProfile } from "@/components/website/talent/CreatorProfile";
import {
  getPublishedCreatorBySlug,
  listPublishedCreators,
} from "@/lib/data/creators";
import {
  getCreatorHeroImage,
  getCreatorMetaDescription,
  getNextPublicCreator,
} from "@/lib/utilities/creators";
import { resolveMediaUrl } from "@/lib/utilities/storage";

export async function generateMetadata({
  params,
}: PageProps<"/talent/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  try {
    const creator = await getPublishedCreatorBySlug(slug);

    if (!creator) {
      notFound();
    }

    const title = creator.seo_title?.trim() || creator.display_name;
    const description = getCreatorMetaDescription(creator);
    const image = resolveMediaUrl(getCreatorHeroImage(creator));

    return {
      title,
      description,
      alternates: {
        canonical: `/talent/${creator.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "profile",
        url: `/talent/${creator.slug}`,
        locale: "en_IN",
        ...(image
          ? {
              images: [
                {
                  url: image,
                  alt: creator.display_name,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch (error) {
    unstable_rethrow(error);
    return {
      title: "Talent",
    };
  }
}

export default async function TalentProfilePage({
  params,
}: PageProps<"/talent/[slug]">) {
  const { slug } = await params;
  const creator = await getPublishedCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  let nextCreator = null;

  try {
    const roster = await listPublishedCreators();
    nextCreator = getNextPublicCreator(roster, creator.slug);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load next creator", message);
  }

  return (
    <main id="main-content" className="flex-1">
      <CreatorProfile creator={creator} nextCreator={nextCreator} />
    </main>
  );
}
