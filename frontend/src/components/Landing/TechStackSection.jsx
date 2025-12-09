import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation
import { FaServer, FaRobot, FaMobileAlt, FaDatabase } from 'react-icons/fa';

// 引入共用動畫設定
import { fadeUpVariants } from '../../utils/motion';

const TechStackSection = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  // 使用 useInView 偵測是否捲動到此區塊
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const animation = useAnimation();

  // 當進入視窗時，觸發動畫
  useEffect(() => {
    if (inView) {
      animation.start("visible");
    }
  }, [inView, animation]);

  // 定義區塊設定 (ID 對應翻譯檔的 key)
  const techConfig = [
    { id: "backend", icon: <FaServer /> },
    { id: "data", icon: <FaRobot /> },
    { id: "frontend", icon: <FaMobileAlt /> },
    { id: "database", icon: <FaDatabase /> },
  ];

  return (
    <section id="tech-stack" className="py-20 bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6">
        {/* 標題區塊 (深色模式專用) */}
        <div className="text-center mb-12">
            {/* 1. 標題翻譯 */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('tech_stack.section_title')}
            </h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            {/* 2. 副標題翻譯 */}
            <p className="text-slate-400">
              {t('tech_stack.subtitle')}
            </p>
        </div>
        
        {/* 技術卡片 Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {techConfig.map((config, index) => {
            // 3. 動態獲取該區塊的翻譯
            const blockData = {
              title: t(`tech_stack.blocks.${config.id}.title`),
              tools: t(`tech_stack.blocks.${config.id}.tools`),
              desc: t(`tech_stack.blocks.${config.id}.desc`)
            };

            return (
              <motion.div
                key={config.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate={animation}
                custom={index}
                className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-emerald-500 transition-colors flex gap-6"
              >
                <div className="text-4xl text-emerald-400 flex-shrink-0">
                  {config.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{blockData.title}</h3>
                  <p className="text-emerald-300 font-mono text-sm mb-3 bg-slate-900 inline-block px-3 py-1 rounded">
                    {blockData.tools}
                  </p>
                  <p className="text-slate-400 leading-relaxed">{blockData.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;