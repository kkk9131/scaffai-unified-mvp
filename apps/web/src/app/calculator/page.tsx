'use client'

import { useScaffold } from '../../components/ScaffoldContext'
import { ThemeToggle } from '../../components/ThemeToggle'

export default function CalculatorPage() {
  const { 
    inputData, 
    setInputValue, 
    calculateScaffold, 
    testAPICall,
    calculationResult,
    isLoading,
    error,
    resetInputData 
  } = useScaffold()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* ヘッダー */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              🏗️ ScaffAI
            </a>
            <span className="text-gray-600 dark:text-gray-300">足場計算機</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* タイトル */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🧮 ScaffAI 足場計算機
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Railway API統合 - モバイル版計算ロジック完全移植
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* 左側：入力パネル */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                📋 建物情報入力
              </h2>
              
              <div className="space-y-6">
                {/* 躯体幅 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      躯体幅 南北 (mm)
                    </label>
                    <input
                      type="number"
                      value={inputData.frameWidth.northSouth || ''}
                      onChange={(e) => setInputValue('frameWidth', 'northSouth', Number(e.target.value) || null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="例: 1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      躯体幅 東西 (mm)
                    </label>
                    <input
                      type="number"
                      value={inputData.frameWidth.eastWest || ''}
                      onChange={(e) => setInputValue('frameWidth', 'eastWest', Number(e.target.value) || null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="例: 1000"
                    />
                  </div>
                </div>

                {/* 基準高さ・目標オフセット */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      基準高さ (mm)
                    </label>
                    <input
                      type="number"
                      value={inputData.referenceHeight || ''}
                      onChange={(e) => setInputValue('referenceHeight', '', Number(e.target.value) || null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="例: 2400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      目標オフセット (mm)
                    </label>
                    <input
                      type="number"
                      value={inputData.targetOffset || ''}
                      onChange={(e) => setInputValue('targetOffset', '', Number(e.target.value) || null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="例: 900"
                    />
                  </div>
                </div>

                {/* 屋根形状 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    屋根形状
                  </label>
                  <select
                    value={inputData.roofShape}
                    onChange={(e) => setInputValue('roofShape', '', e.target.value as 'flat' | 'sloped' | 'roofDeck')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="flat">フラット屋根</option>
                    <option value="sloped">勾配屋根</option>
                    <option value="roofDeck">屋上デッキ</option>
                  </select>
                </div>
              </div>

              {/* ボタンエリア */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={testAPICall}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  🔍 API接続テスト + サンプルデータ設定
                </button>

                <button
                  onClick={calculateScaffold}
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? '⏳ 計算中...' : '🧮 足場計算を実行'}
                </button>

                <button
                  onClick={resetInputData}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  🔄 入力をリセット
                </button>
              </div>
            </div>

            {/* 右側：結果・ステータスパネル */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                📊 計算結果
              </h2>

              {/* エラー表示 */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm flex items-start">
                    <span className="mr-2">❌</span>
                    {error}
                  </p>
                </div>
              )}

              {/* ローディング */}
              {isLoading && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm flex items-center">
                    <span className="mr-2">⏳</span>
                    計算処理中...
                  </p>
                </div>
              )}

              {/* 計算結果 */}
              {calculationResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                      <span className="mr-2">✅</span>
                      計算完了
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-2">
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">南北スパン:</span><br/>
                          {calculationResult.ns_total_span}mm
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">東西スパン:</span><br/>
                          {calculationResult.ew_total_span}mm
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">段数:</span><br/>
                          {calculationResult.num_stages}段
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">モジュール数:</span><br/>
                          {calculationResult.modules_count}個
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">ジャッキアップ高:</span><br/>
                          {calculationResult.jack_up_height}mm
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          <span className="font-medium">1層目高さ:</span><br/>
                          {calculationResult.first_layer_height}mm
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 詳細情報 */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">構造詳細</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p><span className="font-medium">南北構造:</span> {calculationResult.ns_span_structure}</p>
                      <p><span className="font-medium">東西構造:</span> {calculationResult.ew_span_structure}</p>
                      <p><span className="font-medium">タイ許可:</span> {calculationResult.tie_ok ? '✅ 可能' : '❌ 不可'}</p>
                      <p><span className="font-medium">タイ柱使用:</span> {calculationResult.tie_column_used ? '✅ 使用' : '❌ 未使用'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 入力データ確認 */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  📝 現在の入力データ
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-48 overflow-auto">
                  <pre className="text-xs text-gray-700 dark:text-gray-300">
                    {JSON.stringify(inputData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* ホームへ戻る */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              🏠 ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}