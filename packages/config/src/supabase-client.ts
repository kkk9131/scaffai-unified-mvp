/**
 * 🏗️ ScaffAI Supabase Client
 * Web/Mobile統一のSupabaseクライアント
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase';
import type { Database } from './database.types';

// 🔧 Supabaseクライアント作成
export const supabase = createClient<Database>(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      // 🔐 認証設定
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    // 📡 リアルタイム設定
    realtime: {
      params: {
        eventsPerSecond: 10, // パフォーマンス最適化
      },
    },
  }
);

// 🎯 認証関数
export const auth = {
  // 📧 メールログイン
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // 📝 メールサインアップ
  signUpWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // 🚪 ログアウト
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 👤 現在のユーザー取得
  getCurrentUser: () => supabase.auth.getUser(),

  // 🔄 認証状態監視
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// 🏗️ プロジェクト操作関数
export const projects = {
  // 📋 全プロジェクト取得
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  // 📝 プロジェクト作成
  create: async (projectData: {
    name: string;
    input_data: any;
    created_platform: 'web' | 'mobile';
  }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        user_id: user.user.id,
      })
      .select()
      .single();
    return { data, error };
  },

  // 💾 プロジェクト更新
  update: async (id: string, updates: {
    name?: string;
    input_data?: any;
    calculation_result?: any;
    last_edited_platform?: 'web' | 'mobile';
  }) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        last_calculated_at: updates.calculation_result ? new Date().toISOString() : undefined,
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // 🗑️ プロジェクト削除
  delete: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    return { error };
  },

  // 📡 リアルタイム購読
  subscribe: (callback: (payload: any) => void) => {
    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        callback
      )
      .subscribe();
  },
};

// 👤 プロファイル操作関数
export const profiles = {
  // 👤 プロファイル取得
  get: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
    return { data, error };
  },

  // 📝 プロファイル作成/更新
  upsert: async (profileData: {
    name?: string;
    company?: string;
    web_preferences?: any;
    mobile_preferences?: any;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.user.id,
        email: user.user.email!,
        ...profileData,
      })
      .select()
      .single();
    return { data, error };
  },
};

// 🎯 エクスポート
export default supabase;
export type { Database };
