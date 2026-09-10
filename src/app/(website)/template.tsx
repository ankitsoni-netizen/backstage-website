import { PageEnter } from "@/components/motion/PageEnter";

export default function WebsiteTemplate({ children }: LayoutProps<"/">) {
  return <PageEnter>{children}</PageEnter>;
}
