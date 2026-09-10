import { MotionRoot } from "@/components/motion/MotionRoot";
import { CookieBanner } from "@/components/website/CookieBanner";
import { SiteFooter } from "@/components/website/SiteFooter";
import { SiteHeader } from "@/components/website/SiteHeader";

export const dynamic = "force-dynamic";

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
  return (
    <MotionRoot>
      <div className="relative isolate flex min-h-full flex-col bg-ivory text-ink">
        <div className="grain" aria-hidden />
        <div className="relative z-10 flex min-h-full flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </div>
      <CookieBanner />
    </MotionRoot>
  );
}
