"use client";

import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CreatorFilmColumns } from "@/components/website/home/CreatorFilmColumns";
import { cinematicEase } from "@/lib/motion/variants";
import {
  BACKSTAGE_LOGO_HEIGHT,
  BACKSTAGE_LOGO_PATH,
  BACKSTAGE_LOGO_WIDTH,
} from "@/lib/utilities/brand";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type HomeHeroProps = {
  creators?: PublicCreatorCard[];
};

type IntroPhase = "montage" | "shrink" | "ready";

export function HomeHero({ creators = [] }: HomeHeroProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>(
    reducedMotion ? "ready" : "montage",
  );
  const [logoBox, setLogoBox] = useState({
    left: 20,
    small: 131,
    wide: 420,
  });

  useEffect(() => {
    if (reducedMotion) {
      delete document.documentElement.dataset.homeIntro;
      setPhase("ready");
      return;
    }

    document.documentElement.dataset.homeIntro = "play";
    const timer = window.setTimeout(() => setPhase("shrink"), 1700);

    return () => {
      window.clearTimeout(timer);
      delete document.documentElement.dataset.homeIntro;
    };
  }, [reducedMotion]);

  useEffect(() => {
    function measure() {
      const viewport = window.innerWidth;
      const pad = viewport >= 1024 ? 48 : viewport >= 640 ? 32 : 20;
      const content = Math.min(1440, viewport);
      setLogoBox({
        left: (viewport - content) / 2 + pad,
        small: viewport >= 640 ? 149 : 131,
        wide: Math.min(viewport * 0.78, 720),
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (phase !== "shrink") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("ready");
      document.documentElement.dataset.homeIntro = "done";
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const introDone = phase === "ready";

  return (
    <section
      id="act-door"
      className="relative -mt-[var(--header-offset)] min-h-svh overflow-hidden bg-ink text-ivory"
    >
      <CreatorFilmColumns creators={creators} />

      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.62)_38%,rgba(10,10,10,0.18)_68%,rgba(10,10,10,0.08)_100%),linear-gradient(180deg,rgba(10,10,10,0.28)_0%,transparent_24%,rgba(10,10,10,0.55)_100%)]"
        initial={false}
        animate={{ opacity: introDone ? 1 : 0.28 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, ease: cinematicEase }}
      />

      <m.div
        className="pointer-events-none relative z-10 flex min-h-svh flex-col justify-end px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
        initial={false}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.6, ease: cinematicEase }}
      >
        <p className="text-kicker text-oxblood">A talent company</p>
        <h1 className="mt-4 max-w-[14ch] text-display">
          We make
          <span className="block">talent own</span>
          <span className="block">
            the <span className="text-oxblood">spotlight</span>.
          </span>
        </h1>
        <p className="mt-6 max-w-[32rem] text-base leading-relaxed text-ivory/75 md:text-lg">
          Backstage is a full-stack partner for the creator economy — dealcraft,
          content strategy, brand collaborations, legal, finance and IP. Not
          brokers. Builders.
        </p>
        <div className={introDone ? "pointer-events-auto mt-8" : "mt-8"}>
          <Button href="/contact" variant="light">
            Let&apos;s Talk
          </Button>
        </div>
      </m.div>

      {!reducedMotion ? (
        <m.div
          aria-hidden
          className="pointer-events-none fixed top-5 z-[70] origin-top-left sm:top-[1.15rem]"
          initial={false}
          animate={{
            left: logoBox.left,
            opacity: introDone ? 0 : 1,
            width: phase === "montage" ? logoBox.wide : logoBox.small,
          }}
          transition={{ duration: 0.9, ease: cinematicEase }}
          onAnimationComplete={() => {
            if (phase !== "shrink") {
              return;
            }

            setPhase("ready");
            document.documentElement.dataset.homeIntro = "done";
          }}
        >
          <Image
            src={BACKSTAGE_LOGO_PATH}
            alt=""
            width={BACKSTAGE_LOGO_WIDTH}
            height={BACKSTAGE_LOGO_HEIGHT}
            priority
            className="h-auto w-full invert"
          />
        </m.div>
      ) : null}
    </section>
  );
}
