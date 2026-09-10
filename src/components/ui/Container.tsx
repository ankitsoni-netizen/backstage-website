import { cn } from "@/lib/utilities/cn";

type ContainerProps = {
  as?: "div" | "section" | "article" | "header" | "footer" | "nav";
  children: React.ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
};

const widthClassName = {
  default: "max-w-[1440px]",
  narrow: "max-w-[42rem]",
  wide: "max-w-[1680px]",
} as const;

export function Container({
  as: Component = "div",
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        widthClassName[width],
        className,
      )}
    >
      {children}
    </Component>
  );
}
