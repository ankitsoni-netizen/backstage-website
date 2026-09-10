import type { Profile, ProfileRole } from "@/types/database";

export const ADMIN_ROLES = ["admin", "editor"] as const satisfies readonly ProfileRole[];

export function isAdminRole(role: string | null | undefined): role is ProfileRole {
  return role === "admin" || role === "editor";
}

export function hasAdminAccess(profile: Profile | null): profile is Profile {
  return (
    profile !== null &&
    profile.is_active === true &&
    isAdminRole(profile.role)
  );
}
