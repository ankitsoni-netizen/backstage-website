"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Notice } from "@/components/admin/Notice";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { saveSiteSettingsAction } from "@/lib/admin/actions/settings";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/lib/validation/settings";
import type { SiteSettings } from "@/types/database";

type SettingsFormProps = {
  settings: SiteSettings | null;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SiteSettingsFormValues>({
    defaultValues: {
      contact_email: settings?.contact_email ?? "",
      instagram_url: settings?.instagram_url ?? "",
      linkedin_url: settings?.linkedin_url ?? "",
      meeting_url: settings?.meeting_url ?? "",
      office_location: settings?.office_location ?? "",
      site_title: settings?.site_title ?? "Backstage",
    },
    resolver: zodResolver(siteSettingsFormSchema),
  });

  return (
    <form
      className="flex max-w-xl flex-col gap-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setError(null);
        setSuccess(false);
        const result = await saveSiteSettingsAction(values);

        if (!result.success) {
          setError(result.error);
          return;
        }

        setSuccess(true);
      })}
    >
      {error ? <Notice tone="error">{error}</Notice> : null}
      {success ? <Notice>Settings saved.</Notice> : null}
      <Field
        id="site_title"
        label="Site title"
        error={errors.site_title?.message}
      >
        <input type="text" {...register("site_title")} />
      </Field>
      <Field
        id="contact_email"
        label="Contact email"
        error={errors.contact_email?.message}
      >
        <input type="email" autoComplete="email" {...register("contact_email")} />
      </Field>
      <Field
        id="office_location"
        label="Office location"
        error={errors.office_location?.message}
      >
        <input type="text" {...register("office_location")} />
      </Field>
      <Field
        id="instagram_url"
        label="Instagram"
        error={errors.instagram_url?.message}
      >
        <input type="url" {...register("instagram_url")} />
      </Field>
      <Field
        id="linkedin_url"
        label="LinkedIn"
        error={errors.linkedin_url?.message}
      >
        <input type="url" {...register("linkedin_url")} />
      </Field>
      <Field
        id="meeting_url"
        label="Meeting URL"
        hint="Used for the public Book directly link. Leave blank to hide it."
        error={errors.meeting_url?.message}
      >
        <input type="url" {...register("meeting_url")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
