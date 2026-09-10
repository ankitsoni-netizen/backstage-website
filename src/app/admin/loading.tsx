import { LoadingBlock } from "@/components/ui/LoadingBlock";

export default function AdminLoading() {
  return (
    <div className="px-6 py-10">
      <LoadingBlock label="Loading admin" />
    </div>
  );
}
