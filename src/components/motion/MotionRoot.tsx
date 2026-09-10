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
  const enableSmoothScroll = reducedMotion !== true;

  useEffect(() => {
    if (!enableSmoothScroll) {
      delete document.documentElement.dataset.publicMotion;
      return;
    }

    document.documentElement.dataset.publicMotion = "lenis";

    return () => {
      delete document.documentElement.dataset.publicMotion;
    };
  }, [enableSmoothScroll]);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ReactLenis
          root
          options={
            enableSmoothScroll
              ? publicLenisOptions
              : {
                  ...publicLenisOptions,
                  anchors: false,
                  autoRaf: false,
                  lerp: 1,
                  smoothWheel: false,
                }
          }
        >
          {children}
        </ReactLenis>
      </MotionConfig>
    </LazyMotion>
  );
}
