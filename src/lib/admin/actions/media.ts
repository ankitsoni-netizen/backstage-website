"use server";

import { requireAdmin } from "@/lib/auth/session";
import {
  CREATOR_MEDIA_MAX_BYTES,
  extensionForMediaType,
  isAllowedCreatorMediaType,
  isManagedStoragePath,
} from "@/lib/admin/media";
import { createClient } from "@/lib/supabase/server";
import { CREATOR_MEDIA_BUCKET } from "@/lib/utilities/storage";

export type MediaActionResult = {
  error: string | null;
  path: string | null;
};

export async function uploadCreatorMedia(formData: FormData): Promise<MediaActionResult> {
  await requireAdmin();

  const file = formData.get("file");
  const creatorKey = String(formData.get("creatorKey") ?? "").trim();
  const kind = String(formData.get("kind") ?? "profile").replace(/[^a-z]/g, "");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload.", path: null };
  }

  if (file.size > CREATOR_MEDIA_MAX_BYTES) {
    return { error: "Images must be 10 MB or smaller.", path: null };
  }

  if (!isAllowedCreatorMediaType(file.type)) {
    return { error: "Use a JPG, PNG, WebP, or AVIF image.", path: null };
  }

  const extension = extensionForMediaType(file.type);

  if (!extension) {
    return { error: "Use a JPG, PNG, WebP, or AVIF image.", path: null };
  }

  const folder = creatorKey || `pending/${crypto.randomUUID()}`;
  const path = `${folder}/${kind}-${crypto.randomUUID()}.${extension}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(CREATOR_MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: "The image could not be uploaded.", path: null };
  }

  return { error: null, path };
}

export async function deleteCreatorMedia(
  path: string,
  confirmed: boolean,
): Promise<MediaActionResult> {
  await requireAdmin();

  if (!confirmed) {
    return { error: "Confirm deletion before removing media.", path: null };
  }

  if (!isManagedStoragePath(path)) {
    return { error: null, path: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from(CREATOR_MEDIA_BUCKET).remove([path]);

  if (error) {
    return { error: "The previous image could not be removed.", path: null };
  }

  return { error: null, path: null };
}

export async function deleteCreatorMediaFolder(
  creatorId: string,
  confirmed: boolean,
): Promise<MediaActionResult> {
  await requireAdmin();

  if (!confirmed) {
    return { error: "Confirm deletion before removing media.", path: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(CREATOR_MEDIA_BUCKET)
    .list(creatorId, { limit: 100 });

  if (error) {
    return { error: "Creator media could not be listed.", path: null };
  }

  const paths = (data ?? []).map((item) => `${creatorId}/${item.name}`);

  if (paths.length === 0) {
    return { error: null, path: null };
  }

  const removed = await supabase.storage.from(CREATOR_MEDIA_BUCKET).remove(paths);

  if (removed.error) {
    return { error: "Creator media could not be deleted.", path: null };
  }

  return { error: null, path: null };
}
