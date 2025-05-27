import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Share2, Printer, ArrowLeft, Layers } from 'lucide-react';

const ResultsPage = () => {
  const [results] = useState({
    projectName: '新しいプロジェクト',
    createdAt: '2025年5月20日 17:36',
    
    spans: {
      northSouth: {
        total: '10500 mm',
        composition: '(+150), 5span, 1500'
      },
      eastWest: {
        total: '10500 mm',
        composition: '5span, 1500'
      }
    },
    
    projections: {
      north: '580 mm',
      east: '450 mm',
      south: '580 mm',
      west: '450 mm'
    },
    
    materials: {
      frames: 120,
      diagonalBraces: 64,
      horizontalBraces: 80,
      baseJacks: 24,
      couplers: 240
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            計算結果
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {results.projectName} · {results.createdAt}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="btn-outline py-2 px-3 text-sm">
            <Download size={16} className="mr-1" />
            <span>保存</span>
          </button>
          <button className="btn-outline py-2 px-3 text-sm">
            <Share2 size={16} className="mr-1" />
            <span>共有</span>
          </button>
          <button className="btn-outline py-2 px-3 text-sm">
            <Printer size={16} className="mr-1" />
            <span>印刷</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-dark-100">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                スパン構成
              </h2>
            </div>
            
            <div className="p-5 space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-1 h-12 bg-primary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">南北面 全スパン</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.spans.northSouth.total}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-1 h-12 bg-primary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">南北面 スパン構成</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.spans.northSouth.composition}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="w-1 h-12 bg-primary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">東西面 全スパン</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.spans.eastWest.total}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-primary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">東西面 スパン構成</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.spans.eastWest.composition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-dark-100">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                離れ
              </h2>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-secondary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">北</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.projections.north}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-secondary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">東</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.projections.east}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-secondary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">南</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.projections.south}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-secondary-500 rounded-r mr-3"></div>
                  <div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400">西</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {results.projections.west}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-dark-100">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                必要資材
              </h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">建枠</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{results.materials.frames}本</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">筋かい</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{results.materials.diagonalBraces}本</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">布板</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{results.materials.horizontalBraces}枚</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">ベースジャッキ</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{results.materials.baseJacks}個</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">クランプ</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{results.materials.couplers}個</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-100">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-300">合計金額（概算）</span>
                  <span className="font-bold text-slate-900 dark:text-white">¥348,500</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                  *価格は地域や取引条件により変動します
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          to="/input"
          className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-dark-200 dark:hover:bg-dark-100 text-slate-800 dark:text-slate-200 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>入力に戻る</span>
        </Link>
        
        <Link
          to="/drawing"
          className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <Layers size={18} />
          <span>描画に進む</span>
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;