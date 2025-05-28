/**
 * 🔑 ScaffAI Supabase Configuration
 * Web/Mobile共通のSupabase設定ファイル
 */

// 🌐 Web環境でのSupabase設定
export const webSupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// 📱 Mobile環境でのSupabase設定
export const mobileSupabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// 🔧 環境判定とコンフィグ選択
export const getSupabaseConfig = () => {
  // React Native環境判定
  const isReactNative = typeof navigator !== 'undefined' && 
    navigator.product === 'ReactNative';
  
  if (isReactNative) {
    return mobileSupabaseConfig;
  }
  
  return webSupabaseConfig;
};

// 📊 デフォルト設定値
export const SUPABASE_CONFIG = {
  url: 'https://svgxhwchbiqtmqimcfxn.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z3hod2NoYmlxdG1xaW1jZnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzYzMjAsImV4cCI6MjA2MzY1MjMyMH0.oHB0RkmkuLN-0xEHPJEGz_luHrzow2ve-2iO5mhZFTU',
} as const;

// 🎯 使用例:
// import { SUPABASE_CONFIG } from '@scaffai/config';
// const { url, anonKey } = SUPABASE_CONFIG;
