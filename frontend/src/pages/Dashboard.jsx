import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ✨ 引入
import {
    FaRocket, FaChartLine, FaSignOutAlt, FaArrowRight,
    FaHistory, FaMapMarkedAlt, FaBrain, FaLeaf, FaQuoteLeft, FaHome
} from 'react-icons/fa';
import bgImage from '../assets/dashboard-bg.jpg'; 

const Dashboard = ({ user, onLogout }) => {
  const { t } = useTranslation(); // ✨ 使用 hook
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  // 新增：記錄卡片點擊時的座標與目標位置
  const [cardPos, setCardPos] = useState({ top: 0, height: 0 });

  // 處理卡片點擊 (包含邊界偵測與自動歸位邏輯)
  const handleCardClick = (card, e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const navbarHeight = 85; 
      const padding = 20;

      let targetTop = rect.top;
      if (targetTop < navbarHeight + padding) {
          targetTop = navbarHeight + padding;
      }
      if (targetTop + rect.height > screenHeight - padding) {
          targetTop = screenHeight - rect.height - padding;
      }

      setCardPos({ 
          initialTop: rect.top,
          targetTop: targetTop,
          height: rect.height,
          width: rect.width
      });
      setActiveCard(card);
  };

  const handleOverlayClick = () => setActiveCard(null);
  const handleNavigate = (link) => {
      navigate(link);
      setActiveCard(null);
  };

  // 1. 功能卡片資料 (文字部分已替換為 t() 函式)
  const cardsData = [
      {
          id: 'quick',
          title: t('dashboard.cards.quick.title'),
          subtitle: 'Quick Estimate',
          usage: t('dashboard.cards.quick.usage'),
          philosophy: t('dashboard.cards.quick.philosophy'),
          icon: <FaRocket />,
          link: '/quick-estimate',
          img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop', 
          theme: 'emerald'
      },
      {
          id: 'detailed',
          title: t('dashboard.cards.detailed.title'),
          subtitle: 'Detailed Analysis',
          usage: t('dashboard.cards.detailed.usage'),
          philosophy: t('dashboard.cards.detailed.philosophy'),
          icon: <FaChartLine />,
          link: '/detailed-analysis',
          img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', 
          theme: 'blue'
      },
      {
          id: 'history',
          title: t('dashboard.cards.history.title'),
          subtitle: 'Track History',
          usage: t('dashboard.cards.history.usage'),
          philosophy: t('dashboard.cards.history.philosophy'),
          icon: <FaHistory />,
          link: '/history',
          img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop', 
          theme: 'indigo'
      },
      {
          id: 'regional',
          title: t('dashboard.cards.regional.title'),
          subtitle: 'Regional Stats',
          usage: t('dashboard.cards.regional.usage'),
          philosophy: t('dashboard.cards.regional.philosophy'),
          icon: <FaMapMarkedAlt />,
          link: '/regional-stats',
          img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop', 
          theme: 'cyan'
      },
      {
          id: 'quiz',
          title: t('dashboard.cards.quiz.title'),
          subtitle: 'Eco Quiz',
          usage: t('dashboard.cards.quiz.usage'),
          philosophy: t('dashboard.cards.quiz.philosophy'),
          icon: <FaBrain />,
          link: '/green-quiz',
          img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', 
          theme: 'yellow'
      },
  ];

  // 2. 左側敘事內容 (文字部分已替換為 t() 函式)
  const leftNarrativeData = [
      {
          id: 'vision',
          title: t('dashboard.narrative.vision.title'),
          text: t('dashboard.narrative.vision.text'),
          img: 'https://images.unsplash.com/photo-1466027397211-20d0d29863e3?q=80&w=1000&auto=format&fit=crop'
      },
      {
          id: 'action',
          title: t('dashboard.narrative.action.title'),
          text: t('dashboard.narrative.action.text'),
          img: 'https://images.unsplash.com/photo-1502086223501-600070ed5b4d?q=80&w=1000&auto=format&fit=crop'
      },
      {
          id: 'impact',
          title: t('dashboard.narrative.impact.title'),
          text: t('dashboard.narrative.impact.text'),
          img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop'
      }
  ];

  const carouselItems = [...cardsData, ...cardsData];

  const getThemeColor = (theme) => {
      const colors = {
          emerald: 'border-emerald-400 text-emerald-300 hover:bg-emerald-600 hover:border-emerald-500',
          blue: 'border-blue-400 text-blue-300 hover:bg-blue-600 hover:border-blue-500',
          indigo: 'border-indigo-400 text-indigo-300 hover:bg-indigo-600 hover:border-indigo-500',
          cyan: 'border-cyan-400 text-cyan-300 hover:bg-cyan-600 hover:border-cyan-500',
          yellow: 'border-yellow-400 text-yellow-300 hover:bg-yellow-600 hover:border-yellow-500',
      };
      return colors[theme] || colors.emerald;
  };

  // 右側輪播的小卡片組件
  const CarouselCardItem = ({ data, onClick }) => (
      <div 
          onClick={onClick}
          className="relative h-[25vh] rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/20 flex-shrink-0"
      >
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${data.img})` }}></div>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-3 text-white">
                  <span className="text-xl">{data.icon}</span>
                  <span className="font-bold text-sm tracking-wider">{data.title}</span>
              </div>
          </div>
      </div>
  );

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden font-sans bg-slate-900"
        style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900/90 z-0"></div>

      {/* Navbar */}
      <nav className="relative z-20 px-8 py-5 flex justify-between items-center border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-emerald-500/20 p-2 rounded-full group-hover:bg-emerald-500/40 transition">
                <FaLeaf className="text-emerald-400 text-2xl"/>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">CarbonTrace</h1>
        </div>
        <div className="flex items-center gap-6 text-white/80">
            <span className="font-medium hidden md:inline tracking-wider">Hi, {user?.fullName}</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                {t('dashboard.member_center')}
            </span>
            
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-white transition opacity-70 hover:opacity-100">
                <FaHome /> <span className="text-sm">{t('dashboard.home')}</span>
            </button>

            <button onClick={onLogout} className="flex items-center gap-2 hover:text-white transition opacity-70 hover:opacity-100">
                <FaSignOutAlt /> <span className="text-sm">{t('dashboard.logout')}</span>
            </button>
        </div>
      </nav>

      {/* 主要佈局 */}
      <div className="relative z-10 flex h-[calc(100vh-85px)]">
         
         {/* 左側 (70%) */}
         <div className="w-full lg:w-[70%] h-full overflow-y-auto no-scrollbar px-6 py-10 lg:px-16 xl:px-24">
             
             {/* 頁面標題 */}
             <div className="mb-12 animate-fade-in-up">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                    <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">DASHBOARD</span>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4">
                     {t('dashboard.main_title_1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200"> {t('dashboard.main_title_2')}</span>
                 </h2>
                 <p className="text-slate-400 text-lg max-w-2xl">
                     {t('dashboard.main_desc')}
                 </p>
             </div>

             {/* 左側敘事卡片列表 */}
             <div className="space-y-12 pb-20">
                 {cardsData.map((card, idx) => (
                     <div 
                        key={card.id}
                        className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/50 hover:shadow-emerald-900/20"
                     >
                         <div className="flex flex-col md:flex-row h-full">
                             
                             {/* 圖片區塊 */}
                             <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                                 <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${card.img})` }}
                                 ></div>
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-l"></div>
                                 <div className="absolute top-4 left-4 font-mono text-6xl font-bold text-white/10 select-none">
                                     0{idx + 1}
                                 </div>
                             </div>

                             {/* 內容區塊 */}
                             <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                 <div className="flex items-center gap-3 mb-2">
                                     <span className={`text-2xl ${card.theme === 'emerald' ? 'text-emerald-400' : card.theme === 'blue' ? 'text-blue-400' : card.theme === 'indigo' ? 'text-indigo-400' : card.theme === 'cyan' ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                         {card.icon}
                                     </span>
                                     <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">{card.subtitle}</span>
                                 </div>
                                 
                                 <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                                     {card.title}
                                 </h3>

                                 <div className="space-y-4 mb-8">
                                     <div>
                                         <h4 className="text-slate-300 font-bold text-sm mb-1 flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('dashboard.label_usage')}
                                         </h4>
                                         <p className="text-slate-400 text-sm leading-relaxed pl-3.5 border-l border-white/10">
                                             {card.usage}
                                         </p>
                                     </div>
                                     <div>
                                         <h4 className="text-slate-300 font-bold text-sm mb-1 flex items-center gap-2">
                                             <FaQuoteLeft className="text-emerald-500/50 text-xs"/> {t('dashboard.label_philosophy')}
                                         </h4>
                                         <p className="text-slate-400 text-sm leading-relaxed italic pl-3.5">
                                             {card.philosophy}
                                         </p>
                                     </div>
                                 </div>

                                 <button 
                                    onClick={() => handleNavigate(card.link)}
                                    className={`
                                        w-fit flex items-center gap-2 px-6 py-2.5 rounded-full border bg-transparent text-sm font-bold tracking-wide transition-all duration-300
                                        ${getThemeColor(card.theme)} group-hover:text-white
                                    `}
                                 >
                                     {t('dashboard.btn_enter')} <FaArrowRight />
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* 右側 (30%) */}
         <div className="hidden lg:flex lg:w-[30%] h-full relative overflow-hidden bg-black/30 backdrop-blur-md border-l border-white/5 flex-col">
             <div className="absolute top-0 w-full p-6 z-20 bg-gradient-to-b from-black/80 to-transparent text-center">
                 <p className="text-white/50 text-xs tracking-[0.2em] font-light">{t('dashboard.feature_gallery')}</p>
             </div>
             <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>

             <div className={`w-full animate-scroll-up ${activeCard ? 'paused' : ''}`}>
                {carouselItems.map((card, index) => (
                    <div key={`${card.id}-${index}`} className="px-6 pb-6">
                        <CarouselCardItem 
                            data={card} 
                            onClick={(e) => handleCardClick(card, e)}
                        />
                    </div>
                ))}
             </div>
         </div>
      </div>

      {/* 側邊延伸展開卡片 */}
      {activeCard && (
        <>
            <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={handleOverlayClick}
            ></div>

            <div 
                className="fixed z-50 right-0 shadow-2xl overflow-hidden flex transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                    top: cardPos.targetTop,
                    height: cardPos.height,
                    width: 'min(700px, 90vw)', 
                    right: 'max(20px, calc(15% - 20px))', 
                    borderRadius: '24px',
                }}
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${activeCard.img})` }}
                ></div>
                <div className="absolute inset-0 bg-slate-900/90"></div>

                <div className="relative z-10 w-full h-full flex items-center p-8 gap-8">
                    <div className="flex flex-col items-center justify-center w-1/3 border-r border-white/10 pr-8 h-full">
                        <div className={`
                            w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg
                            ${activeCard.theme === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 
                              activeCard.theme === 'blue' ? 'bg-blue-500/20 text-blue-400' : 
                              activeCard.theme === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' : 
                              activeCard.theme === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : 
                              'bg-yellow-500/20 text-yellow-400'}
                        `}>
                            {activeCard.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white text-center leading-tight">
                            {activeCard.title}
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full py-2 animate-fade-in-right">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    {t('dashboard.tool_info')}
                                </span>
                            </div>
                            
                            <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <FaLeaf /> {t('dashboard.label_usage')}
                            </h4>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                {activeCard.usage}
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                            <span className="text-slate-500 text-sm">{t('dashboard.label_ready')}</span>
                            <button 
                                onClick={() => handleNavigate(activeCard.link)}
                                className={`
                                    flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg
                                    ${activeCard.theme === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500' : 
                                      activeCard.theme === 'blue' ? 'bg-blue-600 hover:bg-blue-500' : 
                                      activeCard.theme === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-500' : 
                                      activeCard.theme === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-500' : 
                                      'bg-yellow-600 hover:bg-yellow-500'}
                                `}
                            >
                                {t('dashboard.btn_open')} <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;