import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBrain, FaLeaf, FaCheckCircle, FaTimesCircle, FaRedo, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // ✨ 引入
import questionsZh from '../data/quizQuestions.json';
import questionsEn from '../data/quizQuestions_en.json';

const GreenQuiz = () => {
  const { t, i18n } = useTranslation(); // 取得 i18n 物件
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('start');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const startGame = () => {
    const sourceData = i18n.language.startsWith('en') ? questionsEn : questionsZh;

    const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowExplanation(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
    
    if (option === currentQuestions[currentIndex].answer) {
      setScore(prev => prev + 10); 
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setGameState('score');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-emerald-50/50 py-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl flex justify-between items-center mb-12">
            
            {/* 左側群組：返回按鈕 + 標題 */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition text-slate-500">
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FaLeaf className="text-emerald-600"/> {t('quiz.title')}
                </h1>
            </div>

            {/* 右側：語言切換按鈕 */}
            <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-emerald-600 transition font-medium"
            >
                <FaGlobe />
                <span>{i18n.language.startsWith('zh') ? 'EN' : '中'}</span>
            </button>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-2xl w-full text-center border-t-8 border-yellow-400">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 text-5xl">
                <FaBrain />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{t('quiz.welcome_title')}</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
                {t('quiz.welcome_desc')}
            </p>
            <button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-[1.02]">
                {t('quiz.btn_start')}
            </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const question = currentQuestions[currentIndex];
    const isCorrect = selectedOption === question.answer;

    return (
      <div className="min-h-screen bg-slate-100 py-12 px-6 flex justify-center">
        <div className="w-full max-w-2xl">
            <div className="flex justify-between text-slate-500 font-bold mb-2">
                <span>{t('quiz.question_progress', { current: currentIndex + 1, total: currentQuestions.length })}</span>
                <span>{t('quiz.score_label')} {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}></div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                    {question.question}
                </h3>

                <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border-2 transition font-medium text-slate-700 ";
                        
                        if (showExplanation) {
                            if (opt === question.answer) btnClass += "border-green-500 bg-green-50 text-green-700"; 
                            else if (opt === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700"; 
                            else btnClass += "border-gray-100 opacity-50"; 
                        } else {
                            btnClass += "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"; 
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

            {showExplanation && (
                <div className="animate-fadeIn">
                    <div className={`p-6 rounded-2xl mb-6 flex gap-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="text-2xl mt-1">
                            {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">{isCorrect ? t('quiz.status_correct') : t('quiz.status_wrong')}</h4>
                            <p className="text-sm opacity-90">{question.explanation}</p>
                        </div>
                    </div>
                    <button onClick={nextQuestion} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition">
                        {currentIndex + 1 === currentQuestions.length ? t('quiz.btn_result') : t('quiz.btn_next')}
                    </button>
                </div>
            )}
        </div>
      </div>
    );
  }

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
                        {score} {t('quiz.score_unit')}
                    </h2>
                    <p className="text-slate-500">
                        {score === 100 ? t('quiz.msg_perfect') : score >= 60 ? t('quiz.msg_good') : t('quiz.msg_keep_trying')}
                    </p>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                        {t('quiz.btn_dashboard')}
                    </button>
                    <button onClick={startGame} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                        <FaRedo /> {t('quiz.btn_retry')}
                    </button>
                </div>
            </div>
        </div>
    );
  }
};

export default GreenQuiz;