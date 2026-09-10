import dynamic from "next/dynamic";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

const CreatorRail = dynamic(
  () =>
    import("@/components/motion/CreatorRail").then((mod) => mod.CreatorRail),
);

type GreenRoomProps = {
  creators: PublicCreatorCard[];
};

export function GreenRoom({ creators }: GreenRoomProps) {
  return (
    <section id="green-room" className="scroll-mt-[var(--header-offset)] bg-ivory">
      <Container className="flex items-end justify-between gap-8 pt-16 pb-6 md:pt-24">
        <div>
          <p className="text-kicker text-oxblood">The roster</p>
          <h2 className="mt-4 max-w-[12ch] text-display-sm">In the room.</h2>
        </div>
        <Button href="/talent" variant="ghost" className="hidden sm:inline-flex">
          Explore Backstage Roster
        </Button>
      </Container>

      {creators.length === 0 ? (
        <Container className="pb-16">
          <EmptyState
            title="The roster is being assembled"
            description="Published talent will appear here."
            action={
              <Button href="/contact" variant="ghost">
                Let&apos;s talk
              </Button>
            }
          />
        </Container>
      ) : (
        <CreatorRail creators={creators} />
      )}

      <div className="mt-8 sm:hidden">
        <Container className="pb-6">
          <Button href="/talent" variant="ghost">
            Explore Backstage Roster
          </Button>
        </Container>
      </div>
    </section>
  );
}
