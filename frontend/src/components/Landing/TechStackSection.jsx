import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaServer, FaRobot, FaMobileAlt, FaDatabase } from 'react-icons/fa';

// 引入共用動畫設定
import { fadeUpVariants } from '../../utils/motion';

const TechStackSection = () => {
  // 使用 useInView 偵測是否捲動到此區塊
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const animation = useAnimation();

  // 當進入視窗時，觸發動畫
  useEffect(() => {
    if (inView) {
      animation.start("visible");
    }
  }, [inView, animation]);

  const techBlocks = [
    { 
      title: "後端架構", 
      icon: <FaServer />, 
      tools: "Python Flask / FastAPI", 
      desc: "自動化背景任務更新係數，模組化計算架構，易於維護擴充。" 
    },
    { 
      title: "資料自動更新", 
      icon: <FaRobot />, 
      tools: "API / 爬蟲技術", 
      desc: "抓取政府公開資料或官方 API，自動比對版本與快取，確保數據最新。" 
    },
    { 
      title: "前端呈現", 
      icon: <FaMobileAlt />, 
      tools: "React + Tailwind + Framer Motion", 
      desc: "輕量清晰的 UI/UX，使用動態圖表呈現排放結構與行為標示。" 
    },
    { 
      title: "資料庫設計", 
      icon: <FaDatabase />, 
      tools: "SQL / NoSQL", 
      desc: "儲存匿名化行為資料、最新碳排係數快取，支援未來模組擴充。" 
    },
  ];

  return (
    <section id="tech-stack" className="py-20 bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6">
        {/* 標題區塊 (深色模式專用) */}
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">技術實作亮點</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-400">身為資訊工程系學生，我們用工程技術解決問題。</p>
        </div>
        
        {/* 技術卡片 Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {techBlocks.map((block, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              initial="hidden"
              animate={animation}
              custom={index}
              className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-emerald-500 transition-colors flex gap-6"
            >
              <div className="text-4xl text-emerald-400 flex-shrink-0">{block.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{block.title}</h3>
                <p className="text-emerald-300 font-mono text-sm mb-3 bg-slate-900 inline-block px-3 py-1 rounded">
                  {block.tools}
                </p>
                <p className="text-slate-400 leading-relaxed">{block.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;