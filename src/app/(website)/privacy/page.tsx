import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Preview privacy policy for the Backstage website. This page is for design review only.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="flex-1 bg-ivory">
      <Container width="narrow" className="py-16 md:py-24">
        <p className="text-kicker text-oxblood">Preview</p>
        <h1 className="mt-4 text-display-sm">Privacy Policy</h1>
        <p className="mt-4 rounded-[2px] border border-line bg-warm-grey px-4 py-3 text-sm leading-relaxed text-muted">
          This page is a preview draft for website review. It is not legal
          advice and should be replaced with counsel-approved terms before
          public launch.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              Who we are
            </h2>
            <p className="mt-3 text-muted">
              Backstage is a talent company. This website is used to present
              our roster, explain how we work, and receive enquiries from
              brands, creators and partners.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              Information we collect
            </h2>
            <p className="mt-3 text-muted">
              If you contact us, we collect the details you submit — typically
              your name, work email, organisation and the brief you share. We
              also collect limited technical data such as browser type, pages
              visited and approximate location when you allow analytics
              cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              How we use it
            </h2>
            <p className="mt-3 text-muted">
              We use this information to respond to enquiries, operate and
              improve the site, understand what content is useful, and — where
              you accept cookies — personalise how the site is shown to you.
              We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              Cookies
            </h2>
            <p className="mt-3 text-muted">
              Essential cookies keep the site working. Optional cookies help us
              measure traffic and remember preferences. You can accept or
              reject optional cookies from the banner, and read more in our{" "}
              <Link
                href="/cookies"
                className="text-ink underline decoration-ink/30 underline-offset-[0.3em] hover:text-oxblood hover:decoration-oxblood"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] uppercase">
              Retention and contact
            </h2>
            <p className="mt-3 text-muted">
              Enquiry records are kept only as long as needed to handle the
              request and any follow-up work. For a privacy question about this
              preview site, use the{" "}
              <Link
                href="/contact"
                className="text-ink underline decoration-ink/30 underline-offset-[0.3em] hover:text-oxblood hover:decoration-oxblood"
              >
                contact form
              </Link>
              .
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
