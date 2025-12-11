import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBrain, FaLightbulb, FaLeaf, FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa';
// 引入題庫
import questionsData from '../data/quizQuestions.json';

const GreenQuiz = () => {
  const navigate = useNavigate();

  // --- 狀態管理 ---
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'score'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // --- 遊戲邏輯 ---
  
  // 1. 開始遊戲：隨機挑選 5 題 (你可以改成 10)
  const startGame = () => {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowExplanation(false);
    setSelectedOption(null);
  };

  // 2. 處理回答
  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
    
    if (option === currentQuestions[currentIndex].answer) {
      // ✨ 修改處：每題改為 10 分 (10題 x 10分 = 100分)
      setScore(prev => prev + 10); 
    }
  };

  // 3. 下一題
  const nextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setGameState('score'); // 遊戲結束
    }
  };

  // --- 渲染不同狀態的畫面 ---

  // 畫面 A: 歡迎頁面
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-emerald-50/50 py-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl flex items-center gap-4 mb-12">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
                <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FaLeaf className="text-emerald-600"/> 綠能知識小測驗
            </h1>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-2xl w-full text-center border-t-8 border-yellow-400">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 text-5xl">
                <FaBrain />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">挑戰你的環保智商！</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
                隨機抽出 10 道題目，測試你對綠能、回收與碳足跡的了解。<br/>
                準備好成為減碳達人了嗎？
            </p>
            <button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-[1.02]">
                開始測驗
            </button>
        </div>
      </div>
    );
  }

  // 畫面 B: 作答中
  if (gameState === 'playing') {
    const question = currentQuestions[currentIndex];
    const isCorrect = selectedOption === question.answer;

    return (
      <div className="min-h-screen bg-slate-100 py-12 px-6 flex justify-center">
        <div className="w-full max-w-2xl">
            {/* 進度條 */}
            <div className="flex justify-between text-slate-500 font-bold mb-2">
                <span>Question {currentIndex + 1} / {currentQuestions.length}</span>
                <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}></div>
            </div>

            {/* 題目卡片 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                    {question.question}
                </h3>

                <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border-2 transition font-medium text-slate-700 ";
                        
                        if (showExplanation) {
                            if (opt === question.answer) btnClass += "border-green-500 bg-green-50 text-green-700"; // 正解 (綠色)
                            else if (opt === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700"; // 選錯 (紅色)
                            else btnClass += "border-gray-100 opacity-50"; // 其他選項變淡
                        } else {
                            btnClass += "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"; // 一般狀態
                        }

                        return (
                            <button 
                                key={idx} 
                                onClick={() => !showExplanation && handleAnswer(opt)}
                                disabled={showExplanation}
                                className={btnClass}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 解析與下一題 */}
            {showExplanation && (
                <div className="animate-fadeIn">
                    <div className={`p-6 rounded-2xl mb-6 flex gap-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="text-2xl mt-1">
                            {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">{isCorrect ? '答對了！' : '答錯囉！'}</h4>
                            <p className="text-sm opacity-90">{question.explanation}</p>
                        </div>
                    </div>
                    <button onClick={nextQuestion} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition">
                        {currentIndex + 1 === currentQuestions.length ? '查看結果' : '下一題'}
                    </button>
                </div>
            )}
        </div>
      </div>
    );
  }

  // 畫面 C: 結算頁面
  if (gameState === 'score') {
    return (
        <div className="min-h-screen bg-emerald-50 py-12 px-6 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">
                <div className="mb-6">
                    {score === 100 ? (
                        <div className="text-6xl mb-4">🏆</div>
                    ) : score >= 60 ? (
                        <div className="text-6xl mb-4">🎉</div>
                    ) : (
                        <div className="text-6xl mb-4">💪</div>
                    )}
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
                        {score} 分
                    </h2>
                    <p className="text-slate-500">
                        {score === 100 ? "太神啦！你是環保知識王！" : score >= 60 ? "表現不錯！繼續保持！" : "再接再厲，一起學習綠能知識！"}
                    </p>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                        回儀表板
                    </button>
                    <button onClick={startGame} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                        <FaRedo /> 再玩一次
                    </button>
                </div>
            </div>
        </div>
    );
  }
};

export default GreenQuiz;