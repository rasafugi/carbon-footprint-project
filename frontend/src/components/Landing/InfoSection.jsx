import React from 'react';
import { motion } from 'framer-motion';
import { FaDatabase, FaHandHoldingHeart } from 'react-icons/fa';

// 引入共用動畫設定
import { fadeUpVariants } from '../../utils/motion';

const InfoSection = () => {
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
            <FaDatabase className="text-emerald-600"/> 資料來源與國際協議
          </h3>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                  <h4 className="font-bold text-emerald-700 mb-2">📚 採用國際公認標準：</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                      <li>ISO 14064 / 14067：碳足跡計算方法標準</li>
                      <li><strong>IPCC</strong>（聯合國氣候變遷專家委員會）排放係數</li>
                      <li>GHG Protocol（溫室氣體盤查國際標準）</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-emerald-700 mb-2">📚 數據資料來源：</h4>
                  <p className="text-sm text-slate-500 mb-2">(依實際情況可調整)</p>
                  <div className="flex flex-wrap gap-2">
                      {['台灣環境部', 'IEA (國際能源署)', 'FAO Food LCA Database', '政府開放資料平台 (Open Data)'].map(source => (
                          <span key={source} className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full">{source}</span>
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
             <FaHandHoldingHeart className="text-emerald-600"/> 對社會的價值與延伸性
           </h3>
           <div className="grid gap-4">
              {[
                  { icon: "🌱", title: "1. 理解影響", desc: "讓一般人不再需要專業知識，也能理解自己的生活如何影響地球。" },
                  { icon: "🎓", title: "2. 環境教育", desc: "可用於大學課程、中學教育、企業 ESG 活動的教學工具。" },
                  { icon: "🔄", title: "3. 促成改變", desc: "用量化回饋取代抽象概念，讓改善行為有明確方向。" },
                  { icon: "📈", title: "4. 延伸應用", desc: "未來可延伸至 ESG 個人報告、社區排碳分析，與政府政策呼應。" },
              ].map((item, idx) => (
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