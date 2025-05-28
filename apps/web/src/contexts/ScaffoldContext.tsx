'use client';

/**
 * 🏗️ ScaffAI Web版 ScaffoldContext (Supabase統合版)
 * モバイル版のロジックをWeb環境に完全移植＋データベース統合！
 */

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { 
  InputData, 
  CalculationResult, 
  ScaffoldContextType
} from '@scaffai/types';
import { defaultInputData, testInputData } from '@scaffai/types';
import { checkAPIHealth, calculateScaffoldAPI } from '@scaffai/utils';
import { auth, projects, type ScaffAIProject } from '@scaffai/config';

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
  const [currentProject, setCurrentProject] = useState<ScaffAIProject | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('unsaved');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔄 URL パラメータからプロジェクト読み込み
  useEffect(() => {
    const projectId = searchParams?.get('project');
    if (projectId) {
      loadProject(projectId);
    }
  }, [searchParams]);

  // 📂 プロジェクト読み込み
  const loadProject = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      
      // 認証チェック
      const { data: user } = await auth.getCurrentUser();
      if (!user.user) {
        router.push('/login');
        return;
      }

      // プロジェクト取得（実際のAPIでは単一プロジェクト取得を実装する必要あり）
      const { data: allProjects } = await projects.getAll();
      const project = allProjects?.find(p => p.id === projectId);
      
      if (project) {
        setCurrentProject(project as ScaffAIProject);
        setInputData(project.input_data);
        if (project.calculation_result) {
          setCalculationResult(project.calculation_result);
        }
        setSaveStatus('saved');
      }
    } catch (error) {
      console.error('❌ Failed to load project:', error);
      setError('プロジェクトの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 🔄 入力値の更新 (ネスト階層対応済み)
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

    // 変更があったらステータス更新
    setSaveStatus('unsaved');
  }, []);

  // 🔄 入力データのリセット
  const resetInputData = useCallback(() => {
    console.log('🔄 resetInputData called');
    setInputData(defaultInputData);
    setCalculationResult(null);
    setError(null);
    setCurrentProject(null);
    setSaveStatus('unsaved');
  }, []);

  // 💾 プロジェクト保存
  const saveProject = useCallback(async (projectName?: string) => {
    try {
      setSaveStatus('saving');

      // 認証チェック
      const { data: user } = await auth.getCurrentUser();
      if (!user.user) {
        router.push('/login');
        return;
      }

      const name = projectName || currentProject?.name || `足場設計 ${new Date().toLocaleDateString('ja-JP')}`;

      if (currentProject) {
        // 既存プロジェクト更新
        const { data, error } = await projects.update(currentProject.id, {
          name,
          input_data: inputData,
          calculation_result: calculationResult,
          last_edited_platform: 'web'
        });
        
        if (error) throw error;
        if (data) setCurrentProject(data as ScaffAIProject);
      } else {
        // 新規プロジェクト作成
        const { data, error } = await projects.create({
          name,
          input_data: inputData,
          created_platform: 'web'
        });
        
        if (error) throw error;
        if (data) setCurrentProject(data as ScaffAIProject);
      }

      setSaveStatus('saved');
      console.log('✅ Project saved successfully');
      
    } catch (error) {
      console.error('❌ Failed to save project:', error);
      setSaveStatus('error');
      setError('プロジェクトの保存に失敗しました');
    }
  }, [inputData, calculationResult, currentProject, router]);

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

  // 🧮 APIを使った計算（Supabase統合版）
  const calculateScaffold = useCallback(async () => {
    console.log('🧮 calculateScaffold called');
    setIsLoading(true);
    setError(null);

    try {
      // 1️⃣ 認証チェック
      const { data: user } = await auth.getCurrentUser();
      if (!user.user) {
        router.push('/login');
        return;
      }

      // 2️⃣ 計算実行
      const result = await calculateScaffoldAPI(inputData);
      setCalculationResult(result);
      
      console.log('✅ Setting calculation result:', result);

      // 3️⃣ 自動保存（既存プロジェクトまたは新規作成）
      try {
        if (currentProject) {
          // 既存プロジェクト更新
          await projects.update(currentProject.id, {
            input_data: inputData,
            calculation_result: result,
            last_edited_platform: 'web'
          });
          console.log('✅ Updated existing project with calculation result');
        } else {
          // 新規プロジェクト作成
          const { data: newProject } = await projects.create({
            name: `足場設計 ${new Date().toLocaleDateString('ja-JP')}`,
            input_data: inputData,
            calculation_result: result,
            created_platform: 'web'
          });
          if (newProject) {
            setCurrentProject(newProject as ScaffAIProject);
            console.log('✅ Created new project with calculation result');
          }
        }
        setSaveStatus('saved');
      } catch (saveError) {
        console.warn('⚠️ Calculation succeeded but save failed:', saveError);
        setSaveStatus('error');
        // 計算は成功したので結果ページには遷移する
      }

      // 4️⃣ 結果画面に遷移 (Web版)
      console.log('🚀 Navigating to result page...');
      
      setTimeout(() => {
        try {
          const projectParam = currentProject?.id ? `?project=${currentProject.id}` : '';
          router.push(`/result${projectParam}`);
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
  }, [inputData, currentProject, router]);

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
        // 🆕 Supabase統合機能
        currentProject,
        saveProject,
        saveStatus,
        loadProject,
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
