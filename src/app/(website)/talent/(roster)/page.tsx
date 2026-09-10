import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { TalentRoster } from "@/components/website/talent/TalentRoster";
import { listPublishedCreators } from "@/lib/data/creators";
import { firstSearchParam } from "@/lib/utilities/search-params";
import type { PublicCreator } from "@/types/public";

export const metadata: Metadata = {
  title: "Talent",
  description:
    "The Backstage roster — creators represented across content, commerce and culture.",
  alternates: {
    canonical: "/talent",
  },
  openGraph: {
    title: "Talent | Backstage",
    description:
      "The Backstage roster — creators represented across content, commerce and culture.",
    type: "website",
    url: "/talent",
  },
};

export default async function TalentPage({
  searchParams,
}: PageProps<"/talent">) {
  const params = await searchParams;
  const initialQuery = firstSearchParam(params.q)?.trim() ?? "";
  const initialCategory = firstSearchParam(params.category)?.trim() ?? "";

  let creators: PublicCreator[] = [];
  let loadFailed = false;

  try {
    creators = await listPublishedCreators();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load published creators", message);
    loadFailed = true;
  }

  return (
    <main id="main-content" className="flex-1 bg-greige">
      <section className="relative overflow-hidden border-b border-line">
        <Container className="relative py-16 md:py-24">
          <SectionLabel index="01">Casting</SectionLabel>
          <Reveal as="h1" className="mt-4 max-w-[12ch] text-display">
            The roster
          </Reveal>
          <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-muted">
            Names we represent. Search by creator, category, or city.
          </p>
        </Container>
      </section>
      <TalentRoster
        creators={creators}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
        loadFailed={loadFailed}
      />
    </main>
  );
}
