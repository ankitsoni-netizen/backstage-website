import { Highlight } from "@/components/ui/Highlight";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCta() {
  return (
    <section className="border-b border-line py-16 md:py-24">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <Reveal as="h2" className="max-w-[8ch] text-display">
          Want <Highlight>in</Highlight>?
        </Reveal>
        <Button href="/contact" variant="signal">
          Step into the room
        </Button>
      </Container>
    </section>
  );
}
