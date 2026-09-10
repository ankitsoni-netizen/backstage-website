import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SectionWash } from "@/components/motion/SectionWash";
import { StickyShift } from "@/components/motion/StickyShift";

export function Positioning() {
  return (
    <SectionWash
      color="#ebe4d6"
      className="border-b border-line bg-paper py-16 md:py-24"
    >
      <Container className="md:grid md:grid-cols-12 md:items-start md:gap-10">
        <StickyShift className="md:col-span-7">
          <SectionLabel index="02">Position</SectionLabel>
          <Reveal as="h2" className="mt-5 max-w-[14ch] text-display">
            Creators don&apos;t need another{" "}
            <Highlight>middleman</Highlight>.
          </Reveal>
        </StickyShift>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:col-span-5 md:mt-16">
          They need{" "}
          <span className="font-semibold text-ink underline decoration-ink/40 underline-offset-[0.18em]">
            infrastructure, leverage
          </span>{" "}
          and a team built for the long game.
        </p>
      </Container>
    </SectionWash>
  );
}
