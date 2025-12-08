import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaChartLine, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 橫幅 Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-emerald-600">CarbonTrace</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">會員中心</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">Hi, {user?.fullName}</span>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-slate-500 hover:text-emerald-600">
                <FaHome /> 首頁
            </button>
            <button onClick={onLogout} className="flex items-center gap-1 text-slate-500 hover:text-red-500">
                <FaSignOutAlt /> 登出
            </button>
        </div>
      </nav>

      {/* 主內容 */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">請選擇計算模式</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 快速估算版 Card */}
            <div 
                onClick={() => navigate('/quick-estimate')}
                className="bg-white p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-emerald-500 hover:shadow-2xl transition cursor-pointer group"
            >
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl text-emerald-600 mb-6 group-hover:scale-110 transition">
                    <FaRocket />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">快速估算版</h3>
                <p className="text-slate-500 mb-4">約 30 秒完成。回答 3 題生活選擇題，立即取得碳排概況。</p>
                <span className="text-emerald-600 font-bold group-hover:underline">立即開始 &rarr;</span>
            </div>

            {/* 詳細分析版 Card (暫時無法點擊) */}
            <div className="bg-gray-50 p-8 rounded-3xl shadow-inner border-2 border-dashed border-gray-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">開發中</div>
                <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-3xl text-gray-400 mb-6">
                    <FaChartLine />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">詳細分析版</h3>
                <p className="text-gray-400 mb-4">輸入電費、里程數等精確數據，產出研究級報告。</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;