import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SectionWash } from "@/components/motion/SectionWash";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const services = [
  {
    title: "Brand partnerships",
    copy: "Collaborations shaped around each creator, not a borrowed media plan.",
  },
  {
    title: "Content and growth",
    copy: "Strategy, packaging and cadence so the work compounds instead of resetting each month.",
  },
  {
    title: "Business and IP",
    copy: "Formats, ownership and ventures that can outlast a single campaign.",
  },
  {
    title: "Legal and finance",
    copy: "Contracts, rights and money treated as infrastructure, not an afterthought.",
  },
] as const;

export function Services() {
  return (
    <SectionWash
      id="what-we-do"
      color="#f3eee4"
      className="scroll-mt-24 border-b border-line bg-paper py-16 md:py-24"
    >
      <Container>
        <SectionLabel index="03">Full-stack</SectionLabel>
        <Reveal as="h2" className="mt-5 max-w-[12ch] text-title">
          The house, end to <Highlight>end</Highlight>.
        </Reveal>
        <Stagger className="mt-12 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <StaggerItem
              key={service.title}
              className="grid gap-4 py-8 md:grid-cols-[8rem_minmax(0,0.9fr)_minmax(0,1.2fr)] md:items-baseline md:gap-10"
            >
              <p className="font-sans text-sm font-medium tracking-[0.16em] uppercase text-muted">
                0{index + 1}
              </p>
              <h3 className="font-sans text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                {service.title}
              </h3>
              <p className="max-w-prose text-base leading-relaxed text-muted">
                {service.copy}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </SectionWash>
  );
}
