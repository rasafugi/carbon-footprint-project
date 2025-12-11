import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaRocket, FaChartLine, FaSignOutAlt,
    FaHistory, FaMapMarkedAlt, FaBrain, FaLeaf
} from 'react-icons/fa';
// 背景底圖 (整個網頁的背景)
import bgImage from '../assets/dashboard-bg.jpg'; 

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  // 定義功能卡片資料 (新增 img 欄位)
  // 這裡使用 Unsplash 連結作為範例，你可以換成 assets 裡的圖片
  const cardsData = [
      {
          id: 'quick',
          title: '快速估算版',
          desc: '30 秒完成，回答生活選擇題，立即取得概況。',
          icon: <FaRocket />,
          link: '/quick-estimate',
          img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1000&auto=format&fit=crop', // 範例圖：火箭/速度
          theme: 'emerald'
      },
      {
          id: 'detailed',
          title: '詳細分析版',
          desc: '輸入電費、里程等精確數據，產出研究級報告。',
          icon: <FaChartLine />,
          link: '/detailed-analysis',
          img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', // 範例圖：數據/分析
          theme: 'blue'
      },
      {
          id: 'history',
          title: '歷史紀錄',
          desc: '查看過往的計算結果與減碳追蹤。',
          icon: <FaHistory />,
          link: '/history',
          img: 'https://images.unsplash.com/photo-1501139083538-0139583c61cf?q=80&w=1000&auto=format&fit=crop', // 範例圖：時間/時鐘
          theme: 'indigo'
      },
      {
          id: 'regional',
          title: '區域數據地圖',
          desc: '探索台灣各縣市的碳排大數據與排名。',
          icon: <FaMapMarkedAlt />,
          link: '/regional-stats',
          img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', // 範例圖：地圖/地球
          theme: 'cyan'
      },
      {
          id: 'quiz',
          title: '綠能智商測驗',
          desc: '挑戰環保知識，累積積分成為減碳達人。',
          icon: <FaBrain />,
          link: '/green-quiz',
          img: 'https://images.unsplash.com/photo-1497250681960-ef04efc29080?q=80&w=1000&auto=format&fit=crop', // 範例圖：植物/知識
          theme: 'yellow'
      },
  ];

  // 複製一份列表以實現無縫輪播 (5 + 5 = 10 張卡片)
  const carouselItems = [...cardsData, ...cardsData];

  // 卡片點擊
  const handleCardClick = (card) => setActiveCard(card);
  
  // 遮罩點擊 (關閉)
  const handleOverlayClick = () => setActiveCard(null);
  
  // 導航
  const handleNavigate = (link) => {
      navigate(link);
      setActiveCard(null);
  };

  // 卡片組件
  const CardItem = ({ data, onClick, isActiveMode = false }) => {
    return (
      <div 
          onClick={onClick}
          className={`
            relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group
            transition-all duration-500 ease-out border border-white/20
            ${isActiveMode ? 'w-full h-full' : 'w-full h-[28vh] mx-0 my-0'} 
            /* h-[28vh] 確保大概 3.5 張卡片填滿螢幕，不會有空隙 */
          `}
      >
          {/* 卡片背景圖 */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${data.img})` }}
          ></div>

          {/* 漸層遮罩 (讓文字看得到) */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent ${isActiveMode ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'} transition-opacity duration-300`}></div>

          {/* 內容區 */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white z-10">
              <div className={`
                  mb-4 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 
                  text-2xl flex items-center justify-center
                  shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  ${isActiveMode ? 'w-20 h-20 text-4xl' : 'w-14 h-14'}
              `}>
                  {data.icon}
              </div>
              
              <h3 className={`${isActiveMode ? 'text-4xl' : 'text-2xl'} font-bold mb-2 text-shadow`}>
                  {data.title}
              </h3>
              
              {/* 在輪播模式下，只顯示簡短文字；放大模式顯示完整 */}
              <p className={`text-gray-200 font-light leading-relaxed ${isActiveMode ? 'text-lg' : 'text-sm line-clamp-2'}`}>
                  {data.desc}
              </p>

              {isActiveMode && (
                  <div className="mt-8 flex items-center gap-2 text-emerald-400 font-bold animate-pulse">
                      點擊進入功能 <FaRocket />
                  </div>
              )}
          </div>
      </div>
    );
  };

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden font-sans"
        style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 全域背景遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40 z-0"></div>

      {/* Navbar */}
      <nav className="relative z-20 px-8 py-5 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-emerald-500/20 p-2 rounded-full group-hover:bg-emerald-500/40 transition">
                <FaLeaf className="text-emerald-400 text-2xl"/>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">CarbonTrace</h1>
        </div>
        <div className="flex items-center gap-6 text-white/80">
            <span className="font-medium hidden md:inline tracking-wider">Hi, {user?.fullName}</span>
            <button onClick={onLogout} className="flex items-center gap-2 hover:text-white transition opacity-70 hover:opacity-100">
                <FaSignOutAlt /> <span className="text-sm">登出</span>
            </button>
        </div>
      </nav>

      {/* 主要佈局 */}
      <div className="relative z-10 flex h-[calc(100vh-85px)]">
         
         {/* 左側：文案區 */}
         <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 text-white">
             <div className="bg-emerald-500/10 w-fit px-4 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-sm font-bold mb-6 backdrop-blur-md">
                 🌍 2025 淨零轉型計畫
             </div>
             <h2 className="text-5xl xl:text-7xl font-extrabold leading-tight mb-8">
                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">你的淨零生活</span>
                 <span className="block text-emerald-400">從這裡開始</span>
             </h2>
             <p className="text-lg xl:text-xl text-slate-300 max-w-xl leading-relaxed">
                 探索個人碳足跡，掌握數據，參與綠能行動。<br/>
                 每一個選擇，都在為地球減壓。
             </p>
         </div>

         {/* 右側：滿版輪播容器 */}
         <div className="w-full lg:w-[500px] xl:w-[600px] h-full relative overflow-hidden bg-black/20 backdrop-blur-sm border-l border-white/5">
             
             {/* 頂部與底部遮罩 (讓捲動更柔和) */}
             <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/80 to-transparent z-20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent z-20 pointer-events-none"></div>

             {/* 捲動軌道 */}
             <div className={`w-full h-full px-6 flex flex-col animate-scroll-up ${activeCard ? 'paused' : ''}`}>
                {carouselItems.map((card, index) => (
                    // 外層容器用來控制卡片間距 (padding-bottom)
                    <div key={`${card.id}-${index}`} className="w-full pb-6 flex-shrink-0"> 
                        <CardItem 
                            data={card} 
                            onClick={() => handleCardClick(card)}
                        />
                    </div>
                ))}
             </div>
         </div>
      </div>

      {/* 中央放大卡片遮罩 */}
      <div 
          className={`
            fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4
            transition-all duration-500
            ${activeCard ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
          onClick={handleOverlayClick}
      >
          {activeCard && (
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="w-full max-w-lg aspect-[4/5] relative animate-fadeInUp"
            >
                {/* 這裡複用 CardItem，但開啟 isActiveMode 模式 */}
                <CardItem 
                    data={activeCard} 
                    onClick={() => handleNavigate(activeCard.link)}
                    isActiveMode={true}
                />
            </div>
          )}
      </div>

    </div>
  );
};

export default Dashboard;