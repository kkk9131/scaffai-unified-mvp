/**
 * 🔑 ScaffAI Config Package
 * Supabase設定とクライアントの統一エクスポート
 */

// 🔧 設定
export { SUPABASE_CONFIG, getSupabaseConfig } from './supabase';

// 🏗️ Supabaseクライアント
export { default as supabase, auth, projects, profiles } from './supabase-client';

// 📊 型定義
export type { 
  Database, 
  Profile, 
  ProfileInsert, 
  ProfileUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  ScaffAIProject 
} from './database.types';

// 🎯 便利な再エクスポート
export { createClient } from '@supabase/supabase-js';
