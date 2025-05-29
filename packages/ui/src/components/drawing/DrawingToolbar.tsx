// 🎮 作図ツールバー (Web/Mobile共通)

import React from 'react';
import { DrawingTool } from './types';

interface DrawingToolbarProps {
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClear: () => void;
  onUndo: () => void;
  className?: string;
}

const tools: Array<{ type: DrawingTool['type']; icon: string; label: string }> = [
  { type: 'select', icon: '↖️', label: '選択' },
  { type: 'wall', icon: '🧱', label: '壁' },
  { type: 'door', icon: '🚪', label: 'ドア' },
  { type: 'window', icon: '🪟', label: '窓' },
  { type: 'dimension', icon: '📏', label: '寸法' },
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  selectedTool,
  onToolChange,
  onClear,
  onUndo,
  className = ""
}) => {
  return (
    <div className={`flex gap-2 p-4 bg-gray-50 border-b ${className}`}>
      {/* ツール選択 */}
      <div className="flex gap-1">
        {tools.map(tool => (
          <button
            key={tool.type}
            onClick={() => onToolChange({ type: tool.type, active: true })}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${selectedTool.type === tool.type 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }
            `}
            title={tool.label}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* 区切り線 */}
      <div className="w-px bg-gray-300 mx-2" />

      {/* アクション */}
      <div className="flex gap-1">
        <button
          onClick={onUndo}
          className="px-3 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          title="元に戻す"
        >
          ↶ 戻す
        </button>
        <button
          onClick={onClear}
          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          title="全削除"
        >
          🗑️ クリア
        </button>
      </div>
    </div>
  );
};
