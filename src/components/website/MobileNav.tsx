"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useId, useRef, useState } from "react";

import { staggerList, revealItem } from "@/lib/motion/variants";
import { getNavHref, websiteNav } from "@/lib/utilities/navigation";

export function MobileNav() {
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
        className="min-h-11 border border-ink px-3 text-sm font-medium uppercase tracking-[0.06em] md:hidden"
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
        className="surface-ink fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-ink p-0 text-paper backdrop:bg-ink"
        onClose={() => setOpen(false)}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <p id={titleId} className="text-sm font-medium uppercase tracking-[0.14em]">
              Navigate
            </p>
            <button
              type="button"
              className="min-h-11 border border-paper px-3 text-sm font-medium uppercase tracking-[0.06em]"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-end px-5 pb-10">
            <m.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate={open ? "show" : "hidden"}
              variants={staggerList}
            >
              {websiteNav.map((item) => (
                <m.li key={item.label} variants={revealItem}>
                  <Link
                    href={getNavHref(item)}
                    className="block py-2 font-sans text-[clamp(2.4rem,12vw,4.2rem)] font-bold leading-[1.02] tracking-[-0.02em]"
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
