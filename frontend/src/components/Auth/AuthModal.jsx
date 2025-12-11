import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // ✨ 引入
import { occupations, taiwanPlaces } from '../../data/options';

import AuthImagePanel from './AuthImagePanel';
import AuthHeader from './AuthHeader';
import RegisterFields from './RegisterFields';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useTranslation(); // ✨ 使用 hook
  const [isLoginView, setIsLoginView] = useState(true);
  const scrollRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    gender: 'Male',
    genderOther: '',
    city: '高雄市',
    district: '仁武區',
    birthdate: '',
    occupation: occupations[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ✨ 修改：回傳 Translation Key 而不是寫死的中文
  const calculatePasswordStrength = (password) => {
    // 若空值，回傳空資料
    if (!password) return { labelKey: '', color: '', width: '0%', tipKeys: [] };

    let score = 0;
    let tipKeys = []; // 儲存建議的 Key

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLong = password.length >= 12;

    if (password.length >= 8) score += 1;
    
    let varietyCount = 0;
    if (hasLower) varietyCount++;
    if (hasUpper) varietyCount++;
    if (hasNumber) varietyCount++;
    if (hasSpecial) varietyCount++;
    score += varietyCount;

    if (isLong) score += 2;

    // 累積建議 Key
    if (score < 5) {
        if (!isLong) tipKeys.push('auth.tip_length');
        if (!hasNumber) tipKeys.push('auth.tip_number');
        if (!hasSpecial) tipKeys.push('auth.tip_symbol');
        if (!hasUpper && !hasLower) tipKeys.push('auth.tip_letter');
    }

    // 判定等級 Key
    if (score < 3) return { labelKey: 'auth.strength_weak', color: 'bg-red-500', width: '33%', tipKeys };
    if (score < 5) return { labelKey: 'auth.strength_medium', color: 'bg-yellow-500', width: '66%', tipKeys };
    return { labelKey: 'auth.strength_strong', color: 'bg-green-500', width: '100%', tipKeys: [] };
  };

  const pwdStrength = calculatePasswordStrength(formData.password);

  useEffect(() => {
    if (isOpen) {
      setIsLoginView(true);
      setError('');
      setLoading(false);
      setFormData({
        username: '',
        password: '',
        email: '',
        fullName: '',
        gender: 'Male',
        genderOther: '',
        city: '高雄市',
        district: '仁武區',
        birthdate: '',
        occupation: occupations[0]
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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

    const API_BASE = import.meta.env.VITE_API_URL || '';
    const endpoint = isLoginView
      ? `${API_BASE}/api/login`
      : `${API_BASE}/api/register`;

    try {
      const res = await axios.post(endpoint, formData, {
        withCredentials: true
      });

      if (isLoginView) {
        onLoginSuccess(res.data.user);
        onClose();
      } else {
        // ✨ 替換 alert 文字
        alert(t('auth.success_register'));
        setIsLoginView(true);
      }
    } catch (err) {
      // ✨ 優先使用後端回傳的錯誤，若無則使用通用錯誤 Key
      const errorMsg = err.response?.data?.error || t('auth.error_generic');
      setError(errorMsg);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <LayoutGroup>
        <motion.div
          layout
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-transparent w-full max-w-5xl md:w-[900px] h-[650px] relative flex flex-col md:flex-row shadow-2xl rounded-3xl"
        >
          <motion.div layout className={`hidden md:flex md:w-4/12 h-full z-20 ${isLoginView ? 'md:order-1' : 'md:order-2'}`}>
            <AuthImagePanel isLoginView={isLoginView} />
          </motion.div>

          <motion.div
            layout
            className={`
              w-full md:w-8/12 flex flex-col h-full bg-white relative z-10
              ${isLoginView ? 'md:order-2 md:rounded-r-3xl md:rounded-l-none' : 'md:order-1 md:rounded-l-3xl md:rounded-r-none'}
              rounded-3xl md:rounded-none overflow-hidden
            `}
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-30 text-white/90 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition">
              <FaTimes size={16} />
            </button>

            <AuthHeader isLoginView={isLoginView} />

            <div
              ref={scrollRef}
              className={`flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col ${isLoginView ? 'justify-center' : ''}`}
            >
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 flex-shrink-0 shadow-sm"
                  >
                    <span className="text-lg">⚠️</span> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4 pb-2">
                <div className="space-y-3">
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                    <input
                      type="text"
                      name="username"
                      placeholder={t('auth.username')} // ✨ 替換
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative group">
                    <FaLock className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t('auth.password')} // ✨ 替換
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  
                  {/* ✨ 密碼強度提示 - 這邊邏輯有大改，使用 map + t() */}
                  {!isLoginView && formData.password.length > 0 && (
                    <div className="space-y-1 mt-2 px-1">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${pwdStrength.color} transition-all duration-500`} 
                                    style={{ width: pwdStrength.width }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                {t('auth.strength_label')} {t(pwdStrength.labelKey)}
                            </span>
                        </div>
                        
                        {pwdStrength.tipKeys.length > 0 && (
                            <p className="text-xs text-slate-400 pl-1">
                                {t('auth.tip_prefix')}
                                {pwdStrength.tipKeys.slice(0, 2).map(key => t(key)).join('、')}...
                            </p>
                        )}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {!isLoginView && (
                    <RegisterFields formData={formData} handleChange={handleChange} />
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-200/50 mt-4 transform active:scale-[0.98]"
                >
                  {loading ? '...' : isLoginView ? t('auth.login_btn') : t('auth.register_btn')}
                </button>
              </form>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white text-center text-sm text-gray-500 flex-shrink-0 z-10">
              {isLoginView ? t('auth.switch_to_register') : t('auth.switch_to_login')}
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError('');
                }}
                className="text-emerald-600 font-bold ml-2 hover:underline transition"
              >
                {isLoginView ? t('auth.register_link') : t('auth.login_link')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </div>
  );
};

export default AuthModal;