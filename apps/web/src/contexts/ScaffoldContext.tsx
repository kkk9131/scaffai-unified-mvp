'use client';

/**
 * 🏗️ ScaffAI Web版 ScaffoldContext
 * モバイル版のロジックをWeb環境に完全移植！
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  InputData, 
  CalculationResult, 
  ScaffoldContextType
} from '@scaffai/types';
import { defaultInputData, testInputData } from '@scaffai/types';
import { checkAPIHealth, calculateScaffoldAPI } from '@scaffai/utils';

// 🏗️ コンテキスト作成
const ScaffoldContext = createContext<ScaffoldContextType | undefined>(undefined);

// 🎯 プロバイダーコンポーネント
export const ScaffoldProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputData, setInputData] = useState<InputData>(defaultInputData);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 🔄 入力値の更新 (ネスト階層対応済)
  const setInputValue = useCallback((
    category: keyof InputData,
    field: string,
    value: any
  ) => {
    console.log('🔄 setInputValue called:', { category, field, value });
    
    setInputData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)) as InputData; // ディープコピー

      if (field === '') { // カテゴリ自体が値 (例: referenceHeight, roofShape)
        (newData[category] as any) = value;
      } else {
        const fieldParts = field.split('.');
        let currentLevel: any = newData[category];

        for (let i = 0; i < fieldParts.length - 1; i++) {
          if (!currentLevel[fieldParts[i]]) {
            currentLevel[fieldParts[i]] = {};
          }
          currentLevel = currentLevel[fieldParts[i]];
        }
        currentLevel[fieldParts[fieldParts.length - 1]] = value;
      }
      return newData;
    });
  }, []);

  // 🔄 入力データのリセット
  const resetInputData = useCallback(() => {
    console.log('🔄 resetInputData called');
    setInputData(defaultInputData);
    setCalculationResult(null);
    setError(null);
  }, []);

  // 🧪 テスト用のシンプルなAPI呼び出し
  const testAPICall = useCallback(async () => {
    console.log('🧪 testAPICall - Testing simple API call');
    try {
      const response = await checkAPIHealth();
      console.log('✅ Health check response:', response);
      
      // Web版でのアラート表示（後でToast実装）
      alert('🎉 API接続成功\n\nヘルスチェックに成功しました！');
      
      // テストデータを設定
      setInputData(testInputData);
      alert('🧪 テストデータ設定完了\n\n計算用のテストデータを設定しました！');
    } catch (error) {
      console.error('❌ Test API call failed:', error);
      alert(`❌ API接続エラー\n\nAPI接続に失敗しました: ${error}`);
    }
  }, []);

  // 🧮 APIを使用した計算
  const calculateScaffold = useCallback(async () => {
    console.log('🧮 calculateScaffold called');
    setIsLoading(true);
    setError(null);

    try {
      const result = await calculateScaffoldAPI(inputData);
      setCalculationResult(result);
      
      console.log('✅ Setting calculation result:', result);
      console.log('🚀 Navigating to result page...');
      
      // 結果画面へ遷移 (Web版)
      setTimeout(() => {
        try {
          router.push('/result');
          console.log('✅ Navigation complete');
        } catch (navError) {
          console.error('❌ Navigation error:', navError);
          alert('❌ 画面遷移エラー\n\nルーティングに問題が発生しました。');
        }
      }, 500);

    } catch (err) {
      console.error('❌ Calculation failed:', err);
      const errorMessage = err instanceof Error ? err.message : '計算処理中にエラーが発生しました。';
      setError(errorMessage);
      alert(`❌ 計算エラー\n\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [inputData, router]);

  return (
    <ScaffoldContext.Provider
      value={{
        inputData,
        setInputValue,
        resetInputData,
        calculationResult,
        isLoading,
        error,
        calculateScaffold,
        testAPICall,
      }}
    >
      {children}
    </ScaffoldContext.Provider>
  );
};

// 🎯 カスタムフックで使いやすくする
export const useScaffold = () => {
  const context = useContext(ScaffoldContext);
  if (context === undefined) {
    throw new Error('useScaffold must be used within a ScaffoldProvider');
  }
  return context;
};
