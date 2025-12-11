import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaRocket, FaChartLine, FaSignOutAlt, FaArrowRight,
    FaHistory, FaMapMarkedAlt, FaBrain, FaLeaf, FaQuoteLeft, FaHome
} from 'react-icons/fa';
// 網站主背景圖
import bgImage from '../assets/dashboard-bg.jpg'; 

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  // 新增：記錄卡片點擊時的座標與目標位置
  const [cardPos, setCardPos] = useState({ top: 0, height: 0 });

  // 修改：處理卡片點擊 (包含邊界偵測與自動歸位邏輯)
  const handleCardClick = (card, e) => {
      // 1. 取得點擊當下卡片的螢幕座標
      const rect = e.currentTarget.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const navbarHeight = 85; // 扣掉上方 Navbar 大約高度
      const padding = 20;      // 上下保留一點邊距

      // 2. 計算「理想」的顯示位置 (Clamp 邏輯)
      // 如果卡片太靠上 (被切到)，就往下移；太靠下，就往上移
      let targetTop = rect.top;
      
      // 上邊界檢查 (Navbar 下方)
      if (targetTop < navbarHeight + padding) {
          targetTop = navbarHeight + padding;
      }
      // 下邊界檢查 (螢幕底部)
      if (targetTop + rect.height > screenHeight - padding) {
          targetTop = screenHeight - rect.height - padding;
      }

      // 3. 設定狀態，觸發動畫
      setCardPos({ 
          initialTop: rect.top, // 原始位置 (用於動畫起點)
          targetTop: targetTop, // 修正後位置 (用於動畫終點)
          height: rect.height,
          width: rect.width
      });
      setActiveCard(card);
  };

  // ==========================================
  // 1. 功能卡片資料 (包含深度文案與獨立圖片)
  // ==========================================
  const cardsData = [
      {
          id: 'quick',
          title: '快速估算版',
          subtitle: 'Quick Estimate',
          // 設計初衷與用途
          usage: '適合生活忙碌的現代人。僅需 30 秒，回答 3 個生活選擇題，立即取得您的年度碳排概況。',
          philosophy: '我們相信「門檻低」是改變的第一步。不需翻找帳單，從大方向建立您的碳直覺。',
          icon: <FaRocket />,
          link: '/quick-estimate',
          // 圖片：起跑/速度/衝刺
          img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop', 
          theme: 'emerald'
      },
      {
          id: 'detailed',
          title: '詳細分析版',
          subtitle: 'Detailed Analysis',
          usage: '輸入電費單、瓦斯度數、里程數等精確數據，系統將依據台灣最新係數，產出研究級報告。',
          philosophy: '數據是改變的基石。透過精確盤查 (LCA)，找出隱藏在生活細節中的高碳排熱點。',
          icon: <FaChartLine />,
          link: '/detailed-analysis',
          // 圖片：分析/數據/科技
          img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', 
          theme: 'blue'
      },
      {
          id: 'history',
          title: '歷史紀錄',
          subtitle: 'Track History',
          usage: '您的數位環保存摺。系統自動儲存每一次計算結果，繪製出長期趨勢圖表。',
          philosophy: '減碳不是一時的熱情，而是長期的堅持。看見數據下降的軌跡，是最大的成就感來源。',
          icon: <FaHistory />,
          link: '/history',
          // 圖片：年輪/時間/成長
          img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop', 
          theme: 'indigo'
      },
      {
          id: 'regional',
          title: '區域數據地圖',
          subtitle: 'Regional Stats',
          usage: '大數據儀表板。探索您所在縣市的平均碳排，並與全國平均值進行比較。',
          philosophy: '個人與群體的連結。透過地理資訊，我們能看見城市能源結構的差異，推動在地化的氣候行動。',
          icon: <FaMapMarkedAlt />,
          link: '/regional-stats',
          // 圖片：城市/夜景/網絡
          img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000&auto=format&fit=crop', 
          theme: 'cyan'
      },
      {
          id: 'quiz',
          title: '綠能智商測驗',
          desc: '隨機 10 題環保知識快問快答！挑戰您的綠能知識庫，累積積分成為減碳達人。',
          icon: <FaBrain />,
          link: '/green-quiz',
          // ✨ 修改處：更換為更穩定的圖片 (燈泡/創意)
          img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', 
          theme: 'yellow'
      },
  ];

  // 右側輪播用的陣列 (重複兩次以達成無縫)
  const carouselItems = [...cardsData, ...cardsData];

  // 互動處理
  const handleOverlayClick = () => setActiveCard(null);
  const handleNavigate = (link) => {
      navigate(link);
      setActiveCard(null);
  };

  // 配色輔助工具
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
      {/* 全域深色遮罩 */}
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
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-white transition opacity-70 hover:opacity-100">
                <FaHome /> <span className="text-sm">首頁</span>
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 hover:text-white transition opacity-70 hover:opacity-100">
                <FaSignOutAlt /> <span className="text-sm">登出</span>
            </button>
        </div>
      </nav>

      {/* 主要佈局 */}
      <div className="relative z-10 flex h-[calc(100vh-85px)]">
         
         {/* ========== 左側 (70%)：詳細功能介紹列表 (可滾動) ========== */}
         <div className="w-full lg:w-[70%] h-full overflow-y-auto no-scrollbar px-6 py-10 lg:px-16 xl:px-24">
             
             {/* 頁面標題 */}
             <div className="mb-12 animate-fade-in-up">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                    <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">DASHBOARD</span>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4">
                     選擇您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">減碳行動</span>
                 </h2>
                 <p className="text-slate-400 text-lg max-w-2xl">
                     CarbonTrace 提供全方位的工具，協助您從數據認知到行動改變。請瀏覽下方功能並開始體驗。
                 </p>
             </div>

             {/* 功能卡片列表 */}
             <div className="space-y-12 pb-20">
                 {cardsData.map((card, idx) => (
                     <div 
                        key={card.id}
                        className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/50 hover:shadow-emerald-900/20"
                     >
                         <div className="flex flex-col md:flex-row h-full">
                             
                             {/* 圖片區塊 (佔 40%) */}
                             <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                                 <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${card.img})` }}
                                 ></div>
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-l"></div>
                                 
                                 {/* 序號 */}
                                 <div className="absolute top-4 left-4 font-mono text-6xl font-bold text-white/10 select-none">
                                     0{idx + 1}
                                 </div>
                             </div>

                             {/* 內容區塊 (佔 60%) */}
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
                                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 功能用途
                                         </h4>
                                         <p className="text-slate-400 text-sm leading-relaxed pl-3.5 border-l border-white/10">
                                             {card.usage}
                                         </p>
                                     </div>
                                     <div>
                                         <h4 className="text-slate-300 font-bold text-sm mb-1 flex items-center gap-2">
                                             <FaQuoteLeft className="text-emerald-500/50 text-xs"/> 設計初衷
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
                                     進入功能 <FaArrowRight />
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* ========== 右側 (30%)：視覺輪播導航區 ========== */}
         <div className="hidden lg:flex lg:w-[30%] h-full relative overflow-hidden bg-black/30 backdrop-blur-md border-l border-white/5 flex-col">
             
             {/* 裝飾標題 & 遮罩保持不變 */}
             <div className="absolute top-0 w-full p-6 z-20 bg-gradient-to-b from-black/80 to-transparent text-center">
                 <p className="text-white/50 text-xs tracking-[0.2em] font-light">FEATURE GALLERY</p>
             </div>
             <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>

             {/* ✨✨✨ 關鍵修改處：移除 h-full，改為 h-auto 或不寫高度 ✨✨✨ */}
             {/* 原本是: className={`flex flex-col gap-6 px-6 py-6 h-full ...`} */}
             {/* 修改後如下 (移除了 h-full): */}
             <div className={`flex flex-col gap-6 px-6 py-6 animate-scroll-up ${activeCard ? 'paused' : ''}`}>
                {carouselItems.map((card, index) => (
                    <CarouselCardItem 
                        key={`${card.id}-${index}`} 
                        data={card} 
                        // ✨ 修改處：傳遞 event (e) 給 handleCardClick
                        onClick={(e) => handleCardClick(card, e)}
                    />
                ))}
             </div>
         </div>
      </div>

      {/* 中央放大卡片 (點擊右側輪播時觸發) */}
      {/* 為了保持一致性，這裡顯示同樣的內容，但作為快速預覽 */}
      {/* ========== 新版：側邊延伸展開卡片 ========== */}
      {activeCard && (
        <>
            {/* 1. 全螢幕透明遮罩 (點擊關閉用) */}
            <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={handleOverlayClick}
            ></div>

            {/* 2. 展開的卡片本體 */}
            <div 
                className="fixed z-50 right-0 shadow-2xl overflow-hidden flex transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                    // 初始位置設為右側輪播區的寬度 (約 30%)，展開後變寬 (約 60% ~ 700px)
                    // 使用 fixed 定位，top 動態計算達成「歸位」效果
                    top: cardPos.targetTop,
                    height: cardPos.height,
                    // RWD: 手機版全寬，桌機版從 30% 寬度展開到 700px
                    width: 'min(700px, 90vw)', 
                    right: 'max(20px, calc(15% - 20px))', // 稍微往左位移一點，製造懸浮感
                    borderRadius: '24px',
                }}
            >
                {/* 背景圖與遮罩 */}
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${activeCard.img})` }}
                ></div>
                <div className="absolute inset-0 bg-slate-900/90"></div>

                {/* 內容佈局：左側圖示區 + 右側文字區 */}
                <div className="relative z-10 w-full h-full flex items-center p-8 gap-8">
                    
                    {/* 左側：大圖示 (類似原本卡片的樣子) */}
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

                    {/* 右側：詳細資訊與按鈕 */}
                    <div className="flex-1 flex flex-col justify-between h-full py-2 animate-fade-in-right">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    TOOL INFO
                                </span>
                            </div>
                            
                            <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <FaLeaf /> 功能用途
                            </h4>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                {activeCard.usage}
                            </p>
                        </div>

                        {/* 底部按鈕 */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                            <span className="text-slate-500 text-sm">準備好開始了嗎？</span>
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
                                開啟功能 <FaArrowRight />
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