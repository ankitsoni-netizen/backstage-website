import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CreatorImage } from "@/components/ui/CreatorImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import {
  getApprovedCreatorSocials,
  getCreatorCategoryLabels,
  getCreatorEnquiryHref,
  getCreatorHeroImage,
} from "@/lib/utilities/creators";
import { formatFollowerCount } from "@/lib/utilities/format";
import { resolveMediaUrl } from "@/lib/utilities/storage";
import type { PublicCreator } from "@/types/public";

type CreatorProfileProps = {
  creator: PublicCreator;
  nextCreator: PublicCreator | null;
};

export function CreatorProfile({ creator, nextCreator }: CreatorProfileProps) {
  const heroSrc = resolveMediaUrl(getCreatorHeroImage(creator));
  const categories = getCreatorCategoryLabels(creator);
  const socials = getApprovedCreatorSocials(creator);
  const bioParagraphs = (creator.bio ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="flex-1 pb-16 md:pb-24">
      <Container className="grid gap-10 border-b border-line py-12 md:grid-cols-12 md:gap-12 md:py-16">
        <div className="group md:col-span-6 lg:col-span-5">
          <CreatorImage
            src={heroSrc}
            name={creator.display_name}
            alt={creator.display_name}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <SectionLabel>{creator.primary_category}</SectionLabel>
          <Reveal as="h1" className="mt-5 max-w-[12ch] text-display">
            {creator.display_name}
          </Reveal>
          {creator.city ? (
            <p className="mt-4 text-lg text-muted">{creator.city}</p>
          ) : null}

          {categories.length > 1 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className="border border-line px-3 py-1 text-sm tracking-[-0.02em]"
                >
                  {category}
                </li>
              ))}
            </ul>
          ) : null}

          {socials.length > 0 ? (
            <ul className="mt-8 flex flex-col gap-2">
              {socials.map((link) => {
                const followers =
                  link.followers != null
                    ? formatFollowerCount(link.followers)
                    : "";

                return (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      rel="noreferrer"
                      target="_blank"
                      className="text-base underline decoration-ink/40 underline-offset-[0.28em] transition-colors duration-200 hover:decoration-ink"
                    >
                      {link.label}
                      {followers ? ` · ${followers}` : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="mt-10">
            <Button href={getCreatorEnquiryHref(creator.slug)} variant="signal">
              Enquire about this creator
            </Button>
          </div>
        </div>
      </Container>

      {bioParagraphs.length > 0 ? (
        <Container width="narrow" className="py-12 md:py-16">
          <SectionLabel>Profile</SectionLabel>
          <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed">
            {bioParagraphs.map((paragraph) => (
              <p key={paragraph} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      ) : null}

      <Container className="flex flex-col gap-6 border-t border-line py-10 md:flex-row md:items-end md:justify-between">
        <TextLink href="/talent">Back to the roster</TextLink>
        {nextCreator ? (
          <p className="text-lg">
            Next:{" "}
            <TextLink href={`/talent/${nextCreator.slug}`}>
              {nextCreator.display_name}
            </TextLink>
          </p>
        ) : null}
      </Container>
    </article>
  );
}
