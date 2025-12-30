export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      connections: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          requester_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          requester_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          created_at: string | null
          id: string
          invite_code: string
          invitee_email: string | null
          inviter_profile_id: string
          used: boolean | null
          used_by_profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_code: string
          invitee_email?: string | null
          inviter_profile_id: string
          used?: boolean | null
          used_by_profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_code?: string
          invitee_email?: string | null
          inviter_profile_id?: string
          used?: boolean | null
          used_by_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_inviter_profile_id_fkey"
            columns: ["inviter_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_used_by_profile_id_fkey"
            columns: ["used_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_content: string
          profile_id: string
          reply_content: string | null
          reply_sent_at: string | null
          sender_name: string
          sender_phone: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content: string
          profile_id: string
          reply_content?: string | null
          reply_sent_at?: string | null
          sender_name: string
          sender_phone: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content?: string
          profile_id?: string
          reply_content?: string | null
          reply_sent_at?: string | null
          sender_name?: string
          sender_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string | null
          viewer_ip: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string | null
          viewer_ip?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string | null
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clinic_location: string | null
          clinic_name: string | null
          connection_count: number | null
          created_at: string | null
          external_booking_url: string | null
          full_name: string
          handle: string
          id: string
          is_verified: boolean | null
          profile_photo_url: string | null
          recommendation_count: number | null
          specialty: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          view_count: number | null
          years_experience: number | null
        }
        Insert: {
          clinic_location?: string | null
          clinic_name?: string | null
          connection_count?: number | null
          created_at?: string | null
          external_booking_url?: string | null
          full_name: string
          handle: string
          id?: string
          is_verified?: boolean | null
          profile_photo_url?: string | null
          recommendation_count?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          view_count?: number | null
          years_experience?: number | null
        }
        Update: {
          clinic_location?: string | null
          clinic_name?: string | null
          connection_count?: number | null
          created_at?: string | null
          external_booking_url?: string | null
          full_name?: string
          handle?: string
          id?: string
          is_verified?: boolean | null
          profile_photo_url?: string | null
          recommendation_count?: number | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          view_count?: number | null
          years_experience?: number | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          fingerprint: string
          id: string
          ip_address: string | null
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          fingerprint: string
          id?: string
          ip_address?: string | null
          profile_id: string
        }
        Update: {
          created_at?: string | null
          fingerprint?: string
          id?: string
          ip_address?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_documents: {
        Row: {
          document_url: string
          id: string
          profile_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_url: string
          id?: string
          profile_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_url?: string
          id?: string
          profile_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_connection_counts: {
        Args: { profile1_uuid: string; profile2_uuid: string }
        Returns: undefined
      }
      increment_recommendation_count: {
        Args: { profile_uuid: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { profile_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type Connection = Database["public"]["Tables"]["connections"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]
export type Invite = Database["public"]["Tables"]["invites"]["Row"]
export type Recommendation = Database["public"]["Tables"]["recommendations"]["Row"]
