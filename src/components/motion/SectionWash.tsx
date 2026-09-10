"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { editorialEase } from "@/lib/motion/variants";

type SectionWashProps = {
  children: ReactNode;
  className?: string;
  color: string;
  id?: string;
};

export function SectionWash({
  children,
  className,
  color,
  id,
}: SectionWashProps) {
  return (
    <m.section
      id={id}
      className={className}
      initial={false}
      whileInView={{ backgroundColor: color }}
      viewport={{ amount: 0.4, once: false }}
      transition={{ duration: 0.7, ease: editorialEase }}
    >
      {children}
    </m.section>
  );
}
