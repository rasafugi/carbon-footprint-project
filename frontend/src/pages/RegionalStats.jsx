import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkedAlt, FaChartBar, FaCity } from 'react-icons/fa';
import { taiwanPlaces } from '../data/options'; // 直接沿用你原本的縣市資料

const RegionalStats = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('高雄市');
  const [selectedDistrict, setSelectedDistrict] = useState('');

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
            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200/50">
                查詢數據
            </button>
        </div>

        {/* 數據儀表板 (Placeholder) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 卡片 1: 平均碳排 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                <h3 className="text-slate-500 text-sm font-bold mb-1">該區平均年碳排</h3>
                <p className="text-3xl font-extrabold text-slate-800">-- <span className="text-sm font-normal text-slate-400">kgCO2e</span></p>
            </div>
            {/* 卡片 2: 最高排放源 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                <h3 className="text-slate-500 text-sm font-bold mb-1">主要排放來源</h3>
                <p className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">交通</span> 
                    (待統計)
                </p>
            </div>
            {/* 卡片 3: 參與人數 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                <h3 className="text-slate-500 text-sm font-bold mb-1">資料庫樣本數</h3>
                <p className="text-3xl font-extrabold text-slate-800">-- <span className="text-sm font-normal text-slate-400">人</span></p>
            </div>

            {/* 大型圖表區 */}
            <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-slate-300">
                <FaChartBar size={64} className="mb-4 opacity-50" />
                <p>數據視覺化圖表將顯示於此 (Chart.js / Recharts)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalStats;