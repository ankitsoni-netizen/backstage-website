import Link from "next/link";

import { CreatorImage } from "@/components/ui/CreatorImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Highlight } from "@/components/ui/Highlight";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  listHomepageCreators,
  type HomepageCreators,
} from "@/lib/data/creators";
import {
  getCreatorDisplayImage,
  getPrimaryCategory,
} from "@/lib/utilities/media";
import { cn } from "@/lib/utilities/cn";
import { resolveMediaUrl } from "@/lib/utilities/storage";

function featuredLayoutClassName(index: number): string {
  if (index === 0) {
    return "md:col-span-7";
  }

  if (index === 1) {
    return "md:col-span-5 md:pt-20";
  }

  if (index === 2) {
    return "md:col-span-5 md:col-start-2";
  }

  return "md:col-span-6";
}

export function FeaturedCreatorsFallback() {
  return (
    <section className="border-b border-line py-16 md:py-24">
      <Container>
        <LoadingBlock label="Loading talent" lines={3} />
      </Container>
    </section>
  );
}

function FeaturedUnavailable() {
  return (
    <section className="border-b border-line py-16 md:py-24">
      <Container>
        <EmptyState
          title="Talent is momentarily offline"
          description="The roster could not be loaded. Try again in a moment."
          action={
            <Button href="/contact" variant="ghost">
              Let&apos;s talk
            </Button>
          }
        />
      </Container>
    </section>
  );
}

export async function FeaturedCreators() {
  let result: HomepageCreators | null = null;

  try {
    result = await listHomepageCreators();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load homepage creators", message);
    result = null;
  }

  if (!result) {
    return <FeaturedUnavailable />;
  }

  const { creators, source } = result;

  return (
    <section
      id="featured"
      className="scroll-mt-24 border-b border-line py-16 md:py-24"
    >
      <Container>
        <SectionLabel index="01">
          {source === "featured" ? "Featured" : "The roster"}
        </SectionLabel>
        <Reveal as="h2" className="mt-5 max-w-[16ch] text-title">
          {source === "featured" ? (
            <>
              Names already in the <Highlight>room</Highlight>.
            </>
          ) : (
            <>
              The roster, as it <Highlight>stands</Highlight>.
            </>
          )}
        </Reveal>

        {creators.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="The roster is being assembled"
            description="Published talent will appear here. Brands and creators can still start a conversation."
            action={
              <Button href="/contact" variant="ghost">
                Let&apos;s talk
              </Button>
            }
          />
        ) : (
          <Stagger className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
            {creators.map((creator, index) => {
              const imageSrc = resolveMediaUrl(getCreatorDisplayImage(creator));
              const category = getPrimaryCategory(creator.categories);

              return (
                <StaggerItem
                  key={creator.id}
                  className={cn(featuredLayoutClassName(index))}
                >
                  <Link href={`/talent/${creator.slug}`} className="group block">
                    <CreatorImage
                      src={imageSrc}
                      name={creator.display_name}
                      alt={creator.display_name}
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.12em] text-muted">
                      {creator.primary_category || category}
                    </p>
                    <h3 className="mt-1 font-sans text-2xl font-bold tracking-[-0.02em] underline decoration-transparent underline-offset-[0.18em] transition-colors duration-200 group-hover:decoration-ink sm:text-3xl">
                      {creator.display_name}
                    </h3>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </Container>
    </section>
  );
}
