"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/lib/auth/actions";
import { adminNav, isAdminNavActive } from "@/lib/admin/navigation";
import { cn } from "@/lib/utilities/cn";
import { Wordmark } from "@/components/shared/Wordmark";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-line bg-admin-fill lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block">
        <Wordmark className="text-lg" />
        <details className="lg:hidden">
          <summary className="cursor-pointer text-sm font-medium">Menu</summary>
          <NavLinks pathname={pathname} className="mt-3 pb-3" />
        </details>
      </div>
      <div className="hidden lg:block">
        <NavLinks pathname={pathname} className="px-3 pb-6" />
      </div>
    </aside>
  );
}

function NavLinks({
  className,
  pathname,
}: {
  className?: string;
  pathname: string;
}) {
  return (
    <nav aria-label="Admin" className={cn("flex flex-col gap-1", className)}>
      {adminNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-2 text-sm font-medium",
            isAdminNavActive(pathname, item.href)
              ? "bg-admin-canvas underline decoration-foreground underline-offset-[0.2em]"
              : "text-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
      >
        View website
      </a>
      <form action={signOut}>
        <button
          type="submit"
          className="w-full px-3 py-2 text-left text-sm font-medium text-muted hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
