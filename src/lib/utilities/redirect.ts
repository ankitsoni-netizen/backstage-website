const DEFAULT_ADMIN_PATH = "/admin";

export function getSafeRedirectPath(
  next: string | null,
  fallback = DEFAULT_ADMIN_PATH,
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  if (
    !next.startsWith("/admin") ||
    next === "/admin/login" ||
    next.startsWith("/admin/login/")
  ) {
    return fallback;
  }

  return next;
}
