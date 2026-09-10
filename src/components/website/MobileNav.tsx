"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useId, useRef, useState } from "react";

import { Wordmark } from "@/components/shared/Wordmark";
import { staggerList, revealItem } from "@/lib/motion/variants";
import { cn } from "@/lib/utilities/cn";
import { getNavHref, websiteNav } from "@/lib/utilities/navigation";

type MobileNavProps = {
  inverted?: boolean;
};

export function MobileNav({ inverted = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className={cn(
          "min-h-11 border px-3 text-kicker md:hidden",
          inverted ? "border-ivory/50 text-ivory" : "border-ink text-ink",
        )}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={openMenu}
      >
        Menu
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="glass-dark surface-dark fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 p-0 text-ivory backdrop:bg-charcoal/70"
        onClose={() => setOpen(false)}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <p id={titleId} className="text-kicker text-ivory/70">
              Navigate
            </p>
            <Wordmark className="h-7 max-w-[9rem]" tone="ink" />
            <button
              type="button"
              className="min-h-11 border border-ivory/50 px-3 text-kicker"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-end px-5 pb-12">
            <m.ul
              className="flex flex-col gap-1"
              initial="hidden"
              animate={open ? "show" : "hidden"}
              variants={staggerList}
            >
              {websiteNav.map((item) => (
                <m.li key={item.label} variants={revealItem}>
                  <Link
                    href={getNavHref(item)}
                    className="block py-2 font-display text-[clamp(2.8rem,14vw,5rem)] leading-[0.9] font-semibold uppercase tracking-[-0.03em]"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </m.li>
              ))}
            </m.ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
