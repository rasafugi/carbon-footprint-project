// frontend/src/components/Auth/AuthImagePanel.jsx
import React from 'react';
import characterImg from '../../assets/character.png';

// 備用圖片
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?q=80&w=1887&auto=format&fit=crop";

const AuthImagePanel = () => {
  return (
    <div className="hidden md:flex md:w-4/12 bg-gradient-to-br from-emerald-50 to-teal-100 relative items-end justify-center z-20">
        {/* 背景光暈 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl"></div>
        
        {/* 角色圖片 */}
        <img 
            src={characterImg} 
            onError={(e) => e.target.src = PLACEHOLDER_IMG}
            alt="Character" 
            // 這裡保留我們調整後的最佳位置 right-[-6%]
            className="absolute bottom-0 right-[-3%] h-[95%] w-auto object-contain drop-shadow-2xl pointer-events-none"
        />
    </div>
  );
};

export default AuthImagePanel;