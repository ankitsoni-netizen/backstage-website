"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "backstage-cookie-consent";

type CookieChoice = "accepted" | "rejected";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== "accepted" && stored !== "rejected") {
      setVisible(true);
    }
  }, []);

  function choose(choice: CookieChoice) {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-copy"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-ivory/15 bg-ink text-ivory shadow-[0_-18px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-6">
        <div className="max-w-[44rem]">
          <p id="cookie-banner-title" className="text-kicker text-oxblood">
            Use of cookies on Backstage website
          </p>
          <p
            id="cookie-banner-copy"
            className="mt-3 text-sm leading-relaxed text-ivory/80 md:text-base"
          >
            We use cookies to offer you a better browsing experience, analyze
            site traffic and personalise content. Read about how we use cookies
            in our{" "}
            <Link
              href="/privacy"
              className="underline decoration-ivory/40 underline-offset-[0.3em] hover:text-oxblood hover:decoration-oxblood"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/cookies"
            className="inline-flex min-h-11 items-center justify-center border border-ivory/50 px-5 text-kicker text-ivory hover:border-oxblood hover:text-oxblood"
          >
            Cookie policy
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center border border-ivory/50 px-5 text-kicker text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
            onClick={() => choose("rejected")}
          >
            Reject all cookies
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center border-2 border-ivory bg-ivory px-5 text-kicker text-ink hover:border-oxblood hover:bg-oxblood hover:text-ivory"
            onClick={() => choose("accepted")}
          >
            Accept all cookies
          </button>
        </div>
      </div>
    </div>
  );
}
