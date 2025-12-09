// frontend/src/components/AuthModal.jsx (或是放在 Auth/ 資料夾)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { taiwanPlaces, occupations } from '../../data/options';

// 引入拆分後的子元件 (請根據你的資料夾結構調整路徑)
import AuthImagePanel from './AuthImagePanel';
import AuthHeader from './AuthHeader';
import RegisterFields from './RegisterFields';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    fullName: '', gender: 'Male', genderOther: '',
    city: '高雄市', district: '仁武區',
    birthdate: '', occupation: occupations[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl md:w-[900px] h-[650px] overflow-hidden relative flex flex-col md:flex-row"
      >
        
        {/* 左側圖片區 (獨立元件) */}
        <AuthImagePanel />

        {/* 右側內容區 */}
        <div className="w-full md:w-8/12 flex flex-col h-full bg-white relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white/90 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition">
                <FaTimes size={16} />
            </button>

            {/* Header (獨立元件) */}
            <AuthHeader isLoginView={isLoginView} />

            {/* 表單內容 */}
            <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col ${isLoginView ? 'justify-center' : ''}`}>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl mb-4 text-sm flex items-center gap-2 flex-shrink-0"
                    >
                        <span>⚠️</span> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 pb-2">
                    {/* 登入/註冊 通用欄位 */}
                    <div className="space-y-3">
                        <div className="relative group">
                            <FaUser className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                            <input type="text" name="username" placeholder="使用者帳號" required 
                                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                                onChange={handleChange} />
                        </div>
                        
                        <div className="relative group">
                            <FaLock className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                            <input type="password" name="password" placeholder="密碼" required 
                                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                                onChange={handleChange} />
                        </div>
                    </div>

                    {/* 註冊專用欄位 (獨立元件) */}
                    <AnimatePresence>
                        {!isLoginView && (
                            <RegisterFields formData={formData} handleChange={handleChange} />
                        )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-200/50 mt-4 transform active:scale-[0.98]">
                        {loading ? '處理中...' : (isLoginView ? '立即登入' : '註冊帳號')}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white text-center text-sm text-gray-500 rounded-br-3xl flex-shrink-0 z-10">
                {isLoginView ? '還沒有帳號嗎？' : '已經有帳號了？'} 
                <button onClick={() => setIsLoginView(!isLoginView)} className="text-emerald-600 font-bold ml-2 hover:underline transition">
                {isLoginView ? '免費註冊' : '馬上登入'}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;