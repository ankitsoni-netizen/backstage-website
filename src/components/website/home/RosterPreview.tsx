import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CreatorImage } from "@/components/ui/CreatorImage";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type RosterPreviewProps = {
  creators: PublicCreatorCard[];
};

export function RosterPreview({ creators }: RosterPreviewProps) {
  const preview = creators.slice(0, 9);

  return (
    <section id="roster-preview" className="scroll-mt-[var(--header-offset)] bg-warm-grey py-16 md:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-kicker text-oxblood">Our work</p>
            <h2 className="mt-4 max-w-[10ch] text-display-sm">The roster.</h2>
          </div>
          <Button href="/talent" variant="ghost">
            Explore the roster
          </Button>
        </div>

        {preview.length === 0 ? (
          <EmptyState
            className="mt-12"
            title="The roster is being assembled"
            description="Published talent will appear here shortly."
            action={
              <Button href="/contact" variant="ghost">
                Let&apos;s talk
              </Button>
            }
          />
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((creator, index) => (
              <li key={creator.href}>
                <Link href={creator.href} className="group block">
                  <CreatorImage
                    src={creator.src}
                    name={creator.name}
                    alt={creator.alt}
                    priority={index < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <p className="mt-4 font-display text-[1.55rem] leading-tight font-semibold tracking-[-0.03em] uppercase">
                    {creator.name}
                  </p>
                  <p className="mt-2 text-kicker text-oxblood">{creator.category}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
