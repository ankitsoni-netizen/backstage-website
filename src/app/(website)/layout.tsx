import { MotionRoot } from "@/components/motion/MotionRoot";
import { SiteFooter } from "@/components/website/SiteFooter";
import { SiteHeader } from "@/components/website/SiteHeader";

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
    </MotionRoot>
  );
}
