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
      category: {
        Row: {
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      donation: {
        Row: {
          beneficiary_ID: string | null
          created_at: string
          donationRequest_ID: number | null
          donor_ID: string | null
          id: number
          status: Database["public"]["Enums"]["status"]
          timer_trigger: boolean | null
        }
        Insert: {
          beneficiary_ID?: string | null
          created_at?: string
          donationRequest_ID?: number | null
          donor_ID?: string | null
          id?: number
          status: Database["public"]["Enums"]["status"]
          timer_trigger?: boolean | null
        }
        Update: {
          beneficiary_ID?: string | null
          created_at?: string
          donationRequest_ID?: number | null
          donor_ID?: string | null
          id?: number
          status?: Database["public"]["Enums"]["status"]
          timer_trigger?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_beneficiary_ID_fkey"
            columns: ["beneficiary_ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donation_requests_with_categories_and_tags"
            referencedColumns: ["donation_request_id"]
          },
          {
            foreignKeyName: "donation_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donationRequest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_donor_ID_fkey"
            columns: ["donor_ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_items: {
        Row: {
          donation_ID: number | null
          id: number
          item_ID: number | null
        }
        Insert: {
          donation_ID?: number | null
          id?: number
          item_ID?: number | null
        }
        Update: {
          donation_ID?: number | null
          id?: number
          item_ID?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_donation_ID_fkey"
            columns: ["donation_ID"]
            isOneToOne: false
            referencedRelation: "donation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_items_item_ID_fkey"
            columns: ["item_ID"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_request_tags: {
        Row: {
          donationRequest_ID: number | null
          id: number
          tag_ID: number | null
        }
        Insert: {
          donationRequest_ID?: number | null
          id?: number
          tag_ID?: number | null
        }
        Update: {
          donationRequest_ID?: number | null
          id?: number
          tag_ID?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_request_tags_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donation_requests_with_categories_and_tags"
            referencedColumns: ["donation_request_id"]
          },
          {
            foreignKeyName: "donation_request_tags_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donationRequest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_request_tags_tag_ID_fkey"
            columns: ["tag_ID"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_timers: {
        Row: {
          created_at: string | null
          donation_id: number
          expiration_time: string
          id: number
          timer_canceled: boolean | null
          timer_start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          donation_id: number
          expiration_time: string
          id?: number
          timer_canceled?: boolean | null
          timer_start_time?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          donation_id?: number
          expiration_time?: string
          id?: number
          timer_canceled?: boolean | null
          timer_start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_timers_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donation"
            referencedColumns: ["id"]
          },
        ]
      }
      donationRequest: {
        Row: {
          beneficiary_ID: string
          created_at: string
          description: string
          formatted_address: string
          headline: string
          id: number
          images: string[] | null
          latitude: number | null
          longitude: number | null
          main_location: string
          place_id: string
          secondary_location: string
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
          usage: Database["public"]["Enums"]["usage"] | null
        }
        Insert: {
          beneficiary_ID?: string
          created_at?: string
          description: string
          formatted_address: string
          headline: string
          id?: number
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          main_location: string
          place_id: string
          secondary_location: string
          status: Database["public"]["Enums"]["status"]
          updated_at?: string | null
          usage?: Database["public"]["Enums"]["usage"] | null
        }
        Update: {
          beneficiary_ID?: string
          created_at?: string
          description?: string
          formatted_address?: string
          headline?: string
          id?: number
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          main_location?: string
          place_id?: string
          secondary_location?: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
          usage?: Database["public"]["Enums"]["usage"] | null
        }
        Relationships: [
          {
            foreignKeyName: "donationRequest_beneficiary_ID_fkey"
            columns: ["beneficiary_ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string
          donationRequest_ID: number | null
          id: number
          url: string | null
        }
        Insert: {
          created_at?: string
          donationRequest_ID?: number | null
          id?: number
          url?: string | null
        }
        Update: {
          created_at?: string
          donationRequest_ID?: number | null
          id?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "images_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donation_requests_with_categories_and_tags"
            referencedColumns: ["donation_request_id"]
          },
          {
            foreignKeyName: "images_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donationRequest"
            referencedColumns: ["id"]
          },
        ]
      }
      item: {
        Row: {
          beneficiary_ID: string | null
          category_ID: string | null
          created_at: string
          donationRequest_ID: number | null
          id: number
          name: string
          quantity: number
          status: Database["public"]["Enums"]["status"] | null
        }
        Insert: {
          beneficiary_ID?: string | null
          category_ID?: string | null
          created_at?: string
          donationRequest_ID?: number | null
          id?: number
          name: string
          quantity: number
          status?: Database["public"]["Enums"]["status"] | null
        }
        Update: {
          beneficiary_ID?: string | null
          category_ID?: string | null
          created_at?: string
          donationRequest_ID?: number | null
          id?: number
          name?: string
          quantity?: number
          status?: Database["public"]["Enums"]["status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "item_beneficiary_ID_fkey"
            columns: ["beneficiary_ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_category_ID_fkey"
            columns: ["category_ID"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donation_requests_with_categories_and_tags"
            referencedColumns: ["donation_request_id"]
          },
          {
            foreignKeyName: "item_donationRequest_ID_fkey"
            columns: ["donationRequest_ID"]
            isOneToOne: false
            referencedRelation: "donationRequest"
            referencedColumns: ["id"]
          },
        ]
      }
      item_categories: {
        Row: {
          category_ID: string | null
          id: number
          item_ID: number | null
        }
        Insert: {
          category_ID?: string | null
          id?: number
          item_ID?: number | null
        }
        Update: {
          category_ID?: string | null
          id?: number
          item_ID?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_categories_category_ID_fkey"
            columns: ["category_ID"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_categories_item_ID_fkey"
            columns: ["item_ID"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          icon_name: string | null
          id: number
          name: string
        }
        Insert: {
          icon_name?: string | null
          id?: number
          name: string
        }
        Update: {
          icon_name?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      donation_requests_with_categories_and_tags: {
        Row: {
          beneficiary_ID: string | null
          category_names: string[] | null
          description: string | null
          donation_request_id: number | null
          formatted_address: string | null
          headline: string | null
          images: string[] | null
          item_names: string[] | null
          latitude: number | null
          longitude: number | null
          main_location: string | null
          secondary_location: string | null
          status: Database["public"]["Enums"]["status"] | null
          tag_names: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "donationRequest_beneficiary_ID_fkey"
            columns: ["beneficiary_ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_secret: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      read_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
    }
    Enums: {
      status: "AVAILABLE" | "PENDING" | "COMPLETE" | "UNAVAILABLE" | "FAILED"
      usage: "PERSONAL" | "ORGANIZATION" | "BUSINESS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
