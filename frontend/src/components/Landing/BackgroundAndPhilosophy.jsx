import React from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb } from 'react-icons/hi';
import { FaHandHoldingHeart, FaRobot, FaChartPie } from 'react-icons/fa';

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants, staggerContainer } from '../../utils/motion';

const BackgroundAndPhilosophy = () => {
  return (
    <section id="background" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <SectionTitle title="專題背景與設計理念" subtitle={true} />
        
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
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <HiLightBulb className="text-emerald-500" /> 為何需要個人碳排放檢測？
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              氣候變遷是全球核心議題。科學顯示，我們日常微小的行為——通勤、飲食、用電，都在累積碳排放。然而，大眾往往難以理解自己「究竟排放了多少？」或「哪些習慣影響最大？」。
            </p>
            <p className="text-lg font-medium text-emerald-700 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
              我們希望建立一個平台，透過直覺介面與自動化機制，引導使用者看見改變的可能，反思生活對環境的影響。
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
            {[
              { icon: <FaHandHoldingHeart />, title: "以使用者為中心", desc: "非專業人士也能輕鬆使用，資訊呈現清晰透明，不造成負擔。" },
              { icon: <FaRobot />, title: "自動化數據更新", desc: "利用 API 或爬蟲技術自動獲取最新係數，避免手動更新的錯誤。" },
              { icon: <FaChartPie />, title: "直觀的結果轉化", desc: "將複雜模型轉化為圖表、影響分析與行為熱點，不只是計算，更是教育。" },
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