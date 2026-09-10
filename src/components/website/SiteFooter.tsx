import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { Wordmark } from "@/components/shared/Wordmark";
import { getPublicSiteSettings } from "@/lib/data/settings";
import { footerNav, getNavHref } from "@/lib/utilities/navigation";
import { getPublicSocialLinks } from "@/lib/utilities/social";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();
  const socialLinks = getPublicSocialLinks(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <Container className="grid gap-12 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Wordmark className="text-2xl" />
          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">
            {settings?.site_description ??
              "A full-stack partner for creators. Dealmaking, strategy, brand work, legal, finance and IP, built as a company, not a transaction."}
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-sm font-medium uppercase tracking-[0.08em]">
            Contact
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {settings?.contact_email ? (
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-base underline decoration-ink/30 underline-offset-[0.3em]"
                >
                  {settings.contact_email}
                </a>
              </li>
            ) : null}
            {settings?.contact_phone ? (
              <li>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="text-base underline decoration-ink/30 underline-offset-[0.3em]"
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
                  className="text-base underline decoration-ink/30 underline-offset-[0.3em]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {!settings?.contact_email &&
            !settings?.contact_phone &&
            socialLinks.length === 0 ? (
              <li className="text-base text-muted">
                Contact details will appear here when published.
              </li>
            ) : null}
          </ul>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-sm font-medium uppercase tracking-[0.08em]">
            Index
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {footerNav.map((item) => (
              <li key={item.label}>
                <TextLink href={getNavHref(item)}>{item.label}</TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container>
        <p className="border-t border-line py-6 text-sm text-muted">
          {year} Backstage
        </p>
      </Container>
    </footer>
  );
}
