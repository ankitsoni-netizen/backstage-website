"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Field, controlClassName } from "@/components/ui/Field";
import { getAdminCreatorName } from "@/lib/utilities/admin-display";
import { formatAdminDate } from "@/lib/utilities/format";
import { resolveMediaUrl } from "@/lib/utilities/storage";
import type { Creator, CreatorStatus } from "@/types/database";

type CreatorsManagerProps = {
  creators: Creator[];
};

const statuses: Array<CreatorStatus | ""> = ["", "draft", "published", "archived"];

export function CreatorsManager({ creators }: CreatorsManagerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CreatorStatus | "">("");
  const [category, setCategory] = useState("");
  const [manager, setManager] = useState("");
  const [featured, setFeatured] = useState("");

  const categories = useMemo(() => {
    const values = new Set<string>();

    for (const creator of creators) {
      if (creator.primary_category) {
        values.add(creator.primary_category);
      }

      for (const item of creator.categories ?? []) {
        if (item.trim()) {
          values.add(item.trim());
        }
      }
    }

    return [...values].sort((a, b) => a.localeCompare(b));
  }, [creators]);

  const managers = useMemo(() => {
    const values = new Set<string>();

    for (const creator of creators) {
      if (creator.manager_name?.trim()) {
        values.add(creator.manager_name.trim());
      }
    }

    return [...values].sort((a, b) => a.localeCompare(b));
  }, [creators]);

  const visible = creators.filter((creator) => {
    const name = getAdminCreatorName(creator).toLowerCase();
    const haystack = [
      name,
      creator.primary_category ?? "",
      ...(creator.categories ?? []),
      creator.manager_name ?? "",
      creator.city ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (query.trim() && !haystack.includes(query.trim().toLowerCase())) {
      return false;
    }

    if (status && creator.status !== status) {
      return false;
    }

    if (category) {
      const labels = [creator.primary_category, ...(creator.categories ?? [])]
        .filter(Boolean)
        .map((item) => item?.toLowerCase());

      if (!labels.includes(category.toLowerCase())) {
        return false;
      }
    }

    if (manager && creator.manager_name?.trim() !== manager) {
      return false;
    }

    if (featured === "yes" && !creator.featured) {
      return false;
    }

    if (featured === "no" && creator.featured) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Field id="creator-search" label="Search">
          <input
            className={controlClassName}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, category, city"
          />
        </Field>
        <Field id="creator-status" label="Status">
          <select
            className={controlClassName}
            value={status}
            onChange={(event) => setStatus(event.target.value as CreatorStatus | "")}
          >
            <option value="">All</option>
            {statuses.filter(Boolean).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="creator-category" label="Category">
          <select
            className={controlClassName}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="creator-manager" label="Manager">
          <select
            className={controlClassName}
            value={manager}
            onChange={(event) => setManager(event.target.value)}
          >
            <option value="">All</option>
            {managers.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="creator-featured" label="Featured">
          <select
            className={controlClassName}
            value={featured}
            onChange={(event) => setFeatured(event.target.value)}
          >
            <option value="">All</option>
            <option value="yes">Featured</option>
            <option value="no">Not featured</option>
          </select>
        </Field>
      </div>

      <p className="mt-4 text-sm text-muted">
        {visible.length} of {creators.length}
      </p>

      <div className="mt-3 overflow-x-auto border border-line">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-line bg-admin-fill text-xs uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Creator</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Manager</th>
              <th className="px-3 py-2 font-medium">Featured</th>
              <th className="px-3 py-2 font-medium">Updated</th>
              <th className="px-3 py-2 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-muted">
                  No creators match these filters.
                </td>
              </tr>
            ) : (
              visible.map((creator) => {
                const name = getAdminCreatorName(creator);
                const image = resolveMediaUrl(creator.profile_image_path);

                return (
                  <tr key={creator.id} className="border-t border-line">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt=""
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center bg-admin-fill text-xs font-medium">
                            {name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <span className="font-medium">{name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{creator.status}</td>
                    <td className="px-3 py-2">
                      {creator.primary_category || "—"}
                    </td>
                    <td className="px-3 py-2">{creator.manager_name || "—"}</td>
                    <td className="px-3 py-2">{creator.featured ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-muted">
                      {formatAdminDate(creator.updated_at)}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin/creators/${creator.id}`}
                        className="underline underline-offset-[0.2em]"
                      >
                        Edit
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
