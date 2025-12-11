import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaLeaf, FaCalendarAlt, FaTimes, FaChartPie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null); // 用來控制詳細資訊 Modal

  // 取得資料
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/calculate/history', { withCredentials: true });
        setLogs(res.data);
      } catch (error) {
        console.error("無法取得紀錄", error);
        alert("請先登入");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  // 格式化日期
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">歷史碳排紀錄</h1>
        </div>

        {/* 列表區塊 */}
        {loading ? (
            <p className="text-center text-slate-500">載入中...</p>
        ) : logs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
                <p className="text-slate-400 mb-4">目前還沒有任何紀錄喔！</p>
                <button onClick={() => navigate('/quick-estimate')} className="text-emerald-600 font-bold hover:underline">去計算第一筆 &rarr;</button>
            </div>
        ) : (
            <div className="grid gap-4">
                {logs.map((log) => (
                    <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedLog(log)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition flex justify-between items-center"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <FaCalendarAlt />
                                <span>{formatDate(log.created_at)}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.log_type === 'Detailed' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {log.log_type === 'Detailed' ? '詳細分析' : '快速估算'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">
                                {log.total_carbon} <span className="text-sm font-normal text-slate-500">kgCO2e/年</span>
                            </h3>
                        </div>
                        <div className="text-slate-300">
                            查看詳情 &rarr;
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

        {/* 詳細資訊 Modal */}
        <AnimatePresence>
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // 防止點擊卡片關閉
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                                <FaChartPie className="text-emerald-600"/> 紀錄詳情
                            </h3>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="text-center">
                                <p className="text-slate-500 text-sm mb-1">{formatDate(selectedLog.created_at)}</p>
                                <h2 className="text-4xl font-extrabold text-slate-800">{selectedLog.total_carbon} <span className="text-lg font-normal text-slate-500">kgCO2e</span></h2>
                            </div>

                            {/* 解析 JSON breakdown */}
                            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                <h4 className="font-bold text-slate-700 text-sm">排放分佈</h4>
                                {Object.entries(JSON.parse(selectedLog.breakdown)).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-slate-600">{key}</span>
                                        <span className="font-bold text-slate-700">{val} kg</span>
                                    </div>
                                ))}
                            </div>

                            {/* 建議 */}
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-2">
                                    <FaLeaf /> 減碳建議
                                </h4>
                                <p className="text-emerald-700 text-sm leading-relaxed">
                                    {selectedLog.suggestions}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default HistoryPage;