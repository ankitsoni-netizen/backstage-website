import { SiteFooter } from "@/components/website/SiteFooter";
import { SiteHeader } from "@/components/website/SiteHeader";
import WebsiteNotFound from "./(website)/not-found";

export default function RootNotFound() {
  return (
    <div className="relative flex min-h-full flex-col bg-paper text-ink">
      <div className="grain" aria-hidden />
      <SiteHeader />
      <WebsiteNotFound />
      <SiteFooter />
    </div>
  );
}
