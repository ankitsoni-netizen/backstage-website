import { cn } from "@/lib/utilities/cn";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
};

export function FadeIn({ children, className }: FadeInProps) {
  return <div className={cn("reveal-up", className)}>{children}</div>;
}
