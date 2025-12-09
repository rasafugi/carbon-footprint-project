// frontend/src/components/Auth/AuthImagePanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 引入動畫組件

// 引入兩張不同的角色圖片
// 請確保你的 assets 資料夾中有這兩張圖，或修改為正確的檔名
import characterImgLogin from '../../assets/character-01.png';
import characterImgRegister from '../../assets/character-02.png';

// 備用圖片
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?q=80&w=1887&auto=format&fit=crop";

// 接收 isLoginView prop 來判斷顯示哪張圖
const AuthImagePanel = ({ isLoginView }) => {
  
  // 根據狀態決定要顯示的圖片
  const currentImage = isLoginView ? characterImgLogin : characterImgRegister;

  // 根據狀態決定圖片的定位偏移
  // 登入時在左側，圖片靠右偏移 (right-[-6%])
  // 註冊時在右側，圖片靠左偏移 (left-[-6%])
  const positionClass = isLoginView ? "right-[-6%]" : "left-[-6%]";

  // 定義圖片切換的動畫效果
  const imageVariants = {
    enter: (isLogin) => ({
      x: isLogin ? -50 : 50, // 登入圖從左飛入，註冊圖從右飛入
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (isLogin) => ({
      zIndex: 0,
      x: isLogin ? 50 : -50, // 登入圖往右飛出，註冊圖往左飛出
      opacity: 0,
    }),
  };

  return (
    // 外層 div 不需要是 motion.div，因為 layout 動畫由 AuthModal 控制
    <div className="hidden md:flex w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 relative items-end justify-center overflow-hidden rounded-3xl">
        {/* 背景光暈 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl"></div>
        
        {/* 使用 AnimatePresence 實現圖片切換動畫 */}
        <AnimatePresence mode='wait' custom={isLoginView}>
            <motion.img 
                key={isLoginView ? 'login' : 'register'} // 設定唯一的 key 以觸發切換動畫
                src={currentImage} 
                onError={(e) => e.target.src = PLACEHOLDER_IMG}
                alt="Character" 
                
                // 應用動畫變數
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={isLoginView}
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }}

                // 動態應用位置樣式
                className={`absolute bottom-0 ${positionClass} h-[95%] w-auto object-contain drop-shadow-2xl pointer-events-none`}
            />
        </AnimatePresence>
    </div>
  );
};

export default AuthImagePanel;