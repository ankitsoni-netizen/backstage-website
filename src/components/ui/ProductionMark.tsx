import { cn } from "@/lib/utilities/cn";

type ProductionMarkProps = {
  className?: string;
  label: string;
};

export function ProductionMark({ className, label }: ProductionMarkProps) {
  return (
    <p className={cn("text-kicker text-muted", className)}>
      <span aria-hidden className="reg-mark mr-2 inline-block h-2.5 w-2.5 align-middle" />
      {label}
    </p>
  );
}
