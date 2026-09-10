import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utilities/cn";

type AppHref = ComponentProps<typeof Link>["href"];

const variants = {
  primary:
    "rounded-full border border-ink bg-ink text-ivory hover:border-oxblood hover:bg-oxblood hover:text-ivory",
  ghost:
    "rounded-full border border-ink bg-transparent text-ink hover:border-oxblood hover:text-oxblood",
  inverse:
    "rounded-full border border-ivory/70 bg-transparent text-ivory hover:bg-ivory hover:text-ink",
  light:
    "rounded-full border-2 border-ivory bg-ivory text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  stage:
    "rounded-full min-h-14 border border-ink bg-ink px-8 text-ivory hover:border-oxblood hover:bg-oxblood hover:text-ivory",
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
    "inline-flex min-h-12 items-center justify-center px-7 py-2 text-sm font-medium tracking-[0.14em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
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
