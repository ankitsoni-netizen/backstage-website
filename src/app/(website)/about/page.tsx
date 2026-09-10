import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskedTextReveal } from "@/components/motion/MaskedTextReveal";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Backstage is the infrastructure behind creator ambition — a full-stack talent company, not a brokerage.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="relative overflow-hidden bg-greige">
        <Container className="relative py-20 md:py-28">
          <SectionLabel index="01">About</SectionLabel>
          <Reveal as="h1" className="mt-6 max-w-[14ch] text-display">
            Not brokers. Builders.
          </Reveal>
          <p className="mt-8 max-w-[38rem] text-lg leading-relaxed text-muted">
            Backstage is the infrastructure behind creator ambition. We bring
            strategy, negotiation, partnerships, legal, finance and IP
            development together—so creators can build businesses that last.
          </p>
        </Container>
      </section>

      <section className="bg-greige py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel>The house</SectionLabel>
            <MaskedTextReveal
              as="h2"
              className="mt-6 max-w-[14ch] text-display-sm"
              lines={["A talent company,", "not a marketplace."]}
            />
          </div>
          <div className="glass lg:col-span-5 lg:col-start-8">
            <div className="px-6 py-8 md:px-8">
              <p className="font-serif text-2xl leading-snug text-ink">
                Full-stack creator management. Long-term business building.
                Transparency. Creator ownership.
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted">
                From emerging talent to media companies, the work is the same:
                stay in the room, build the company, protect the value.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-ivory py-20 md:py-28">
        <Container>
          <SectionLabel>What we hold</SectionLabel>
          <ul className="mt-10 grid gap-10 md:grid-cols-2">
            {[
              [
                "The long game",
                "Careers built as companies—formats, ownership and ventures that outlast a campaign.",
              ],
              [
                "The crew",
                "Dealcraft, creative direction, partnerships, legal, finance and IP, working as one house.",
              ],
              [
                "The room",
                "A green room of talent with a point of view, not a catalogue of availability.",
              ],
              [
                "The stage",
                "When the lights come up, the work is already owned, protected and ready.",
              ],
            ].map(([title, copy]) => (
              <li key={title} className="border-t border-line pt-6">
                <h2 className="font-display text-[1.8rem] leading-none font-semibold uppercase tracking-[-0.03em]">
                  {title}
                </h2>
                <p className="mt-4 max-w-[32rem] text-base leading-relaxed text-muted">
                  {copy}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ivory py-20 md:py-28">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-[12ch] text-display-sm">
              Ready for the <Highlight>spotlight</Highlight>.
            </h2>
            <p className="mt-5 max-w-[38rem] text-lg leading-relaxed text-muted">
              Whether you&apos;re building a first breakout year or the next media
              company, the crew is already in the room.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Let&apos;s Talk</Button>
            <Button href="/talent" variant="ghost">
              Meet the Talent
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
