import { Link, useLocation } from 'react-router-dom';
import { Bold as Scaffold, Home, Calculator, FileText, Layers, Settings, FileUp, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'ホーム', 
      path: '/', 
      icon: <Home size={20} /> 
    },
    { 
      name: 'データ入力', 
      path: '/input', 
      icon: <Calculator size={20} /> 
    },
    { 
      name: '計算結果', 
      path: '/results', 
      icon: <FileText size={20} /> 
    },
    { 
      name: '描画', 
      path: '/drawing', 
      icon: <Layers size={20} /> 
    },
    { 
      name: 'ファイル読込', 
      path: '/upload', 
      icon: <FileUp size={20} /> 
    },
    { 
      name: 'エクスポート', 
      path: '/export', 
      icon: <Download size={20} /> 
    },
    { 
      name: '設定', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    },
  ];

  return (
    <div className="h-full bg-dark-500 text-white flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-dark-300">
        <div className="bg-primary-500 rounded-md p-2">
          <Scaffold size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">ScaffAI</h1>
          <p className="text-xs text-slate-400">Ver.1.0</p>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 w-1 h-full bg-primary-500"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-2 px-4 mx-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-dark-400 text-primary-400'
                      : 'text-slate-300 hover:text-white hover:bg-dark-400'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dark-300">
        <div className="bg-dark-400 rounded-md p-3">
          <p className="text-sm text-slate-300 mb-2">サポートが必要ですか？</p>
          <button className="w-full py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors">
            サポートに連絡
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;