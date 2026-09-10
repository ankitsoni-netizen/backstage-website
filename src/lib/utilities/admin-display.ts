import type { Creator, Profile } from "@/types/database";

export function getAdminCreatorName(creator: Creator): string {
  return creator.display_name?.trim() || creator.slug;
}

export function getStaffLabel(profile: Profile): string {
  return profile.full_name?.trim() || "Staff";
}
