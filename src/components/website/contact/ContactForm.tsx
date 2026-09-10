"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Highlight } from "@/components/ui/Highlight";
import { TextLink } from "@/components/ui/TextLink";
import { submitPublicEnquiry } from "@/lib/contact/actions";
import { cn } from "@/lib/utilities/cn";
import {
  budgetRangeLabels,
  budgetRanges,
  campaignTimelineLabels,
  campaignTimelines,
  enquiryTypeLabels,
  enquiryTypes,
  publicEnquiryFormSchema,
  type EnquiryType,
  type PublicEnquiryFormValues,
} from "@/lib/validation/enquiry";

export type ContactCreatorOption = {
  display_name: string;
  id: string;
  slug: string;
};

type ContactFormProps = {
  creator: ContactCreatorOption | null;
  creators: ContactCreatorOption[];
  meetingUrl: string | null;
};

const defaultValues = (
  creator: ContactCreatorOption | null,
): PublicEnquiryFormValues => ({
  budget_range: "",
  campaign_brief: "",
  campaign_timeline: "",
  company: "",
  creator_id: creator?.id ?? "",
  creator_name: creator?.display_name ?? "",
  enquiry_type: creator ? "book_talent" : "brand_partnership",
  name: "",
  phone: "",
  preferred_meeting_date: "",
  website: "",
  work_email: "",
});

export function ContactForm({
  creator,
  creators,
  meetingUrl,
}: ContactFormProps) {
  const [startedAt, setStartedAt] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function markFormStarted() {
    setStartedAt((current) => current || Date.now());
  }
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<PublicEnquiryFormValues>({
    defaultValues: defaultValues(creator),
    resolver: zodResolver(publicEnquiryFormSchema),
  });

  if (success) {
    return (
      <div role="status" className="border border-line px-5 py-10 sm:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.14em]">
          Enquiry
        </p>
        <h2 className="mt-5 text-title">
          Request <Highlight>received</Highlight>.
        </h2>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
          We&apos;ll bring the right people into the room and get back to you
          shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/talent">See the talent</Button>
          {meetingUrl ? (
            <Button href={meetingUrl} variant="ghost">
              Book directly
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      className="relative flex flex-col gap-8"
      noValidate
      aria-busy={isSubmitting}
      onFocus={markFormStarted}
      onInput={markFormStarted}
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);

        const result = await submitPublicEnquiry({
          ...values,
          started_at: startedAt,
        });

        if (result.success) {
          setSuccess(true);
          return;
        }

        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof PublicEnquiryFormValues, { message });
          }
        }

        setServerError(result.error);
      })}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Company website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {serverError ? (
        <p role="alert" className="text-sm text-admin-danger">
          {serverError}
        </p>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium tracking-[0.02em]">
          What brings you in
        </legend>
        <Controller
          control={control}
          name="enquiry_type"
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="Enquiry type"
              className="mt-3 flex flex-wrap gap-2"
            >
              {enquiryTypes.map((type) => (
                <EnquiryTypeOption
                  key={type}
                  checked={field.value === type}
                  label={enquiryTypeLabels[type]}
                  name={field.name}
                  type={type}
                  onBlur={field.onBlur}
                  onSelect={() => field.onChange(type)}
                />
              ))}
            </div>
          )}
        />
        {errors.enquiry_type?.message ? (
          <p role="alert" className="mt-2 text-sm text-admin-danger">
            {errors.enquiry_type.message}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name?.message}>
          <input type="text" autoComplete="name" {...register("name")} />
        </Field>
        <Field
          id="work_email"
          label="Work email"
          error={errors.work_email?.message}
        >
          <input
            type="email"
            autoComplete="email"
            {...register("work_email")}
          />
        </Field>
        <Field
          id="phone"
          label="Phone"
          hint="Optional"
          error={errors.phone?.message}
        >
          <input type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field
          id="company"
          label="Company"
          hint="Optional"
          error={errors.company?.message}
        >
          <input
            type="text"
            autoComplete="organization"
            {...register("company")}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="creator_id"
          label="Creator on the roster"
          hint="Optional"
          error={errors.creator_id?.message}
        >
          <select
            {...register("creator_id", {
              onChange: (event) => {
                const selected = creators.find(
                  (item) => item.id === event.target.value,
                );

                if (selected) {
                  setValue("creator_name", selected.display_name);
                }
              },
            })}
          >
            <option value="">No specific creator</option>
            {creators.map((item) => (
              <option key={item.id} value={item.id}>
                {item.display_name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="creator_name"
          label="Or name them"
          hint="Optional"
          error={errors.creator_name?.message}
        >
          <input type="text" autoComplete="off" {...register("creator_name")} />
        </Field>
      </div>

      {creator ? (
        <p className="text-base">
          This started as an enquiry about{" "}
          <TextLink href={`/talent/${creator.slug}`}>
            {creator.display_name}
          </TextLink>
          .
        </p>
      ) : null}

      <Field
        id="campaign_brief"
        label="The brief"
        error={errors.campaign_brief?.message}
      >
        <textarea
          rows={7}
          {...register("campaign_brief")}
          placeholder="What are you making, who is it for, and what does success look like?"
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="budget_range"
          label="Budget"
          hint="Optional"
          error={errors.budget_range?.message}
        >
          <select {...register("budget_range")}>
            <option value="">Prefer not to say</option>
            {budgetRanges.map((value) => (
              <option key={value} value={value}>
                {budgetRangeLabels[value]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="campaign_timeline"
          label="Timeline"
          hint="Optional"
          error={errors.campaign_timeline?.message}
        >
          <select {...register("campaign_timeline")}>
            <option value="">Prefer not to say</option>
            {campaignTimelines.map((value) => (
              <option key={value} value={value}>
                {campaignTimelineLabels[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="preferred_meeting_date"
        label="Preferred meeting date"
        hint="Optional"
        error={errors.preferred_meeting_date?.message}
      >
        <input type="date" {...register("preferred_meeting_date")} />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send the brief"}
        </Button>
        {meetingUrl ? (
          <Button href={meetingUrl} variant="ghost">
            Book directly
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function EnquiryTypeOption({
  checked,
  label,
  name,
  onBlur,
  onSelect,
  type,
}: {
  checked: boolean;
  label: string;
  name: string;
  onBlur: () => void;
  onSelect: () => void;
  type: EnquiryType;
}) {
  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center border px-4 text-sm tracking-[0.02em] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ink",
        checked
          ? "border-oxblood bg-oxblood text-ivory"
          : "border-line bg-transparent text-ink hover:border-ink",
      )}
    >
      <input
        type="radio"
        name={name}
        value={type}
        checked={checked}
        className="sr-only"
        onBlur={onBlur}
        onChange={onSelect}
      />
      {label}
    </label>
  );
}
