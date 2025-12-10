import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation
import { FaMobileAlt, FaChartPie, FaDatabase, FaIndustry, FaServer } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants } from '../../utils/motion';

const UXDesignSection = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  // 取得特點列表陣列
  const quickFeatures = t('ux_design.quick.features', { returnObjects: true });
  const detailedFeatures = t('ux_design.detailed.features', { returnObjects: true });

  // 定義圖示對應 (依照原本的順序)
  const quickIcons = [<FaChartPie />, null, <HiLightBulb />]; // 中間那個是文字說明，無圖示
  const detailedIcons = [<FaIndustry />, null, <FaServer />];

  return (
    <section id="ux-design" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* 背景裝飾光暈 */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* 1. 標題翻譯 */}
        <SectionTitle title={t('ux_design.section_title')} subtitle={true} />
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          
          {/* 左側卡片：快速估算版 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}
            className="lg:w-5/12 bg-gradient-to-br from-teal-50 to-cyan-100 p-8 rounded-3xl shadow-lg border-2 border-teal-200 transform hover:-translate-y-2 transition-transform"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-teal-500 text-white rounded-2xl text-3xl"><FaMobileAlt /></div>
              <div>
                <h3 className="text-2xl font-bold text-teal-800">{t('ux_design.quick.title')}</h3>
                <p className="text-teal-600 font-medium">{t('ux_design.quick.subtitle')}</p>
              </div>
            </div>
            <ul className="space-y-4 text-teal-900">
              {Array.isArray(quickFeatures) && quickFeatures.map((feature, idx) => (
                <li key={idx} className={`flex items-center gap-2 ${idx === 1 ? 'font-semibold bg-white/50 p-2 rounded-lg' : ''}`}>
                  {/* 第二個項目特殊樣式處理 */}
                  {idx !== 1 && quickIcons[idx]} 
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center font-bold text-teal-700 bg-teal-200/50 py-2 rounded-full">
              {t('ux_design.quick.highlight')}
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
                <h3 className="text-2xl font-bold text-emerald-900">{t('ux_design.detailed.title')}</h3>
                <p className="text-emerald-700 font-medium">{t('ux_design.detailed.subtitle')}</p>
              </div>
            </div>
            <ul className="space-y-4 text-emerald-900">
              {Array.isArray(detailedFeatures) && detailedFeatures.map((feature, idx) => (
                <li key={idx} className={`flex items-center gap-2 ${idx === 1 ? 'font-semibold bg-white/50 p-2 rounded-lg' : ''}`}>
                   {/* 第二個項目特殊樣式處理 */}
                   {idx !== 1 && detailedIcons[idx]}
                   {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center font-bold text-emerald-800 bg-emerald-200/50 py-2 rounded-full">
              {t('ux_design.detailed.highlight')}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UXDesignSection;