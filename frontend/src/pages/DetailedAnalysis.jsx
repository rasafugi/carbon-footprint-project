import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// ✨ 修正：在這裡加入了 FaCheck
import { FaBolt, FaCar, FaUtensils, FaShoppingBag, FaRecycle, FaArrowLeft, FaLeaf, FaCheck } from 'react-icons/fa';

const DetailedAnalysis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 目前步驟 (1~5: 輸入, 6: 結果)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 表單資料初始值
  const [formData, setFormData] = useState({
    energy: { electricity: 0, gas: 0, water: 0 },
    transport: { km: 0, type: 'scooter_gas' },
    diet: { meat: 0, veg: 0, grain: 0 },
    consumption: { clothes: 0, electronics: 0 },
    waste: { bags: 0, recycle: 0 }
  });

  // 更新表單函式
  const updateData = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 請確認後端 Port 正確 (預設 5000)
      const res = await axios.post('http://127.0.0.1:5000/api/calculate/detailed', formData, { withCredentials: true });
      setResult(res.data);
      setStep(6); // 跳轉到結果頁
    } catch (error) {
      console.error(error);
      alert("計算失敗，請確認是否已登入");
    } finally {
      setLoading(false);
    }
  };

  // 定義每個步驟的 UI
  const renderStep = () => {
    switch(step) {
      // --- Step 1: 能源 ---
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-yellow-600">
              <FaBolt /> Module A: 家庭能源 (月平均)
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">用電量 (度 / kWh)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder="例如：300"
                  value={formData.energy.electricity} onChange={e => updateData('energy', 'electricity', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">瓦斯用量 (度 / m³)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder="例如：20"
                  value={formData.energy.gas} onChange={e => updateData('energy', 'gas', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">用水量 (度)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition" 
                  placeholder="例如：15"
                  value={formData.energy.water} onChange={e => updateData('energy', 'water', e.target.value)} />
              </label>
            </div>
          </div>
        );

      // --- Step 2: 交通 ---
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <FaCar /> Module B: 交通通勤 (月平均)
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">主要交通工具</span>
                <select className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition cursor-pointer"
                  value={formData.transport.type} onChange={e => updateData('transport', 'type', e.target.value)}>
                  <option value="scooter_gas">燃油機車</option>
                  <option value="scooter_electric">電動機車</option>
                  <option value="car_gas">燃油汽車</option>
                  <option value="car_electric">電動汽車</option>
                  <option value="public">大眾運輸 (捷運/公車)</option>
                  <option value="bike">單車/步行</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">每月行駛里程 (km)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition" 
                  placeholder="例如：500"
                  value={formData.transport.km} onChange={e => updateData('transport', 'km', e.target.value)} />
              </label>
            </div>
          </div>
        );

      // --- Step 3: 飲食 ---
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-red-500">
              <FaUtensils /> Module C: 飲食行為 (週平均)
            </h3>
            <p className="text-sm text-gray-500">請填寫您每週大約吃幾餐這類食物。</p>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">肉類主食 (餐/週)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder="例如：10"
                  value={formData.diet.meat} onChange={e => updateData('diet', 'meat', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">蔬食/素食 (餐/週)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder="例如：5"
                  value={formData.diet.veg} onChange={e => updateData('diet', 'veg', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">澱粉/輕食 (餐/週)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" 
                  placeholder="例如：6"
                  value={formData.diet.grain} onChange={e => updateData('diet', 'grain', e.target.value)} />
              </label>
            </div>
          </div>
        );

      // --- Step 4: 消費 ---
      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-600">
              <FaShoppingBag /> Module D: 生活消費 (月平均)
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">服飾/鞋包支出 (元/月)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none transition" 
                  placeholder="例如：2000"
                  value={formData.consumption.clothes} onChange={e => updateData('consumption', 'clothes', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">電子產品/3C支出 (元/月)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none transition" 
                  placeholder="例如：1000 (若買手機可除以使用月數)"
                  value={formData.consumption.electronics} onChange={e => updateData('consumption', 'electronics', e.target.value)} />
              </label>
            </div>
          </div>
        );

      // --- Step 5: 廢棄物 ---
      case 5:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <FaRecycle /> Module E: 廢棄物與回收 (週平均)
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">一般垃圾 (14L垃圾袋/週)</span>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition" 
                  placeholder="例如：2"
                  value={formData.waste.bags} onChange={e => updateData('waste', 'bags', e.target.value)} />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">資源回收 (分類項目數/週)</span>
                <p className="text-xs text-gray-400 mb-2">指有確實分類回收的次數或體積單位</p>
                <input type="number" className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 p-3 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition" 
                  placeholder="例如：5"
                  value={formData.waste.recycle} onChange={e => updateData('waste', 'recycle', e.target.value)} />
              </label>
            </div>
          </div>
        );

      default:
        return <div>未知步驟</div>;
    }
  };

  // --- Step 6: 結果頁面 ---
  if (step === 6 && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border-t-8 border-emerald-600">
          <div className="text-center mb-8">
            <p className="text-slate-500 mb-2">您的詳細年度碳排放量</p>
            <h2 className="text-6xl font-extrabold text-slate-800">
              {result.total} <span className="text-xl text-slate-500 font-normal">kgCO2e/年</span>
            </h2>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl mb-8">
            <h3 className="font-bold text-slate-700 mb-4">📊 排放結構分析</h3>
            <div className="space-y-3">
              {/* 長條圖顯示 */}
              {Object.entries(result.breakdown).map(([key, val]) => {
                const colors = { energy: 'bg-yellow-400', transport: 'bg-blue-400', diet: 'bg-red-400', consumption: 'bg-purple-400', waste: 'bg-green-400' };
                const labels = { energy: '能源', transport: '交通', diet: '飲食', consumption: '消費', waste: '廢棄物' };
                const percentage = Math.min(100, (val / result.total) * 100);

                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-slate-600 font-medium">{labels[key]}</span>
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
                <FaLeaf /> 分析建議
            </h3>
            <p className="text-emerald-700 leading-relaxed">
                {result.suggestion}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition shadow-lg"
          >
            回到儀表板
          </button>
        </div>
      </div>
    );
  }

  // --- 主要表單介面 ---
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition text-slate-500">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">詳細碳排分析</h1>
        </div>

        {/* 步驟進度條 */}
        <div className="flex justify-between mb-8 relative">
            {/* 背景線 */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
            
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 
                ${step >= i ? 'bg-emerald-600 border-emerald-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {i}
                </div>
            ))}
        </div>

        {/* 表單內容區 (固定高度避免跳動) */}
        <div className="min-h-[350px]">
          {renderStep()}
        </div>

        {/* 底部按鈕區 */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))} 
            disabled={step === 1} 
            className="px-6 py-2.5 text-slate-500 font-medium hover:bg-slate-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            上一步
          </button>
          
          {step < 5 ? (
            <button 
                onClick={() => setStep(s => s + 1)} 
                className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 transition"
            >
                下一步
            </button>
          ) : (
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-8 py-2.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 shadow-lg transition flex items-center gap-2"
            >
                {loading ? '計算中...' : <><FaCheck /> 提交分析</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;