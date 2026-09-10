import { Container } from "@/components/ui/Container";
import { LoadingBlock } from "@/components/ui/LoadingBlock";

export default function ContactLoading() {
  return (
    <main id="main-content" className="flex-1 py-16 md:py-24">
      <Container>
        <LoadingBlock label="Loading contact" />
      </Container>
    </main>
  );
}
