"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Notice } from "@/components/admin/Notice";
import { Button } from "@/components/ui/Button";
import {
  archiveCreatorAction,
  deleteCreatorAction,
} from "@/lib/admin/actions/creators";

type DeleteCreatorDialogProps = {
  creatorId: string;
  creatorName: string;
};

export function DeleteCreatorDialog({
  creatorId,
  creatorName,
}: DeleteCreatorDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deleteMedia, setDeleteMedia] = useState(false);

  return (
    <details className="border border-line px-4 py-4">
      <summary className="cursor-pointer text-sm font-medium">
        Remove {creatorName}
      </summary>
      <div className="mt-4 flex max-w-xl flex-col gap-4">
        <p className="text-sm text-muted">
          Archiving hides the creator from the public site and keeps the record.
          Permanent deletion cannot be undone.
        </p>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError(null);
              const result = await archiveCreatorAction(creatorId);
              setPending(false);

              if (!result.success) {
                setError(result.error);
                return;
              }

              router.refresh();
            }}
          >
            Archive creator
          </Button>
        </div>
        <div className="border-t border-line pt-4">
          <p className="text-sm font-medium text-admin-danger">
            Permanent deletion
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={deleteMedia}
              onChange={(event) => setDeleteMedia(event.target.checked)}
            />
            Also delete storage assets. This is required to remove files.
          </label>
          <div className="mt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              className="border-admin-danger text-admin-danger hover:bg-admin-danger hover:text-admin-canvas"
              onClick={async () => {
                const confirmed = window.confirm(
                  `Permanently delete ${creatorName}? This cannot be undone.`,
                );

                if (!confirmed) {
                  return;
                }

                if (deleteMedia) {
                  const mediaConfirmed = window.confirm(
                    "This will also delete this creator's uploaded images.",
                  );

                  if (!mediaConfirmed) {
                    return;
                  }
                }

                setPending(true);
                setError(null);
                const result = await deleteCreatorAction({
                  creatorId,
                  deleteMedia,
                });
                setPending(false);

                if (!result.success) {
                  setError(result.error);
                }
              }}
            >
              Delete permanently
            </Button>
          </div>
        </div>
      </div>
    </details>
  );
}
