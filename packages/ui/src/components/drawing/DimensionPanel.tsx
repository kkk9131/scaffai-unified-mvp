// 📏 寸法入力パネル (建物の基本情報入力)

import React from 'react';
import { BuildingData } from './types';

interface DimensionPanelProps {
  building: BuildingData;
  onBuildingChange: (building: BuildingData) => void;
  className?: string;
}

export const DimensionPanel: React.FC<DimensionPanelProps> = ({
  building,
  onBuildingChange,
  className = ""
}) => {
  const handleDimensionChange = (key: 'width' | 'height', value: number) => {
    onBuildingChange({
      ...building,
      dimensions: {
        ...building.dimensions,
        [key]: value
      }
    });
  };

  const handleNameChange = (name: string) => {
    onBuildingChange({
      ...building,
      name
    });
  };

  // 🏗️ 足場計算ページに移動
  const handleCalculateScaffold = () => {
    // 建物データをローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('buildingData', JSON.stringify(building));
    }
    
    // 足場計算ページに移動
    window.location.href = '/scaffold';
  };

  return (
    <div className={`p-4 bg-white border-l ${className}`}>
      <h3 className="text-lg font-semibold mb-4">📏 建物情報</h3>
      
      {/* 建物名 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          建物名
        </label>
        <input
          type="text"
          value={building.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 住宅A"
        />
      </div>

      {/* 寸法入力 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            幅 (m)
          </label>
          <input
            type="number"
            value={building.dimensions.width}
            onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            奥行き (m)
          </label>
          <input
            type="number"
            value={building.dimensions.height}
            onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="0.1"
          />
        </div>
      </div>

      {/* 統計情報 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">📊 統計</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>壁の数: {building.walls.length}</div>
          <div>開口部: {building.openings.length}</div>
          <div>建築面積: {(building.dimensions.width * building.dimensions.height).toFixed(1)}m²</div>
        </div>
      </div>

      {/* 足場計算ボタン - 修正済み */}
      <button
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={handleCalculateScaffold}
      >
        🔧 足場計算を実行
      </button>
      
      {/* 建物データ説明 */}
      <div className="mt-3 text-xs text-gray-500">
        💡 建物データを保存して足場計算ページに移動します
      </div>
    </div>
  );
};
