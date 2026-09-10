import dynamic from "next/dynamic";

import { SectionLabel } from "@/components/ui/SectionLabel";

const BackstageCapabilitiesCylinder = dynamic(
  () =>
    import("@/components/motion/BackstageCapabilitiesCylinder").then(
      (mod) => mod.BackstageCapabilitiesCylinder,
    ),
);

export function MeetTheCrew() {
  return (
    <section id="crew" className="scroll-mt-[var(--header-offset)] bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <SectionLabel index="04">Meet the crew</SectionLabel>
          <p className="hidden max-w-[28ch] text-sm text-muted md:block">
            Six disciplines. One house.
          </p>
        </div>
      </div>
      <BackstageCapabilitiesCylinder />
    </section>
  );
}
