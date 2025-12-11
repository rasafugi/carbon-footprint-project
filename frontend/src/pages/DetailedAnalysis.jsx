import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBolt, FaCar, FaUtensils, FaShoppingBag, FaRecycle, FaArrowLeft, FaLeaf, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // ✨ 引入

const DetailedAnalysis = () => {
  const { t } = useTranslation(); // ✨ 使用 hook
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    energy: { electricity: 0, gas: 0, water: 0 },
    transport: { km: 0, type: 'scooter_gas' },
    diet: { meat: 0, veg: 0, grain: 0 },
    consumption: { clothes: 0, electronics: 0 },
    waste: { bags: 0, recycle: 0 }
  });

  const updateData = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/calculate/detailed', formData, { withCredentials: true });
      setResult(res.data);
      setStep(6); 
    } catch (error) {
      console.error(error);
      alert("計算失敗，請確認是否已登入");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-yellow-600">
              <FaBolt /> {t('detailed.steps.energy')}
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.electricity')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.electricity')}
                  value={formData.energy.electricity} onChange={e => updateData('energy', 'electricity', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.gas')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.gas')}
                  value={formData.energy.gas} onChange={e => updateData('energy', 'gas', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.water')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.water')}
                  value={formData.energy.water} onChange={e => updateData('energy', 'water', e.target.value)} />
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <FaCar /> {t('detailed.steps.transport')}
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.transport_type')}</span>
                <select className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition cursor-pointer"
                  value={formData.transport.type} onChange={e => updateData('transport', 'type', e.target.value)}>
                  
                  <optgroup label={t('detailed.transport_options.group_private')}>
                    <option value="scooter_gas">{t('detailed.transport_options.scooter_gas')}</option>
                    <option value="scooter_electric">{t('detailed.transport_options.scooter_electric')}</option>
                    <option value="car_gas">{t('detailed.transport_options.car_gas')}</option>
                    <option value="car_electric">{t('detailed.transport_options.car_electric')}</option>
                    <option value="bike">{t('detailed.transport_options.bike')}</option>
                  </optgroup>

                  <optgroup label={t('detailed.transport_options.group_public')}>
                    <option value="bus">{t('detailed.transport_options.bus')}</option>
                    <option value="mrt">{t('detailed.transport_options.mrt')}</option>
                    <option value="train">{t('detailed.transport_options.train')}</option>
                    <option value="hsr">{t('detailed.transport_options.hsr')}</option>
                    <option value="airplane_domestic">{t('detailed.transport_options.airplane_domestic')}</option>
                  </optgroup>

                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.transport_km')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.transport_km')}
                  value={formData.transport.km} onChange={e => updateData('transport', 'km', e.target.value)} />
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-red-500">
              <FaUtensils /> {t('detailed.steps.diet')}
            </h3>
            <p className="text-sm text-gray-500">{t('detailed.notes.diet')}</p>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.diet_meat')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.diet_meat')}
                  value={formData.diet.meat} onChange={e => updateData('diet', 'meat', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.diet_veg')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.diet_veg')}
                  value={formData.diet.veg} onChange={e => updateData('diet', 'veg', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.diet_grain')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.diet_grain')}
                  value={formData.diet.grain} onChange={e => updateData('diet', 'grain', e.target.value)} />
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-600">
              <FaShoppingBag /> {t('detailed.steps.consumption')}
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.cons_clothes')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.cons_clothes')}
                  value={formData.consumption.clothes} onChange={e => updateData('consumption', 'clothes', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.cons_electronics')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.cons_electronics')}
                  value={formData.consumption.electronics} onChange={e => updateData('consumption', 'electronics', e.target.value)} />
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <FaRecycle /> {t('detailed.steps.waste')}
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.waste_bags')}</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.waste_bags')}
                  value={formData.waste.bags} onChange={e => updateData('waste', 'bags', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('detailed.fields.waste_recycle')}</span>
                <p className="text-xs text-gray-400 mb-2">{t('detailed.notes.waste')}</p>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition" 
                  placeholder={t('detailed.placeholders.waste_recycle')}
                  value={formData.waste.recycle} onChange={e => updateData('waste', 'recycle', e.target.value)} />
              </label>
            </div>
          </div>
        );

      default:
        return <div>Unknown Step</div>;
    }
  };

  if (step === 6 && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border-t-8 border-emerald-600">
          <div className="text-center mb-8">
            <p className="text-slate-500 mb-2">{t('detailed.result_title')}</p>
            <h2 className="text-6xl font-extrabold text-slate-800">
              {result.total} <span className="text-xl text-slate-500 font-normal">{t('detailed.unit_year')}</span>
            </h2>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl mb-8">
            <h3 className="font-bold text-slate-700 mb-4">📊 {t('detailed.result_breakdown')}</h3>
            <div className="space-y-3">
              {Object.entries(result.breakdown).map(([key, val]) => {
                const colors = { energy: 'bg-yellow-400', transport: 'bg-blue-400', diet: 'bg-red-400', consumption: 'bg-purple-400', waste: 'bg-green-400' };
                // ✨ 使用 t() 翻譯標籤
                const percentage = Math.min(100, (val / result.total) * 100);

                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-slate-600 font-medium">{t(`detailed.labels.${key}`, key)}</span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors[key]} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right text-sm font-bold text-slate-700">{val} kg</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mb-8">
            <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <FaLeaf /> {t('detailed.result_suggestion')}
            </h3>
            <p className="text-emerald-700 leading-relaxed">
                {t(result.suggestion)}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition shadow-lg"
          >
            {t('detailed.btn_dashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg relative">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition text-slate-500">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">{t('detailed.title')}</h1>
        </div>

        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 
                ${step >= i ? 'bg-emerald-600 border-emerald-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {i}
                </div>
            ))}
        </div>

        <div className="min-h-[350px]">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))} 
            disabled={step === 1} 
            className="px-6 py-2.5 text-slate-500 font-medium hover:bg-slate-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {t('detailed.btn_prev')}
          </button>
          
          {step < 5 ? (
            <button 
                onClick={() => setStep(s => s + 1)} 
                className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 transition"
            >
                {t('detailed.btn_next')}
            </button>
          ) : (
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-8 py-2.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 shadow-lg transition flex items-center gap-2"
            >
                {loading ? t('detailed.btn_calculating') : <><FaCheck /> {t('detailed.btn_submit')}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;