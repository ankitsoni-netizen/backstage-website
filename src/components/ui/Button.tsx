import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utilities/cn";

type AppHref = ComponentProps<typeof Link>["href"];

const variants = {
  primary:
    "border-foreground bg-foreground text-surface hover:bg-transparent hover:text-foreground",
  signal: "border-signal bg-signal text-ink hover:bg-transparent",
  ghost:
    "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-surface",
  inverse:
    "border-paper bg-transparent text-paper hover:bg-paper hover:text-ink",
} as const;

type ButtonVariant = keyof typeof variants;

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

type ButtonAsLink = BaseProps & {
  href: AppHref;
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const composedClassName = cn(
    "inline-flex min-h-11 items-center justify-center border px-5 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in props) {
    return (
      <Link href={props.href} className={composedClassName}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;

  return (
    <button type={type} className={composedClassName} {...buttonProps}>
      {children}
    </button>
  );
}
