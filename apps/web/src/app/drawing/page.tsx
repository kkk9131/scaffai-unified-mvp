'use client';

// 🏗️ ScaffAI 統合作図ページ - 軒の出機能付き Phase 2
import React, { useState, useCallback, useRef } from 'react';
import { 
  Download, 
  Save, 
  Grid3X3, 
  Layers, 
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';

// 基本型定義（簡略版）
interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height: number;
  hasEave?: boolean;
  color: string;
  createdAt: Date;
}

interface Eave {
  id: string;
  wallId: string;
  points: Point[];
  distance: number;
  color: string;
  opacity: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EaveSettings {
  defaultDistance: number;
  autoGenerate: boolean;
  color: string;
  opacity: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  showDimensions: boolean;
}

const DrawingPageWithEaves = () => {
  // 🎯 状態管理
  const [walls, setWalls] = useState<Wall[]>([]);
  const [eaves, setEaves] = useState<Eave[]>([]);
  const [eaveSettings, setEaveSettings] = useState<EaveSettings>({
    defaultDistance: 600,
    autoGenerate: true,
    color: '#94a3b8',
    opacity: 0.6,
    strokeStyle: 'dashed',
    showDimensions: true
  });
  
  // 描画状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  
  // 選択状態
  const [selectedWall, setSelectedWall] = useState<Wall | null>(null);
  const [selectedEave, setSelectedEave] = useState<Eave | null>(null);
  
  // 表示設定
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showEaves, setShowEaves] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixelToMm = 0.1;
  const gridSize = 20;
  
  // 🎯 スナップ機能
  const snapPoint = useCallback((point: Point): Point => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);
  
  // 🏗️ 軒の出生成ロジック（簡略版）
  const generateEaveForWall = useCallback((wall: Wall): Eave => {
    // 壁の方向ベクトルを計算
    const wallVector = {
      x: wall.endPoint.x - wall.startPoint.x,
      y: wall.endPoint.y - wall.startPoint.y
    };
    
    // 法線ベクトル（外向き）を計算
    const length = Math.sqrt(wallVector.x * wallVector.x + wallVector.y * wallVector.y);
    const normalVector = {
      x: -wallVector.y / length,
      y: wallVector.x / length
    };
    
    // 軒の出の点を計算
    const distance = eaveSettings.defaultDistance / 10; // mm to px conversion
    const p1 = {
      x: wall.startPoint.x + normalVector.x * distance,
      y: wall.startPoint.y + normalVector.y * distance
    };
    const p2 = {
      x: wall.endPoint.x + normalVector.x * distance,
      y: wall.endPoint.y + normalVector.y * distance
    };
    
    return {
      id: `eave-${wall.id}-${Date.now()}`,
      wallId: wall.id,
      points: [wall.startPoint, wall.endPoint, p2, p1],
      distance: eaveSettings.defaultDistance,
      color: eaveSettings.color,
      opacity: eaveSettings.opacity,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }, [eaveSettings]);
  
  // 🖱️ マウスイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const point = snapPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    setDragStart(point);
    setMousePos(point);
  }, [snapPoint]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const point = snapPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setMousePos(point);
  }, [snapPoint]);
  
  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart) return;
    
    // 新しい壁を作成
    const newWall: Wall = {
      id: `wall-${Date.now()}`,
      startPoint: dragStart,
      endPoint: mousePos,
      thickness: 150,
      height: 3000,
      hasEave: eaveSettings.autoGenerate,
      color: '#3b82f6',
      createdAt: new Date()
    };
    
    setWalls(prev => [...prev, newWall]);
    
    // 🏗️ 軒の出自動生成（Phase 2 機能）
    if (eaveSettings.autoGenerate) {
      const newEave = generateEaveForWall(newWall);
      setEaves(prev => [...prev, newEave]);
    }
    
    setIsDragging(false);
    setDragStart(null);
  }, [isDragging, dragStart, mousePos, eaveSettings, generateEaveForWall]);
  
  // 🎨 軒の出設定更新
  const updateEaveSettings = useCallback((updates: Partial<EaveSettings>) => {
    setEaveSettings(prev => ({ ...prev, ...updates }));
  }, []);
  
  // 🔄 全軒の出一括生成
  const generateAllEaves = useCallback(() => {
    const newEaves = walls.map(wall => generateEaveForWall(wall));
    setEaves(newEaves);
  }, [walls, generateEaveForWall]);
  
  // 🗑️ 軒の出リセット
  const resetAllEaves = useCallback(() => {
    setEaves([]);
  }, []);

  // 📏 軒の出距離更新
  const updateEaveDistance = useCallback((eaveId: string, newDistance: number) => {
    setEaves(prev => prev.map(eave => {
      if (eave.id !== eaveId) return eave;
      
      const wall = walls.find(w => w.id === eave.wallId);
      if (!wall) return eave;
      
      // 再計算
      const wallVector = {
        x: wall.endPoint.x - wall.startPoint.x,
        y: wall.endPoint.y - wall.startPoint.y
      };
      
      const length = Math.sqrt(wallVector.x * wallVector.x + wallVector.y * wallVector.y);
      const normalVector = {
        x: -wallVector.y / length,
        y: wallVector.x / length
      };
      
      const distance = newDistance / 10;
      const p1 = {
        x: wall.startPoint.x + normalVector.x * distance,
        y: wall.startPoint.y + normalVector.y * distance
      };
      const p2 = {
        x: wall.endPoint.x + normalVector.x * distance,
        y: wall.endPoint.y + normalVector.y * distance
      };
      
      return {
        ...eave,
        distance: newDistance,
        points: [wall.startPoint, wall.endPoint, p2, p1],
        updatedAt: new Date()
      };
    }));
  }, [walls]);

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto px-4 md:px-6">
      {/* ヘッダー */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            軒の出対応 足場設計図面作成
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            スマート軒の出自動生成機能付き建設現場図面作成
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="btn-outline py-2 px-3 text-sm">
            <ArrowLeft size={16} className="mr-1" />
            <span>結果に戻る</span>
          </button>
          <button className="btn-outline py-2 px-3 text-sm">
            <Save size={16} className="mr-1" />
            <span>保存</span>
          </button>
          <button className="btn-outline py-2 px-3 text-sm">
            <Download size={16} className="mr-1" />
            <span>エクスポート</span>
          </button>
        </div>
      </header>

      {/* メイン描画エリア */}
      <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        
        {/* ツールバー */}
        <div className="p-3 border-b border-slate-200 dark:border-dark-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* グリッド設定 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded ${showGrid ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <span className="text-sm text-slate-600">グリッド</span>
            </div>
            
            {/* スナップ設定 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`p-2 rounded ${snapToGrid ? 'bg-accent-100 text-accent-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Plus size={18} />
              </button>
              <span className="text-sm text-slate-600">スナップ</span>
            </div>
            
            {/* 🏗️ 軒の出設定セクション */}
            <div className="border-l border-slate-200 pl-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">軒の出</label>
                <button 
                  onClick={() => updateEaveSettings({ autoGenerate: !eaveSettings.autoGenerate })}
                  className={`p-2 rounded ${eaveSettings.autoGenerate ? 'bg-success-100 text-success-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {eaveSettings.autoGenerate ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-600">距離:</label>
                <input
                  type="number"
                  value={eaveSettings.defaultDistance}
                  onChange={(e) => updateEaveSettings({ defaultDistance: Number(e.target.value) })}
                  className="w-20 px-2 py-1 text-sm border border-slate-200 rounded"
                  min="0"
                  max="2000"
                  step="50"
                />
                <span className="text-xs text-slate-500">mm</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-600">色:</label>
                <input
                  type="color"
                  value={eaveSettings.color}
                  onChange={(e) => updateEaveSettings({ color: e.target.value })}
                  className="w-8 h-8 border border-slate-200 rounded cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-600">透明度:</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={eaveSettings.opacity}
                  onChange={(e) => updateEaveSettings({ opacity: Number(e.target.value) })}
                  className="w-16"
                />
                <span className="text-xs text-slate-500">{Math.round(eaveSettings.opacity * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={generateAllEaves}
              className="btn-primary py-2 px-3 text-sm"
            >
              <Layers size={16} className="mr-1" />
              軒の出生成
            </button>
            <button 
              onClick={resetAllEaves}
              className="btn-outline py-2 px-3 text-sm text-red-600 hover:bg-red-50"
            >
              <Minus size={16} className="mr-1" />
              リセット
            </button>
          </div>
        </div>
        
        {/* 描画キャンバス */}
        <div className="flex-1 p-4 overflow-auto relative">
          <div 
            ref={canvasRef}
            className="border border-slate-200 dark:border-dark-100 rounded-lg mx-auto relative bg-slate-50 dark:bg-dark-200 cursor-crosshair"
            style={{ width: '800px', height: '600px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* SVG描画レイヤー */}
            <svg 
              width="800" 
              height="600" 
              className="absolute inset-0 pointer-events-none"
              viewBox="0 0 800 600"
            >
              <defs>
                <pattern 
                  id="grid" 
                  width={gridSize} 
                  height={gridSize} 
                  patternUnits="userSpaceOnUse"
                >
                  <path 
                    d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              
              {/* グリッド表示 */}
              {showGrid && (
                <rect 
                  width="800" 
                  height="600" 
                  fill="url(#grid)" 
                />
              )}
              
              {/* 🏗️ 軒の出描画（壁より下のレイヤー） */}
              {showEaves && eaves.map(eave => eave.isVisible && (
                <g key={eave.id}>
                  <polygon
                    points={eave.points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill={eave.color}
                    fillOpacity={eave.opacity}
                    stroke={eave.color}
                    strokeWidth="1"
                    strokeDasharray="5,3"
                    className="hover:stroke-width-2 cursor-pointer"
                    onClick={() => setSelectedEave(eave)}
                  />
                  {/* 軒の出距離ラベル */}
                  {eaveSettings.showDimensions && (
                    <text
                      x={(eave.points[2].x + eave.points[3].x) / 2}
                      y={(eave.points[2].y + eave.points[3].y) / 2}
                      fontSize="10"
                      textAnchor="middle"
                      fill={eave.color}
                      className="pointer-events-none font-medium"
                    >
                      {eave.distance}mm
                    </text>
                  )}
                </g>
              ))}
              
              {/* 壁描画 */}
              {walls.map(wall => (
                <g key={wall.id}>
                  <line
                    x1={wall.startPoint.x}
                    y1={wall.startPoint.y}
                    x2={wall.endPoint.x}
                    y2={wall.endPoint.y}
                    stroke={wall.color}
                    strokeWidth="4"
                    className="hover:stroke-width-6 cursor-pointer"
                    onClick={() => setSelectedWall(wall)}
                  />
                  {/* 壁厚表示 */}
                  <text
                    x={(wall.startPoint.x + wall.endPoint.x) / 2}
                    y={(wall.startPoint.y + wall.endPoint.y) / 2 - 8}
                    fontSize="10"
                    textAnchor="middle"
                    fill={wall.color}
                    className="pointer-events-none font-medium"
                  >
                    {wall.thickness}mm
                  </text>
                </g>
              ))}
              
              {/* 描画中のプレビュー */}
              {isDragging && dragStart && (
                <g>
                  <line
                    x1={dragStart.x}
                    y1={dragStart.y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                  />
                  {/* 描画中の寸法 */}
                  <text
                    x={(dragStart.x + mousePos.x) / 2}
                    y={(dragStart.y + mousePos.y) / 2 - 12}
                    fontSize="11"
                    textAnchor="middle"
                    fill="#3b82f6"
                    className="pointer-events-none font-medium"
                  >
                    {Math.round(Math.sqrt(
                      Math.pow(mousePos.x - dragStart.x, 2) + 
                      Math.pow(mousePos.y - dragStart.y, 2)
                    ) * pixelToMm).toLocaleString()}mm
                  </text>
                </g>
              )}
              
              {/* スナップポイント表示 */}
              {snapToGrid && (
                <circle
                  cx={mousePos.x}
                  cy={mousePos.y}
                  r="3"
                  fill="#f59e0b"
                  className="pointer-events-none"
                />
              )}
            </svg>
            
            {/* 情報パネル */}
            <div className="absolute top-6 left-6 bg-white dark:bg-dark-200 rounded-lg shadow-md p-3 text-sm">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">🏗️ プロジェクト情報</h3>
              <p className="text-slate-600 dark:text-slate-400">壁数: {walls.length}</p>
              <p className="text-slate-600 dark:text-slate-400">軒の出: {eaves.length}</p>
              <p className="text-slate-600 dark:text-slate-400">軒の出設定: {eaveSettings.defaultDistance}mm</p>
              {selectedEave && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="font-medium text-slate-700">選択中の軒の出</p>
                  <p className="text-slate-600">距離: {selectedEave.distance}mm</p>
                  <div className="mt-1 flex gap-1">
                    <button 
                      onClick={() => updateEaveDistance(selectedEave.id, selectedEave.distance - 50)}
                      className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      -50
                    </button>
                    <button 
                      onClick={() => updateEaveDistance(selectedEave.id, selectedEave.distance + 50)}
                      className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      +50
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 操作説明 */}
            <div className="absolute bottom-6 right-6 bg-white dark:bg-dark-200 rounded-lg shadow-md p-3 text-sm">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">📝 操作方法</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-1">• ドラッグで壁を描画</p>
              <p className="text-slate-600 dark:text-slate-400 mb-1">• 軒の出は自動生成</p>
              <p className="text-slate-600 dark:text-slate-400">• 軒の出をクリックして編集</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingPageWithEaves;