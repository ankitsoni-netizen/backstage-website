export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "admin" | "editor";
export type CreatorStatus = "draft" | "published" | "archived";
export type EnquiryStatus = "new" | "in_progress" | "closed";

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          categories: string[];
          city: string | null;
          created_at: string;
          created_by: string | null;
          display_name: string | null;
          featured: boolean;
          full_bio: string | null;
          hero_image_path: string | null;
          id: string;
          instagram_engagement_rate: number | null;
          instagram_followers: number | null;
          instagram_handle: string | null;
          instagram_url: string | null;
          manager_name: string | null;
          other_social_links: Json | null;
          primary_category: string | null;
          profile_image_path: string | null;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          short_bio: string | null;
          slug: string;
          sort_order: number;
          status: CreatorStatus;
          updated_at: string;
          updated_by: string | null;
          youtube_handle: string | null;
          youtube_subscribers: number | null;
          youtube_url: string | null;
        };
        Insert: {
          categories?: string[];
          city?: string | null;
          created_at?: string;
          created_by?: string | null;
          display_name?: string | null;
          featured?: boolean;
          full_bio?: string | null;
          hero_image_path?: string | null;
          id?: string;
          instagram_engagement_rate?: number | null;
          instagram_followers?: number | null;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          manager_name?: string | null;
          other_social_links?: Json | null;
          primary_category?: string | null;
          profile_image_path?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_bio?: string | null;
          slug: string;
          sort_order?: number;
          status?: CreatorStatus;
          updated_at?: string;
          updated_by?: string | null;
          youtube_handle?: string | null;
          youtube_subscribers?: number | null;
          youtube_url?: string | null;
        };
        Update: {
          categories?: string[];
          city?: string | null;
          created_at?: string;
          created_by?: string | null;
          display_name?: string | null;
          featured?: boolean;
          full_bio?: string | null;
          hero_image_path?: string | null;
          id?: string;
          instagram_engagement_rate?: number | null;
          instagram_followers?: number | null;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          manager_name?: string | null;
          other_social_links?: Json | null;
          primary_category?: string | null;
          profile_image_path?: string | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          short_bio?: string | null;
          slug?: string;
          sort_order?: number;
          status?: CreatorStatus;
          updated_at?: string;
          updated_by?: string | null;
          youtube_handle?: string | null;
          youtube_subscribers?: number | null;
          youtube_url?: string | null;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          assigned_to: string | null;
          budget_range: string | null;
          campaign_brief: string | null;
          campaign_timeline: string | null;
          company: string | null;
          created_at: string;
          creator_id: string | null;
          creator_name: string | null;
          email: string;
          enquiry_type: string | null;
          id: string;
          internal_notes: string | null;
          message: string;
          name: string;
          phone: string | null;
          preferred_meeting_date: string | null;
          status: EnquiryStatus;
          updated_at: string;
          work_email: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          budget_range?: string | null;
          campaign_brief?: string | null;
          campaign_timeline?: string | null;
          company?: string | null;
          created_at?: string;
          creator_id?: string | null;
          creator_name?: string | null;
          email: string;
          enquiry_type?: string | null;
          id?: string;
          internal_notes?: string | null;
          message: string;
          name: string;
          phone?: string | null;
          preferred_meeting_date?: string | null;
          status?: EnquiryStatus;
          updated_at?: string;
          work_email?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          budget_range?: string | null;
          campaign_brief?: string | null;
          campaign_timeline?: string | null;
          company?: string | null;
          created_at?: string;
          creator_id?: string | null;
          creator_name?: string | null;
          email?: string;
          enquiry_type?: string | null;
          id?: string;
          internal_notes?: string | null;
          message?: string;
          name?: string;
          phone?: string | null;
          preferred_meeting_date?: string | null;
          status?: EnquiryStatus;
          updated_at?: string;
          work_email?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: ProfileRole;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role: ProfileRole;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: ProfileRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          is_public: boolean;
          setting_key: string;
          setting_value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          is_public?: boolean;
          setting_key: string;
          setting_value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          is_public?: boolean;
          setting_key?: string;
          setting_value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      creator_status: CreatorStatus;
      enquiry_status: EnquiryStatus;
      profile_role: ProfileRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Creator = Database["public"]["Tables"]["creators"]["Row"];
export type CreatorInsert = Database["public"]["Tables"]["creators"]["Insert"];
export type CreatorUpdate = Database["public"]["Tables"]["creators"]["Update"];

export type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
export type EnquiryInsert = Database["public"]["Tables"]["enquiries"]["Insert"];
export type EnquiryUpdate = Database["public"]["Tables"]["enquiries"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingsInsert =
  Database["public"]["Tables"]["site_settings"]["Insert"];
export type SiteSettingsUpdate =
  Database["public"]["Tables"]["site_settings"]["Update"];

export type SiteSettings = {
  contact_email: string | null;
  contact_phone: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  meeting_url: string | null;
  office_location: string | null;
  setting_key: string;
  site_description: string | null;
  site_title: string;
  twitter_url: string | null;
  youtube_url: string | null;
};
