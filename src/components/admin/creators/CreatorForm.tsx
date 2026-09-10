"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { MediaField } from "@/components/admin/creators/MediaField";
import { Notice } from "@/components/admin/Notice";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { slugifyName } from "@/lib/admin/slug";
import {
  CREATOR_MEDIA_MAX_BYTES,
  isAllowedCreatorMediaType,
} from "@/lib/admin/media";
import { deleteCreatorMedia, uploadCreatorMedia } from "@/lib/admin/actions/media";
import { saveCreatorAction } from "@/lib/admin/actions/creators";
import { parseOtherSocialLinks } from "@/lib/utilities/social-links";
import { toCategoriesText } from "@/lib/validation/creator";
import {
  creatorPublishSchema,
  type CreatorFormValues,
} from "@/lib/validation/creator";
import type { Creator } from "@/types/database";

type CreatorFormProps = {
  creator?: Creator | null;
};

function valuesFromCreator(creator?: Creator | null): CreatorFormValues {
  const displayName = creator?.display_name?.trim() || "";
  const socials = parseOtherSocialLinks(creator?.other_social_links);

  return {
    categories_text: toCategoriesText(creator?.categories),
    city: creator?.city ?? "",
    display_name: displayName,
    featured: creator?.featured ?? false,
    full_bio: creator?.full_bio ?? "",
    hero_image_path: creator?.hero_image_path ?? "",
    instagram_followers: creator?.instagram_followers ?? "",
    instagram_url: creator?.instagram_url ?? "",
    intent: "draft",
    linkedin_url: socials.linkedin_url ?? "",
    manager_name: creator?.manager_name ?? "",
    primary_category: creator?.primary_category ?? "",
    profile_image_path: creator?.profile_image_path ?? "",
    seo_description: creator?.seo_description ?? "",
    seo_title: creator?.seo_title ?? "",
    short_bio: creator?.short_bio ?? "",
    slug: creator?.slug ?? "",
    sort_order: creator?.sort_order ?? 0,
    tiktok_followers: socials.tiktok_followers ?? "",
    tiktok_url: socials.tiktok_url ?? "",
    twitter_url: socials.twitter_url ?? "",
    youtube_followers: creator?.youtube_subscribers ?? "",
    youtube_url: creator?.youtube_url ?? "",
  };
}

export function CreatorForm({ creator }: CreatorFormProps) {
  const router = useRouter();
  const [slugLocked, setSlugLocked] = useState(Boolean(creator?.slug));
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [removeOldProfile, setRemoveOldProfile] = useState(true);
  const [removeOldHero, setRemoveOldHero] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<CreatorFormValues>({
    defaultValues: valuesFromCreator(creator),
    resolver: zodResolver(creatorPublishSchema),
  });

  async function uploadIfNeeded(
    file: File | null,
    kind: "profile" | "hero",
    currentPath: string | null,
    removeOld: boolean,
  ): Promise<string | null> {
    if (!file) {
      return currentPath;
    }

    if (file.size > CREATOR_MEDIA_MAX_BYTES) {
      throw new Error(`${kind}-size`);
    }

    if (!isAllowedCreatorMediaType(file.type)) {
      throw new Error(`${kind}-type`);
    }

    const payload = new FormData();
    payload.set("file", file);
    payload.set("kind", kind);
    payload.set("creatorKey", creator?.id ?? "");
    const uploaded = await uploadCreatorMedia(payload);

    if (uploaded.error || !uploaded.path) {
      throw new Error(uploaded.error ?? "upload");
    }

    if (removeOld && currentPath && currentPath !== uploaded.path) {
      await deleteCreatorMedia(currentPath, true);
    }

    return uploaded.path;
  }

  return (
    <form
      className="flex max-w-4xl flex-col gap-8"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        setSuccess(false);

        try {
          const profilePath = await uploadIfNeeded(
            profileFile,
            "profile",
            values.profile_image_path || null,
            removeOldProfile,
          );
          const heroPath = await uploadIfNeeded(
            heroFile,
            "hero",
            values.hero_image_path || null,
            removeOldHero,
          );

          const result = await saveCreatorAction(creator?.id ?? null, {
            ...values,
            hero_image_path: heroPath ?? "",
            profile_image_path: profilePath ?? "",
          });

          if (!result.success) {
            if (result.fieldErrors) {
              for (const [field, message] of Object.entries(result.fieldErrors)) {
                setError(field as keyof CreatorFormValues, { message });
              }
            }

            setServerError(result.error);
            return;
          }

          setSuccess(true);
          setProfileFile(null);
          setHeroFile(null);
          router.refresh();
        } catch (error) {
          const code = error instanceof Error ? error.message : "save";

          if (code.endsWith("-size")) {
            setServerError("Images must be 10 MB or smaller.");
            return;
          }

          if (code.endsWith("-type")) {
            setServerError("Use a JPG, PNG, WebP, or AVIF image.");
            return;
          }

          setServerError("The creator could not be saved.");
        }
      })}
    >
      {serverError ? <Notice tone="error">{serverError}</Notice> : null}
      {success ? <Notice>Creator saved.</Notice> : null}

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]">
          Identity
        </legend>
        <Field id="display_name" label="Display name" error={errors.display_name?.message}>
          <input
            type="text"
            autoComplete="off"
            {...register("display_name", {
              onChange: (event) => {
                if (!slugLocked) {
                  setValue("slug", slugifyName(event.target.value), {
                    shouldValidate: true,
                  });
                }
              },
            })}
          />
        </Field>
        <Field
          id="slug"
          label="Slug"
          hint={slugLocked ? "Manual override is on." : "Generated from the name."}
          error={errors.slug?.message}
        >
          <input type="text" autoComplete="off" {...register("slug")} />
        </Field>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={slugLocked}
            onChange={(event) => setSlugLocked(event.target.checked)}
          />
          Edit slug manually
        </label>
        <Field
          id="primary_category"
          label="Primary category"
          error={errors.primary_category?.message}
        >
          <input type="text" {...register("primary_category")} />
        </Field>
        <Field
          id="categories_text"
          label="Categories"
          hint="Comma-separated"
          error={errors.categories_text?.message}
        >
          <input type="text" {...register("categories_text")} />
        </Field>
        <Field id="city" label="City" error={errors.city?.message}>
          <input type="text" {...register("city")} />
        </Field>
        <Field
          id="manager_name"
          label="Talent manager"
          error={errors.manager_name?.message}
        >
          <input type="text" {...register("manager_name")} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]">
          Profile
        </legend>
        <Field id="short_bio" label="Short bio" error={errors.short_bio?.message}>
          <textarea rows={3} {...register("short_bio")} />
        </Field>
        <Field id="full_bio" label="Full bio" error={errors.full_bio?.message}>
          <textarea rows={8} {...register("full_bio")} />
        </Field>
        <MediaField
          id="profile_image"
          label="Profile image"
          path={creator?.profile_image_path ?? null}
          selected={Boolean(profileFile)}
          removeOld={removeOldProfile}
          onFileChange={setProfileFile}
          onRemoveOldChange={setRemoveOldProfile}
          error={errors.profile_image_path?.message}
        />
        <MediaField
          id="hero_image"
          label="Hero image"
          path={creator?.hero_image_path ?? null}
          selected={Boolean(heroFile)}
          removeOld={removeOldHero}
          onFileChange={setHeroFile}
          onRemoveOldChange={setRemoveOldHero}
          error={errors.hero_image_path?.message}
        />
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]">
          Social
        </legend>
        <Field id="instagram_url" label="Instagram URL" error={errors.instagram_url?.message}>
          <input type="url" {...register("instagram_url")} />
        </Field>
        <Field
          id="instagram_followers"
          label="Instagram followers"
          error={errors.instagram_followers?.message}
        >
          <input type="number" min={0} {...register("instagram_followers")} />
        </Field>
        <Field id="youtube_url" label="YouTube URL" error={errors.youtube_url?.message}>
          <input type="url" {...register("youtube_url")} />
        </Field>
        <Field
          id="youtube_followers"
          label="YouTube followers"
          error={errors.youtube_followers?.message}
        >
          <input type="number" min={0} {...register("youtube_followers")} />
        </Field>
        <Field id="tiktok_url" label="TikTok URL" error={errors.tiktok_url?.message}>
          <input type="url" {...register("tiktok_url")} />
        </Field>
        <Field
          id="tiktok_followers"
          label="TikTok followers"
          error={errors.tiktok_followers?.message}
        >
          <input type="number" min={0} {...register("tiktok_followers")} />
        </Field>
        <Field id="twitter_url" label="X URL" error={errors.twitter_url?.message}>
          <input type="url" {...register("twitter_url")} />
        </Field>
        <Field id="linkedin_url" label="LinkedIn URL" error={errors.linkedin_url?.message}>
          <input type="url" {...register("linkedin_url")} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]">
          Publishing
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} />
          Featured on the homepage
        </label>
        <Field id="sort_order" label="Sort order" error={errors.sort_order?.message}>
          <input type="number" min={0} {...register("sort_order")} />
        </Field>
        <Field id="seo_title" label="SEO title" error={errors.seo_title?.message}>
          <input type="text" {...register("seo_title")} />
        </Field>
        <Field
          id="seo_description"
          label="SEO description"
          error={errors.seo_description?.message}
        >
          <textarea rows={3} {...register("seo_description")} />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setValue("intent", "draft")}
        >
          {isSubmitting ? "Saving…" : "Save draft"}
        </Button>
        <Button
          type="submit"
          variant="ghost"
          disabled={isSubmitting}
          onClick={() => setValue("intent", "publish")}
        >
          Publish
        </Button>
        {creator ? (
          <Button
            type="submit"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => setValue("intent", "archive")}
          >
            Archive
          </Button>
        ) : null}
      </div>
    </form>
  );
}
