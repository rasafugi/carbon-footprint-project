import React from 'react';

// 引入拆分後的 Landing Page 組件
import Navbar from '../components/Landing/Navbar';
import HeroSection from '../components/Landing/HeroSection';
import BackgroundAndPhilosophy from '../components/Landing/BackgroundAndPhilosophy';
import FeaturesSection from '../components/Landing/FeaturesSection';
import UXDesignSection from '../components/Landing/UXDesignSection';
import TechStackSection from '../components/Landing/TechStackSection';
import InfoSection from '../components/Landing/InfoSection';
import Footer from '../components/Landing/Footer';

// ✨ 修改處：接收 user prop
const LandingPage = ({ user, onOpenAuth }) => {
  return (
    <div className="antialiased overflow-x-hidden bg-slate-50">
        {/* ✨ 修改處：將 user 傳給 Navbar */}
        <Navbar user={user} onOpenAuth={onOpenAuth} />
        
        {/* 各個內容區塊 */}
        <HeroSection />
        <BackgroundAndPhilosophy />
        <FeaturesSection />
        <UXDesignSection />
        <TechStackSection />
        <InfoSection />
        
        {/* 頁尾 */}
        <Footer />
    </div>
  );
};

export default LandingPage;