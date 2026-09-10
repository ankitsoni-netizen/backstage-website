import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HomeImpact() {
  return (
    <section id="spotlight" className="bg-oxblood text-ivory">
      <Container className="flex min-h-[70vh] flex-col justify-end py-20 md:py-28">
        <p className="text-kicker text-ivory/80">Take the stage</p>
        <h2 className="mt-5 max-w-[14ch] text-display">Make an impact.</h2>
        <p className="mt-8 max-w-[36rem] text-lg leading-relaxed text-ivory/85">
          First breakout year or the next media company — we build the
          infrastructure behind the spotlight.
        </p>
        <div className="mt-10">
          <Button href="/contact" variant="light">
            Let&apos;s Talk
          </Button>
        </div>
      </Container>
    </section>
  );
}
