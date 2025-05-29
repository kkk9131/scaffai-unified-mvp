// 🎨 作図ページ - 端数寸法対応 + 端点スナップ機能

'use client';

import React, { useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  start: Point;
  end: Point;
  userLength?: number; // ユーザーが編集した長さ（mm）
}

export default function DrawingPage() {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'select' | 'wall'>('wall');
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToAxis, setSnapToAxis] = useState(true);
  const [snapToEndpoints, setSnapToEndpoints] = useState(true); // 新機能：端点スナップ
  const [editingWall, setEditingWall] = useState<string | null>(null);
  const [editLength, setEditLength] = useState<string>('');
  const [nearestEndpoint, setNearestEndpoint] = useState<Point | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const gridSize = 25; // 1マス = 500mm = 25px（500mm / 20 = 25px）
  const pixelToMm = 20; // 1px = 20mm
  const snapDistance = 15; // スナップ距離（ピクセル）

  // 📍 すべての壁の端点を取得
  const getAllEndpoints = (): Point[] => {
    const endpoints: Point[] = [];
    walls.forEach(wall => {
      endpoints.push(wall.start, wall.end);
    });
    return endpoints;
  };

  // 📍 最も近い端点を検索
  const findNearestEndpoint = (point: Point): Point | null => {
    if (!snapToEndpoints) return null;

    const endpoints = getAllEndpoints();
    let nearestPoint: Point | null = null;
    let minDistance = snapDistance;

    endpoints.forEach(endpoint => {
      const distance = Math.sqrt(
        Math.pow(point.x - endpoint.x, 2) + 
        Math.pow(point.y - endpoint.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = endpoint;
      }
    });

    return nearestPoint;
  };

  // 📐 グリッドスナップ関数
  const snapToGridPoint = (point: Point): Point => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  // 📏 軸スナップ関数（水平・垂直）
  const snapToAxisPoint = (current: Point, start: Point): Point => {
    if (!snapToAxis || !start) return current;

    const deltaX = Math.abs(current.x - start.x);
    const deltaY = Math.abs(current.y - start.y);

    if (deltaX > deltaY) {
      return { x: current.x, y: start.y };
    } else {
      return { x: start.x, y: current.y };
    }
  };

  // 🎯 総合スナップ処理
  const processSnapping = (rawPoint: Point, startPoint?: Point): { point: Point; snappedToEndpoint: boolean } => {
    let processedPoint = rawPoint;
    let snappedToEndpoint = false;

    // 1. 端点スナップを最優先
    const nearestEndpoint = findNearestEndpoint(rawPoint);
    if (nearestEndpoint) {
      processedPoint = nearestEndpoint;
      snappedToEndpoint = true;
    } else {
      // 2. グリッドスナップ
      if (snapToGrid) {
        processedPoint = snapToGridPoint(rawPoint);
      }
    }

    // 3. 軸スナップ（描画中のみ）
    if (startPoint && snapToAxis && !snappedToEndpoint) {
      processedPoint = snapToAxisPoint(processedPoint, startPoint);
    }

    return { point: processedPoint, snappedToEndpoint };
  };

  // SVG座標取得
  const getSVGPoint = (event: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // 📏 壁の長さ計算（ピクセル → mm）
  const getWallLengthMm = (wall: Wall): number => {
    if (wall.userLength) return wall.userLength;
    
    const pixelLength = Math.sqrt(
      Math.pow(wall.end.x - wall.start.x, 2) + 
      Math.pow(wall.end.y - wall.start.y, 2)
    );
    return Math.round(pixelLength * pixelToMm);
  };

  // 🔄 長さから終点を再計算
  const recalculateEndPoint = (wall: Wall, newLengthMm: number): Point => {
    const currentPixelLength = Math.sqrt(
      Math.pow(wall.end.x - wall.start.x, 2) + 
      Math.pow(wall.end.y - wall.start.y, 2)
    );
    
    if (currentPixelLength === 0) return wall.end;
    
    const newPixelLength = newLengthMm / pixelToMm;
    const ratio = newPixelLength / currentPixelLength;
    
    const deltaX = wall.end.x - wall.start.x;
    const deltaY = wall.end.y - wall.start.y;
    
    return {
      x: wall.start.x + deltaX * ratio,
      y: wall.start.y + deltaY * ratio
    };
  };

  // 📝 寸法編集開始
  const startEditingDimension = (wallId: string) => {
    const wall = walls.find(w => w.id === wallId);
    if (wall) {
      setEditingWall(wallId);
      setEditLength(getWallLengthMm(wall).toString());
    }
  };

  // ✅ 寸法編集確定
  const confirmEditDimension = () => {
    if (!editingWall) return;
    
    const newLength = parseInt(editLength);
    if (isNaN(newLength) || newLength <= 0) {
      setEditingWall(null);
      setEditLength('');
      return;
    }
    
    setWalls(prev => prev.map(wall => {
      if (wall.id === editingWall) {
        const newEndPoint = recalculateEndPoint(wall, newLength);
        return {
          ...wall,
          end: newEndPoint,
          userLength: newLength
        };
      }
      return wall;
    }));
    
    setEditingWall(null);
    setEditLength('');
  };

  // ❌ 寸法編集キャンセル
  const cancelEditDimension = () => {
    setEditingWall(null);
    setEditLength('');
  };

  // マウスイベント
  const handleMouseDown = (event: React.MouseEvent) => {
    if (currentTool !== 'wall') return;
    
    const rawPoint = getSVGPoint(event);
    const { point: snappedPoint } = processSnapping(rawPoint);
    setDragStart(snappedPoint);
    setIsDrawing(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rawPoint = getSVGPoint(event);
    const { point: processedPoint, snappedToEndpoint } = processSnapping(
      rawPoint, 
      isDrawing ? dragStart : undefined
    );
    
    setMousePos(processedPoint);
    
    // 端点スナップのビジュアルフィードバック
    if (!isDrawing) {
      const nearestPoint = findNearestEndpoint(rawPoint);
      setNearestEndpoint(nearestPoint);
    } else {
      setNearestEndpoint(null);
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!isDrawing || !dragStart || currentTool !== 'wall') return;
    
    const rawPoint = getSVGPoint(event);
    const { point: endPoint } = processSnapping(rawPoint, dragStart);
    
    const distance = Math.sqrt(
      Math.pow(endPoint.x - dragStart.x, 2) + 
      Math.pow(endPoint.y - dragStart.y, 2)
    );
    
    if (distance > 5) { // 5px以上の距離
      const newWall: Wall = {
        id: `wall-${Date.now()}`,
        start: dragStart,
        end: endPoint
      };
      setWalls(prev => [...prev, newWall]);
    }
    
    setIsDrawing(false);
    setDragStart(null);
    setNearestEndpoint(null);
  };

  // 🧭 壁の方向を判定
  const getWallDirection = (wall: Wall): string => {
    const deltaX = Math.abs(wall.end.x - wall.start.x);
    const deltaY = Math.abs(wall.end.y - wall.start.y);
    
    if (deltaY < 3) return '水平';
    if (deltaX < 3) return '垂直';
    return '斜め';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🏗️ ScaffAI - 建物作図 (端点スナップ対応)
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a 
                href="/" 
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                ダッシュボード
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* ツールバー */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">🎮 ツール</h3>
          
          <div className="space-y-2 mb-6">
            <button
              onClick={() => setCurrentTool('select')}
              className={`w-full p-3 rounded-md text-left transition-colors ${
                currentTool === 'select' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              ↖️ 選択ツール
            </button>
            
            <button
              onClick={() => setCurrentTool('wall')}
              className={`w-full p-3 rounded-md text-left transition-colors ${
                currentTool === 'wall' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              🧱 壁を描く
            </button>
          </div>

          {/* 📐 スナップ設定 */}
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-3">📐 スナップ設定</h4>
            
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">グリッドスナップ (500mm)</span>
            </label>
            
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={snapToAxis}
                onChange={(e) => setSnapToAxis(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">📏 水平・垂直スナップ</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={snapToEndpoints}
                onChange={(e) => setSnapToEndpoints(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">🎯 端点スナップ</span>
            </label>
            
            {snapToEndpoints && (
              <div className="mt-2 text-xs text-gray-600">
                💡 既存の壁の端点に自動的に吸着します
              </div>
            )}
          </div>

          {/* 📏 寸法編集 */}
          {editingWall && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium mb-2 text-yellow-800">📏 寸法編集</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  value={editLength}
                  onChange={(e) => setEditLength(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="長さ (mm)"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <button
                    onClick={confirmEditDimension}
                    className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    ✅ 確定
                  </button>
                  <button
                    onClick={cancelEditDimension}
                    className="flex-1 px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                  >
                    ❌ キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 統計 */}
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">📊 統計</h4>
            <div className="text-sm space-y-1">
              <div>壁の数: {walls.length}</div>
              <div>端点の数: {getAllEndpoints().length}</div>
              <div>グリッド: 1マス = 500mm</div>
              {nearestEndpoint && !isDrawing && (
                <div className="text-blue-600">
                  🎯 端点検出: {nearestEndpoint.x.toFixed(0)}, {nearestEndpoint.y.toFixed(0)}
                </div>
              )}
              {isDrawing && dragStart && (
                <div className="text-blue-600">
                  描画中... {Math.round(Math.sqrt(
                    Math.pow(mousePos.x - dragStart.x, 2) + 
                    Math.pow(mousePos.y - dragStart.y, 2)
                  ) * pixelToMm)}mm
                </div>
              )}
            </div>
          </div>

          {/* 🧭 壁リスト */}
          {walls.length > 0 && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">🧭 壁リスト</h4>
              <div className="text-sm space-y-2 max-h-40 overflow-y-auto">
                {walls.map((wall, index) => (
                  <div key={wall.id} className="bg-white p-2 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">壁{index + 1}</span>
                      <span className="text-gray-600 text-xs">
                        {getWallDirection(wall)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <button
                        onClick={() => startEditingDimension(wall.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs hover:underline"
                        disabled={editingWall !== null}
                      >
                        📏 {getWallLengthMm(wall).toLocaleString()}mm
                      </button>
                      <button
                        onClick={() => setWalls(prev => prev.filter(w => w.id !== wall.id))}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🏗️ 足場計算ボタン */}
          {walls.length > 0 && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium mb-2 text-green-800">🏗️ 足場計算</h4>
              <p className="text-sm text-green-600 mb-3">
                作図した建物データで足場計算を実行できます
              </p>
              <button
                onClick={() => {
                  // 建物データをローカルストレージに保存
                  const buildingData = {
                    name: '作図建物',
                    walls: walls,
                    totalArea: walls.length > 0 ? walls.reduce((total, wall) => total + getWallLengthMm(wall), 0) : 0
                  };
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('drawingBuildingData', JSON.stringify(buildingData));
                  }
                  // 足場計算ページに移動
                  window.location.href = '/scaffold';
                }}
                className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                🔧 足場計算を実行
              </button>
            </div>
          )}

          {/* クリアボタン */}
          <button
            onClick={() => setWalls([])}
            className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            disabled={walls.length === 0}
          >
            🗑️ 全削除
          </button>
        </div>

        {/* キャンバス */}
        <div className="flex-1 p-4">
          <div className="h-full bg-white rounded-lg border relative">
            {/* 📋 操作ヒント */}
            <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 rounded-md p-3 z-10">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">📖 操作方法</div>
                <div>🧱 壁を描く → ドラッグで描画</div>
                <div>🎯 端点スナップ: {snapToEndpoints ? 'ON' : 'OFF'}</div>
                <div>📏 寸法編集 → 赤い数値をクリック</div>
                <div className="text-xs mt-1 text-blue-600">
                  🎯 壁の端点近くにカーソルを置くと自動で吸着
                </div>
              </div>
            </div>

            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className={`${currentTool === 'wall' ? 'cursor-crosshair' : 'cursor-default'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* グリッド（500mm = 25px間隔） */}
              <defs>
                <pattern id="grid500" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                  <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#d1d5db" strokeWidth="1"/>
                </pattern>
                {/* 細かいグリッド（100mm = 5px間隔） */}
                <pattern id="grid100" width={gridSize/5} height={gridSize/5} patternUnits="userSpaceOnUse">
                  <path d={`M ${gridSize/5} 0 L 0 0 0 ${gridSize/5}`} fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid100)" />
              <rect width="100%" height="100%" fill="url(#grid500)" />
              
              {/* 端点表示 */}
              {snapToEndpoints && getAllEndpoints().map((endpoint, index) => (
                <circle
                  key={`endpoint-${index}`}
                  cx={endpoint.x}
                  cy={endpoint.y}
                  r="4"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="1"
                  className="pointer-events-none"
                />
              ))}

              {/* 近い端点のハイライト */}
              {nearestEndpoint && !isDrawing && (
                <circle
                  cx={nearestEndpoint.x}
                  cy={nearestEndpoint.y}
                  r="8"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="pointer-events-none animate-pulse"
                />
              )}
              
              {/* 壁 */}
              {walls.map(wall => (
                <g key={wall.id}>
                  <line
                    x1={wall.start.x}
                    y1={wall.start.y}
                    x2={wall.end.x}
                    y2={wall.end.y}
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* 🧭 方向インジケーター */}
                  {getWallDirection(wall) === '水平' && (
                    <text
                      x={wall.start.x - 12}
                      y={(wall.start.y + wall.end.y) / 2 + 15}
                      fontSize="10"
                      fill="#10b981"
                      className="pointer-events-none"
                    >
                      ↔️
                    </text>
                  )}
                  {getWallDirection(wall) === '垂直' && (
                    <text
                      x={(wall.start.x + wall.end.x) / 2 - 15}
                      y={wall.start.y - 5}
                      fontSize="10"
                      fill="#10b981"
                      className="pointer-events-none"
                    >
                      ↕️
                    </text>
                  )}
                  {/* 📏 寸法表示（クリック可能） */}
                  <text
                    x={(wall.start.x + wall.end.x) / 2}
                    y={(wall.start.y + wall.end.y) / 2 - 8}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#dc2626"
                    className="cursor-pointer font-medium hover:fill-red-800"
                    onClick={() => startEditingDimension(wall.id)}
                  >
                    {getWallLengthMm(wall).toLocaleString()}mm
                  </text>
                  {/* 編集中の背景 */}
                  {editingWall === wall.id && (
                    <rect
                      x={(wall.start.x + wall.end.x) / 2 - 30}
                      y={(wall.start.y + wall.end.y) / 2 - 20}
                      width="60"
                      height="16"
                      fill="yellow"
                      fillOpacity="0.3"
                      stroke="orange"
                      strokeWidth="1"
                      className="pointer-events-none"
                    />
                  )}
                </g>
              ))}

              {/* 描画中の線 */}
              {isDrawing && dragStart && (
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
              {snapToGrid && !nearestEndpoint && (
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
    </div>
  );
}
