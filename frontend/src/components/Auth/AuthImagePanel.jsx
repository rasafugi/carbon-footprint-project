import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 請確認你的 assets 資料夾內有這兩張圖片
// 如果檔名不同，請自行修改
import characterImgLogin from '../../assets/character-01.png';
import characterImgRegister from '../../assets/character-02.png';

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?q=80&w=1887&auto=format&fit=crop";

const AuthImagePanel = ({ isLoginView }) => {
  const currentImage = isLoginView ? characterImgLogin : characterImgRegister;
  
  // 圖片位置微調：讓圖片稍微超出邊界，製造立體感 (手搭在表單上)
  // 登入時在左側 (圖往右偏)，註冊時在右側 (圖往左偏)
  const positionClass = isLoginView ? "right-[-3%]" : "left-[-9%]";

  // 動態圓角設定：只讓「外側」的角變圓，中間接縫處變直角
  const radiusClass = isLoginView ? "md:rounded-l-3xl md:rounded-r-none" : "md:rounded-r-3xl md:rounded-l-none";

  const imageVariants = {
    enter: (isLogin) => ({ x: isLogin ? -50 : 50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (isLogin) => ({ zIndex: 0, x: isLogin ? 50 : -50, opacity: 0 }),
  };

  return (
    // 移除 transition-all，讓 Framer Motion 全權接管動畫
    <motion.div 
        layout 
        className={`hidden md:flex w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 relative items-end justify-center ${radiusClass} overflow-visible`}
    >
        {/* 背景光暈 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl"></div>
        
        {/* 圖片切換動畫 */}
        <AnimatePresence mode='wait' custom={isLoginView}>
            <motion.img 
                key={isLoginView ? 'login' : 'register'}
                src={currentImage} 
                onError={(e) => e.target.src = PLACEHOLDER_IMG}
                alt="Character" 
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={isLoginView}
                transition={{ x: { type: "spring", stiffness: 450, damping: 30 }, opacity: { duration: 0.2 } }}
                // z-50 確保圖片在最上層，蓋過表單邊緣
                className={`absolute bottom-0 ${positionClass} h-[100%] w-auto object-contain drop-shadow-2xl pointer-events-none z-50`}
            />
        </AnimatePresence>
    </motion.div>
  );
};

export default AuthImagePanel;