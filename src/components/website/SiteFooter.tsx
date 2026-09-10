import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/shared/Wordmark";
import { getPublicSiteSettings } from "@/lib/data/settings";
import { footerNav, getNavHref } from "@/lib/utilities/navigation";
import { getPublicSocialLinks } from "@/lib/utilities/social";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();
  const socialLinks = getPublicSocialLinks(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark mt-auto bg-ink text-ivory">
      <Container className="grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Wordmark className="h-9 max-w-[12rem]" tone="ink" />
          <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-ivory/70">
            {settings?.site_description ??
              "A full-stack partner for creators. Dealmaking, strategy, brand work, legal, finance and IP, built as a company, not a transaction."}
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-kicker text-oxblood">Connect</p>
          <ul className="mt-4 flex flex-col gap-2">
            {settings?.contact_email ? (
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-base underline decoration-ivory/30 underline-offset-[0.3em]"
                >
                  {settings.contact_email}
                </a>
              </li>
            ) : null}
            {settings?.contact_phone ? (
              <li>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="text-base underline decoration-ivory/30 underline-offset-[0.3em]"
                >
                  {settings.contact_phone}
                </a>
              </li>
            ) : null}
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                  className="text-base underline decoration-ivory/30 underline-offset-[0.3em]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {!settings?.contact_email &&
            !settings?.contact_phone &&
            socialLinks.length === 0 ? (
              <li className="text-base text-ivory/55">
                Contact details will appear here when published.
              </li>
            ) : null}
          </ul>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-kicker text-oxblood">Index</p>
          <ul className="mt-4 flex flex-col gap-2">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={getNavHref(item)}
                  className="text-base underline decoration-ivory/30 underline-offset-[0.3em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container>
        <div className="flex flex-col justify-between gap-3 border-t border-light-line py-6 text-sm text-ivory/55 sm:flex-row sm:items-center">
          <p>{year} Backstage</p>
          <p className="font-serif text-base text-ivory/80">
            The crew behind the curtain
          </p>
        </div>
      </Container>
    </footer>
  );
}
