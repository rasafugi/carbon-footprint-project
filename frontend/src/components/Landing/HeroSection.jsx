import React from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from 'react-i18next'; // ✨ 引入

const HeroSection = () => {
  const { t } = useTranslation(); // ✨ 使用 hook

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* 背景圖片保持不變... */}
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
          {/* 使用 t() 替換文字 */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {t('hero.title_1')}<br />
            {t('hero.title_2')}<span className="text-emerald-400">{t('hero.title_suffix')}</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
           
           <ScrollLink to="background" smooth={true} offset={-70} duration={800} className="cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              {t('hero.cta')}
            </motion.button>
           </ScrollLink>
        </motion.div>
      </div>
      
      {/* SVG 保持不變... */}
      <div className="absolute bottom-0 w-full leading-none z-10">
        <svg className="block w-full h-24 md:h-48 text-slate-50" viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;