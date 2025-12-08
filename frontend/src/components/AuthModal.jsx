import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { taiwanPlaces, occupations } from '../data/options';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true); // 切換登入或註冊模式
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    fullName: '', gender: 'Male', genderOther: '',
    city: '高雄市', district: '仁武區',
    birthdate: '', occupation: occupations[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 處理表單輸入
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        // 如果改了縣市，預設區要重置為該縣市的第一個區
        if (name === 'city') {
            return { ...prev, city: value, district: taiwanPlaces[value][0] };
        }
        return { ...prev, [name]: value };
    });
  };

  // 送出表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = isLoginView ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/register';
    
    try {
      const res = await axios.post(endpoint, formData, { withCredentials: true });
      if (isLoginView) {
        onLoginSuccess(res.data.user);
        onClose();
      } else {
        alert("註冊成功！請登入。");
        setIsLoginView(true); // 切換回登入頁
      }
    } catch (err) {
      setError(err.response?.data?.error || "發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
      >
        {/* 關閉按鈕 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <FaTimes size={20} />
        </button>

        {/* 標題區 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">{isLoginView ? '歡迎回來' : '加入 CarbonTrace'}</h2>
          <p className="text-emerald-100 text-sm mt-1">{isLoginView ? '登入以查看你的碳足跡紀錄' : '開始你的減碳旅程'}</p>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- 通用欄位 (帳號/密碼) --- */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input type="text" name="username" placeholder="帳號" required 
                className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={handleChange} />
            </div>
            
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input type="password" name="password" placeholder="密碼" required 
                className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={handleChange} />
            </div>

            {/* --- 註冊專用欄位 (使用 AnimatePresence 做展開動畫) --- */}
            {!isLoginView && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input type="email" name="email" placeholder="電子信箱" required 
                        className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange} />
                </div>
                
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">📝</span>
                    <input type="text" name="fullName" placeholder="真實姓名" required 
                        className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange} />
                </div>

                {/* 性別 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="flex items-center gap-2 text-gray-600 text-sm mb-2"><FaVenusMars /> 性別</label>
                    <div className="flex gap-4">
                        {['Male', 'Female', 'Other'].map(g => (
                            <label key={g} className="flex items-center cursor-pointer">
                                <input type="radio" name="gender" value={g} 
                                    checked={formData.gender === g} onChange={handleChange}
                                    className="accent-emerald-600 mr-1" />
                                {g === 'Male' ? '男' : g === 'Female' ? '女' : '其他'}
                            </label>
                        ))}
                    </div>
                    {formData.gender === 'Other' && (
                        <input type="text" name="genderOther" placeholder="請輸入性別" 
                            className="mt-2 w-full p-2 border rounded text-sm" onChange={handleChange} />
                    )}
                </div>

                {/* 住址 (連動選單) */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                        <select name="city" value={formData.city} onChange={handleChange}
                            className="w-full pl-8 p-2.5 border rounded-lg bg-white appearance-none outline-none">
                            {Object.keys(taiwanPlaces).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <select name="district" value={formData.district} onChange={handleChange}
                        className="w-full p-2.5 border rounded-lg bg-white outline-none">
                        {taiwanPlaces[formData.city]?.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* 生日與職業 */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input type="date" name="birthdate" required 
                            className="w-full pl-9 p-2.5 border rounded-lg text-gray-600 text-sm outline-none"
                            onChange={handleChange} />
                    </div>
                    <div className="relative">
                        <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
                        <select name="occupation" onChange={handleChange}
                            className="w-full pl-9 p-2.5 border rounded-lg bg-white text-sm outline-none">
                            {occupations.map(job => <option key={job} value={job}>{job}</option>)}
                        </select>
                    </div>
                </div>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition shadow-lg mt-6">
              {loading ? '處理中...' : (isLoginView ? '登入' : '註冊帳號')}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {isLoginView ? '還沒有帳號嗎？' : '已經有帳號了？'} 
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-emerald-600 font-bold ml-1 hover:underline">
              {isLoginView ? '立即註冊' : '馬上登入'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;