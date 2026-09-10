import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function WebsiteNotFound() {
  return (
    <main id="main-content" className="flex-1 py-16 md:py-24">
      <Container>
        <SectionLabel>404</SectionLabel>
        <h1 className="mt-5 max-w-[12ch] text-display">
          This page is not on the <Highlight>roster</Highlight>.
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
          The page you asked for is unpublished, moved, or does not exist.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/talent">See the talent</Button>
          <Button href="/" variant="ghost">
            Back home
          </Button>
        </div>
      </Container>
    </main>
  );
}
