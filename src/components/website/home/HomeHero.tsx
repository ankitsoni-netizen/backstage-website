import { Button } from "@/components/ui/Button";
import { CreatorFilmColumns } from "@/components/website/home/CreatorFilmColumns";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type HomeHeroProps = {
  creators?: PublicCreatorCard[];
};

export function HomeHero({ creators = [] }: HomeHeroProps) {
  return (
    <section
      id="act-door"
      className="relative -mt-[var(--header-offset)] min-h-svh overflow-hidden bg-ink text-ivory"
    >
      <CreatorFilmColumns creators={creators} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.62)_38%,rgba(10,10,10,0.18)_68%,rgba(10,10,10,0.08)_100%),linear-gradient(180deg,rgba(10,10,10,0.28)_0%,transparent_24%,rgba(10,10,10,0.55)_100%)]"
      />

      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col justify-end px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <p className="text-kicker text-oxblood">A talent company</p>
        <h1 className="mt-4 max-w-[14ch] text-display">
          We make
          <span className="block">talent own</span>
          <span className="block">
            the <span className="text-oxblood">spotlight</span>.
          </span>
        </h1>
        <p className="mt-6 max-w-[32rem] text-base leading-relaxed text-ivory/75 md:text-lg">
          Backstage is a full-stack partner for the creator economy — dealcraft,
          content strategy, brand collaborations, legal, finance and IP. Not
          brokers. Builders.
        </p>
        <div className="pointer-events-auto mt-8">
          <Button href="/contact" variant="light">
            Let&apos;s Talk
          </Button>
        </div>
      </div>
    </section>
  );
}
