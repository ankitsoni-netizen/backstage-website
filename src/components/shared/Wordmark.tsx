import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utilities/cn";

type WordmarkProps = {
  className?: string;
  priority?: boolean;
  tone?: "paper" | "ink";
};

export function Wordmark({
  className,
  priority = false,
  tone = "paper",
}: WordmarkProps) {
  return (
    <Logo
      className={cn(className)}
      priority={priority}
      tone={tone}
    />
  );
}
