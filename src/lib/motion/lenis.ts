import type { LenisOptions } from "lenis";

export const publicLenisOptions = {
  allowNestedScroll: true,
  anchors: {
    duration: 1,
    offset: -88,
  },
  autoRaf: true,
  lerp: 0.11,
  prevent: (node: HTMLElement) =>
    Boolean(node.closest("dialog, [data-lenis-prevent]")),
  respectReducedMotion: true,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
  syncTouch: false,
  wheelMultiplier: 0.92,
} satisfies LenisOptions;
