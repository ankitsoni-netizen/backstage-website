import { getSupabasePublicEnv } from "@/lib/utilities/env";

export const CREATOR_MEDIA_BUCKET = "creator-media";

export function getPublicStorageUrl(bucket: string, objectPath: string): string {
  const { url } = getSupabasePublicEnv();
  const normalisedPath = objectPath.replace(/^\/+/, "");

  return `${url}/storage/v1/object/public/${bucket}/${normalisedPath}`;
}

function isBlockedRemoteMedia(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();

    return (
      host === "drive.google.com" ||
      host === "docs.google.com" ||
      host.endsWith(".googleusercontent.com")
    );
  } catch {
    return true;
  }
}

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  if (path.startsWith("/")) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return isBlockedRemoteMedia(path) ? null : path;
  }

  return getPublicStorageUrl(CREATOR_MEDIA_BUCKET, path);
}
