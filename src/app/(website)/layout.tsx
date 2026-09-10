import dynamic from "next/dynamic";

import { SiteFooter } from "@/components/website/SiteFooter";
import { SiteHeader } from "@/components/website/SiteHeader";

const MotionRoot = dynamic(
  () =>
    import("@/components/motion/MotionRoot").then((mod) => mod.MotionRoot),
);

const motionReadyScript = `(function(){try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var host=document.currentScript&&document.currentScript.parentElement;if(host)host.setAttribute("data-motion-ready","true")}catch(e){}})();`;

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
  return (
    <MotionRoot>
      <div className="relative flex min-h-full flex-col bg-paper text-ink">
        <script dangerouslySetInnerHTML={{ __html: motionReadyScript }} />
        <div className="grain" aria-hidden />
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </MotionRoot>
  );
}
