import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkedAlt, FaChartBar, FaUserFriends, FaFireAlt } from 'react-icons/fa';
// 引入圖表元件
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { taiwanPlaces } from '../data/options';

const RegionalStats = () => {
  const navigate = useNavigate();
  
  // 篩選狀態
  const [selectedCity, setSelectedCity] = useState('高雄市');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // 數據狀態
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // 當篩選條件改變時，自動撈取資料
  useEffect(() => {
    fetchStats();
  }, [selectedCity, selectedDistrict]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 建構 Query String
      let url = `/api/stats/region?city=${selectedCity}`;
      if (selectedDistrict) url += `&district=${selectedDistrict}`;

      const res = await axios.get(url);
      setStats(res.data);
    } catch (error) {
      console.error("獲取統計失敗", error);
    } finally {
      setLoading(false);
    }
  };

  // 圖表顏色設定
  const COLORS = ['#FBBF24', '#60A5FA', '#F87171', '#A78BFA', '#34D399'];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FaMapMarkedAlt className="text-blue-600"/> 台灣區域碳排大數據
            </h1>
        </div>

        {/* 篩選控制器 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-slate-600 mb-2">選擇縣市</label>
                <select 
                    value={selectedCity}
                    onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(''); }}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50"
                >
                    {Object.keys(taiwanPlaces).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-slate-600 mb-2">選擇行政區 (選填)</label>
                <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 disabled:opacity-50"
                    disabled={!selectedCity}
                >
                    <option value="">全區統計</option>
                    {selectedCity && taiwanPlaces[selectedCity]?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
        </div>

        {/* 內容顯示區 */}
        {loading ? (
            <div className="text-center py-20 text-slate-400">數據分析中...</div>
        ) : !stats || stats.sample_count === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 mb-2">該區域目前還沒有足夠的樣本資料</p>
                <p className="text-sm text-slate-300">快邀請住在{selectedCity}{selectedDistrict}的朋友來測驗吧！</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                
                {/* 數據卡片 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaChartBar /> 平均年碳排
                    </h3>
                    <p className="text-4xl font-extrabold text-slate-800">
                        {stats.avg_total} <span className="text-sm font-normal text-slate-400">kgCO2e</span>
                    </p>
                </div>

                {/* 數據卡片 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaFireAlt /> 主要排放源
                    </h3>
                    <p className="text-2xl font-bold text-slate-800 mt-2">
                        {stats.top_source}
                    </p>
                </div>

                {/* 數據卡片 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaUserFriends /> 樣本數
                    </h3>
                    <p className="text-4xl font-extrabold text-slate-800">
                        {stats.sample_count} <span className="text-sm font-normal text-slate-400">人</span>
                    </p>
                </div>

                {/* 大型圖表區 */}
                <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2">
                        {selectedCity}{selectedDistrict ? ` - ${selectedDistrict}` : ''} 平均排放結構
                    </h3>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chart_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                    {stats.chart_data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        * 此數據基於本平台使用者輸入之平均值，僅供參考。
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RegionalStats;