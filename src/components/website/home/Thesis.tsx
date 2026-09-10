import { MaskedTextReveal } from "@/components/motion/MaskedTextReveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { thesisPrinciples } from "@/lib/content/narrative";

export function Thesis() {
  return (
    <section id="thesis" className="scroll-mt-[var(--header-offset)] bg-greige">
      <Container className="grid gap-12 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
        <div className="lg:col-span-7">
          <SectionLabel index="03">Thesis</SectionLabel>
          <MaskedTextReveal
            as="h2"
            className="mt-6 text-display"
            lines={["Not brokers.", "Builders."]}
          />
        </div>

        <div className="lg:col-span-5">
          <p className="max-w-[34rem] text-[1.05rem] leading-relaxed text-muted">
            Infrastructure behind creator ambition: strategy, deals, legal,
            finance and IP—so the work can last.
          </p>
          <div className="mt-8 border border-line bg-ivory px-5 py-6">
            <p className="font-serif text-xl leading-snug text-ink">
              Full-stack management. Creator ownership. From emerging talent to
              media companies.
            </p>
            <ol className="mt-6 grid grid-cols-2 gap-4">
              {thesisPrinciples.map((item) => (
                <li key={item.number}>
                  <p className="text-kicker text-oxblood">{item.number}</p>
                  <p className="mt-1 font-display text-xl leading-none font-semibold uppercase tracking-[-0.03em]">
                    {item.title}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
