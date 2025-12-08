import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaUtensils, FaShoppingBag, FaArrowLeft, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QuickEstimation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' or 'result'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [answers, setAnswers] = useState({
    commute: 'scooter_gas',
    diet: 'balanced',
    shopping: 'medium'
  });

  const handleChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 這裡請確認 URL 與你的 Flask port 一致
      const res = await axios.post('http://127.0.0.1:5000/api/calculate/quick', answers, { withCredentials: true });
      setResult(res.data);
      setStep('result');
    } catch (error) {
      alert("計算失敗，請確認是否已登入");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // --- 選項卡片組件 ---
  const OptionCard = ({ label, icon, value, current, onClick }) => (
    <div 
        onClick={() => onClick(value)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col items-center gap-2 text-center
        ${current === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-300'}`}
    >
        <div className="text-2xl">{icon}</div>
        <span className="font-medium text-sm">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">快速碳排估算</h1>
        </div>

        {step === 'form' ? (
            <div className="bg-white p-8 rounded-3xl shadow-lg space-y-8">
                {/* Q1: 交通 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaCar className="text-blue-500"/> 平常最主要的通勤方式？</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <OptionCard label="燃油機車" icon="🛵" value="scooter_gas" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard label="電動機車" icon="🔋" value="scooter_electric" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard label="燃油汽車" icon="🚗" value="car_gas" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard label="電動汽車" icon="⚡" value="car_electric" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard label="大眾運輸" icon="🚌" value="public" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard label="走路/單車" icon="🚲" value="bike" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                    </div>
                </div>

                {/* Q2: 飲食 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaUtensils className="text-red-500"/> 平常的飲食習慣？</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <OptionCard label="無肉不歡 (肉食為主)" icon="🍖" value="meat_heavy" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard label="均衡飲食 (蛋奶肉菜)" icon="🍱" value="balanced" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard label="外食族 (加工食品多)" icon="🍔" value="convenience" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard label="素食/蔬食" icon="🥗" value="vegetarian" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                    </div>
                </div>

                {/* Q3: 消費 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaShoppingBag className="text-purple-500"/> 每月平均購物消費 (不含餐費)？</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <OptionCard label="節儉 (1萬以下)" icon="💰" value="low" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                        <OptionCard label="一般 (1~3萬)" icon="💳" value="medium" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                        <OptionCard label="享樂 (3萬以上)" icon="🛍️" value="high" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition"
                >
                    {loading ? '計算中...' : '開始計算'}
                </button>
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500"
            >
                <div className="text-center mb-8">
                    <p className="text-slate-500 mb-2">您的年度預估碳排放量</p>
                    <h2 className="text-5xl font-extrabold text-slate-800">
                        {result.total} <span className="text-xl text-slate-500 font-normal">kgCO2e/年</span>
                    </h2>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                    <h3 className="font-bold text-slate-700 mb-4">📊 排放來源分析</h3>
                    <div className="space-y-3">
                        {/* 簡單的長條圖 */}
                        {Object.entries(result.breakdown).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-3">
                                <span className="w-20 text-sm text-slate-600 capitalize">
                                    {key === 'transport' ? '交通' : key === 'diet' ? '飲食' : '消費'}
                                </span>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${key === 'transport' ? 'bg-blue-500' : key === 'diet' ? 'bg-red-500' : 'bg-purple-500'}`}
                                        style={{ width: `${(val / result.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                    <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <FaLeaf /> 給您的減碳建議
                    </h3>
                    <p className="text-emerald-700 leading-relaxed">
                        {result.suggestion}
                    </p>
                </div>

                <button 
                    onClick={() => setStep('form')}
                    className="w-full mt-8 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                    重新測驗
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuickEstimation;