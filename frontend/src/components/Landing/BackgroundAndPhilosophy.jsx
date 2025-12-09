import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation
import { HiLightBulb } from 'react-icons/hi';
import { FaHandHoldingHeart, FaRobot, FaChartPie } from 'react-icons/fa';

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants, staggerContainer } from '../../utils/motion';

const BackgroundAndPhilosophy = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  return (
    <section id="background" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* 1. 標題翻譯 */}
        <SectionTitle title={t('background.section_title')} subtitle={true} />
        
        {/* 上半部：圖文介紹 */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <motion.div 
            className="md:w-1/2"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}
          >
            <img 
              src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Climate Change" 
              className="rounded-2xl shadow-2xl object-cover h-96 w-full"
            />
          </motion.div>
          <motion.div 
            className="md:w-1/2 space-y-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}
          >
            {/* 2. 副標題翻譯 */}
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <HiLightBulb className="text-emerald-500 flex-shrink-0" /> 
              {t('background.why_title')}
            </h3>
            
            {/* 3. 內文翻譯 */}
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('background.intro_p1')}
            </p>
            <p className="text-lg font-medium text-emerald-700 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
              {t('background.intro_p2')}
            </p>
          </motion.div>
        </div>

        {/* 下半部：特點卡片 */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
            {/* 4. 卡片內容翻譯 - 使用 map 渲染 */}
            {[
              { 
                icon: <FaHandHoldingHeart />, 
                title: t('background.cards.user_centric.title'), 
                desc: t('background.cards.user_centric.desc') 
              },
              { 
                icon: <FaRobot />, 
                title: t('background.cards.automated.title'), 
                desc: t('background.cards.automated.desc') 
              },
              { 
                icon: <FaChartPie />, 
                title: t('background.cards.intuitive.title'), 
                desc: t('background.cards.intuitive.desc') 
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeUpVariants} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-emerald-500">
                <div className="text-4xl text-emerald-500 mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundAndPhilosophy;