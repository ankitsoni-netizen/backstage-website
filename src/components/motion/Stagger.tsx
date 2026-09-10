import { cn } from "@/lib/utilities/cn";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
};

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function Stagger({ children, className }: StaggerProps) {
  return <ul className={cn("stagger-children", className)}>{children}</ul>;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return <li className={className}>{children}</li>;
}
