import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaUtensils, FaShoppingBag, FaArrowLeft, FaLeaf, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✨ 引入

const QuickEstimation = () => {
  const { t, i18n } = useTranslation(); // ✨ 使用 hook
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

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
      const res = await axios.post('/api/calculate/quick', answers, { withCredentials: true });
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
  const OptionCard = ({ labelKey, icon, value, current, onClick }) => (
    <div 
        onClick={() => onClick(value)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col items-center gap-2 text-center
        ${current === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-300'}`}
    >
        <div className="text-2xl">{icon}</div>
        {/* ✨ 使用 t() 翻譯選項 */}
        <span className="font-medium text-sm">{t(`quick.options.${labelKey}`)}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        {step === 'form' ? (
            <div className="bg-white p-8 rounded-3xl shadow-lg space-y-8">
                {/* Q1: 交通 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaCar className="text-blue-500"/> {t('quick.q_commute')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <OptionCard labelKey="scooter_gas" icon="🛵" value="scooter_gas" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard labelKey="scooter_electric" icon="🔋" value="scooter_electric" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard labelKey="car_gas" icon="🚗" value="car_gas" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard labelKey="car_electric" icon="⚡" value="car_electric" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard labelKey="public" icon="🚌" value="public" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                        <OptionCard labelKey="bike" icon="🚲" value="bike" current={answers.commute} onClick={(v) => handleChange('commute', v)} />
                    </div>
                </div>

                {/* Q2: 飲食 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaUtensils className="text-red-500"/> {t('quick.q_diet')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <OptionCard labelKey="meat_heavy" icon="🍖" value="meat_heavy" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard labelKey="balanced" icon="🍱" value="balanced" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard labelKey="convenience" icon="🍔" value="convenience" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                        <OptionCard labelKey="vegetarian" icon="🥗" value="vegetarian" current={answers.diet} onClick={(v) => handleChange('diet', v)} />
                    </div>
                </div>

                {/* Q3: 消費 */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaShoppingBag className="text-purple-500"/> {t('quick.q_shopping')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <OptionCard labelKey="low" icon="💰" value="low" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                        <OptionCard labelKey="medium" icon="💳" value="medium" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                        <OptionCard labelKey="high" icon="🛍️" value="high" current={answers.shopping} onClick={(v) => handleChange('shopping', v)} />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition"
                >
                    {loading ? t('quick.btn_calculating') : t('quick.btn_calc')}
                </button>
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500"
            >
                <div className="text-center mb-8">
                    <p className="text-slate-500 mb-2">{t('quick.result_title')}</p>
                    <h2 className="text-5xl font-extrabold text-slate-800">
                        {result.total} <span className="text-xl text-slate-500 font-normal">{t('quick.unit_year')}</span>
                    </h2>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                    <h3 className="font-bold text-slate-700 mb-4">📊 {t('quick.result_breakdown')}</h3>
                    <div className="space-y-3">
                        {Object.entries(result.breakdown).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-3">
                                {/* ✨ 使用 t() 翻譯標籤 */}
                                <span className="w-20 text-sm text-slate-600 capitalize">
                                    {t(`quick.labels.${key}`, key)}
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
                        <FaLeaf /> {t('quick.result_suggestion')}
                    </h3>
                    <p className="text-emerald-700 leading-relaxed">
                        {t(result.suggestion)}
                    </p>
                </div>

                <button 
                    onClick={() => setStep('form')}
                    className="w-full mt-8 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                    {t('quick.btn_retry')}
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuickEstimation;