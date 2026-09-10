const phrases = [
  "TALENT",
  "STRATEGY",
  "PARTNERSHIPS",
  "IP",
  "OWNERSHIP",
] as const;

export function EditorialMarquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-ivory" aria-hidden>
      <div className="flex w-max marquee-rail">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="flex items-center gap-6 py-3 pr-6 font-display text-[clamp(1.4rem,3vw,2.4rem)] leading-none font-semibold tracking-[-0.03em] uppercase sm:gap-10 sm:pr-10"
          >
            {phrases.map((phrase) => (
              <span key={`${copy}-${phrase}`} className="flex items-center gap-6 sm:gap-10">
                <span>{phrase}</span>
                <span className="text-oxblood">/</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
