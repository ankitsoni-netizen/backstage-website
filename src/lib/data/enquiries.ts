import { requireAdmin } from "@/lib/auth/session";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import {
  requireSupabaseRow,
  unwrapSupabaseResult,
} from "@/lib/utilities/errors";
import type {
  EnquiryInput,
  EnquiryUpdateInput,
} from "@/lib/validation/enquiry";
import type { Enquiry } from "@/types/database";

function toPublicInsert(input: EnquiryInput) {
  return {
    budget_range: input.budget_range,
    campaign_brief: input.campaign_brief,
    campaign_timeline: input.campaign_timeline,
    company: input.company,
    creator_id: input.creator_id,
    creator_name: input.creator_name,
    enquiry_type: input.enquiry_type,
    name: input.name,
    phone: input.phone,
    preferred_meeting_date: input.preferred_meeting_date,
    status: "new" as const,
    work_email: input.work_email,
  };
}

export async function insertPublicEnquiry(input: EnquiryInput): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("enquiries").insert(toPublicInsert(input));
  unwrapSupabaseResult(null, error, "Failed to submit enquiry");
}

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .insert(toPublicInsert(input))
    .select("*")
    .single();

  return requireSupabaseRow(data, error, "Failed to submit enquiry");
}

export async function listEnquiries(): Promise<Enquiry[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return unwrapSupabaseResult(data ?? [], error, "Failed to load enquiries");
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return unwrapSupabaseResult(data, error, "Failed to load enquiry");
}

export async function updateEnquiryStatus(
  id: string,
  input: EnquiryUpdateInput,
): Promise<Enquiry> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .update({
      assigned_to: input.assigned_to,
      internal_notes: input.internal_notes,
      status: input.status,
    })
    .eq("id", id)
    .select("*")
    .single();

  return requireSupabaseRow(data, error, "Failed to update enquiry");
}
