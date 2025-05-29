// 🏗️ ScaffAI 軒の出描画機能 - 型定義

// 基本図形型
export interface Point {
  x: number;
  y: number;
}

// 壁の型定義（既存）
export interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height: number;
  hasEave?: boolean; // 軒の出フラグ
  color: string;
  createdAt: Date;
}

// 軒の出の型定義（新規）
export interface Eave {
  id: string;
  wallId: string; // 関連する壁のID
  points: Point[]; // 軒の出のポリゴン点群
  distance: number; // 軒の出距離（mm）
  color: string;
  opacity: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 軒の出設定の型定義
export interface EaveSettings {
  defaultDistance: number; // デフォルト軒の出距離（mm）
  autoGenerate: boolean; // 自動生成ON/OFF
  color: string; // 軒の出色
  opacity: number; // 透明度
  strokeStyle: 'solid' | 'dashed' | 'dotted'; // 線スタイル
  showDimensions: boolean; // 寸法表示
}

// 建物データの型定義（拡張）
export interface Building {
  id: string;
  name: string;
  walls: Wall[];
  eaves: Eave[]; // 軒の出配列
  eaveSettings: EaveSettings;
  createdAt: Date;
  updatedAt: Date;
}

// 軒の出生成関数の型定義
export interface EaveGenerator {
  generateEaveForWall: (wall: Wall, distance: number) => Eave;
  generateAllEaves: (walls: Wall[], settings: EaveSettings) => Eave[];
  calculateOuterDirection: (wall: Wall) => Point;
  findIntersections: (eaves: Eave[]) => Point[];
}

// 軒の出編集関数の型定義
export interface EaveEditor {
  updateEaveDistance: (eaveId: string, newDistance: number) => void;
  toggleEaveVisibility: (eaveId: string) => void;
  deleteEave: (eaveId: string) => void;
  resetAllEaves: () => void;
}

// イベントハンドラーの型
export interface DrawingEventHandlers {
  onWallComplete: (wall: Wall) => void;
  onEaveGenerate: (wall: Wall) => void;
  onEaveUpdate: (eave: Eave) => void;
  onSettingsChange: (settings: EaveSettings) => void;
}

// 描画コンテキストの型
export interface DrawingContext {
  walls: Wall[];
  eaves: Eave[];
  settings: EaveSettings;
  selectedWall: Wall | null;
  selectedEave: Eave | null;
  isDragging: boolean;
  dragStart: Point | null;
  mousePos: Point;
}
