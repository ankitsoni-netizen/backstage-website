import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth/session";
import { getDashboardSnapshot } from "@/lib/data/creators";
import { getAdminCreatorName } from "@/lib/utilities/admin-display";
import { formatAdminDate } from "@/lib/utilities/format";
import {
  budgetRangeLabels,
  enquiryTypeLabels,
  type EnquiryType,
} from "@/lib/validation/enquiry";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const snapshot = await getDashboardSnapshot();

  const stats = [
    { label: "Published creators", value: snapshot.publishedCreators },
    { label: "Draft creators", value: snapshot.draftCreators },
    { label: "Featured creators", value: snapshot.featuredCreators },
    { label: "New enquiries", value: snapshot.newEnquiries },
  ];

  return (
    <main>
      <AdminPageHeader
        title="Overview"
        description="What needs attention across the roster and inbox."
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="border border-line bg-admin-fill px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {stat.value}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">Recent enquiries</h2>
          {snapshot.recentEnquiries.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No enquiries yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line border border-line">
              {snapshot.recentEnquiries.map((enquiry) => {
                const type = enquiry.enquiry_type as EnquiryType | null;
                return (
                  <li key={enquiry.id}>
                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="block px-4 py-3 hover:bg-admin-fill"
                    >
                      <p className="text-sm font-medium">{enquiry.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {enquiry.status.replace("_", " ")}
                        {type && type in enquiryTypeLabels
                          ? ` · ${enquiryTypeLabels[type]}`
                          : ""}
                        {enquiry.budget_range &&
                        enquiry.budget_range in budgetRangeLabels
                          ? ` · ${budgetRangeLabels[enquiry.budget_range as keyof typeof budgetRangeLabels]}`
                          : ""}
                        {` · ${formatAdminDate(enquiry.created_at)}`}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Recently updated creators</h2>
          {snapshot.recentCreators.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No creators yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line border border-line">
              {snapshot.recentCreators.map((creator) => (
                <li key={creator.id}>
                  <Link
                    href={`/admin/creators/${creator.id}`}
                    className="block px-4 py-3 hover:bg-admin-fill"
                  >
                    <p className="text-sm font-medium">
                      {getAdminCreatorName(creator)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {creator.status}
                      {creator.featured ? " · featured" : ""}
                      {` · ${formatAdminDate(creator.updated_at)}`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
