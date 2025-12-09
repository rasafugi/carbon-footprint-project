import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-slate-800 text-slate-400 py-8 text-center">
    <div className="container mx-auto px-6">
      {/* Logo 區塊 */}
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-500 mb-4">
          <FaLeaf />
          <span>CarbonTrace</span>
      </div>
      
      {/* 專題資訊 */}
      <p className="mb-4">資訊工程系畢業專題 —— 個人碳排放檢測平台</p>
      
      {/* 版權宣告 (自動更新年份) */}
      <p className="text-sm">
        © {new Date().getFullYear()} All rights reserved. 用科技為地球盡一份心力。
      </p>
    </div>
  </footer>
);

export default Footer;