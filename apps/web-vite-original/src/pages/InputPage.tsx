import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, ArrowRight, Calculator, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const InputPage = () => {
  const [scaffoldData, setScaffoldData] = useState({
    // 躯体幅
    northSouth: '',
    eastWest: '',
    // 軒の出
    north: '',
    east: '',
    south: '',
    west: '',
    // 足場の層数
    layers: '5',
    // 安全性係数
    safetyFactor: '1.2',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScaffoldData({
      ...scaffoldData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際のアプリでは計算処理を行い、結果ページに遷移
    console.log('Form submitted:', scaffoldData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          データ入力
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          足場計算に必要なデータを入力してください。
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-200 dark:border-dark-100">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <span>躯体幅</span>
              <button className="ml-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <Info size={16} />
              </button>
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="northSouth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                南北
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="northSouth"
                  name="northSouth"
                  value={scaffoldData.northSouth}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                  mm
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="eastWest" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                東西
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="eastWest"
                  name="eastWest"
                  value={scaffoldData.eastWest}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                  mm
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-200 dark:border-dark-100">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <span>軒の出</span>
              <button className="ml-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <Info size={16} />
              </button>
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="north" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  北
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="north"
                    name="north"
                    value={scaffoldData.north}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    mm
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="east" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  東
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="east"
                    name="east"
                    value={scaffoldData.east}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    mm
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="south" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  南
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="south"
                    name="south"
                    value={scaffoldData.south}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    mm
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="west" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  西
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="west"
                    name="west"
                    value={scaffoldData.west}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    mm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-200 dark:border-dark-100">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <span>その他の設定</span>
              <button className="ml-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <Info size={16} />
              </button>
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="layers" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  足場の層数
                </label>
                <input
                  type="number"
                  id="layers"
                  name="layers"
                  value={scaffoldData.layers}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="5"
                />
              </div>
              
              <div>
                <label htmlFor="safetyFactor" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  安全性係数
                </label>
                <input
                  type="number"
                  id="safetyFactor"
                  name="safetyFactor"
                  value={scaffoldData.safetyFactor}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1.2"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            to="/"
            className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-dark-200 dark:hover:bg-dark-100 text-slate-800 dark:text-slate-200 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            キャンセル
          </Link>
          
          <div className="flex gap-3">
            <Link
              to="/drawing"
              className="py-2 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <Layers size={18} />
              <span>描画に進む</span>
            </Link>
            
            <motion.button
              type="submit"
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calculator size={18} />
              <span>計算する</span>
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputPage;