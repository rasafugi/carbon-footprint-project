import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { FaLeaf, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  // 切換語言函式
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  // 監聽捲動事件，改變 Navbar 背景樣式
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "background", labelKey: "nav.background" },
    { to: "features", labelKey: "nav.features" },
    { to: "ux-design", labelKey: "nav.ux_design" },
    { to: "tech-stack", labelKey: "nav.tech" },
    { to: "value", labelKey: "nav.value" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
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
              {t(link.labelKey)} {/* ✨ 使用 t() 翻譯 */}
            </ScrollLink>
          ))}
          
          {/* 語言切換按鈕 */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition font-medium"
          >
            <FaGlobe />
            <span>{i18n.language.startsWith('zh') ? 'EN' : '中'}</span>
          </button>

          <button 
            onClick={onOpenAuth}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition shadow-lg font-bold ml-4"
          >
            {t('nav.login_register')} {/* ✨ 使用 t() 翻譯 */}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
           {/* 手機版也要有語言切換 */}
           <button onClick={toggleLanguage} className="text-slate-600">
              <FaGlobe size={20} />
           </button>

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
                {t(link.labelKey)} {/* ✨ 使用 t() 翻譯 */}
            </ScrollLink>
          ))}
          
          <div className="pt-2">
            <button 
              onClick={() => { onOpenAuth(); setIsOpen(false); }}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md"
            >
              {t('nav.login_register')}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;