const phrases = [
  "Talent",
  "Partnerships",
  "Content",
  "Commerce",
  "IP",
  "Legal",
  "Finance",
  "The long game",
] as const;

export function EditorialTicker() {
  return (
    <div
      className="overflow-hidden border-y border-ink bg-ink text-paper"
      aria-hidden
    >
      <div className="flex w-max motion-safe:animate-[ticker_46s_linear_infinite]">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="flex items-center gap-6 py-4 pr-6 text-sm font-medium uppercase tracking-[0.18em] sm:gap-10 sm:pr-10"
          >
            {phrases.map((phrase) => (
              <span key={`${copy}-${phrase}`} className="flex items-center gap-6 sm:gap-10">
                <span>{phrase}</span>
                <span className="text-signal">/</span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
