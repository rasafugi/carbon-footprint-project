import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation
import { FaLeaf, FaCarSide, FaUtensils, FaShoppingBag, FaRecycle } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants, staggerContainer } from '../../utils/motion';

const FeaturesSection = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  // 定義功能模組資料
  // 注意：這裡我們只保留 ID 和 Icon/Color 設定
  // 文字內容將直接從翻譯檔中動態讀取
  const modulesConfig = [
    { 
      id: "A", 
      icon: <HiLightBulb />, 
      color: "bg-yellow-100 text-yellow-600"
    },
    { 
      id: "B", 
      icon: <FaCarSide />, 
      color: "bg-blue-100 text-blue-600"
    },
    { 
      id: "C", 
      icon: <FaUtensils />, 
      color: "bg-red-100 text-red-600"
    },
    { 
      id: "D", 
      icon: <FaShoppingBag />, 
      color: "bg-purple-100 text-purple-600"
    },
    { 
      id: "E", 
      icon: <FaRecycle />, 
      color: "bg-green-100 text-green-600"
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        {/* 1. 標題與副標題翻譯 */}
        <SectionTitle title={t('features.section_title')} subtitle={true} />
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          {t('features.subtitle')}
        </p>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {modulesConfig.map((mod) => {
            // 2. 動態獲取該模組的翻譯資料
            // 這裡使用了 returnObjects: true 來獲取 points 陣列
            const points = t(`features.modules.${mod.id}.points`, { returnObjects: true });
            const title = t(`features.modules.${mod.id}.title`);

            return (
              <motion.div 
                key={mod.id} 
                variants={fadeUpVariants}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
              >
                {/* 卡片標題區塊 */}
                <div className={`p-6 flex items-center gap-4 ${mod.color} bg-opacity-50`}>
                  <span className="text-3xl p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-lg">Module {mod.id}</h4>
                    <h3 className="font-extrabold text-2xl">{title}</h3>
                  </div>
                </div>

                {/* 卡片內容列表 */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {/* 確保 points 是陣列才渲染，避免翻譯檔未載入時報錯 */}
                    {Array.isArray(points) && points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FaLeaf className="text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;