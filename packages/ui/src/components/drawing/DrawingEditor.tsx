// 🎨 統合作図エディター (Web版メイン)

import React, { useState, useCallback } from 'react';
import { BuildingData, DrawingTool, Point } from './types';
import { DrawingCanvasWeb } from './DrawingCanvasWeb';
import { DrawingToolbar } from './DrawingToolbar';
import { DimensionPanel } from './DimensionPanel';

interface DrawingEditorProps {
  initialBuilding?: Partial<BuildingData>;
  onSave?: (building: BuildingData) => void;
  className?: string;
}

export const DrawingEditor: React.FC<DrawingEditorProps> = ({
  initialBuilding = {},
  onSave,
  className = ""
}) => {
  // 初期建物データ
  const [building, setBuilding] = useState<BuildingData>({
    id: initialBuilding.id || `building-${Date.now()}`,
    name: initialBuilding.name || '新しい建物',
    walls: initialBuilding.walls || [],
    openings: initialBuilding.openings || [],
    rooms: initialBuilding.rooms || [],
    scale: 30, // 1メートル = 30ピクセル
    dimensions: {
      width: initialBuilding.dimensions?.width || 10,
      height: initialBuilding.dimensions?.height || 8,
      ...initialBuilding.dimensions
    }
  });

  // 選択中のツール
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    type: 'select',
    active: false
  });

  // 操作履歴 (Undo/Redo用)
  const [history, setHistory] = useState<BuildingData[]>([building]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 建物データ更新
  const handleBuildingChange = useCallback((newBuilding: BuildingData) => {
    setBuilding(newBuilding);
    
    // 履歴に追加
    const newHistory = [...history.slice(0, historyIndex + 1), newBuilding];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo機能
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setBuilding(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  }, [history, historyIndex]);

  // クリア機能
  const handleClear = useCallback(() => {
    const clearedBuilding = {
      ...building,
      walls: [],
      openings: [],
      rooms: []
    };
    handleBuildingChange(clearedBuilding);
  }, [building, handleBuildingChange]);

  // 保存機能
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(building);
    }
    console.log('保存された建物データ:', building);
  }, [building, onSave]);

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`}>
      {/* ツールバー */}
      <DrawingToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onClear={handleClear}
        onUndo={handleUndo}
      />

      {/* メインエリア */}
      <div className="flex flex-1 overflow-hidden">
        {/* 作図キャンバス */}
        <div className="flex-1 p-4">
          <DrawingCanvasWeb
            building={building}
            onBuildingChange={handleBuildingChange}
            selectedTool={selectedTool}
            className="h-full"
          />
        </div>

        {/* サイドパネル */}
        <div className="w-80">
          <DimensionPanel
            building={building}
            onBuildingChange={handleBuildingChange}
            className="h-full"
          />
        </div>
      </div>

      {/* 下部アクションバー */}
      <div className="flex justify-between items-center p-4 bg-white border-t">
        <div className="text-sm text-gray-600">
          {building.name} - 壁: {building.walls.length}個
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            💾 保存
          </button>
        </div>
      </div>
    </div>
  );
};
