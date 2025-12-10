import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

// 引入頁面與組件
import AuthModal from './components/Auth/AuthModal';
import Dashboard from './pages/Dashboard';
import QuickEstimation from './pages/QuickEstimation';
import LandingPage from './pages/LandingPage'; 
import DetailedAnalysis from './pages/DetailedAnalysis';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 1. 初始化：檢查使用者是否已經登入
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 這裡建議未來可以改成讀取環境變數: import.meta.env.VITE_API_URL
        const res = await axios.get('/api/me', { withCredentials: true });
        if (res.data.is_logged_in) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        console.log("訪客瀏覽模式 (尚未登入)");
      }
    };
    checkLoginStatus();
  }, []);

  // 2. 登出處理函式
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setCurrentUser(null);
      navigate('/'); // 登出後踢回首頁
      alert("已安全登出");
    } catch (error) {
      console.error("登出失敗");
    }
  };

  return (
    <>
      <Routes>
        {/* 1. 首頁路由：如果已登入，強制跳轉到 Dashboard；否則顯示 LandingPage */}
        <Route path="/" element={
            currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage onOpenAuth={() => setIsModalOpen(true)} />
        } />

        {/* 2. 儀表板路由：受保護，沒登入會踢回首頁 */}
        <Route path="/dashboard" element={
            currentUser ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <Navigate to="/" replace />
        } />

        {/* 3. 快速估算路由：受保護 */}
        <Route path="/quick-estimate" element={
            currentUser ? <QuickEstimation /> : <Navigate to="/" replace />
        } />

        {/* ✨ 新增這行：詳細分析路由 */}
        <Route path="/detailed-analysis" element={
            currentUser ? <DetailedAnalysis /> : <Navigate to="/" replace />
        } />

      </Routes>

      {/* 登入彈窗 (Global) - 保持在最外層以免被頁面切換影響 */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsModalOpen(false);
          navigate('/dashboard'); // 登入成功後直接進入儀表板
        }}
      />
    </>
  );
}

export default App;