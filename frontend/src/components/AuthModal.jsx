import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { taiwanPlaces, occupations } from '../data/options';

// 引入圖片
import characterImg from '../assets/character.png';

// 備用圖片
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?q=80&w=1887&auto=format&fit=crop";

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
        
        {/* --- 左側圖片區 --- */}
        <div className="hidden md:flex md:w-4/12 bg-gradient-to-br from-emerald-50 to-teal-100 relative items-end justify-center z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl"></div>
            <img 
                src={characterImg} 
                onError={(e) => e.target.src = PLACEHOLDER_IMG}
                alt="Character" 
                className="absolute bottom-0 right-[-2%] h-[100%] w-auto object-contain drop-shadow-2xl pointer-events-none"
            />
        </div>

        {/* --- 右側內容區 --- */}
        <div className="w-full md:w-8/12 flex flex-col h-full bg-white relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white/90 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition">
                <FaTimes size={16} />
            </button>

            {/* Header */}
            {/* 修改重點：加入 rounded-t-3xl md:rounded-none md:rounded-tr-3xl */}
            {/* 這會強制綠色背景的右上角 (手機版則是左上+右上) 變成圓角，填補白色縫隙 */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex-shrink-0 relative overflow-hidden rounded-t-3xl md:rounded-none md:rounded-tr-3xl -mr-[3px] -mt-[3px] w-[calc(100%+2px)]">
                <div className="relative z-10 text-white pl-4">
                    <h2 className="text-2xl font-bold tracking-wide">{isLoginView ? '歡迎回來' : '建立帳戶'}</h2>
                    <p className="text-emerald-100 text-sm mt-1 opacity-90">
                        {isLoginView ? '登入以存取您的個人儀表板' : '加入我們，一起計算與減少碳足跡'}
                    </p>
                </div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

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
                    {/* 通用欄位 */}
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

                    {/* 註冊專用欄位 */}
                    <AnimatePresence>
                    {!isLoginView && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="space-y-4 overflow-hidden"
                    >
                        <div className="relative group pt-1">
                            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                            <input type="email" name="email" placeholder="電子信箱" required 
                                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                onChange={handleChange} />
                        </div>
                        
                        <div className="relative group">
                            <span className="absolute left-4 top-3 text-gray-400 transition group-focus-within:text-emerald-600 text-lg">📝</span>
                            <input type="text" name="fullName" placeholder="真實姓名" required 
                                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                onChange={handleChange} />
                        </div>

                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-2">
                                <FaVenusMars className="text-emerald-600"/> 性別
                            </label>
                            <div className="flex gap-4">
                                {['Male', 'Female', 'Other'].map(g => (
                                    <label key={g} className="flex items-center cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-5 h-5 mr-2 bg-white border border-gray-300 rounded-full group-hover:border-emerald-500 transition">
                                            <input type="radio" name="gender" value={g} 
                                                checked={formData.gender === g} onChange={handleChange}
                                                className="opacity-0 absolute inset-0 cursor-pointer" />
                                            {formData.gender === g && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>}
                                        </div>
                                        <span className="text-gray-600 group-hover:text-emerald-700 transition text-sm">
                                            {g === 'Male' ? '男' : g === 'Female' ? '女' : '其他'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {formData.gender === 'Other' && (
                                <input type="text" name="genderOther" placeholder="請輸入" 
                                    className="mt-2 w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none bg-white" onChange={handleChange} />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                                <select name="city" value={formData.city} onChange={handleChange}
                                    className="w-full pl-9 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer appearance-none text-gray-600 text-sm">
                                    {Object.keys(taiwanPlaces).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <select name="district" value={formData.district} onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer text-gray-600 text-sm">
                                {taiwanPlaces[formData.city]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                                <input type="date" name="birthdate" required 
                                    className="w-full pl-9 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 text-gray-600 text-sm outline-none"
                                    onChange={handleChange} />
                            </div>
                            <div className="relative">
                                <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                                <select name="occupation" onChange={handleChange}
                                    className="w-full pl-9 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 text-sm outline-none cursor-pointer text-gray-600">
                                    {occupations.map(job => <option key={job} value={job}>{job.length > 8 ? job.substring(0,8)+'...' : job}</option>)}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                    )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-200/50 mt-4 transform active:scale-[0.98]">
                        {loading ? '處理中...' : (isLoginView ? '立即登入' : '註冊帳號')}
                    </button>
                </form>
            </div>

            {/* Footer 已經有 rounded-br-3xl，這裡保持不變 */}
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