export type WebsiteNavItem = {
  hash?: string;
  href: "/" | "/talent" | "/about" | "/contact" | "/admin/login";
  label: string;
};

export const websiteNav: WebsiteNavItem[] = [
  { href: "/talent", label: "Talent" },
  { href: "/", hash: "what-we-do", label: "What we do" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Let's Talk" },
];

export const footerNav: WebsiteNavItem[] = [
  { href: "/talent", label: "Talent" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin login" },
];

export function getNavHref(item: WebsiteNavItem) {
  if (!item.hash) {
    return item.href;
  }

  return { pathname: item.href, hash: item.hash };
}
