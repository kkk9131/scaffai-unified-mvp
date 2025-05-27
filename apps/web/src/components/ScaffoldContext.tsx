'use client'

import React, { createContext, useState, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// 型定義
export type InputData = {
  frameWidth: {
    northSouth: number | null;
    eastWest: number | null;
  };
  eaveOverhang: {
    north: number | null;
    east: number | null;
    south: number | null;
    west: number | null;
  };
  propertyLine: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
  referenceHeight: number | null;
  roofShape: 'flat' | 'sloped' | 'roofDeck';
  hasTieColumns: boolean;
  eavesHandrails: number | null;
  specialMaterial: {
    northSouth: {
      material355: number | null;
      material300: number | null;
      material150: number | null;
    };
    eastWest: {
      material355: number | null;
      material300: number | null;
      material150: number | null;
    };
  };
  targetOffset: number | null;
  propertyLineDistance?: {
    north: number | null;
    east: number | null;
    south: number | null;
    west: number | null;
  };
};

export type CalculationResult = {
  ns_total_span: number;
  ew_total_span: number;
  ns_span_structure: string;
  ew_span_structure: string;
  north_gap: string;
  south_gap: string;
  east_gap: string;
  west_gap: string;
  num_stages: number;
  modules_count: number;
  jack_up_height: number;
  first_layer_height: number;
  tie_ok: boolean;
  tie_column_used: boolean;
};

// デフォルト値と API設定
const defaultInputData: InputData = {
  frameWidth: { northSouth: null, eastWest: null },
  eaveOverhang: { north: null, east: null, south: null, west: null },
  propertyLine: { north: false, east: false, south: false, west: false },
  referenceHeight: null,
  roofShape: 'flat',
  hasTieColumns: false,
  eavesHandrails: null,
  specialMaterial: {
    northSouth: { material355: null, material300: null, material150: null },
    eastWest: { material355: null, material300: null, material150: null },
  },
  targetOffset: null,
  propertyLineDistance: { north: null, east: null, south: null, west: null },
};

const testInputData: InputData = {
  frameWidth: { northSouth: 1000, eastWest: 1000 },
  eaveOverhang: { north: 0, east: 0, south: 0, west: 0 },
  propertyLine: { north: false, east: false, south: false, west: false },
  referenceHeight: 2400,
  roofShape: 'flat',
  hasTieColumns: false,
  eavesHandrails: 0,
  specialMaterial: {
    northSouth: { material355: 0, material300: 0, material150: 0 },
    eastWest: { material355: 0, material300: 0, material150: 0 },
  },
  targetOffset: 900,
  propertyLineDistance: { north: null, east: null, south: null, west: null },
};

const API_URL = 'https://scaffai-app-production.up.railway.app'

type ScaffoldContextType = {
  inputData: InputData
  setInputValue: (category: keyof InputData, field: string, value: any) => void
  resetInputData: () => void
  calculationResult: CalculationResult | null
  isLoading: boolean
  error: string | null
  calculateScaffold: () => Promise<void>
  testAPICall: () => Promise<void>
}

const ScaffoldContext = createContext<ScaffoldContextType | undefined>(undefined)

export const ScaffoldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputData, setInputData] = useState<InputData>(defaultInputData)
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const setInputValue = useCallback((category: keyof InputData, field: string, value: any) => {
    setInputData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)) as InputData
      if (field === '') {
        (newData[category] as any) = value
      } else {
        const fieldParts = field.split('.')
        let currentLevel: any = newData[category]
        for (let i = 0; i < fieldParts.length - 1; i++) {
          if (!currentLevel[fieldParts[i]]) {
            currentLevel[fieldParts[i]] = {}
          }
          currentLevel = currentLevel[fieldParts[i]]
        }
        currentLevel[fieldParts[fieldParts.length - 1]] = value
      }
      return newData
    })
  }, [])

  const resetInputData = useCallback(() => {
    setInputData(defaultInputData)
    setCalculationResult(null)
    setError(null)
  }, [])

  const testAPICall = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()
      console.log('API接続成功:', data)
      setInputData(testInputData)
    } catch (error) {
      console.error('API接続失敗:', error)
      setError(`API接続に失敗しました: ${error}`)
    }
  }, [])

  const calculateScaffold = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const requestData = {
        width_NS: inputData.frameWidth.northSouth || 1000,
        width_EW: inputData.frameWidth.eastWest || 1000,
        eaves_N: inputData.eaveOverhang.north || 0,
        eaves_E: inputData.eaveOverhang.east || 0,
        eaves_S: inputData.eaveOverhang.south || 0,
        eaves_W: inputData.eaveOverhang.west || 0,
        boundary_N: inputData.propertyLine.north ? inputData.propertyLineDistance?.north : null,
        boundary_E: inputData.propertyLine.east ? inputData.propertyLineDistance?.east : null,
        boundary_S: inputData.propertyLine.south ? inputData.propertyLineDistance?.south : null,
        boundary_W: inputData.propertyLine.west ? inputData.propertyLineDistance?.west : null,
        standard_height: inputData.referenceHeight || 2400,
        roof_shape: inputData.roofShape,
        tie_column: inputData.hasTieColumns,
        railing_count: inputData.eavesHandrails || 0,
        use_355_NS: inputData.specialMaterial.northSouth.material355 || 0,
        use_300_NS: inputData.specialMaterial.northSouth.material300 || 0,
        use_150_NS: inputData.specialMaterial.northSouth.material150 || 0,
        use_355_EW: inputData.specialMaterial.eastWest.material355 || 0,
        use_300_EW: inputData.specialMaterial.eastWest.material300 || 0,
        use_150_EW: inputData.specialMaterial.eastWest.material150 || 0,
        target_margin: inputData.targetOffset || 900,
      }

      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const responseData = await response.json()
      const result: CalculationResult = {
        ns_total_span: responseData.ns_total_span,
        ew_total_span: responseData.ew_total_span,
        ns_span_structure: responseData.ns_span_structure,
        ew_span_structure: responseData.ew_span_structure,
        north_gap: responseData.north_gap,
        east_gap: responseData.east_gap,
        south_gap: responseData.south_gap,
        west_gap: responseData.west_gap,
        num_stages: responseData.num_stages,
        modules_count: responseData.modules_count,
        jack_up_height: responseData.jack_up_height,
        first_layer_height: responseData.first_layer_height,
        tie_ok: responseData.tie_ok,
        tie_column_used: responseData.tie_column_used,
      }

      setCalculationResult(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '計算処理中にエラーが発生しました。'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [inputData, router])

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
  )
}

export const useScaffold = () => {
  const context = useContext(ScaffoldContext)
  if (context === undefined) {
    throw new Error('useScaffold must be used within a ScaffoldProvider')
  }
  return context
}
