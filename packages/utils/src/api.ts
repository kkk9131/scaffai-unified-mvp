/**
 * 🌐 ScaffAI API クライアント
 * Railway API との統合処理を担当
 */

import axios from 'axios';
import type { InputData, CalculationAPIRequest, CalculationResult } from '@scaffai/types';

// 🔗 APIのベースURL
export const API_URL = 'https://scaffai-app-production.up.railway.app';

/**
 * 🔄 InputData を APIリクエスト形式に変換
 */
export const convertInputDataToAPIRequest = (inputData: InputData): CalculationAPIRequest => {
  return {
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
  };
};

/**
 * 🏥 ヘルスチェック API
 */
export const checkAPIHealth = async (): Promise<any> => {
  console.log('🔍 API Health Check:', `${API_URL}/health`);
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};

/**
 * 🧮 足場計算 API呼び出し
 */
export const calculateScaffoldAPI = async (inputData: InputData): Promise<CalculationResult> => {
  const requestData = convertInputDataToAPIRequest(inputData);
  
  console.log('📤 API Request:', JSON.stringify(requestData, null, 2));
  console.log('🔗 API URL:', `${API_URL}/calculate`);

  try {
    const response = await axios.post(`${API_URL}/calculate`, requestData);
    console.log('📥 API Response:', response.data);
    
    const result: CalculationResult = {
      ns_total_span: response.data.ns_total_span,
      ew_total_span: response.data.ew_total_span,
      ns_span_structure: response.data.ns_span_structure,
      ew_span_structure: response.data.ew_span_structure,
      north_gap: response.data.north_gap,
      east_gap: response.data.east_gap,
      south_gap: response.data.south_gap,
      west_gap: response.data.west_gap,
      num_stages: response.data.num_stages,
      modules_count: response.data.modules_count,
      jack_up_height: response.data.jack_up_height,
      first_layer_height: response.data.first_layer_height,
      tie_ok: response.data.tie_ok,
      tie_column_used: response.data.tie_column_used,
    };

    return result;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('📋 Response Status:', error.response.status);
      console.error('📋 Response Data:', error.response.data);
      
      if (error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const message = error.response.data.detail.map((d: any) => {
            const loc = d.loc && d.loc.length > 1 ? d.loc.slice(1).join('.') : '入力値';
            return `${loc}: ${d.msg}`;
          }).join('\n');
          throw new Error(message);
        } else {
          throw new Error(error.response.data.detail);
        }
      } else {
        throw new Error('サーバーで不明なエラーが発生しました。');
      }
    } else {
      throw new Error('API通信中にエラーが発生しました。ネットワーク接続を確認してください。');
    }
  }
};
