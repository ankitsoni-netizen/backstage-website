import { Button } from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Not found</h1>
      <p className="mt-2 text-sm text-muted">
        That admin record does not exist or is no longer available.
      </p>
      <div className="mt-4">
        <Button href="/admin" className="min-h-10 px-4 text-xs">
          Back to overview
        </Button>
      </div>
    </main>
  );
}
