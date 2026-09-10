export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "admin" | "editor";
export type CreatorStatus = "draft" | "published" | "archived";
export type EnquiryStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed"
  | "spam";
export type EnquiryType =
  | "book_talent"
  | "brand_partnership"
  | "join_roster"
  | "press"
  | "general";

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
          instagram_followers: number | null;
          instagram_handle: string | null;
          instagram_url: string | null;
          manager_name: string | null;
          other_social_links: Json;
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
          instagram_followers?: number | null;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          manager_name?: string | null;
          other_social_links?: Json;
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
          instagram_followers?: number | null;
          instagram_handle?: string | null;
          instagram_url?: string | null;
          manager_name?: string | null;
          other_social_links?: Json;
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
          youtube_subscribers?: number | null;
          youtube_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "creators_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creators_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      enquiries: {
        Row: {
          assigned_to: string | null;
          budget_range: string | null;
          campaign_brief: string;
          campaign_timeline: string | null;
          company: string | null;
          created_at: string;
          creator_id: string | null;
          creator_name: string | null;
          enquiry_type: EnquiryType | null;
          id: string;
          internal_notes: string | null;
          name: string;
          phone: string | null;
          preferred_meeting_date: string | null;
          status: EnquiryStatus;
          updated_at: string;
          work_email: string;
        };
        Insert: {
          assigned_to?: string | null;
          budget_range?: string | null;
          campaign_brief: string;
          campaign_timeline?: string | null;
          company?: string | null;
          created_at?: string;
          creator_id?: string | null;
          creator_name?: string | null;
          enquiry_type?: EnquiryType | null;
          id?: string;
          internal_notes?: string | null;
          name: string;
          phone?: string | null;
          preferred_meeting_date?: string | null;
          status?: EnquiryStatus;
          updated_at?: string;
          work_email: string;
        };
        Update: {
          assigned_to?: string | null;
          budget_range?: string | null;
          campaign_brief?: string;
          campaign_timeline?: string | null;
          company?: string | null;
          created_at?: string;
          creator_id?: string | null;
          creator_name?: string | null;
          enquiry_type?: EnquiryType | null;
          id?: string;
          internal_notes?: string | null;
          name?: string;
          phone?: string | null;
          preferred_meeting_date?: string | null;
          status?: EnquiryStatus;
          updated_at?: string;
          work_email?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
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
          full_name: string | null;
          id: string;
          is_active: boolean;
          role: ProfileRole;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          role?: ProfileRole;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          role?: ProfileRole;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_backstage_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
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
