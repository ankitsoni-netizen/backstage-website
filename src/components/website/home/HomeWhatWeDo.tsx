import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { backstageCapabilities } from "@/lib/content/capabilities";

export function HomeWhatWeDo() {
  return (
    <section id="what-we-do" className="bg-ink text-ivory">
      <Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
        <div className="lg:col-span-8">
          <h2 className="text-display">
            This is
            <span className="block">what we do.</span>
          </h2>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <Link
            href="/talent"
            className="text-kicker text-oxblood underline decoration-oxblood/50 underline-offset-[0.4em] hover:decoration-oxblood"
          >
            Our Work
          </Link>
        </div>
      </Container>

      <Container className="pb-20 lg:pb-28">
        <div className="grid gap-12 border-t border-ivory/15 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="max-w-[16ch] font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em] uppercase">
              Elevate creator businesses. Protect the value.
            </h3>
            <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-ivory/70">
              In the creator economy you need more than a booking. It takes a
              house: negotiation, strategy, partnerships, legal, finance and IP
              — so careers become companies.
            </p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            {backstageCapabilities.map((item) => (
              <li key={item.number}>
                <p className="text-kicker text-oxblood">{item.number}</p>
                <h4 className="mt-2 font-display text-2xl leading-none font-semibold tracking-[-0.03em] uppercase">
                  {item.title}
                </h4>
                <p className="mt-3 max-w-[28rem] text-sm leading-relaxed text-ivory/65">
                  {item.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
