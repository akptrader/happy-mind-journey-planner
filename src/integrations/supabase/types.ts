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
      checklist_items: {
        Row: {
          category: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          time: string | null
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          time?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          time?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_entries: {
        Row: {
          calories: number | null
          food_name: string
          id: string
          meal_type: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          food_name: string
          id?: string
          meal_type?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          food_name?: string
          id?: string
          meal_type?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_entries: {
        Row: {
          duration: number
          exercise_type: string
          id: string
          intensity: number | null
          notes: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          duration: number
          exercise_type: string
          id?: string
          intensity?: number | null
          notes?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          duration?: number
          exercise_type?: string
          id?: string
          intensity?: number | null
          notes?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          id: string
          metric_type: string
          timestamp: string | null
          unit: string | null
          user_id: string
          value: number
        }
        Insert: {
          id?: string
          metric_type: string
          timestamp?: string | null
          unit?: string | null
          user_id: string
          value: number
        }
        Update: {
          id?: string
          metric_type?: string
          timestamp?: string | null
          unit?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          frequency: string
          id: string
          name: string
          taken: boolean | null
          taken_at: string | null
          time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          frequency: string
          id?: string
          name: string
          taken?: boolean | null
          taken_at?: string | null
          time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          taken?: boolean | null
          taken_at?: string | null
          time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          anxiety: number | null
          energy: number | null
          id: string
          mood: number
          notes: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          anxiety?: number | null
          energy?: number | null
          id?: string
          mood: number
          notes?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          anxiety?: number | null
          energy?: number | null
          id?: string
          mood?: number
          notes?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplements: {
        Row: {
          created_at: string | null
          dosage: string
          frequency: string
          id: string
          name: string
          taken: boolean | null
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          frequency: string
          id?: string
          name: string
          taken?: boolean | null
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          taken?: boolean | null
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_entries: {
        Row: {
          date: string | null
          difficulty: number
          energy: number
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          date?: string | null
          difficulty: number
          energy: number
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          date?: string | null
          difficulty?: number
          energy?: number
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_entries_user_id_fkey"
            columns: ["user_id"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
