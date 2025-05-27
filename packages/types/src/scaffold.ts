/**
 * 🏗️ ScaffAI - 足場計算システム型定義
 * Web/Mobile共通で使用する型定義ファイル
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

// 🔧 コンテキストの型定義
export interface ScaffoldContextType {
  inputData: InputData;
  setInputValue: (
    category: keyof InputData,
    field: string,
    value: any
  ) => void;
  resetInputData: () => void;
  calculationResult: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
  calculateScaffold: () => Promise<void>;
  testAPICall: () => Promise<void>;
}
