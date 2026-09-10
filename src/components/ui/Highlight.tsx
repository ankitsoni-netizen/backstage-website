import { cn } from "@/lib/utilities/cn";

type HighlightProps = {
  children: React.ReactNode;
  className?: string;
};

export function Highlight({ children, className }: HighlightProps) {
  return (
    <em className={cn("text-highlight", className)}>{children}</em>
  );
}
