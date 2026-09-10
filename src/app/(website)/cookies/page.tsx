import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Preview cookie policy for the Backstage website. This page is for design review only.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <main id="main-content" className="flex-1 bg-ivory">
      <Container width="narrow" className="py-16 md:py-24">
        <p className="text-kicker text-oxblood">Preview</p>
        <h1 className="mt-4 text-display-sm">Cookie Policy</h1>
        <p className="mt-4 rounded-[2px] border border-line bg-warm-grey px-4 py-3 text-sm leading-relaxed text-muted">
          This page is a preview draft for website review. It is not legal
          advice and should be replaced with counsel-approved terms before
          public launch.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              What cookies are
            </h2>
            <p className="mt-3 text-muted">
              Cookies are small files stored on your device. They help a site
              remember choices, keep pages working, and — if you allow them —
              understand how the site is used.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              How Backstage uses cookies
            </h2>
            <p className="mt-3 text-muted">
              We use cookies to offer a better browsing experience, analyze
              site traffic and personalise content. Essential cookies run
              regardless of the banner. Analytics and personalisation cookies
              are used only if you choose Accept all cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              Your choices
            </h2>
            <p className="mt-3 text-muted">
              Reject all cookies keeps only what the site needs to function.
              Accept all cookies allows optional measurement and
              personalisation. You can read how this sits alongside personal
              data in our{" "}
              <Link
                href="/privacy"
                className="text-ink underline decoration-ink/30 underline-offset-[0.3em] hover:text-oxblood hover:decoration-oxblood"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
