export function HeroComposition() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
    >
      <div className="absolute inset-[12%] bg-ink motion-safe:animate-[drift_16s_ease-in-out_infinite]" />
      <div className="absolute top-0 right-0 h-[46%] w-[42%] bg-signal" />
      <div className="absolute bottom-[8%] left-0 h-[38%] w-[58%] bg-powder" />
      <div className="absolute top-[18%] left-[12%] h-16 w-16 bg-blush sm:h-20 sm:w-20" />
      <div className="absolute right-[14%] bottom-[22%] h-24 w-24 bg-orange motion-safe:animate-[slow-spin_36s_linear_infinite] sm:h-28 sm:w-28" />
    </div>
  );
}
