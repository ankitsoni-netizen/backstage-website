import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function Ownership() {
  return (
    <section className="surface-ink bg-ink text-paper">
      <Container className="py-20 md:py-28">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-paper/70 underline decoration-paper/40 underline-offset-[0.28em]">
          Ownership
        </p>
        <Reveal as="h2" className="mt-6 max-w-[12ch] text-display text-paper">
          From rising voice to media <Highlight>empire</Highlight>.
        </Reveal>
      </Container>
    </section>
  );
}
