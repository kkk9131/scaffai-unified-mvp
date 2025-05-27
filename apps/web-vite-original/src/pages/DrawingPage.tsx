import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, Maximize, Minimize, Save, RotateCw, Eye, Grid3X3, Layers, ArrowLeft } from 'lucide-react';

const DrawingPage = () => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // モックアップとしてキャンバス描画の例
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景色を設定
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // グリッドを描画
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    const gridSize = 20;
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
    
    if (viewMode === '2d') {
      // 簡易的な2D足場を描画
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      // 矩形を描画
      ctx.strokeRect(100, 100, 400, 300);
      
      // 内部の支柱を描画
      ctx.beginPath();
      for (let x = 100; x <= 500; x += 100) {
        ctx.moveTo(x, 100);
        ctx.lineTo(x, 400);
      }
      ctx.stroke();
      
      for (let y = 100; y <= 400; y += 100) {
        ctx.moveTo(100, y);
        ctx.lineTo(500, y);
      }
      ctx.stroke();
      
      // ラベルを追加
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px Arial';
      ctx.fillText('南北：10500mm', 100, 420);
      ctx.fillText('東西：10500mm', 100, 440);
    } else {
      // 簡易的な3D表現（実際はThree.jsなどを使用）
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      // 等角投影の疑似3D
      const drawCube = (x: number, y: number, width: number, height: number, depth: number) => {
        // 前面
        ctx.strokeRect(x, y, width, height);
        
        // 上面
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + width + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.stroke();
        
        // 側面
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
  }, [viewMode]);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto px-4 md:px-6">
      <header className={`mb-4 flex items-center justify-between ${isFullscreen ? 'hidden' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            足場描画
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            計算結果に基づいた足場の2D/3D描画
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/results"
            className="btn-outline py-2 px-3 text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>結果に戻る</span>
          </Link>
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

      <div className={`bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
        <div className="p-2 border-b border-slate-200 dark:border-dark-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                viewMode === '2d'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200'
              }`}
              onClick={() => setViewMode('2d')}
            >
              <Grid3X3 size={16} className="inline-block mr-1" />
              2D表示
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                viewMode === '3d'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200'
              }`}
              onClick={() => setViewMode('3d')}
            >
              <Layers size={16} className="inline-block mr-1" />
              3D表示
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200 rounded">
              <Eye size={18} />
            </button>
            <button className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200 rounded">
              <RotateCw size={18} />
            </button>
            <button
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-200 rounded"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-slate-200 dark:border-dark-100 rounded-lg mx-auto max-w-full"
          ></canvas>
          
          <div className="absolute top-6 left-6 bg-white dark:bg-dark-200 rounded-lg shadow-md p-3 text-sm">
            <h3 className="font-medium text-slate-800 dark:text-white mb-2">プロジェクト情報</h3>
            <p className="text-slate-600 dark:text-slate-400">南北: 10500mm</p>
            <p className="text-slate-600 dark:text-slate-400">東西: 10500mm</p>
            <p className="text-slate-600 dark:text-slate-400">層数: 5層</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingPage;