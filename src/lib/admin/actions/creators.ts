"use server";

import { redirect, unstable_rethrow } from "next/navigation";

import { revalidateCreatorPublicPages } from "@/lib/admin/revalidate";
import { deleteCreatorMedia, deleteCreatorMediaFolder } from "@/lib/admin/actions/media";
import { requireAdmin } from "@/lib/auth/session";
import {
  archiveCreator,
  createCreator,
  creatorSlugExists,
  deleteCreator,
  getCreatorById,
  updateCreator,
} from "@/lib/data/creators";
import { isManagedStoragePath } from "@/lib/admin/media";
import {
  creatorPublishSchema,
  type CreatorFormValues,
} from "@/lib/validation/creator";

export type CreatorActionState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
  success: boolean;
};

function fieldErrorsFromZod(issues: { message: string; path: PropertyKey[] }[]) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path[0];

    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export async function saveCreatorAction(
  creatorId: string | null,
  values: CreatorFormValues,
): Promise<CreatorActionState> {
  await requireAdmin();

  const parsed = creatorPublishSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: "Check the highlighted fields before continuing.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
      success: false,
    };
  }

  if (await creatorSlugExists(parsed.data.slug, creatorId ?? undefined)) {
    return {
      error: "That slug is already in use.",
      fieldErrors: { slug: "Choose a different slug." },
      success: false,
    };
  }

  try {
    if (creatorId) {
      const current = await getCreatorById(creatorId);

      if (!current) {
        return { error: "That creator could not be found.", success: false };
      }

      const updated = await updateCreator(creatorId, parsed.data, current);
      revalidateCreatorPublicPages(updated.slug);

      if (current.slug !== updated.slug) {
        revalidateCreatorPublicPages(current.slug);
      }

      return { error: null, success: true };
    }

    const created = await createCreator(parsed.data);
    revalidateCreatorPublicPages(created.slug);
    redirect(`/admin/creators/${created.id}?notice=created`);
  } catch (error) {
    unstable_rethrow(error);
    return {
      error: "The creator could not be saved. Try again shortly.",
      success: false,
    };
  }
}

export async function archiveCreatorAction(creatorId: string): Promise<CreatorActionState> {
  await requireAdmin();
  const current = await getCreatorById(creatorId);

  if (!current) {
    return { error: "That creator could not be found.", success: false };
  }

  try {
    const archived = await archiveCreator(creatorId);
    revalidateCreatorPublicPages(archived.slug);
    return { error: null, success: true };
  } catch {
    return { error: "The creator could not be archived.", success: false };
  }
}

export async function deleteCreatorAction(input: {
  creatorId: string;
  deleteMedia: boolean;
}): Promise<CreatorActionState> {
  await requireAdmin();
  const current = await getCreatorById(input.creatorId);

  if (!current) {
    return { error: "That creator could not be found.", success: false };
  }

  try {
    if (input.deleteMedia) {
      await deleteCreatorMediaFolder(current.id, true);

      for (const path of [current.profile_image_path, current.hero_image_path]) {
        if (isManagedStoragePath(path) && path && !path.startsWith(`${current.id}/`)) {
          await deleteCreatorMedia(path, true);
        }
      }
    }

    await deleteCreator(current.id);
    revalidateCreatorPublicPages(current.slug);
    redirect("/admin/creators?notice=deleted");
  } catch (error) {
    unstable_rethrow(error);
    return { error: "The creator could not be deleted.", success: false };
  }
}
