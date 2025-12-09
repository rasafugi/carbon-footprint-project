import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaCarSide, FaUtensils, FaShoppingBag, FaRecycle } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";

// 引入共用組件與動畫
import SectionTitle from './SectionTitle';
import { fadeUpVariants, staggerContainer } from '../../utils/motion';

const FeaturesSection = () => {
  // 定義功能模組資料
  const modules = [
    { 
      id: "A", 
      title: "家庭能源估算", 
      icon: <HiLightBulb />, 
      color: "bg-yellow-100 text-yellow-600", 
      points: ["輸入水電瓦斯用量", "自動套用最新係數", "圖表呈現能源佔比"] 
    },
    { 
      id: "B", 
      title: "交通通勤計算", 
      icon: <FaCarSide />, 
      color: "bg-blue-100 text-blue-600", 
      points: ["多元交通方式整合", "自選車款與燃油類型", "通勤情境比較功能"] 
    },
    { 
      id: "C", 
      title: "飲食行為分析", 
      icon: <FaUtensils />, 
      color: "bg-red-100 text-red-600", 
      points: ["依據食物攝取量估算", "支援快速與精準模式", "使用國際 LCA 資料庫"] 
    },
    { 
      id: "D", 
      title: "個人消費購物", 
      icon: <FaShoppingBag />, 
      color: "bg-purple-100 text-purple-600", 
      points: ["衣物、電子產品消費", "套用生命週期係數", "顯示「隱含碳排」"] 
    },
    { 
      id: "E", 
      title: "廢棄物與回收", 
      icon: <FaRecycle />, 
      color: "bg-green-100 text-green-600", 
      points: ["計算垃圾量碳排", "量化回收減碳效益", "看見環保行為價值"] 
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <SectionTitle title="核心功能模組 (Module A–E)" subtitle={true} />
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          功能設計皆基於國際通用的碳足跡分類，全方位覆蓋你的生活。
        </p>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {modules.map((mod) => (
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
                  <h3 className="font-extrabold text-2xl">{mod.title}</h3>
                </div>
              </div>

              {/* 卡片內容列表 */}
              <div className="p-6">
                <ul className="space-y-3">
                  {mod.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaLeaf className="text-emerald-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;