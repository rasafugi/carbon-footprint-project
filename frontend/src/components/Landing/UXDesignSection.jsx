import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaChartPie, FaDatabase, FaIndustry, FaServer } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants } from '../../utils/motion';

const UXDesignSection = () => {
  return (
    <section id="ux-design" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* 背景裝飾光暈 */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle title="UX 設計理念：兩種模式，隨心選擇" subtitle={true} />
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          
          {/* 左側卡片：快速估算版 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}
            className="lg:w-5/12 bg-gradient-to-br from-teal-50 to-cyan-100 p-8 rounded-3xl shadow-lg border-2 border-teal-200 transform hover:-translate-y-2 transition-transform"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-teal-500 text-white rounded-2xl text-3xl"><FaMobileAlt /></div>
              <div>
                <h3 className="text-2xl font-bold text-teal-800">快速估算版</h3>
                <p className="text-teal-600 font-medium">給一般使用者、約 30 秒完成</p>
              </div>
            </div>
            <ul className="space-y-4 text-teal-900">
              <li className="flex items-center gap-2"><FaChartPie /> 適合希望快速知道大概碳排量的使用者。</li>
              <li className="font-semibold bg-white/50 p-2 rounded-lg">包含了生活型態選擇題，系統使用預設係數快速估算。</li>
              <li className="flex items-center gap-2"><HiLightBulb /> 立即給出碳排總量、三大主要來源與改善建議。</li>
            </ul>
            <div className="mt-6 text-center font-bold text-teal-700 bg-teal-200/50 py-2 rounded-full">
              強調：快速、不須填太多資訊
            </div>
          </motion.div>

          {/* 右側卡片：詳細分析版 */}
          <motion.div 
             initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}
            className="lg:w-5/12 bg-gradient-to-br from-emerald-50 to-green-100 p-8 rounded-3xl shadow-lg border-2 border-emerald-200 transform hover:-translate-y-2 transition-transform lg:mt-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-3xl"><FaDatabase /></div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-900">詳細分析版</h3>
                <p className="text-emerald-700 font-medium">給希望更精準、願意提供資料者</p>
              </div>
            </div>
            <ul className="space-y-4 text-emerald-900">
              <li className="flex items-center gap-2"><FaIndustry /> 包含完整的 A–E 表單輸入（如電表讀數、交通里程、食物克數）。</li>
              <li className="font-semibold bg-white/50 p-2 rounded-lg">以實際數據進行精準生命週期 (LCA) 評估。</li>
              <li className="flex items-center gap-2"><FaServer /> 數據客製化，可用於研究或教學。</li>
            </ul>
            <div className="mt-6 text-center font-bold text-emerald-800 bg-emerald-200/50 py-2 rounded-full">
              強調：精準、客製化、研究級數據
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UXDesignSection;