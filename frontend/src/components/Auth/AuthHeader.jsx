// frontend/src/components/Auth/AuthHeader.jsx
import React from 'react';

const AuthHeader = ({ isLoginView }) => {
  
  // 動態決定圓角樣式
  // 登入視圖 (表單在右): md:rounded-tr-3xl (右上圓角)
  // 註冊視圖 (表單在左): md:rounded-tl-3xl (左上圓角)
  const cornerClass = isLoginView ? 'md:rounded-none md:rounded-tr-3xl' : 'md:rounded-none md:rounded-tl-3xl';

  return (
    // 將 cornerClass 應用到 className
    <div className={`bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex-shrink-0 relative overflow-hidden rounded-t-3xl ${cornerClass} -mr-[1px] -mt-[1px] -ml-[1px] w-[calc(100%+2px)]`}>
        <div className="relative z-10 text-white pl-4">
            <h2 className="text-2xl font-bold tracking-wide">{isLoginView ? '歡迎回來' : '建立帳戶'}</h2>
            <p className="text-emerald-100 text-sm mt-1 opacity-90">
                {isLoginView ? '登入以存取您的個人儀表板' : '加入我們，一起計算與減少碳足跡'}
            </p>
        </div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default AuthHeader;