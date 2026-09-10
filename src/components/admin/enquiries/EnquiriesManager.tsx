"use client";

import Link from "next/link";
import { useState } from "react";

import { Field, controlClassName } from "@/components/ui/Field";
import { formatAdminDate } from "@/lib/utilities/format";
import {
  enquiryStatusLabels,
  enquiryStatuses,
  enquiryTypeLabels,
  enquiryTypes,
  type EnquiryType,
} from "@/lib/validation/enquiry";
import type { Enquiry, EnquiryStatus } from "@/types/database";

type EnquiriesManagerProps = {
  creatorNames: Record<string, string>;
  enquiries: Enquiry[];
};

const statuses = enquiryStatuses;

export function EnquiriesManager({
  creatorNames,
  enquiries,
}: EnquiriesManagerProps) {
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [type, setType] = useState<EnquiryType | "">("");

  const visible = enquiries.filter((enquiry) => {
    if (status && enquiry.status !== status) {
      return false;
    }

    if (type && enquiry.enquiry_type !== type) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="enquiry-status" label="Status">
          <select
            className={controlClassName}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as EnquiryStatus | "")
            }
          >
            <option value="">All</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {enquiryStatusLabels[item]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="enquiry-type" label="Type">
          <select
            className={controlClassName}
            value={type}
            onChange={(event) => setType(event.target.value as EnquiryType | "")}
          >
            <option value="">All</option>
            {enquiryTypes.map((item) => (
              <option key={item} value={item}>
                {enquiryTypeLabels[item]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p className="mt-4 text-sm text-muted">
        {visible.length} of {enquiries.length}
      </p>

      <div className="mt-3 overflow-x-auto border border-line">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-line bg-admin-fill text-xs uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">From</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Creator</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Received</th>
              <th className="px-3 py-2 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-muted">
                  No enquiries match these filters.
                </td>
              </tr>
            ) : (
              visible.map((enquiry) => {
                const enquiryType = enquiry.enquiry_type as EnquiryType | null;
                const creatorLabel =
                  (enquiry.creator_id && creatorNames[enquiry.creator_id]) ||
                  enquiry.creator_name ||
                  "—";

                return (
                  <tr key={enquiry.id} className="border-t border-line">
                    <td className="px-3 py-2">
                      <p className="font-medium">{enquiry.name}</p>
                      <p className="text-xs text-muted">
                        {enquiry.work_email}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      {enquiryType && enquiryType in enquiryTypeLabels
                        ? enquiryTypeLabels[enquiryType]
                        : "—"}
                    </td>
                    <td className="px-3 py-2">{creatorLabel}</td>
                    <td className="px-3 py-2">
                      {enquiry.status in enquiryStatusLabels
                        ? enquiryStatusLabels[enquiry.status]
                        : enquiry.status}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {formatAdminDate(enquiry.created_at)}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="underline underline-offset-[0.2em]"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
