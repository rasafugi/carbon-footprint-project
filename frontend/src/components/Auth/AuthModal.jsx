// frontend/src/components/Auth/AuthModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'; // 引入 LayoutGroup
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { taiwanPlaces, occupations } from '../../data/options';

// 引入子元件
import AuthImagePanel from './AuthImagePanel';
import AuthHeader from './AuthHeader';
import RegisterFields from './RegisterFields';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  // ... (formData, loading, error 狀態保持不變，省略以節省空間)
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    fullName: '', gender: 'Male', genderOther: '',
    city: '高雄市', district: '仁武區',
    birthdate: '', occupation: occupations[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ... (handleChange, handleSubmit 函式保持不變，省略以節省空間)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        if (name === 'city') {
            return { ...prev, city: value, district: taiwanPlaces[value][0] };
        }
        return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
    const endpoint = isLoginView ? `${API_BASE}/api/login` : `${API_BASE}/api/register`;
    
    try {
      const res = await axios.post(endpoint, formData, { withCredentials: true });
      if (isLoginView) {
        onLoginSuccess(res.data.user);
        onClose();
      } else {
        alert("註冊成功！請登入。");
        setIsLoginView(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      {/* 使用 LayoutGroup 包裹，確保內部組件的 layout 動畫能協同工作 */}
      <LayoutGroup>
        <motion.div 
            layout // 啟用整體佈局動畫
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            // 移除 overflow-hidden，改在子元素處理圓角，以避免動畫裁切問題
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl md:w-[900px] h-[650px] relative flex flex-col md:flex-row"
        >
            
            {/* --- 左側/右側 圖片區 --- */}
            <motion.div 
                layout // 啟用佈局動畫，實現平滑移動
                // 根據狀態改變 order：登入時在左 (order-1)，註冊時在右 (order-2)
                className={`hidden md:flex md:w-4/12 h-full z-20 transition-all duration-500 ease-in-out ${isLoginView ? 'md:order-1' : 'md:order-2'}`}
            >
                {/* 將 isLoginView 傳遞給 ImagePanel 以切換圖片和位置 */}
                <AuthImagePanel isLoginView={isLoginView} />
            </motion.div>

            {/* --- 右側/左側 內容區 --- */}
            <motion.div 
                layout // 啟用佈局動畫
                // 根據狀態改變 order：登入時在右 (order-2)，註冊時在左 (order-1)
                // 根據狀態改變圓角：在右側時左邊直角，在左側時右邊直角
                className={`w-full md:w-8/12 flex flex-col h-full bg-white relative z-10 transition-all duration-500 ease-in-out ${isLoginView ? 'md:order-2 md:rounded-r-3xl' : 'md:order-1 md:rounded-l-3xl'}`}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-30 text-white/90 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition">
                    <FaTimes size={16} />
                </button>

                {/* Header */}
                <AuthHeader isLoginView={isLoginView} />

                {/* 表單內容 (保持不變，省略部分內容以節省空間) */}
                <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col ${isLoginView ? 'justify-center' : ''}`}>
                    {/* ... Error Message ... */}
                    {/* ... Form Fields ... */}
                    {/* ... Login/Register Fields ... */}
                    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
                       {/* (這裡的表單內容與原本相同，請保留原本的程式碼) */}
                       {/* ...省略... */}
                       {/* 註冊專用欄位 */}
                       <AnimatePresence>
                           {!isLoginView && (
                               <RegisterFields formData={formData} handleChange={handleChange} />
                           )}
                       </AnimatePresence>
                       {/* ...省略... */}
                    </form>
                </div>

                {/* Footer */}
                {/* 根據在左側還是右側，調整 Footer 的圓角 */}
                <div className={`p-4 border-t border-gray-100 bg-white text-center text-sm text-gray-500 flex-shrink-0 z-10 transition-all duration-500 ${isLoginView ? 'rounded-br-3xl' : 'rounded-bl-3xl'}`}>
                    {isLoginView ? '還沒有帳號嗎？' : '已經有帳號了？'} 
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-emerald-600 font-bold ml-2 hover:underline transition">
                    {isLoginView ? '免費註冊' : '馬上登入'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
      </LayoutGroup>
    </div>
  );
};

export default AuthModal;