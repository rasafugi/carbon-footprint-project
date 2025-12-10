import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaCarSide, FaUtensils, FaShoppingBag, FaRecycle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件
import SectionTitle from './SectionTitle';

// 引入背景圖片
import moduleAImg from '../../assets/modules-A.png';
import moduleBImg from '../../assets/modules-B.png';
import moduleCImg from '../../assets/modules-C.png';
import moduleDImg from '../../assets/modules-D.png';
import moduleEImg from '../../assets/modules-E.png';

const FeaturesSection = () => {
  const { t } = useTranslation();

  // 定義初始狀態
  const [activeIndex, setActiveIndex] = useState(2);
  
  // ✨ 新增：防連點狀態 (避免一次跳兩張)
  const [isAnimating, setIsAnimating] = useState(false);

  // 定義功能模組資料
  const modulesConfig = [
    { id: "A", icon: <HiLightBulb />, img: moduleAImg, color: "text-yellow-600" },
    { id: "B", icon: <FaCarSide />, img: moduleBImg, color: "text-blue-600" },
    { id: "C", icon: <FaUtensils />, img: moduleCImg, color: "text-red-600" },
    { id: "D", icon: <FaShoppingBag />, img: moduleDImg, color: "text-purple-600" },
    { id: "E", icon: <FaRecycle />, img: moduleEImg, color: "text-green-600" },
  ];

  // ✨ 優化：切換邏輯 (加入防連點與事件阻擋)
  const handleNext = (e) => {
    // 阻止事件冒泡 (防止點擊穿透)
    if (e) e.stopPropagation();
    
    // 如果正在動畫中，則忽略點擊
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % modulesConfig.length);
    
    // 500ms 後解鎖 (配合動畫時間)
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + modulesConfig.length) % modulesConfig.length);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  // 拖曳結束處理
  const onDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 50;

    // 拖曳也需要防連點檢查
    if (isAnimating) return;

    if (offset < -threshold || velocity < -500) {
      handleNext(); // 這裡不需要傳 e，因為 handleNext 有處理 if(e)
    } else if (offset > threshold || velocity > 500) {
      handlePrev();
    }
  };

  // 計算卡片樣式
  const getCardStyle = (index) => {
    const total = modulesConfig.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > 2) offset -= total;

    const isActive = offset === 0;
    const isNeighbor = Math.abs(offset) === 1;
    
    return {
      x: offset * (window.innerWidth < 768 ? 60 : 260), 
      scale: isActive ? 1.1 : isNeighbor ? 0.8 : 0.6,
      zIndex: 50 - Math.abs(offset) * 10,
      opacity: isActive ? 1 : isNeighbor ? 0.7 : 0.4,
      rotateY: offset * -5,
      filter: isActive ? 'blur(0px)' : 'blur(2px)',
    };
  };

  return (
    <section id="features" className="py-20 bg-slate-100 overflow-hidden min-h-[800px] flex flex-col justify-center">
      
      {/* 標題層級 z-[60] */}
      <div className="container mx-auto px-6 mb-10 relative z-[60]">
        <SectionTitle title={t('features.section_title')} subtitle={true} />
        <p className="text-center text-slate-600 max-w-2xl mx-auto">
          {t('features.subtitle')}
        </p>
      </div>

      {/* --- 輪播容器 --- */}
      <div className="relative w-full h-[450px] flex justify-center items-center perspective-1000">
        
        <button 
            onClick={handlePrev} 
            // 加入 disabled 樣式，讓使用者知道現在不能點
            disabled={isAnimating}
            className={`absolute left-4 md:left-20 z-[60] p-4 bg-white/80 rounded-full shadow-lg transition text-slate-600 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'}`}
        >
            <FaChevronLeft size={24} />
        </button>

        <button 
            onClick={handleNext} 
            disabled={isAnimating}
            className={`absolute right-4 md:right-20 z-[60] p-4 bg-white/80 rounded-full shadow-lg transition text-slate-600 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110'}`}
        >
            <FaChevronRight size={24} />
        </button>

        <AnimatePresence mode='popLayout'>
            {modulesConfig.map((mod, index) => {
                const style = getCardStyle(index);
                const points = t(`features.modules.${mod.id}.points`, { returnObjects: true });
                const title = t(`features.modules.${mod.id}.title`);
                const isCenter = style.zIndex === 50; 

                return (
                    <motion.div
                        key={mod.id}
                        // 修正：只允許中間卡片被拖曳
                        drag={isCenter ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={onDragEnd}
                        animate={{
                            x: style.x,
                            scale: style.scale,
                            zIndex: style.zIndex,
                            opacity: style.opacity,
                            rotateY: style.rotateY,
                            filter: style.filter
                        }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                        onClick={() => { 
                            if (!isCenter && !isAnimating) {
                                setIsAnimating(true);
                                setActiveIndex(index);
                                setTimeout(() => setIsAnimating(false), 500);
                            }
                        }}
                        className={`absolute w-[280px] md:w-[350px] bg-white rounded-3xl shadow-2xl border-2 border-white flex flex-col overflow-hidden
                            ${isCenter ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                        `}
                        style={{ 
                            height: isCenter ? '450px' : '380px',
                            backgroundImage: `url(${mod.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* 遮罩 */}
                        <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${isCenter ? 'bg-white/85' : 'bg-white/60'}`}></div>

                        <div className={`relative z-10 p-6 flex flex-col items-center text-center transition-all ${isCenter ? 'justify-start pt-8 flex-shrink-0' : 'h-full justify-center'}`}>
                            <div className={`text-5xl mb-4 drop-shadow-md bg-white p-4 rounded-full shadow-sm ${mod.color}`}>
                                {mod.icon}
                            </div>
                            <h4 className="font-bold text-lg opacity-80 text-slate-800">Module {mod.id}</h4>
                            <h3 className="font-extrabold text-2xl leading-tight px-2 text-slate-900">{title}</h3>
                        </div>

                        {/* 下半部 */}
                        <motion.div 
                            // ✨ 修改處：加入 y (位移) 控制，並設定 transition
                            animate={{ 
                                opacity: isCenter ? 1 : 0, 
                                height: isCenter ? 'auto' : 0,
                                y: isCenter ? 0 : 20 // 未顯示時向下偏移 20px，顯示時歸零 (產生上浮效果)
                            }}
                            transition={{ 
                                duration: 0.4, // 動畫時間
                                ease: "easeOut",
                                delay: isCenter ? 0.2 : 0 // ✨ 關鍵：變成中間卡片時，延遲 0.2 秒才顯示文字
                            }}
                            className="relative z-10 px-6 pb-6 flex-1 flex flex-col justify-center min-h-0 bg-white w-full"
                        >
                            <ul className="space-y-3 w-full">
                                {Array.isArray(points) && points.map((point, idx) => (
                                    <li key={idx} className="flex items-center justify-center gap-2 text-slate-800 text-sm font-medium leading-relaxed text-center">
                                        <FaLeaf className="text-emerald-600 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        
                        {/* 暗色遮罩 */}
                        {!isCenter && (
                             <div className="absolute inset-0 bg-white/40 hover:bg-transparent transition-colors z-20"></div>
                        )}
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 mt-16 relative z-[60]">
        {modulesConfig.map((_, idx) => (
            <button
                key={idx}
                onClick={() => {
                    if (!isAnimating) {
                        setIsAnimating(true);
                        setActiveIndex(idx);
                        setTimeout(() => setIsAnimating(false), 500);
                    }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'bg-emerald-600 w-8' : 'bg-slate-300 hover:bg-emerald-400'
                }`}
            />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;