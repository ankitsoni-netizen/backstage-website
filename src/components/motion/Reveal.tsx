import { cn } from "@/lib/utilities/cn";

type RevealTag = "div" | "h1" | "h2" | "h3" | "p" | "section";

type RevealProps = {
  as?: RevealTag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
}: RevealProps) {
  return (
    <Tag
      className={cn("reveal-up", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
