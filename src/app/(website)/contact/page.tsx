import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/website/contact/ContactForm";
import { listPublishedCreators, getPublishedCreatorBySlug } from "@/lib/data/creators";
import { getPublicSiteSettings } from "@/lib/data/settings";
import { firstSearchParam } from "@/lib/utilities/search-params";
import { getSafeHttpUrl } from "@/lib/utilities/urls";
import type { PublicCreator } from "@/types/public";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Brand brief, talent enquiry or a bigger business idea — bring Backstage the ambition.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage({
  searchParams,
}: PageProps<"/contact">) {
  const params = await searchParams;
  const slug = firstSearchParam(params.creator)?.trim() ?? "";

  const [settings, roster, creator] = await Promise.all([
    getPublicSiteSettings(),
    listPublishedCreators().catch(() => [] as PublicCreator[]),
    slug
      ? getPublishedCreatorBySlug(slug).catch(() => null)
      : Promise.resolve(null),
  ]);

  const meetingUrl = getSafeHttpUrl(settings?.meeting_url);
  const contactEmail = settings?.contact_email?.trim() || null;
  const creators = roster.map((item) => ({
    display_name: item.display_name,
    id: item.id,
    slug: item.slug,
  }));

  return (
    <main id="main-content" className="flex-1">
      <Container className="grid gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionLabel>Enquiries</SectionLabel>
          <Reveal as="h1" className="mt-5 max-w-[12ch] text-display">
            A great partnership starts <Highlight>off-script</Highlight>.
          </Reveal>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
            Brand brief, talent enquiry or a bigger business idea—bring us the
            ambition. We&apos;ll bring the{" "}
            <span className="font-semibold text-ink underline decoration-ink/40 underline-offset-[0.18em]">
              right people
            </span>{" "}
            into the room.
          </p>

          {contactEmail || meetingUrl ? (
            <ul className="mt-10 flex flex-col gap-3 text-base">
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="underline decoration-ink/40 underline-offset-[0.28em] transition-colors duration-200 hover:decoration-ink"
                  >
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {meetingUrl ? (
                <li>
                  <a
                    href={meetingUrl}
                    rel="noreferrer"
                    target="_blank"
                    className="underline decoration-ink/40 underline-offset-[0.28em] transition-colors duration-200 hover:decoration-ink"
                  >
                    Book directly
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}

          {slug && !creator ? (
            <p className="mt-8 max-w-prose text-base text-muted">
              That creator is not on the public roster. Send a general enquiry
              instead.
            </p>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          <ContactForm
            creator={
              creator
                ? {
                    display_name: creator.display_name,
                    id: creator.id,
                    slug: creator.slug,
                  }
                : null
            }
            creators={creators}
            meetingUrl={meetingUrl}
          />
        </div>
      </Container>
    </main>
  );
}
