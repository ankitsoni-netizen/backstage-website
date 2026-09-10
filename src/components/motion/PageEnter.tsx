import type { ReactNode } from "react";

type PageEnterProps = {
  children: ReactNode;
};

export function PageEnter({ children }: PageEnterProps) {
  return (
    <div className="reveal-up flex min-h-full flex-1 flex-col">{children}</div>
  );
}
