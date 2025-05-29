// 🏗️ ScaffAI 軒の出計算ユーティリティ - Phase 2
// 壁の外側方向を自動計算し、スマートに軒の出を生成

import { Point, Wall, Eave, EaveSettings } from '../types/drawing';

// 📐 座標計算ユーティリティ
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const normalizeVector = (vector: Point): Point => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
};

// 🔄 壁の方向ベクトルを計算
export const getWallDirection = (wall: Wall): Point => {
  return {
    x: wall.endPoint.x - wall.startPoint.x,
    y: wall.endPoint.y - wall.startPoint.y
  };
};

// 📏 壁の外側方向（法線ベクトル）を自動計算
export const calculateOuterDirection = (wall: Wall, allWalls: Wall[]): Point => {
  const wallDirection = getWallDirection(wall);
  const normalizedDirection = normalizeVector(wallDirection);
  
  // 左向きの法線ベクトルを計算（右手系）
  const leftNormal = {
    x: -normalizedDirection.y,
    y: normalizedDirection.x
  };
  
  // 右向きの法線ベクトルを計算
  const rightNormal = {
    x: normalizedDirection.y,
    y: -normalizedDirection.x
  };
  
  // 🎯 スマート判定: 他の壁との関係から外側を判定
  const wallCenter = {
    x: (wall.startPoint.x + wall.endPoint.x) / 2,
    y: (wall.startPoint.y + wall.endPoint.y) / 2
  };
  
  // 左向き法線上の点
  const leftTestPoint = {
    x: wallCenter.x + leftNormal.x * 50,
    y: wallCenter.y + leftNormal.y * 50
  };
  
  // 右向き法線上の点
  const rightTestPoint = {
    x: wallCenter.x + rightNormal.x * 50,
    y: wallCenter.y + rightNormal.y * 50
  };
  
  // どちらが建物の外側かを他の壁との距離で判定
  let leftMinDistance = Infinity;
  let rightMinDistance = Infinity;
  
  allWalls.forEach(otherWall => {
    if (otherWall.id === wall.id) return;
    
    const otherCenter = {
      x: (otherWall.startPoint.x + otherWall.endPoint.x) / 2,
      y: (otherWall.startPoint.y + otherWall.endPoint.y) / 2
    };
    
    const leftDist = calculateDistance(leftTestPoint, otherCenter);
    const rightDist = calculateDistance(rightTestPoint, otherCenter);
    
    leftMinDistance = Math.min(leftMinDistance, leftDist);
    rightMinDistance = Math.min(rightMinDistance, rightDist);
  });
  
  // より遠い方を外側として採用
  return leftMinDistance > rightMinDistance ? leftNormal : rightNormal;
};

// 🏗️ 壁に対して軒の出を生成
export const generateEaveForWall = (
  wall: Wall, 
  distance: number, 
  allWalls: Wall[], 
  settings: EaveSettings
): Eave => {
  const outerDirection = calculateOuterDirection(wall, allWalls);
  
  // 軒の出の4つの角を計算
  const p1 = {
    x: wall.startPoint.x + outerDirection.x * distance,
    y: wall.startPoint.y + outerDirection.y * distance
  };
  const p2 = {
    x: wall.endPoint.x + outerDirection.x * distance,
    y: wall.endPoint.y + outerDirection.y * distance
  };
  
  // 矩形の軒の出ポリゴン
  const eavePoints = [
    wall.startPoint,
    wall.endPoint,
    p2,
    p1
  ];
  
  return {
    id: `eave-${wall.id}-${Date.now()}`,
    wallId: wall.id,
    points: eavePoints,
    distance,
    color: settings.color,
    opacity: settings.opacity,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// 💫 全ての壁に対して軒の出を一括生成
export const generateAllEaves = (walls: Wall[], settings: EaveSettings): Eave[] => {
  if (!settings.autoGenerate) return [];
  
  return walls.map(wall => 
    generateEaveForWall(wall, settings.defaultDistance, walls, settings)
  );
};

// ✂️ 軒の出同士の交差点を計算（角の処理用）
export const findEaveIntersections = (eaves: Eave[]): Point[] => {
  const intersections: Point[] = [];
  
  for (let i = 0; i < eaves.length; i++) {
    for (let j = i + 1; j < eaves.length; j++) {
      const eave1 = eaves[i];
      const eave2 = eaves[j];
      
      // 隣接する軒の出の場合のみ交差点を計算
      if (areEavesAdjacent(eave1, eave2)) {
        const intersection = calculateEaveIntersection(eave1, eave2);
        if (intersection) {
          intersections.push(intersection);
        }
      }
    }
  }
  
  return intersections;
};

// 🔗 軒の出が隣接しているかチェック
const areEavesAdjacent = (eave1: Eave, eave2: Eave): boolean => {
  // 簡単な隣接判定：軒の出の端点が近いかチェック
  const threshold = 10; // 10px以内なら隣接とみなす
  
  return eave1.points.some(p1 => 
    eave2.points.some(p2 => 
      calculateDistance(p1, p2) < threshold
    )
  );
};

// ✨ 軒の出同士の交差点を計算
const calculateEaveIntersection = (eave1: Eave, eave2: Eave): Point | null => {
  // 簡単な実装：軒の出の外側エッジ同士の交点を計算
  if (eave1.points.length < 4 || eave2.points.length < 4) return null;
  
  // 軒の出の外側エッジ（点2→点3）を取得
  const line1 = {
    start: eave1.points[2],
    end: eave1.points[3]
  };
  const line2 = {
    start: eave2.points[2],
    end: eave2.points[3]
  };
  
  return calculateLineIntersection(line1.start, line1.end, line2.start, line2.end);
};

// 📐 2つの線分の交差点を計算
const calculateLineIntersection = (p1: Point, p2: Point, p3: Point, p4: Point): Point | null => {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 1e-10) return null; // 平行線
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
};

// 🎨 軒の出の更新
export const updateEaveDistance = (eave: Eave, newDistance: number, allWalls: Wall[]): Eave => {
  const wall = allWalls.find(w => w.id === eave.wallId);
  if (!wall) return eave;
  
  const outerDirection = calculateOuterDirection(wall, allWalls);
  
  const p1 = {
    x: wall.startPoint.x + outerDirection.x * newDistance,
    y: wall.startPoint.y + outerDirection.y * newDistance
  };
  const p2 = {
    x: wall.endPoint.x + outerDirection.x * newDistance,
    y: wall.endPoint.y + outerDirection.y * newDistance
  };
  
  return {
    ...eave,
    distance: newDistance,
    points: [wall.startPoint, wall.endPoint, p2, p1],
    updatedAt: new Date()
  };
};

// 🧮 デフォルト軒の出設定
export const getDefaultEaveSettings = (): EaveSettings => ({
  defaultDistance: 600, // 600mm
  autoGenerate: true,
  color: '#94a3b8', // slate-400
  opacity: 0.6,
  strokeStyle: 'dashed',
  showDimensions: true
});
