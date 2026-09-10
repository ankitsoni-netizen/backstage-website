"use client";

import Link from "next/link";
import { useState } from "react";

import { Notice } from "@/components/admin/Notice";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { updateEnquiryAction } from "@/lib/admin/actions/enquiries";
import { getStaffLabel } from "@/lib/utilities/admin-display";
import { formatAdminDate } from "@/lib/utilities/format";
import {
  budgetRangeLabels,
  campaignTimelineLabels,
  enquiryTypeLabels,
  type BudgetRange,
  type CampaignTimeline,
  type EnquiryType,
} from "@/lib/validation/enquiry";
import type { Enquiry, EnquiryStatus, Profile } from "@/types/database";

type EnquiryEditorProps = {
  creatorHref: string | null;
  creatorLabel: string | null;
  enquiry: Enquiry;
  staff: Profile[];
};

const statuses: EnquiryStatus[] = ["new", "in_progress", "closed"];

export function EnquiryEditor({
  creatorHref,
  creatorLabel,
  enquiry,
  staff,
}: EnquiryEditorProps) {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [assignedTo, setAssignedTo] = useState(enquiry.assigned_to ?? "");
  const [notes, setNotes] = useState(enquiry.internal_notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const type = enquiry.enquiry_type as EnquiryType | null;
  const budget = enquiry.budget_range as BudgetRange | null;
  const timeline = enquiry.campaign_timeline as CampaignTimeline | null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="flex flex-col gap-4 text-sm">
        <p>
          <span className="text-muted">From</span>
          <br />
          {enquiry.name}
        </p>
        <p>
          <span className="text-muted">Email</span>
          <br />
          {enquiry.work_email || enquiry.email}
        </p>
        {enquiry.phone ? (
          <p>
            <span className="text-muted">Phone</span>
            <br />
            {enquiry.phone}
          </p>
        ) : null}
        {enquiry.company ? (
          <p>
            <span className="text-muted">Company</span>
            <br />
            {enquiry.company}
          </p>
        ) : null}
        <p>
          <span className="text-muted">Type</span>
          <br />
          {type && type in enquiryTypeLabels ? enquiryTypeLabels[type] : "—"}
        </p>
        <p>
          <span className="text-muted">Creator</span>
          <br />
          {creatorHref && creatorLabel ? (
            <Link href={creatorHref} className="underline underline-offset-[0.2em]">
              {creatorLabel}
            </Link>
          ) : (
            (creatorLabel ?? "—")
          )}
        </p>
        <p>
          <span className="text-muted">Budget</span>
          <br />
          {budget && budget in budgetRangeLabels ? budgetRangeLabels[budget] : "—"}
        </p>
        <p>
          <span className="text-muted">Timeline</span>
          <br />
          {timeline && timeline in campaignTimelineLabels
            ? campaignTimelineLabels[timeline]
            : "—"}
        </p>
        <p>
          <span className="text-muted">Preferred meeting</span>
          <br />
          {enquiry.preferred_meeting_date || "—"}
        </p>
        <p>
          <span className="text-muted">Received</span>
          <br />
          {formatAdminDate(enquiry.created_at)}
        </p>
        <div>
          <p className="text-muted">Brief</p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">
            {enquiry.campaign_brief || enquiry.message}
          </p>
        </div>
      </section>

      <form
        className="flex flex-col gap-5 border border-line p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError(null);
          setSuccess(false);
          const result = await updateEnquiryAction(enquiry.id, {
            assigned_to: assignedTo,
            internal_notes: notes,
            status,
          });
          setPending(false);

          if (!result.success) {
            setError(result.error);
            return;
          }

          setSuccess(true);
        }}
      >
        {error ? <Notice tone="error">{error}</Notice> : null}
        {success ? <Notice>Enquiry updated.</Notice> : null}
        <Field id="enquiry-status" label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as EnquiryStatus)}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field id="enquiry-assignee" label="Assign to">
          <select
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
          >
            <option value="">Unassigned</option>
            {staff.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {getStaffLabel(profile)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="enquiry-notes" label="Internal notes">
          <textarea
            rows={8}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save enquiry"}
        </Button>
      </form>
    </div>
  );
}
