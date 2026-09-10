export const cinematicEase = [0.16, 1, 0.3, 1] as const;
export const editorialEase = [0.22, 1, 0.36, 1] as const;

export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: editorialEase },
    y: 0,
  },
};

export const staggerList = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.06,
    },
  },
};
