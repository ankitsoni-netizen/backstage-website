import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Instrument_Serif } from "next/font/google";

import { getMetadataBaseUrl } from "@/lib/utilities/site-url";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
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
    <html
      lang="en-IN"
      className={`${geist.variable} ${barlow.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface font-sans text-base font-normal text-foreground">
        {children}
      </body>
    </html>
  );
}
