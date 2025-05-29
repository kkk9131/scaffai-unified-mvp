'use client';

/**
 * 🏗️ ScaffAI 足場計算システム - プロフェッショナル版
 * モバイル版の美しいUIを完全移植！
 */

import { useScaffold } from '../../contexts/ScaffoldContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  RotateCcw, 
  ArrowRight, 
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Ruler,
  Building
} from 'lucide-react';
import { 
  InputField, 
  SwitchField, 
  RadioField, 
  Section 
} from '@scaffai/ui';

export default function ScaffoldPage() {
  const { 
    inputData, 
    setInputValue, 
    resetInputData, 
    calculationResult, 
    isLoading, 
    error, 
    calculateScaffold, 
    testAPICall 
  } = useScaffold();

  const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

  // 数値入力を処理する関数
  const handleNumberInput = (
    category: keyof typeof inputData,
    field: string,
    value: string
  ) => {
    const numValue = value === '' ? null : Number(value);
    setInputValue(category, field, numValue);
  };

  // アニメーション設定
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.header 
          className="text-center mb-8"
          {...fadeIn}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ScaffAI 足場計算システム
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            プロフェッショナル版 - リアルタイム計算 & Railway API統合
          </p>
        </motion.header>

        {/* タブナビゲーション */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'input'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📝 入力
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'result'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📊 結果
            </button>
          </div>
        </motion.div>

        {/* エラー表示 */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* 入力タブ */}
        {activeTab === 'input' && (
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* 建物の幅 */}
            <motion.div variants={fadeIn}>
              <Section title="🏢 建物の幅" variant="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="南北方向"
                    value={inputData.frameWidth.northSouth?.toString() || ''}
                    onChange={(value) => handleNumberInput('frameWidth', 'northSouth', value)}
                    type="number"
                    placeholder="例: 1000"
                    suffix="mm"
                  />
                  <InputField
                    label="東西方向"
                    value={inputData.frameWidth.eastWest?.toString() || ''}
                    onChange={(value) => handleNumberInput('frameWidth', 'eastWest', value)}
                    type="number"
                    placeholder="例: 1000"
                    suffix="mm"
                  />
                </div>
              </Section>
            </motion.div>



            {/* 軒の出 */}
            <motion.div variants={fadeIn}>
              <Section title="🏠 軒の出" variant="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="北側"
                    value={inputData.eaveOverhang.north?.toString() || ''}
                    onChange={(value) => handleNumberInput('eaveOverhang', 'north', value)}
                    type="number"
                    placeholder="例: 0"
                    suffix="mm"
                  />
                  <InputField
                    label="東側"
                    value={inputData.eaveOverhang.east?.toString() || ''}
                    onChange={(value) => handleNumberInput('eaveOverhang', 'east', value)}
                    type="number"
                    placeholder="例: 0"
                    suffix="mm"
                  />
                  <InputField
                    label="南側"
                    value={inputData.eaveOverhang.south?.toString() || ''}
                    onChange={(value) => handleNumberInput('eaveOverhang', 'south', value)}
                    type="number"
                    placeholder="例: 0"
                    suffix="mm"
                  />
                  <InputField
                    label="西側"
                    value={inputData.eaveOverhang.west?.toString() || ''}
                    onChange={(value) => handleNumberInput('eaveOverhang', 'west', value)}
                    type="number"
                    placeholder="例: 0"
                    suffix="mm"
                  />
                </div>
              </Section>
            </motion.div>

            {/* 敷地境界線 */}
            <motion.div variants={fadeIn}>
              <Section title="🚧 敷地境界線" variant="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <SwitchField
                      label="北側境界線"
                      checked={inputData.propertyLine.north}
                      onChange={(value) => setInputValue('propertyLine', 'north', value)}
                    />
                    {inputData.propertyLine.north && (
                      <InputField
                        label="北側距離"
                        value={inputData.propertyLineDistance?.north?.toString() || ''}
                        onChange={(value) => handleNumberInput('propertyLineDistance', 'north', value)}
                        type="number"
                        placeholder="境界線までの距離"
                        suffix="mm"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <SwitchField
                      label="東側境界線"
                      checked={inputData.propertyLine.east}
                      onChange={(value) => setInputValue('propertyLine', 'east', value)}
                    />
                    {inputData.propertyLine.east && (
                      <InputField
                        label="東側距離"
                        value={inputData.propertyLineDistance?.east?.toString() || ''}
                        onChange={(value) => handleNumberInput('propertyLineDistance', 'east', value)}
                        type="number"
                        placeholder="境界線までの距離"
                        suffix="mm"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <SwitchField
                      label="南側境界線"
                      checked={inputData.propertyLine.south}
                      onChange={(value) => setInputValue('propertyLine', 'south', value)}
                    />
                    {inputData.propertyLine.south && (
                      <InputField
                        label="南側距離"
                        value={inputData.propertyLineDistance?.south?.toString() || ''}
                        onChange={(value) => handleNumberInput('propertyLineDistance', 'south', value)}
                        type="number"
                        placeholder="境界線までの距離"
                        suffix="mm"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <SwitchField
                      label="西側境界線"
                      checked={inputData.propertyLine.west}
                      onChange={(value) => setInputValue('propertyLine', 'west', value)}
                    />
                    {inputData.propertyLine.west && (
                      <InputField
                        label="西側距離"
                        value={inputData.propertyLineDistance?.west?.toString() || ''}
                        onChange={(value) => handleNumberInput('propertyLineDistance', 'west', value)}
                        type="number"
                        placeholder="境界線までの距離"
                        suffix="mm"
                      />
                    )}
                  </div>
                </div>
              </Section>
            </motion.div>

            {/* 基本設定 */}
            <motion.div variants={fadeIn}>
              <Section title="⚙️ 基本設定" variant="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="基準高さ"
                    value={inputData.referenceHeight?.toString() || ''}
                    onChange={(value) => handleNumberInput('referenceHeight', '', value)}
                    type="number"
                    placeholder="例: 2400"
                    suffix="mm"
                  />
                  <InputField
                    label="ターゲットオフセット"
                    value={inputData.targetOffset?.toString() || ''}
                    onChange={(value) => handleNumberInput('targetOffset', '', value)}
                    type="number"
                    placeholder="例: 900"
                    suffix="mm"
                  />
                </div>
                
                <div className="mt-6">
                  <RadioField
                    label="屋根形状"
                    options={[
                      { label: "平屋根", value: "flat", description: "フラットな屋根構造" },
                      { label: "傾斜屋根", value: "sloped", description: "勾配のある屋根構造" },
                      { label: "屋根デッキ", value: "roofDeck", description: "デッキ構造の屋根" },
                    ]}
                    selectedValue={inputData.roofShape}
                    onChange={(value) => setInputValue('roofShape', '', value as any)}
                  />
                </div>
                
                <div className="mt-6">
                  <SwitchField
                    label="タイ支柱を使用"
                    checked={inputData.hasTieColumns}
                    onChange={(value) => setInputValue('hasTieColumns', '', value)}
                    description="構造強化のためのタイ支柱の使用"
                  />
                </div>
                
                <div className="mt-6">
                  <InputField
                    label="軒先手すり"
                    value={inputData.eavesHandrails?.toString() || ''}
                    onChange={(value) => handleNumberInput('eavesHandrails', '', value)}
                    type="number"
                    placeholder="例: 0"
                    suffix="個"
                  />
                </div>
              </Section>
            </motion.div>

            {/* ✨ 特殊材料セクション (Day5復旧) - 最下部に配置 */}
            <motion.div variants={fadeIn}>
              <Section title="🔧 特殊材料" variant="card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 南北方向 - Purple テーマ */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                    <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                      📍 南北方向材料
                    </h4>
                    <div className="space-y-4">
                      <InputField
                        label="材料355"
                        value={inputData.specialMaterial.northSouth.material355?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'northSouth.material355', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                      <InputField
                        label="材料300"
                        value={inputData.specialMaterial.northSouth.material300?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'northSouth.material300', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                      <InputField
                        label="材料150"
                        value={inputData.specialMaterial.northSouth.material150?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'northSouth.material150', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                    </div>
                  </div>
                  
                  {/* 東西方向 - Orange テーマ */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
                    <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4 flex items-center gap-2">
                      📍 東西方向材料
                    </h4>
                    <div className="space-y-4">
                      <InputField
                        label="材料355"
                        value={inputData.specialMaterial.eastWest.material355?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'eastWest.material355', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                      <InputField
                        label="材料300"
                        value={inputData.specialMaterial.eastWest.material300?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'eastWest.material300', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                      <InputField
                        label="材料150"
                        value={inputData.specialMaterial.eastWest.material150?.toString() || ''}
                        onChange={(value) => handleNumberInput('specialMaterial', 'eastWest.material150', value)}
                        type="number"
                        placeholder="例: 0"
                        suffix="本"
                      />
                    </div>
                  </div>
                </div>
                
                {/* 特殊材料の説明 */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📝 <strong>特殊材料について:</strong> 材料355/300/150はそれぞれ異なる長さの足場材料です。必要に応じて本数を指定してください。
                  </p>
                </div>
              </Section>
            </motion.div>

            {/* アクションボタン */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap gap-4 justify-center pt-6"
            >
              <button
                onClick={testAPICall}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <Info className="h-5 w-5" />
                🧪 API接続テスト
              </button>
              
              <button
                onClick={resetInputData}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <RotateCcw className="h-5 w-5" />
                🔄 リセット
              </button>
              
              <button
                onClick={async () => {
                  try {
                    await calculateScaffold();
                    // 計算成功時、結果タブに切り替え
                    setTimeout(() => {
                      setActiveTab('result');
                    }, 500);
                  } catch (error) {
                    console.error('計算エラー:', error);
                    // エラーがあっても結果タブでエラーを表示
                    setActiveTab('result');
                  }
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Calculator className="h-5 w-5" />
                )}
                {isLoading ? '🔄 計算中...' : '🧮 足場計算実行'}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 結果タブ */}
        {activeTab === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {calculationResult ? (
              <div className="space-y-6">
                {/* 基本情報 */}
                <Section title="🏗️ 基本構造" variant="highlight">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">南北総スパン</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculationResult.ns_total_span.toLocaleString()} mm
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">東西総スパン</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculationResult.ew_total_span.toLocaleString()} mm
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">段数</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculationResult.num_stages} 段
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">モジュール数</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculationResult.modules_count} 個
                      </p>
                    </div>
                  </div>
                </Section>

                {/* 隙間情報 */}
                <Section title="📏 隙間情報" variant="card">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">北側隙間</span>
                      </div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {calculationResult.north_gap}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">南側隙間</span>
                      </div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {calculationResult.south_gap}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">東側隙間</span>
                      </div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {calculationResult.east_gap}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">西側隙間</span>
                      </div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {calculationResult.west_gap}
                      </p>
                    </div>
                  </div>
                </Section>

                {/* 高さ・ステータス情報 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Section title="📐 高さ情報" variant="card">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium text-purple-800 dark:text-purple-200">ジャッキアップ高さ</span>
                        <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                          {calculationResult.jack_up_height.toLocaleString()} mm
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium text-purple-800 dark:text-purple-200">第1層高さ</span>
                        <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                          {calculationResult.first_layer_height.toLocaleString()} mm
                        </span>
                      </div>
                    </div>
                  </Section>

                  <Section title="✅ ステータス" variant="card">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-800 dark:text-gray-200">タイ可能</span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          calculationResult.tie_ok 
                            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' 
                            : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}>
                          {calculationResult.tie_ok ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {calculationResult.tie_ok ? 'OK' : 'NG'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-800 dark:text-gray-200">タイ支柱使用</span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          calculationResult.tie_column_used 
                            ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' 
                            : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}>
                          {calculationResult.tie_column_used ? '✅ 使用' : '❌ 未使用'}
                        </div>
                      </div>
                    </div>
                  </Section>
                </div>

                {/* 構造詳細 */}
                <Section title="🔧 構造詳細" variant="card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">南北方向構造</h4>
                      <p className="text-blue-700 dark:text-blue-300 font-mono text-sm">
                        {calculationResult.ns_span_structure}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">東西方向構造</h4>
                      <p className="text-blue-700 dark:text-blue-300 font-mono text-sm">
                        {calculationResult.ew_span_structure}
                      </p>
                    </div>
                  </div>
                </Section>
              </div>
            ) : (
              <Section variant="card">
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🏗️</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    計算結果がありません
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                    入力タブで情報を入力し、計算を実行してください
                  </p>
                  <button
                    onClick={() => setActiveTab('input')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <ArrowRight className="h-5 w-5" />
                    入力画面へ
                  </button>
                </div>
              </Section>
            )}
          </motion.div>
        )}

        {/* デバッグ情報 */}
        <details className="mt-8">
          <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium">
            🔍 デバッグ情報を表示
          </summary>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
            <h4 className="font-bold mb-2 text-gray-900 dark:text-white">現在の入力データ:</h4>
            <pre className="text-xs overflow-auto text-gray-700 dark:text-gray-300">
              {JSON.stringify(inputData, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
