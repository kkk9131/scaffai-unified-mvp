// 🏗️ 作図機能の共通型定義

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height: number;
  material?: string;
}

export interface Opening {
  id: string;
  type: 'door' | 'window' | 'balcony';
  position: Point;
  width: number;
  height: number;
  wallId: string;
}

export interface Room {
  id: string;
  name: string;
  outline: Point[];
  area?: number;
}

export interface BuildingData {
  id: string;
  name: string;
  walls: Wall[];
  openings: Opening[];
  rooms: Room[];
  scale: number; // 1メートル = scale ピクセル
  dimensions: {
    width: number;  // 実際の幅（メートル）
    height: number; // 実際の高さ（メートル）
  };
}

export interface DrawingTool {
  type: 'select' | 'wall' | 'door' | 'window' | 'dimension';
  active: boolean;
}

export interface DrawingState {
  building: BuildingData;
  selectedTool: DrawingTool;
  selectedElements: string[];
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
  panOffset: Point;
}
