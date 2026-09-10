"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SkipLink } from "@/components/ui/SkipLink";
import { Wordmark } from "@/components/shared/Wordmark";
import { MobileNav } from "@/components/website/MobileNav";
import { getNavHref, websiteNav } from "@/lib/utilities/navigation";
import { cn } from "@/lib/utilities/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-50 border-b",
        isHome
          ? "border-ivory/10 bg-ink text-ivory"
          : "border-line bg-ivory text-ink",
      )}
    >
      <SkipLink />
      <div className="mx-auto flex min-h-[var(--header-offset)] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Backstage home"
          className="site-header-mark py-1"
        >
          <Wordmark priority tone={isHome ? "ink" : "paper"} />
        </Link>
        <div className="site-header-chrome flex items-center">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {websiteNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={getNavHref(item)}
                    className={cn(
                      "text-kicker underline decoration-current/25 underline-offset-[0.4em] transition-colors duration-200 hover:text-oxblood hover:decoration-oxblood",
                      item.href === "/contact" &&
                        "text-oxblood decoration-oxblood",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <MobileNav inverted={isHome} />
        </div>
      </div>
    </header>
  );
}
