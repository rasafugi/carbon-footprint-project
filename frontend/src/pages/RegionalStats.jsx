import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkedAlt, FaChartBar, FaUserFriends, FaFireAlt, FaGlobe } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next'; // ✨ 引入
import { taiwanPlaces } from '../data/options';

const RegionalStats = () => {
  const { t, i18n } = useTranslation(); // ✨ 使用 hook
  const navigate = useNavigate();
  
  const [selectedCity, setSelectedCity] = useState('高雄市');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    fetchStats();
  }, [selectedCity, selectedDistrict]);

  const fetchStats = async () => {
    setLoading(true);
    try {
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

  const COLORS = ['#FBBF24', '#60A5FA', '#F87171', '#A78BFA', '#34D399'];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8"> {/* ✨ 改用 justify-between */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{t('history.title')}</h1>
            </div>

            {/* ✨ 右上角語言切換 */}
            <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition font-medium"
            >
                <FaGlobe />
                <span>{i18n.language.startsWith('zh') ? 'EN' : '中'}</span>
            </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-slate-600 mb-2">{t('regional.label_city')}</label>
                <select 
                    value={selectedCity}
                    onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(''); }}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50"
                >
                    {Object.keys(taiwanPlaces).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-slate-600 mb-2">{t('regional.label_district')}</label>
                <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 disabled:opacity-50"
                    disabled={!selectedCity}
                >
                    <option value="">{t('regional.option_all_districts')}</option>
                    {selectedCity && taiwanPlaces[selectedCity]?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-slate-400">{t('regional.loading')}</div>
        ) : !stats || stats.sample_count === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 mb-2">{t('regional.empty_title')}</p>
                <p className="text-sm text-slate-300">
                    {t('regional.empty_desc', { region: `${selectedCity}${selectedDistrict}` })}
                </p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaChartBar /> {t('regional.card_avg')}
                    </h3>
                    <p className="text-4xl font-extrabold text-slate-800">
                        {stats.avg_total} <span className="text-sm font-normal text-slate-400">kgCO2e</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaFireAlt /> {t('regional.card_source')}
                    </h3>
                    <p className="text-2xl font-bold text-slate-800 mt-2">
                        {/* 這裡簡單處理，如果需要精確翻譯，需要在後端回傳 key 或前端建立對照表 */}
                        {stats.top_source || t('regional.no_data')}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                    <h3 className="text-slate-500 text-sm font-bold mb-1 flex items-center gap-2">
                        <FaUserFriends /> {t('regional.card_sample')}
                    </h3>
                    <p className="text-4xl font-extrabold text-slate-800">
                        {stats.sample_count} <span className="text-sm font-normal text-slate-400">{t('regional.card_sample').includes('Count') ? '' : '人'}</span>
                    </p>
                </div>

                <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2">
                        {t('regional.chart_title', { region: `${selectedCity}${selectedDistrict ? ' - ' + selectedDistrict : ''}` })}
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
                        {t('regional.disclaimer')}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RegionalStats;