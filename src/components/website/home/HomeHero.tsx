import { Highlight } from "@/components/ui/Highlight";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { HeroComposition } from "@/components/website/home/HeroComposition";

export function HomeHero() {
  return (
    <section className="border-b border-line py-12 md:py-20 lg:py-24">
      <Container className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
        <div>
          <SectionLabel>Talent, built as a company</SectionLabel>
          <Reveal as="h1" className="mt-6 max-w-[13ch] text-display">
            Behind every icon is a <Highlight>power</Highlight> move.
          </Reveal>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Backstage builds creator careers into{" "}
            <span className="font-semibold text-ink underline decoration-ink/40 underline-offset-[0.18em]">
              enduring businesses
            </span>{" "}
            across content, commerce and culture.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={{ pathname: "/", hash: "featured" }}>
              Meet the talent
            </Button>
            <Button href="/contact" variant="ghost">
              Let&apos;s talk
            </Button>
          </div>
        </div>
        <HeroComposition />
      </Container>
    </section>
  );
}
