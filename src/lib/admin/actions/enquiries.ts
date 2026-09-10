"use server";

import { requireAdmin } from "@/lib/auth/session";
import { listStaffProfiles } from "@/lib/data/profiles";
import { updateEnquiryStatus } from "@/lib/data/enquiries";
import { enquiryUpdateSchema } from "@/lib/validation/enquiry";

export type EnquiryActionState = {
  error: string | null;
  success: boolean;
};

export async function updateEnquiryAction(
  enquiryId: string,
  input: unknown,
): Promise<EnquiryActionState> {
  await requireAdmin();

  const parsed = enquiryUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Check the enquiry fields and try again.", success: false };
  }

  if (parsed.data.assigned_to) {
    const staff = await listStaffProfiles();
    const exists = staff.some((profile) => profile.id === parsed.data.assigned_to);

    if (!exists) {
      return {
        error: "Assign the enquiry to an active admin or editor.",
        success: false,
      };
    }
  }

  try {
    await updateEnquiryStatus(enquiryId, parsed.data);
    return { error: null, success: true };
  } catch {
    return { error: "The enquiry could not be updated.", success: false };
  }
}
