import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as ScrollLink } from 'react-scroll';
import { FaLeaf, FaChartPie, FaDatabase, FaMobileAlt, FaRecycle, FaCarSide, FaUtensils, FaShoppingBag, FaIndustry, FaServer, FaRobot, FaHandHoldingHeart, FaBars, FaTimes } from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";
import axios from 'axios'; // 用於登出與檢查登入狀態
import AuthModal from './components/AuthModal'; // 引入剛剛寫好的模組

// --- 動畫設定 ---
// 定義 Framer Motion 的動畫變體，用於滾動時元素的浮現效果
const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// --- 可重用的標題組件 ---
const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpVariants}
      className="text-3xl md:text-4xl font-bold mb-4 text-slate-900"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"
      ></motion.div>
    )}
  </div>
);

// --- 導覽列組件 (Navbar) ---
// 接收三個 props: onOpenAuth (開彈窗), currentUser (使用者資料), onLogout (登出)
const Navbar = ({ onOpenAuth, currentUser, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "background", label: "背景與理念" },
    { to: "features", label: "核心功能" },
    { to: "ux-design", label: "UX 設計" },
    { to: "tech-stack", label: "技術" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <ScrollLink to="hero" smooth={true} duration={500} className="cursor-pointer flex items-center gap-2 text-2xl font-bold text-emerald-600">
          <FaLeaf />
          <span>CarbonTrace</span>
        </ScrollLink>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <ScrollLink 
              key={link.to} 
              to={link.to} 
              spy={true} 
              smooth={true} 
              offset={-70} 
              duration={500} 
              className="cursor-pointer font-medium text-slate-600 hover:text-emerald-600 transition text-sm uppercase tracking-wider"
              activeClass="text-emerald-600 font-bold"
            >
              {link.label}
            </ScrollLink>
          ))}

          {/* --- 動態登入區塊 (Desktop) --- */}
          {currentUser ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l-2 border-slate-200">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold">歡迎回來</p>
                <p className="text-sm font-bold text-emerald-700">{currentUser.fullName}</p>
              </div>
              <button 
                onClick={onLogout}
                className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-4 py-2 rounded-full text-sm font-bold transition"
              >
                登出
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition shadow-lg font-bold ml-4"
            >
              登入 / 註冊
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg absolute w-full px-6 py-4 flex flex-col space-y-4 border-t border-slate-100"
        >
          {navLinks.map((link) => (
             <ScrollLink 
                key={link.to} 
                to={link.to}
                smooth={true} 
                offset={-70} 
                duration={500}
                onClick={() => setIsOpen(false)}
                className="cursor-pointer font-medium text-slate-600 hover:text-emerald-600 py-2 border-b border-slate-50"
              >
                {link.label}
            </ScrollLink>
          ))}
          
          {/* --- 動態登入區塊 (Mobile) --- */}
          <div className="pt-2">
            {currentUser ? (
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <span className="font-bold text-emerald-700">Hi, {currentUser.fullName}</span>
                <button onClick={onLogout} className="text-sm text-slate-500 hover:text-red-500 underline">登出</button>
              </div>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setIsOpen(false); }}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md"
              >
                登入 / 註冊會員
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// --- 主視覺組件 (Hero Section) ---
const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* 背景圖片 - 建議替換為高品質的環保主題圖片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-50"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            看見你的生活，<br />
            對地球的<span className="text-emerald-400">真實影響</span>。
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            個人碳排放檢測平台 —— 用科技讓「碳排」變容易理解，從意識到改變的每一步。
          </p>
           <ScrollLink to="background" smooth={true} offset={-70} duration={800}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              探索專題理念
            </motion.button>
           </ScrollLink>
        </motion.div>
      </div>
      
      {/* 裝飾性波浪 */}
      <div className="absolute bottom-0 w-full leading-none z-10">
        <svg className="block w-full h-24 md:h-48 text-slate-50" viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

// --- 背景與理念組件 ---
const BackgroundAndPhilosophy = () => {
  return (
    <section id="background" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <SectionTitle title="專題背景與設計理念" subtitle={true} />

        {/* 背景介紹 - 圖文並茂 */}
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

        {/* 設計理念 - 三點式卡片 */}
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

// --- 核心功能組件 (Modules A-E) ---
const FeaturesSection = () => {
  const modules = [
    { id: "A", title: "家庭能源估算", icon: <HiLightBulb />, color: "bg-yellow-100 text-yellow-600", points: ["輸入水電瓦斯用量", "自動套用最新係數", "圖表呈現能源佔比"] },
    { id: "B", title: "交通通勤計算", icon: <FaCarSide />, color: "bg-blue-100 text-blue-600", points: ["多元交通方式整合", "自選車款與燃油類型", "通勤情境比較功能"] },
    { id: "C", title: "飲食行為分析", icon: <FaUtensils />, color: "bg-red-100 text-red-600", points: ["依據食物攝取量估算", "支援快速與精準模式", "使用國際 LCA 資料庫"] },
    { id: "D", title: "個人消費購物", icon: <FaShoppingBag />, color: "bg-purple-100 text-purple-600", points: ["衣物、電子產品消費", "套用生命週期係數", "顯示「隱含碳排」"] },
    { id: "E", title: "廢棄物與回收", icon: <FaRecycle />, color: "bg-green-100 text-green-600", points: ["計算垃圾量碳排", "量化回收減碳效益", "看見環保行為價值"] },
  ];

  return (
    <section id="features" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <SectionTitle title="核心功能模組 (Module A–E)" subtitle={true} />
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">功能設計皆基於國際通用的碳足跡分類，全方位覆蓋你的生活。</p>
        
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
              <div className={`p-6 flex items-center gap-4 ${mod.color} bg-opacity-50`}>
                <span className="text-3xl p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">{mod.icon}</span>
                <div>
                  <h4 className="font-bold text-lg">Module {mod.id}</h4>
                  <h3 className="font-extrabold text-2xl">{mod.title}</h3>
                </div>
              </div>
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

// --- UX 設計理念組件 (快速版 vs 詳細版) ---
const UXDesignSection = () => {
  return (
    <section id="ux-design" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle title="UX 設計理念：兩種模式，隨心選擇" subtitle={true} />
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          {/* 快速版 Card */}
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

          {/* 詳細版 Card */}
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

// --- 技術實作亮點組件 ---
const TechStackSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start("visible");
    }
  }, [inView, animation]);

  const techBlocks = [
    { title: "後端架構", icon: <FaServer />, tools: "Python Flask / FastAPI", desc: "自動化背景任務更新係數，模組化計算架構，易於維護擴充。" },
    { title: "資料自動更新", icon: <FaRobot />, tools: "API / 爬蟲技術", desc: "抓取政府公開資料或官方 API，自動比對版本與快取，確保數據最新。" },
    { title: "前端呈現", icon: <FaMobileAlt />, tools: "React + Tailwind + Framer Motion", desc: "輕量清晰的 UI/UX，使用動態圖表呈現排放結構與行為標示。" },
    { title: "資料庫設計", icon: <FaDatabase />, tools: "SQL / NoSQL", desc: "儲存匿名化行為資料、最新碳排係數快取，支援未來模組擴充。" },
  ];

  return (
    <section id="tech-stack" className="py-20 bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">技術實作亮點</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-400">身為資訊工程系學生，我們用工程技術解決問題。</p>
        </div>
        
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
              <div className="text-4xl text-emerald-400">{block.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{block.title}</h3>
                <p className="text-emerald-300 font-mono text-sm mb-3 bg-slate-900 inline-block px-3 py-1 rounded">{block.tools}</p>
                <p className="text-slate-400 leading-relaxed">{block.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 資料來源與價值組件 (Footer 前的資訊區) ---
const InfoSection = () => {
    return (
      <section id="value" className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
          
          {/* 左側：資料來源與協議 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaDatabase className="text-emerald-600"/> 資料來源與國際協議</h3>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants}>
             <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaHandHoldingHeart className="text-emerald-600"/> 對社會的價值與延伸性</h3>
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

// --- 頁尾組件 ---
const Footer = () => (
  <footer className="bg-slate-800 text-slate-400 py-8 text-center">
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-500 mb-4">
          <FaLeaf />
          <span>CarbonTrace</span>
      </div>
      <p className="mb-4">資訊工程系畢業專題 —— 個人碳排放檢測平台</p>
      <p className="text-sm">© {new Date().getFullYear()} All rights reserved. 用科技為地球盡一份心力。</p>
    </div>
  </footer>
);


// --- 主應用組件 (App.js) ---
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. 初始化：檢查使用者是否已經登入 (呼叫後端 /api/me)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 注意：這裡要傳送認證 Cookie (withCredentials: true 在 axios 全域設定或這裡加)
        const res = await axios.get('http://127.0.0.1:5000/api/me', { withCredentials: true });
        if (res.data.is_logged_in) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        console.error("尚未登入或連線失敗");
      }
    };
    checkLoginStatus();
  }, []);

  // 2. 登出處理函式
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/logout', {}, { withCredentials: true });
      setCurrentUser(null);
      alert("已安全登出");
    } catch (error) {
      console.error("登出失敗");
    }
  };

  return (
    <div className="antialiased overflow-x-hidden bg-slate-50">
      {/* 3. 將 State 與處理函式傳給 Navbar */}
      <Navbar 
        onOpenAuth={() => setIsModalOpen(true)} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
      
      {/* 4. 掛載登入彈窗模組 */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsModalOpen(false); // 登入成功後關閉視窗
        }}
      />

      <HeroSection />
      <BackgroundAndPhilosophy />
      <FeaturesSection />
      <UXDesignSection />
      <TechStackSection />
      <InfoSection />
      <Footer />
    </div>
  );
}

export default App;