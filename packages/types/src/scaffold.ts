/**
 * 🏗️ ScaffAI - 足場計算システム型定義
 * Web/Mobile共通で使用する型定義ファイル (Supabase統合版)
 */

// 🎯 入力データの型定義
export interface InputData {
  frameWidth: {
    northSouth: number | null;
    eastWest: number | null;
  };
  eaveOverhang: {
    north: number | null;
    east: number | null;
    south: number | null;
    west: number | null;
  };
  propertyLine: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
  referenceHeight: number | null;
  roofShape: 'flat' | 'sloped' | 'roofDeck';
  hasTieColumns: boolean;
  eavesHandrails: number | null;
  specialMaterial: {
    northSouth: {
      material355: number | null;
      material300: number | null;
      material150: number | null;
    };
    eastWest: {
      material355: number | null;
      material300: number | null;
      material150: number | null;
    };
  };
  targetOffset: number | null;
  propertyLineDistance?: {
    north: number | null;
    east: number | null;
    south: number | null;
    west: number | null;
  };
}

// 📊 計算結果の型定義 (Railway APIレスポンス構造)
export interface CalculationResult {
  ns_total_span: number;
  ew_total_span: number;
  ns_span_structure: string;
  ew_span_structure: string;
  north_gap: string;
  south_gap: string;
  east_gap: string;
  west_gap: string;
  num_stages: number;
  modules_count: number;
  jack_up_height: number;
  first_layer_height: number;
  tie_ok: boolean;
  tie_column_used: boolean;
}

// 🌐 APIリクエスト用の型定義
export interface CalculationAPIRequest {
  width_NS: number;
  width_EW: number;
  eaves_N: number;
  eaves_E: number;
  eaves_S: number;
  eaves_W: number;
  boundary_N: number | null;
  boundary_E: number | null;
  boundary_S: number | null;
  boundary_W: number | null;
  standard_height: number;
  roof_shape: 'flat' | 'sloped' | 'roofDeck';
  tie_column: boolean;
  railing_count: number;
  use_355_NS: number;
  use_300_NS: number;
  use_150_NS: number;
  use_355_EW: number;
  use_300_EW: number;
  use_150_EW: number;
  target_margin: number;
}

// 🏗️ デフォルト値
export const defaultInputData: InputData = {
  frameWidth: {
    northSouth: null,
    eastWest: null,
  },
  eaveOverhang: {
    north: null,
    east: null,
    south: null,
    west: null,
  },
  propertyLine: {
    north: false,
    east: false,
    south: false,
    west: false,
  },
  referenceHeight: null,
  roofShape: 'flat',
  hasTieColumns: false,
  eavesHandrails: null,
  specialMaterial: {
    northSouth: {
      material355: null,
      material300: null,
      material150: null,
    },
    eastWest: {
      material355: null,
      material300: null,
      material150: null,
    },
  },
  targetOffset: null,
  propertyLineDistance: {
    north: null,
    east: null,
    south: null,
    west: null,
  },
};

// 🧪 テスト用データ
export const testInputData: InputData = {
  frameWidth: {
    northSouth: 1000,
    eastWest: 1000,
  },
  eaveOverhang: {
    north: 0,
    east: 0,
    south: 0,
    west: 0,
  },
  propertyLine: {
    north: false,
    east: false,
    south: false,
    west: false,
  },
  referenceHeight: 2400,
  roofShape: 'flat',
  hasTieColumns: false,
  eavesHandrails: 0,
  specialMaterial: {
    northSouth: {
      material355: 0,
      material300: 0,
      material150: 0,
    },
    eastWest: {
      material355: 0,
      material300: 0,
      material150: 0,
    },
  },
  targetOffset: 900,
  propertyLineDistance: {
    north: null,
    east: null,
    south: null,
    west: null,
  },
};

// 🎯 コンテキストの型定義 (Supabase統合版)
export interface ScaffoldContextType {
  // 📝 基本データ
  inputData: InputData;
  setInputValue: (
    category: keyof InputData,
    field: string,
    value: any
  ) => void;
  resetInputData: () => void;
  
  // 🧮 計算関連
  calculationResult: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
  calculateScaffold: () => Promise<void>;
  testAPICall: () => Promise<void>;
  
  // 🆕 Supabase統合機能
  currentProject?: any; // ScaffAIProject type
  saveProject?: (projectName?: string) => Promise<void>;
  saveStatus?: 'saved' | 'saving' | 'unsaved' | 'error';
  loadProject?: (projectId: string) => Promise<void>;
}

// 🔐 認証関連の型定義
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  company?: string;
  created_at: string;
}

// 💾 プロジェクト管理の型定義
export interface ProjectMetadata {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_platform: 'web' | 'mobile';
  last_edited_platform: 'web' | 'mobile';
  user_id: string;
}

// 🎨 UI状態管理の型定義
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: 'ja' | 'en';
  sidebarOpen: boolean;
  currentTab: string;
}

// 📱 モバイル特有の型定義
export interface MobileSettings {
  notifications: boolean;
  haptics: boolean;
  offlineMode: boolean;
  autoSave: boolean;
}

// 🌐 Web特有の型定義
export interface WebSettings {
  autoSave: boolean;
  shortcuts: boolean;
  animations: boolean;
  density: 'compact' | 'normal' | 'comfortable';
}

// 🔄 同期関連の型定義
export interface SyncEvent {
  id: string;
  project_id: string;
  event_type: 'create' | 'update' | 'delete' | 'calculate';
  changes: Record<string, any>;
  platform: 'web' | 'mobile';
  timestamp: string;
}

// 📊 統計・分析用の型定義
export interface ProjectStats {
  totalProjects: number;
  totalCalculations: number;
  averageProjectSize: number;
  mostUsedFeatures: string[];
  lastActivity: string;
}

// 🚨 エラーハンドリングの型定義
export interface ScaffAIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  context: 'auth' | 'calculation' | 'sync' | 'storage';
}

// 🎯 API レスポンスの型定義
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ScaffAIError;
  metadata?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// 🔧 設定管理の型定義
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    realTimeSync: boolean;
    offlineMode: boolean;
    analytics: boolean;
    betaFeatures: boolean;
  };
  ui: {
    theme: UIState['theme'];
    animations: boolean;
    density: WebSettings['density'];
  };
}

// 📝 フォームバリデーションの型定義
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

// 🎨 テーマ関連の型定義
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
}

// 🔍 検索・フィルター関連の型定義
export interface ProjectFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  platform?: 'web' | 'mobile';
  hasCalculation?: boolean;
  searchQuery?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  projects: ProjectMetadata[];
  total: number;
  page: number;
  hasMore: boolean;
}
