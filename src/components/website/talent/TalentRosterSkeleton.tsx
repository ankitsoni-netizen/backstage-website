import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utilities/cn";

export function TalentRosterSkeleton() {
  return (
    <main id="main-content" className="flex-1 bg-greige pb-16 md:pb-24">
      <section className="border-b border-line py-16 md:py-24">
        <Container>
          <SectionLabel index="01">Casting</SectionLabel>
          <div className="mt-5 h-[3.5rem] w-64 bg-fill motion-safe:animate-pulse md:h-24" />
          <div className="mt-6 h-5 w-full max-w-md bg-fill motion-safe:animate-pulse" />
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <div
          role="status"
          aria-live="polite"
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Loading talent</span>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} aria-hidden>
              <div className="aspect-[4/5] bg-fill motion-safe:animate-pulse" />
              <div className="mt-4 h-4 w-24 bg-fill motion-safe:animate-pulse" />
              <div
                className={cn(
                  "mt-2 h-7 bg-fill motion-safe:animate-pulse",
                  index % 2 === 0 ? "w-40" : "w-32",
                )}
              />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
