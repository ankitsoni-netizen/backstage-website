import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getMetadataBaseUrl } from "@/lib/utilities/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: "Backstage",
    template: "%s | Backstage",
  },
  description:
    "Backstage is an Indian talent-management company built for the creator economy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface font-sans text-base font-normal text-foreground">
        {children}
      </body>
    </html>
  );
}
