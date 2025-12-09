import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaCarSide, FaUtensils, FaShoppingBag, FaRecycle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件
import SectionTitle from './SectionTitle';

const FeaturesSection = () => {
  const { t } = useTranslation();

  // 1. 定義初始狀態：預設中間顯示的是索引 2 (Module C)
  const [activeIndex, setActiveIndex] = useState(2);

  // 定義功能模組資料
  const modulesConfig = [
    { id: "A", icon: <HiLightBulb />, color: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600" },
    { id: "B", icon: <FaCarSide />, color: "from-blue-50 to-blue-100 border-blue-200 text-blue-600" },
    { id: "C", icon: <FaUtensils />, color: "from-red-50 to-red-100 border-red-200 text-red-600" },
    { id: "D", icon: <FaShoppingBag />, color: "from-purple-50 to-purple-100 border-purple-200 text-purple-600" },
    { id: "E", icon: <FaRecycle />, color: "from-green-50 to-green-100 border-green-200 text-green-600" },
  ];

  // 2. 處理切換邏輯 (循環播放)
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % modulesConfig.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + modulesConfig.length) % modulesConfig.length);
  };

  // 3. 計算每張卡片的位置樣式
  const getCardStyle = (index) => {
    const total = modulesConfig.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > 2) offset -= total; // 將 3, 4 轉換為 -2, -1

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
      <div className="container mx-auto px-6 mb-10">
        <SectionTitle title={t('features.section_title')} subtitle={true} />
        <p className="text-center text-slate-600 max-w-2xl mx-auto">
          {t('features.subtitle')}
        </p>
      </div>

      {/* --- 輪播容器 --- */}
      <div className="relative w-full h-[450px] flex justify-center items-center perspective-1000">
        
        {/* 左箭頭按鈕 */}
        <button 
            onClick={handlePrev} 
            className="absolute left-4 md:left-20 z-50 p-4 bg-white/80 rounded-full shadow-lg hover:bg-white hover:scale-110 transition text-slate-600"
        >
            <FaChevronLeft size={24} />
        </button>

        {/* 右箭頭按鈕 */}
        <button 
            onClick={handleNext} 
            className="absolute right-4 md:right-20 z-50 p-4 bg-white/80 rounded-full shadow-lg hover:bg-white hover:scale-110 transition text-slate-600"
        >
            <FaChevronRight size={24} />
        </button>

        {/* 卡片渲染 */}
        <AnimatePresence mode='popLayout'>
            {modulesConfig.map((mod, index) => {
                const style = getCardStyle(index);
                const points = t(`features.modules.${mod.id}.points`, { returnObjects: true });
                const title = t(`features.modules.${mod.id}.title`);
                const isCenter = style.zIndex === 50; // 是否為中間那張

                return (
                    <motion.div
                        key={mod.id}
                        animate={{
                            x: style.x,
                            scale: style.scale,
                            zIndex: style.zIndex,
                            opacity: style.opacity,
                            rotateY: style.rotateY,
                            filter: style.filter
                        }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                        onClick={() => setActiveIndex(index)}
                        className={`absolute w-[280px] md:w-[350px] bg-gradient-to-br ${mod.color} bg-white rounded-3xl shadow-2xl border-2 cursor-pointer flex flex-col overflow-hidden`}
                        style={{ 
                            height: isCenter ? '450px' : '380px', // 將中間卡片高度稍微加高一點點，確保空間足夠
                        }}
                    >
                        {/* ★ 關鍵修改處 ★
                           1. 移除 h-1/3，改為 flex-shrink-0 (防止被壓縮)
                           2. 如果是中間卡片 (isCenter)：使用 justify-start pt-8 (靠上對齊，給予頂部空間)
                           3. 如果是旁邊卡片 (!isCenter)：使用 h-full justify-center (垂直置中)
                        */}
                        <div className={`p-6 flex flex-col items-center text-center transition-all ${isCenter ? 'justify-start pt-8 flex-shrink-0' : 'h-full justify-center'}`}>
                            <div className="text-5xl mb-4 drop-shadow-md bg-white p-4 rounded-full shadow-sm">
                                {mod.icon}
                            </div>
                            <h4 className="font-bold text-lg opacity-80">Module {mod.id}</h4>
                            <h3 className="font-extrabold text-2xl leading-tight px-2">{title}</h3>
                        </div>

                        {/* 卡片下半部：詳細內容 */}
                        <motion.div 
                            animate={{ opacity: isCenter ? 1 : 0, height: isCenter ? 'auto' : 0 }}
                            // 使用 flex-1 讓它自動填滿剩下的空間，min-h-0 防止溢出
                            className="px-6 pb-8 bg-white/60 backdrop-blur-sm flex-1 flex flex-col justify-center min-h-0"
                        >
                            <ul className="space-y-3 text-left">
                                {Array.isArray(points) && points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm font-medium leading-relaxed">
                                        <FaLeaf className="text-emerald-500 mt-1 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        
                        {/* 非中間卡片的遮罩 */}
                        {!isCenter && (
                             <div className="absolute inset-0 bg-white/30 hover:bg-transparent transition-colors"></div>
                        )}
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      {/* 底部指示點 */}
      <div className="flex justify-center gap-3 mt-8">
        {modulesConfig.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
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