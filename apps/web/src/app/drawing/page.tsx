'use client';

// 🏗️ ScaffAI 統合建築ページ - 軒の出描画機能 + UI/UX改善版
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Download, 
  Save, 
  Grid3X3, 
  Layers, 
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  RotateCw,
  Move,
  Square,
  Home,
  Ruler,
  Settings,
  Info,
  PaintBucket
} from 'lucide-react';

// 基本型定義（既存コードから）
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

// 🎨 描画モード定義
type DrawingMode = 'wall' | 'eave' | 'select' | 'measure';
type ViewMode = '2d' | '3d';

const DrawingPageEnhanced = () => {
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
  
  // 🎨 UI状態
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('wall');
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
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
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
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
  
  // 🏗️ 軒の出生成ロジック（既存機能維持）
  const generateEaveForWall = useCallback((wall: Wall): Eave => {
    const wallVector = {
      x: wall.endPoint.x - wall.startPoint.x,
      y: wall.endPoint.y - wall.startPoint.y
    };
    
    const length = Math.sqrt(wallVector.x * wallVector.x + wallVector.y * wallVector.y);
    const normalVector = {
      x: -wallVector.y / length,
      y: wallVector.x / length
    };
    
    const distance = eaveSettings.defaultDistance / 10;
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
  
  // 🎨 Canvas描画（2D/3D統合）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景色設定
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (viewMode === '2d') {
      // 2D表示モード
      if (showGrid) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    } else {
      // 3D表示モード（簡易版）
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      const drawCube = (x: number, y: number, width: number, height: number, depth: number) => {
        // フロント面
        ctx.strokeRect(x, y, width, height);
        
        // トップ面
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + width + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.stroke();
        
        // 右面
        ctx.beginPath();
        ctx.moveTo(x + width, y);
        ctx.lineTo(x + width + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + width + depth * 0.5, y + height - depth * 0.5);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.stroke();
      };
      
      // 足場の層を描画
      for (let i = 0; i < 5; i++) {
        drawCube(100, 100 + i * 60, 400, 50, 300);
      }
    }
  }, [viewMode, showGrid, gridSize]);
  
  // 🖱️ マウスイベント処理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (drawingMode !== 'wall') return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const point = snapPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    setDragStart(point);
    setMousePos(point);
  }, [drawingMode, snapPoint]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const point = snapPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setMousePos(point);
  }, [snapPoint]);
  
  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart || drawingMode !== 'wall') return;
    
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
  }, [isDragging, dragStart, mousePos, drawingMode, eaveSettings, generateEaveForWall]);
  
  // 🔧 設定更新
  const updateEaveSettings = useCallback((updates: Partial<EaveSettings>) => {
    setEaveSettings(prev => ({ ...prev, ...updates }));
  }, []);
  
  // 🎯 軒の出機能
  const generateAllEaves = useCallback(() => {
    const newEaves = walls.map(wall => generateEaveForWall(wall));
    setEaves(newEaves);
  }, [walls, generateEaveForWall]);
  
  const resetAllEaves = useCallback(() => {
    setEaves([]);
  }, []);
  
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
    <div className={`h-full flex ${isFullscreen ? 'fixed inset-0 z-50' : 'max-w-7xl mx-auto'}`}>
      
      {/* 🔧 左サイドバー - ツール&設定 */}
      {!isFullscreen && leftSidebarOpen && (
        <div className="w-64 bg-white dark:bg-dark-300 border-r border-slate-200 dark:border-dark-100 flex flex-col">
          {/* ヘッダー */}
          <div className="p-4 border-b border-slate-200 dark:border-dark-100">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-2">🛠️ 描画ツール</h2>
          </div>
          
          {/* 描画モード選択 */}
          <div className="p-4 border-b border-slate-200 dark:border-dark-100">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">描画モード</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { mode: 'wall' as DrawingMode, icon: Square, label: '壁' },
                { mode: 'eave' as DrawingMode, icon: Home, label: '軒' },
                { mode: 'select' as DrawingMode, icon: Move, label: '選択' },
                { mode: 'measure' as DrawingMode, icon: Ruler, label: '測定' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setDrawingMode(mode)}
                  className={`p-3 rounded-lg text-sm font-medium flex flex-col items-center gap-1 transition-colors ${
                    drawingMode === mode
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 軒の出設定 */}
          <div className="p-4 border-b border-slate-200 dark:border-dark-100">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">🏗️ 軒の出設定</h3>
            
            <div className="space-y-3">
              {/* 自動生成ON/OFF */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 dark:text-slate-400">自動生成</label>
                <button
                  onClick={() => updateEaveSettings({ autoGenerate: !eaveSettings.autoGenerate })}
                  className={`p-2 rounded ${
                    eaveSettings.autoGenerate 
                      ? 'bg-success-100 text-success-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {eaveSettings.autoGenerate ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              
              {/* 距離設定 */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">距離</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={eaveSettings.defaultDistance}
                    onChange={(e) => updateEaveSettings({ defaultDistance: Number(e.target.value) })}
                    className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded"
                    min="0"
                    max="2000"
                    step="50"
                  />
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              
              {/* 色設定 */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">色</label>
                <input
                  type="color"
                  value={eaveSettings.color}
                  onChange={(e) => updateEaveSettings({ color: e.target.value })}
                  className="w-full h-8 border border-slate-200 rounded cursor-pointer"
                />
              </div>
              
              {/* 透明度 */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">
                  透明度: {Math.round(eaveSettings.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={eaveSettings.opacity}
                  onChange={(e) => updateEaveSettings({ opacity: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* アクションボタン */}
            <div className="mt-4 space-y-2">
              <button 
                onClick={generateAllEaves}
                className="w-full btn-primary py-2 px-3 text-sm"
              >
                <Layers size={16} className="mr-2 inline" />
                軒の出生成
              </button>
              <button 
                onClick={resetAllEaves}
                className="w-full btn-outline py-2 px-3 text-sm text-red-600 hover:bg-red-50"
              >
                <Minus size={16} className="mr-2 inline" />
                リセット
              </button>
            </div>
          </div>
          
          {/* 表示設定 */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">表示設定</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 dark:text-slate-400">グリッド</label>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded ${showGrid ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Grid3X3 size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 dark:text-slate-400">スナップ</label>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`p-2 rounded ${snapToGrid ? 'bg-accent-100 text-accent-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 dark:text-slate-400">軒の出</label>
                <button
                  onClick={() => setShowEaves(!showEaves)}
                  className={`p-2 rounded ${showEaves ? 'bg-success-100 text-success-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {showEaves ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 🎨 メイン描画エリア */}
      <div className="flex-1 flex flex-col">
        {/* トップバー */}
        {!isFullscreen && (
          <header className="p-3 bg-white dark:bg-dark-300 border-b border-slate-200 dark:border-dark-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded"
              >
                <Settings size={18} />
              </button>
              
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  軒の出対応 足場設計図面作成
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  スマート軒の出自動生成機能付き建物図面作成
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* 2D/3D切り替え */}
              <div className="flex items-center bg-slate-100 dark:bg-dark-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    viewMode === '2d'
                      ? 'bg-white dark:bg-dark-100 text-primary-700'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Grid3X3 size={14} className="mr-1 inline" />
                  2D
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    viewMode === '3d'
                      ? 'bg-white dark:bg-dark-100 text-primary-700'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Layers size={14} className="mr-1 inline" />
                  3D
                </button>
              </div>
              
              {/* ツールボタン */}
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded">
                <RotateCw size={18} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              
              {/* アクションボタン */}
              <button className="btn-outline py-2 px-3 text-sm">
                <ArrowLeft size={16} className="mr-1" />
                結果に戻る
              </button>
              <button className="btn-outline py-2 px-3 text-sm">
                <Save size={16} className="mr-1" />
                保存
              </button>
              <button className="btn-outline py-2 px-3 text-sm">
                <Download size={16} className="mr-1" />
                エクスポート
              </button>
            </div>
          </header>
        )}
        
        {/* 描画キャンバス */}
        <div className="flex-1 relative flex">
          {/* Canvas + SVG ハイブリッド描画エリア */}
          <div className="flex-1 p-4 overflow-auto relative">
            <div className="relative mx-auto" style={{ width: '800px', height: '600px' }}>
              {/* Canvas レイヤー（背景・グリッド・3D） */}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="absolute inset-0 border border-slate-200 dark:border-dark-100 rounded-lg"
              />
              
              {/* SVG レイヤー（インタラクティブ要素） */}
              <div
                ref={svgRef}
                className="absolute inset-0 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <svg 
                  width="800" 
                  height="600" 
                  className="absolute inset-0 pointer-events-none"
                  viewBox="0 0 800 600"
                >
                  {/* 軒の出描画（壁より下のレイヤー） */}
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
              </div>
            </div>
          </div>
          
          {/* 📊 右サイドバー - プロパティ&情報 */}
          {!isFullscreen && rightSidebarOpen && (
            <div className="w-64 bg-white dark:bg-dark-300 border-l border-slate-200 dark:border-dark-100 flex flex-col">
              {/* プロジェクト情報 */}
              <div className="p-4 border-b border-slate-200 dark:border-dark-100">
                <h3 className="font-medium text-slate-800 dark:text-white mb-2">🏗️ プロジェクト情報</h3>
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>壁数: {walls.length}</p>
                  <p>軒の出: {eaves.length}</p>
                  <p>軒の出設定: {eaveSettings.defaultDistance}mm</p>
                </div>
              </div>
              
              {/* 選択中の軒の出編集 */}
              {selectedEave && (
                <div className="p-4 border-b border-slate-200 dark:border-dark-100">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">選択中の軒の出</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      距離: {selectedEave.distance}mm
                    </p>
                    <div className="flex gap-1">
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
                </div>
              )}
              
              {/* レイヤー管理 */}
              <div className="p-4 border-b border-slate-200 dark:border-dark-100">
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">📋 レイヤー管理</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-dark-200 rounded">
                    <span className="text-sm">壁レイヤー</span>
                    <Eye size={16} className="text-slate-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-dark-200 rounded">
                    <span className="text-sm">軒の出レイヤー</span>
                    <button onClick={() => setShowEaves(!showEaves)}>
                      {showEaves ? <Eye size={16} className="text-blue-500" /> : <EyeOff size={16} className="text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 操作説明 */}
              <div className="p-4 flex-1">
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">💡 操作方法</h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p>• ドラッグで壁を描画</p>
                  <p>• 軒の出は自動生成</p>
                  <p>• 軒の出をクリックして編集</p>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => setRightSidebarOpen(false)}
                    className="w-full p-2 text-xs text-slate-500 hover:bg-slate-100 rounded"
                  >
                    <Info size={14} className="mr-1 inline" />
                    パネルを閉じる
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* サイドバー開閉ボタン */}
          {!isFullscreen && !rightSidebarOpen && (
            <button
              onClick={() => setRightSidebarOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-dark-300 border border-slate-200 dark:border-dark-100 rounded-lg shadow-md text-slate-600 hover:bg-slate-50"
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingPageEnhanced;