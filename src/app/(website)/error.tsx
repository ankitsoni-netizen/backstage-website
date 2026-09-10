"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";

type WebsiteErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function WebsiteError({ error, retry }: WebsiteErrorProps) {
  return (
    <main id="main-content" className="flex-1 py-16 md:py-24">
      <Container>
        <h1 className="max-w-[12ch] text-title">
          This page could not <Highlight>load</Highlight>.
        </h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">
          Something went wrong while rendering the site. You can try again, or
          come back shortly.
        </p>
        {error.digest ? (
          <p className="mt-3 text-sm text-muted">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8">
          <Button type="button" onClick={retry}>
            Try again
          </Button>
        </div>
      </Container>
    </main>
  );
}
