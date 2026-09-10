"use client";

import { ReactLenis } from "lenis/react";
import { LazyMotion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

import { publicLenisOptions } from "@/lib/motion/lenis";

import "lenis/dist/lenis.css";

type MotionRootProps = {
  children: ReactNode;
};

function loadMotionFeatures() {
  return import("motion/react").then((mod) => mod.domAnimation);
}

export function MotionRoot({ children }: MotionRootProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion === true) {
      delete document.documentElement.dataset.publicMotion;
      return;
    }

    document.documentElement.dataset.publicMotion = "lenis";

    return () => {
      delete document.documentElement.dataset.publicMotion;
    };
  }, [reducedMotion]);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ReactLenis root options={publicLenisOptions}>
          <div data-motion-ready="true">{children}</div>
        </ReactLenis>
      </MotionConfig>
    </LazyMotion>
  );
}
