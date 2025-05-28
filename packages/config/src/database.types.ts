/**
 * 🏗️ ScaffAI Database Types
 * Supabaseから自動生成される型定義
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          company: string | null;
          subscription_tier: string | null;
          web_preferences: any | null;
          mobile_preferences: any | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          company?: string | null;
          subscription_tier?: string | null;
          web_preferences?: any | null;
          mobile_preferences?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          company?: string | null;
          subscription_tier?: string | null;
          web_preferences?: any | null;
          mobile_preferences?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          input_data: any;
          calculation_result: any | null;
          last_calculated_at: string | null;
          created_platform: string | null;
          last_edited_platform: string | null;
          sync_version: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          input_data: any;
          calculation_result?: any | null;
          last_calculated_at?: string | null;
          created_platform?: string | null;
          last_edited_platform?: string | null;
          sync_version?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          input_data?: any;
          calculation_result?: any | null;
          last_calculated_at?: string | null;
          created_platform?: string | null;
          last_edited_platform?: string | null;
          sync_version?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// 🎯 便利な型エイリアス
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

// 🏗️ ScaffAI特化型
export interface ScaffAIProject extends Project {
  input_data: import('@scaffai/types').InputData;
  calculation_result: import('@scaffai/types').CalculationResult | null;
}
