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
      categories: {
        Row: {
          created_at: string | null
          description_kk: string | null
          description_ru: string | null
          id: string
          image_url: string | null
          name_kk: string
          name_ru: string
        }
        Insert: {
          created_at?: string | null
          description_kk?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name_kk: string
          name_ru: string
        }
        Update: {
          created_at?: string | null
          description_kk?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name_kk?: string
          name_ru?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          additional_notes: string | null
          city: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          id: string
          payment_method: string
          postal_code: string | null
          receipt_url: string | null
          status: string
          total_amount: number
        }
        Insert: {
          additional_notes?: string | null
          city: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          id?: string
          payment_method: string
          postal_code?: string | null
          receipt_url?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          additional_notes?: string | null
          city?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          id?: string
          payment_method?: string
          postal_code?: string | null
          receipt_url?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description_kk: string | null
          description_ru: string | null
          discount: number | null
          id: string
          images: string[]
          is_new: boolean | null
          is_popular: boolean | null
          name_kk: string
          name_ru: string
          old_price: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description_kk?: string | null
          description_ru?: string | null
          discount?: number | null
          id?: string
          images: string[]
          is_new?: boolean | null
          is_popular?: boolean | null
          name_kk: string
          name_ru: string
          old_price?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description_kk?: string | null
          description_ru?: string | null
          discount?: number | null
          id?: string
          images?: string[]
          is_new?: boolean | null
          is_popular?: boolean | null
          name_kk?: string
          name_ru?: string
          old_price?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
