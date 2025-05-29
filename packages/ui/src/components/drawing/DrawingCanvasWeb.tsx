// 🎨 Web版作図キャンバス (SVG + ドラッグ&ドロップ)

import React, { useState, useCallback, useRef } from 'react';
import { BuildingData, Point, Wall, DrawingTool } from './types';

interface DrawingCanvasWebProps {
  building: BuildingData;
  onBuildingChange: (building: BuildingData) => void;
  selectedTool: DrawingTool;
  className?: string;
}

export const DrawingCanvasWeb: React.FC<DrawingCanvasWebProps> = ({
  building,
  onBuildingChange,
  selectedTool,
  className = ""
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [currentWall, setCurrentWall] = useState<Partial<Wall> | null>(null);

  // SVG座標を実際の座標に変換
  const getSVGCoordinates = useCallback((event: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / building.scale),
      y: ((event.clientY - rect.top) / building.scale)
    };
  }, [building.scale]);

  // マウス操作ハンドラー
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const point = getSVGCoordinates(event);
    setIsDragging(true);
    setDragStart(point);

    if (selectedTool.type === 'wall') {
      // 壁の描画開始
      setCurrentWall({
        id: `wall-${Date.now()}`,
        start: point,
        end: point,
        thickness: 0.15, // 15cm
        height: 2.4      // 2.4m
      });
    }
  }, [getSVGCoordinates, selectedTool]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;
    
    const point = getSVGCoordinates(event);
    
    if (selectedTool.type === 'wall' && currentWall) {
      // 壁の終点を更新
      setCurrentWall(prev => prev ? { ...prev, end: point } : null);
    }
  }, [isDragging, getSVGCoordinates, selectedTool, currentWall]);

  const handleMouseUp = useCallback(() => {
    if (selectedTool.type === 'wall' && currentWall && currentWall.start && currentWall.end) {
      // 壁を確定
      const newWall: Wall = {
        ...currentWall as Wall,
        id: currentWall.id!
      };
      
      onBuildingChange({
        ...building,
        walls: [...building.walls, newWall]
      });
    }
    
    setIsDragging(false);
    setCurrentWall(null);
  }, [selectedTool, currentWall, building, onBuildingChange]);

  // グリッドを描画
  const renderGrid = () => {
    const gridLines = [];
    const gridSize = 1; // 1メートルグリッド
    const canvasWidth = 20; // 20メートル
    const canvasHeight = 15; // 15メートル

    // 縦線
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x * building.scale}
          y1={0}
          x2={x * building.scale}
          y2={canvasHeight * building.scale}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      );
    }

    // 横線
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y * building.scale}
          x2={canvasWidth * building.scale}
          y2={y * building.scale}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      );
    }

    return gridLines;
  };

  // 壁を描画
  const renderWalls = () => {
    const walls = [...building.walls];
    if (currentWall && currentWall.start && currentWall.end) {
      walls.push(currentWall as Wall);
    }

    return walls.map(wall => (
      <g key={wall.id}>
        <line
          x1={wall.start.x * building.scale}
          y1={wall.start.y * building.scale}
          x2={wall.end.x * building.scale}
          y2={wall.end.y * building.scale}
          stroke="#2563eb"
          strokeWidth={wall.thickness * building.scale}
          strokeLinecap="round"
        />
        {/* 寸法表示 */}
        <text
          x={(wall.start.x + wall.end.x) / 2 * building.scale}
          y={(wall.start.y + wall.end.y) / 2 * building.scale - 10}
          fontSize="12"
          textAnchor="middle"
          fill="#666"
        >
          {Math.sqrt(
            Math.pow(wall.end.x - wall.start.x, 2) + 
            Math.pow(wall.end.y - wall.start.y, 2)
          ).toFixed(2)}m
        </text>
      </g>
    ));
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        viewBox={`0 0 ${20 * building.scale} ${15 * building.scale}`}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* グリッド */}
        {renderGrid()}
        
        {/* 壁 */}
        {renderWalls()}
      </svg>
    </div>
  );
};
