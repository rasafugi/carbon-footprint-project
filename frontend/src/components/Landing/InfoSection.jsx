import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // ✨ 引入 useTranslation
import { FaDatabase, FaHandHoldingHeart } from 'react-icons/fa';

// 引入共用動畫設定
import { fadeUpVariants } from '../../utils/motion';

const InfoSection = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  // 取得陣列資料
  const standardsList = t('info.data_source.standards_list', { returnObjects: true });
  const sourcesTags = t('info.data_source.sources_tags', { returnObjects: true });
  const valueCards = t('info.social_value.cards', { returnObjects: true });

  return (
    <section id="value" className="py-20 bg-emerald-50">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
        
        {/* 左側：資料來源 */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeUpVariants}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaDatabase className="text-emerald-600"/> 
            {t('info.data_source.title')}
          </h3>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                  <h4 className="font-bold text-emerald-700 mb-2">
                    {t('info.data_source.standards_title')}
                  </h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                      {Array.isArray(standardsList) && standardsList.map((item, idx) => (
                        // 使用 dangerouslySetInnerHTML 來支援翻譯檔中的 <strong> 標籤
                        <li key={idx} dangerouslySetInnerHTML={{ __html: item }}></li>
                      ))}
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-emerald-700 mb-2">
                    {t('info.data_source.sources_title')}
                  </h4>
                  <p className="text-sm text-slate-500 mb-2">
                    {t('info.data_source.sources_note')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                      {Array.isArray(sourcesTags) && sourcesTags.map((source, idx) => (
                          <span key={idx} className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full">
                            {source}
                          </span>
                      ))}
                  </div>
              </div>
          </div>
        </motion.div>

        {/* 右側：社會價值 */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeUpVariants}
        >
           <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
             <FaHandHoldingHeart className="text-emerald-600"/> 
             {t('info.social_value.title')}
           </h3>
           <div className="grid gap-4">
              {Array.isArray(valueCards) && valueCards.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                          <h4 className="font-bold text-lg">{item.title}</h4>
                          <p className="text-slate-600">{item.desc}</p>
                      </div>
                  </div>
              ))}
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;