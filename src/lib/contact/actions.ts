"use server";

import { getPublishedCreatorById } from "@/lib/data/creators";
import { insertPublicEnquiry } from "@/lib/data/enquiries";
import { guardPublicEnquiry, markEnquirySubmitted } from "@/lib/contact/guard";
import { publicEnquirySubmissionSchema } from "@/lib/validation/enquiry";

export type SubmitEnquiryState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
  success: boolean;
};

export async function submitPublicEnquiry(
  input: unknown,
): Promise<SubmitEnquiryState> {
  const parsed = publicEnquirySubmissionSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];

      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      error: "Check the highlighted fields and try again.",
      fieldErrors,
      success: false,
    };
  }

  const guard = await guardPublicEnquiry({
    started_at: parsed.data.started_at,
    website: parsed.data.website,
  });

  if (!guard.ok) {
    return {
      error: guard.error,
      success: false,
    };
  }

  if (guard.ignore) {
    await markEnquirySubmitted();
    return {
      error: null,
      success: true,
    };
  }

  const creatorId = parsed.data.creator_id;
  let creatorName = parsed.data.creator_name;

  if (creatorId) {
    const creator = await getPublishedCreatorById(creatorId);

    if (!creator) {
      return {
        error: "That creator is not available for public enquiry.",
        fieldErrors: {
          creator_id: "Choose a published creator, or leave this blank.",
        },
        success: false,
      };
    }

    creatorName = creatorName || creator.display_name;
  }

  try {
    await insertPublicEnquiry({
      budget_range: parsed.data.budget_range,
      campaign_brief: parsed.data.campaign_brief,
      campaign_timeline: parsed.data.campaign_timeline,
      company: parsed.data.company,
      creator_id: creatorId,
      creator_name: creatorName,
      enquiry_type: parsed.data.enquiry_type,
      name: parsed.data.name,
      phone: parsed.data.phone,
      preferred_meeting_date: parsed.data.preferred_meeting_date,
      work_email: parsed.data.work_email,
    });
  } catch {
    return {
      error: "The enquiry could not be sent. Try again shortly.",
      success: false,
    };
  }

  await markEnquirySubmitted();

  return {
    error: null,
    success: true,
  };
}
