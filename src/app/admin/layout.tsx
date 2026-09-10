import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Backstage Admin",
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div
      data-theme="admin"
      className="flex min-h-full flex-col bg-admin-canvas text-admin-ink"
    >
      {children}
    </div>
  );
}
