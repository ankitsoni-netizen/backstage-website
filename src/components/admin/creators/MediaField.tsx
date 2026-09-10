"use client";

import { useState } from "react";

import { CREATOR_MEDIA_ACCEPT } from "@/lib/admin/media";
import { resolveMediaUrl } from "@/lib/utilities/storage";

type MediaFieldProps = {
  error?: string;
  hint?: string;
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  onRemoveOldChange: (checked: boolean) => void;
  path: string | null;
  removeOld: boolean;
  selected: boolean;
};

export function MediaField({
  error,
  hint,
  id,
  label,
  onFileChange,
  onRemoveOldChange,
  path,
  removeOld,
  selected,
}: MediaFieldProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const preview = objectUrl ?? resolveMediaUrl(path);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium tracking-[0.02em]">
        {label}
      </label>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      <div className="flex items-start gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-28 w-24 object-cover" />
        ) : (
          <div className="flex h-28 w-24 items-center justify-center bg-admin-fill text-xs text-muted">
            No image
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            id={id}
            type="file"
            accept={CREATOR_MEDIA_ACCEPT}
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;

              setObjectUrl((current) => {
                if (current) {
                  URL.revokeObjectURL(current);
                }

                return next ? URL.createObjectURL(next) : null;
              });
              onFileChange(next);
            }}
          />
          <p className="text-xs text-muted">JPG, PNG, WebP or AVIF. 10 MB max.</p>
          {selected && path ? (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeOld}
                onChange={(event) => onRemoveOldChange(event.target.checked)}
              />
              Delete the previous file after this replacement is saved
            </label>
          ) : null}
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-admin-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
