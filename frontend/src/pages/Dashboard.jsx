import React from 'react';
import { useNavigate } from 'react-router-dom';
// ✨ 引入更多 icon
import { FaRocket, FaChartLine, FaSignOutAlt, FaHome, FaHistory, FaMapMarkedAlt, FaBrain } from 'react-icons/fa';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 橫幅 Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>CarbonTrace</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">會員中心</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium hidden md:inline">Hi, {user?.fullName}</span>
            <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500" title="回首頁">
                <FaHome size={20} />
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition" title="登出">
                <FaSignOutAlt size={20} />
            </button>
        </div>
      </nav>

      {/* 主內容區 */}
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        
        {/* 第一區：開始計算 (核心功能) */}
        <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-emerald-500 pl-3">開始碳足跡計算</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* 快速估算 */}
                <div 
                    onClick={() => navigate('/quick-estimate')}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-emerald-400 transition cursor-pointer group flex items-center gap-6"
                >
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-3xl text-emerald-600 group-hover:scale-110 transition">
                        <FaRocket />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">快速估算版</h3>
                        <p className="text-slate-500 text-sm">30 秒完成，回答生活選擇題，立即取得概況。</p>
                    </div>
                </div>

                {/* 詳細分析 */}
                <div 
                    onClick={() => navigate('/detailed-analysis')}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue-400 transition cursor-pointer group flex items-center gap-6"
                >
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-3xl text-blue-600 group-hover:scale-110 transition">
                        <FaChartLine />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">詳細分析版</h3>
                        <p className="text-slate-500 text-sm">輸入電費、里程等精確數據，產出研究級報告。</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 第二區：數據洞察 & 知識 (新功能) */}
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-500 pl-3">數據洞察與活動</h2>
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* 1. 歷史紀錄 (原本在 Navbar，現在變成大卡片) */}
                <div 
                    onClick={() => navigate('/history')}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 cursor-pointer hover:-translate-y-1 transition"
                >
                    <div className="text-indigo-500 text-3xl mb-4"><FaHistory /></div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">歷史紀錄</h3>
                    <p className="text-slate-400 text-sm">查看過往的計算結果與減碳追蹤。</p>
                </div>

                {/* 2. 區域數據統計 (新功能) */}
                <div 
                    onClick={() => navigate('/regional-stats')}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 cursor-pointer hover:-translate-y-1 transition"
                >
                    <div className="text-cyan-600 text-3xl mb-4"><FaMapMarkedAlt /></div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                        區域數據地圖 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">NEW</span>
                    </h3>
                    <p className="text-slate-400 text-sm">探索台灣各縣市的碳排大數據與排名。</p>
                </div>

                {/* 3. 綠能測驗 (新功能) */}
                <div 
                    onClick={() => navigate('/green-quiz')}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 cursor-pointer hover:-translate-y-1 transition"
                >
                    <div className="text-yellow-500 text-3xl mb-4"><FaBrain /></div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                        綠能智商測驗 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">NEW</span>
                    </h3>
                    <p className="text-slate-400 text-sm">挑戰環保知識，累積積分成為減碳達人。</p>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;