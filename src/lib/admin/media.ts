export const CREATOR_MEDIA_MAX_BYTES = 10 * 1024 * 1024;

export const CREATOR_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const CREATOR_MEDIA_ACCEPT = CREATOR_MEDIA_TYPES.join(",");

const extensionByType: Record<(typeof CREATOR_MEDIA_TYPES)[number], string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isAllowedCreatorMediaType(
  type: string,
): type is (typeof CREATOR_MEDIA_TYPES)[number] {
  return CREATOR_MEDIA_TYPES.includes(type as (typeof CREATOR_MEDIA_TYPES)[number]);
}

export function extensionForMediaType(type: string): string | null {
  if (!isAllowedCreatorMediaType(type)) {
    return null;
  }

  return extensionByType[type];
}

export function isManagedStoragePath(path: string | null | undefined): boolean {
  if (!path) {
    return false;
  }

  return !path.startsWith("http://") && !path.startsWith("https://") && !path.startsWith("/");
}
