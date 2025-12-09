import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation

const Footer = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  return (
    <footer className="bg-slate-800 text-slate-400 py-8 text-center">
      <div className="container mx-auto px-6">
        {/* Logo 區塊 (CarbonTrace 是品牌名，通常不翻譯，維持原樣) */}
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-500 mb-4">
            <FaLeaf />
            <span>CarbonTrace</span>
        </div>
        
        {/* 1. 專題資訊翻譯 */}
        <p className="mb-4">
          {t('footer.project_info')}
        </p>
        
        {/* 2. 版權宣告翻譯 (帶入年份參數) */}
        <p className="text-sm">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;