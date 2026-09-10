export const creatorFallbackTones = [
  "powder",
  "blush",
  "signal",
  "orange",
] as const;

export type CreatorFallbackTone = (typeof creatorFallbackTones)[number];

export function toneFromName(name: string): CreatorFallbackTone {
  const total = creatorFallbackTones.reduce(
    (sum, _, index) => sum + name.charCodeAt(index % name.length) + index,
    0,
  );

  return creatorFallbackTones[total % creatorFallbackTones.length];
}

export function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "B";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function getPrimaryCategory(categories: string[]): string {
  const primary = categories.find((category) => category.trim().length > 0);
  return primary ?? "Creator";
}

export function getCreatorDisplayImage(creator: {
  cover_image_path: string | null;
  hero_image_path: string | null;
  profile_image_path: string | null;
}): string | null {
  return (
    creator.hero_image_path ??
    creator.profile_image_path ??
    creator.cover_image_path
  );
}
