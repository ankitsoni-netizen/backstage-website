import Link from "next/link";

import { SkipLink } from "@/components/ui/SkipLink";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/shared/Wordmark";
import { MobileNav } from "@/components/website/MobileNav";
import { getNavHref, websiteNav } from "@/lib/utilities/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-[8px]">
      <SkipLink />
      <Container className="flex items-center justify-between py-4">
        <Link href="/" aria-label="Backstage home" className="py-1">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {websiteNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={getNavHref(item)}
                  className="text-sm font-medium uppercase tracking-[0.04em] underline decoration-ink/40 underline-offset-[0.35em] transition-colors duration-200 hover:decoration-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav />
      </Container>
    </header>
  );
}
