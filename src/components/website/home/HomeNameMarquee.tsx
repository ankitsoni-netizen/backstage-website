import { cn } from "@/lib/utilities/cn";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type HomeNameMarqueeProps = {
  creators: PublicCreatorCard[];
};

export function HomeNameMarquee({ creators }: HomeNameMarqueeProps) {
  const names =
    creators.length > 0
      ? creators.map((creator) => creator.name)
      : ["Talent", "Strategy", "Partnerships", "IP", "Ownership"];

  return (
    <div className="overflow-hidden bg-ink py-5" aria-hidden>
      <div className="flex w-max marquee-rail">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="flex items-center gap-8 pr-8 font-display text-[clamp(1.5rem,3vw,2.6rem)] leading-none font-semibold tracking-[-0.03em] text-ivory uppercase sm:gap-12 sm:pr-12"
          >
            {names.map((name) => (
              <span key={`${copy}-${name}`} className="flex items-center gap-8 sm:gap-12">
                <span>{name}</span>
                <span className={cn("text-oxblood")}>/</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
