import { revalidatePath } from "next/cache";

export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/talent");
  revalidatePath("/talent/[slug]", "page");
  revalidatePath("/contact");
}

export function revalidateCreatorPublicPages(slug?: string | null) {
  revalidatePublicSite();

  if (slug) {
    revalidatePath(`/talent/${slug}`);
  }
}
