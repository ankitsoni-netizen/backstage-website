export const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/creators", label: "Creators" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Website settings" },
] as const;

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
