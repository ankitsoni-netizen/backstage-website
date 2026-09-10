export const HOMEPAGE_FEATURED_SLUGS = [
  "gorang-grover",
  "simran-sehgal",
  "prachi-chaudhary",
  "jatin-parmar",
  "sanya-puri",
  "vaishali-attri",
  "lagni-panchal",
  "nyraa-banerjee",
] as const;

export function compareHomepageFeatured(
  leftSlug: string,
  rightSlug: string,
): number {
  const left = HOMEPAGE_FEATURED_SLUGS.indexOf(
    leftSlug as (typeof HOMEPAGE_FEATURED_SLUGS)[number],
  );
  const right = HOMEPAGE_FEATURED_SLUGS.indexOf(
    rightSlug as (typeof HOMEPAGE_FEATURED_SLUGS)[number],
  );
  const leftRank = left === -1 ? HOMEPAGE_FEATURED_SLUGS.length : left;
  const rightRank = right === -1 ? HOMEPAGE_FEATURED_SLUGS.length : right;

  return leftRank - rightRank;
}
