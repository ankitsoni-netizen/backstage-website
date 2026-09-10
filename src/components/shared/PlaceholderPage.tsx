import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";

type PlaceholderPageProps = {
  description?: string;
  eyebrow?: string;
  title: string;
};

export function PlaceholderPage({
  description,
  eyebrow = "Backstage",
  title,
}: PlaceholderPageProps) {
  return (
    <main id="main-content" className="flex-1 py-16 md:py-24">
      <Container>
        <SectionLabel>{eyebrow}</SectionLabel>
        <Reveal as="h1" className="mt-5 max-w-[14ch] text-display">
          {title}
        </Reveal>
        {description ? (
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </Container>
    </main>
  );
}
