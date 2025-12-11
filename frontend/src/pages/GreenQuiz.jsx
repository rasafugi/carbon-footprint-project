import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBrain, FaLightbulb, FaLeaf } from 'react-icons/fa';

const GreenQuiz = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-emerald-50/50 py-12 px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center gap-4 mb-12">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
              <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaLeaf className="text-emerald-600"/> 綠能知識小測驗
          </h1>
      </div>

      {/* 測驗歡迎卡片 */}
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-2xl w-full text-center border-t-8 border-yellow-400">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 text-5xl">
              <FaBrain />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">挑戰你的環保智商！</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
              你知道台灣主要的發電方式是什麼嗎？<br/>
              回收一個鋁罐可以省下多少電？<br/>
              透過 10 題快問快答，測試你是不是真正的「減碳達人」！
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                  <FaLightbulb className="text-yellow-500"/>
                  <span className="text-sm font-bold text-slate-700">隨機題庫</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                  <FaLeaf className="text-emerald-500"/>
                  <span className="text-sm font-bold text-slate-700">累積積分</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <span className="text-sm font-bold text-slate-700">排行榜</span>
              </div>
          </div>

          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-yellow-200 transition transform hover:scale-[1.02] active:scale-[0.98]">
              開始測驗
          </button>
      </div>
    </div>
  );
};

export default GreenQuiz;