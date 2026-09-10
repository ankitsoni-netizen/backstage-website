import dynamic from "next/dynamic";

import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

const StageProgress = dynamic(
  () =>
    import("@/components/motion/StageProgress").then((mod) => mod.StageProgress),
);

export function Wings() {
  return (
    <section id="wings" className="bg-greige text-ink">
      <Container className="relative z-[1] pt-16 md:pt-20">
        <SectionLabel index="05">The wings</SectionLabel>
        <h2 className="mt-4 max-w-[12ch] text-display-sm">
          From talent to enterprise.
        </h2>
        <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-muted">
          Revenue systems, owned IP and teams designed for what comes after
          influence.
        </p>
      </Container>
      <StageProgress />
    </section>
  );
}
