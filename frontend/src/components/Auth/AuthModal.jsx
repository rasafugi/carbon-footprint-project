import React, { useState, useEffect, useRef } from 'react'; // ✨ 引入 useRef
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { occupations, taiwanPlaces } from '../../data/options';

// 子元件
import AuthImagePanel from './AuthImagePanel';
import AuthHeader from './AuthHeader';
import RegisterFields from './RegisterFields';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const scrollRef = useRef(null); // ✨ 用來控制捲動

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

  const [showPassword, setShowPassword] = useState(false); // ✨ 控制密碼顯示

  // ✨ 密碼強度計算函式
  const calculatePasswordStrength = (password) => {
    if (!password) return { label: '', color: '', width: '0%', tips: [] };

    let score = 0;
    let tips = [];

    // --- 基礎檢測 ---
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLong = password.length >= 12;

    // --- 給分邏輯 ---
    // 1. 長度基本分
    if (password.length >= 8) score += 1;
    
    // 2. 類型多樣性 (最多拿 3 分)
    let varietyCount = 0;
    if (hasLower) varietyCount++;
    if (hasUpper) varietyCount++;
    if (hasNumber) varietyCount++;
    if (hasSpecial) varietyCount++;
    score += varietyCount;

    // 3. 長度獎勵 (關鍵修改：夠長直接 +2，讓純英數長密碼也能高分)
    if (isLong) score += 2;

    // --- 產生建議 ---
    // 如果分數未達標 (小於 5)，才給建議
    if (score < 5) {
        if (!isLong) tips.push("增加長度");
        if (!hasNumber) tips.push("加入數字");
        if (!hasSpecial) tips.push("加入符號");
        if (!hasUpper && !hasLower) tips.push("加入英文"); // 防呆
    }

    // --- 判定等級 ---
    // 弱: 0-2 分
    // 中: 3-4 分
    // 強: 5 分以上 (例如: 8碼+英+數+符號=1+3=4分(中) / 12碼+英+數=1+2+2=5分(強))
    if (score < 3) return { label: '弱', color: 'bg-red-500', width: '33%', tips };
    if (score < 5) return { label: '中等', color: 'bg-yellow-500', width: '66%', tips };
    return { label: '強', color: 'bg-green-500', width: '100%', tips: [] };
  };

  const pwdStrength = calculatePasswordStrength(formData.password);

  useEffect(() => {
    if (isOpen) {
      setIsLoginView(true);
      setError('');
      setLoading(false);
      // 重置表單...
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
        alert('註冊成功！請登入。');
        setIsLoginView(true);
      }
    } catch (err) {
      // ✨ 錯誤處理與自動捲動
      const errorMsg = err.response?.data?.error || '發生錯誤，請稍後再試';
      setError(errorMsg);
      // 如果 scrollRef 存在，捲動到最上方
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
          {/* --- 圖片區塊 --- */}
          <motion.div layout className={`hidden md:flex md:w-4/12 h-full z-20 ${isLoginView ? 'md:order-1' : 'md:order-2'}`}>
            <AuthImagePanel isLoginView={isLoginView} />
          </motion.div>

          {/* --- 表單內容區塊 --- */}
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

            {/* --- 表單區 (加入 ref) --- */}
            <div
              ref={scrollRef} // ✨ 綁定 ref
              className={`flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col ${isLoginView ? 'justify-center' : ''}`}
            >
              {/* 錯誤提示 (紅色區塊) */}
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
                {/* 帳號密碼 */}
                <div className="space-y-3">
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                    <input
                      type="text"
                      name="username"
                      placeholder="使用者帳號"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative group">
                    <FaLock className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
                    <input
                      type={showPassword ? "text" : "password"} // ✨ 動態切換 type
                      name="password"
                      placeholder="密碼"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      // ✨ 增加 padding-right (pr-10) 避免文字被眼睛圖示擋住
                      className="w-full pl-11 pr-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    
                    {/* ✨ 顯示/隱藏密碼按鈕 */}
                    <button
                      type="button" // 務必設為 button，避免觸發 submit
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  
                  {/* ✨ 密碼強度提示 (只在註冊時且密碼有輸入時顯示) */}
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
                                強度：{pwdStrength.label}
                            </span>
                        </div>
                        
                        {/* 顯示改善建議 */}
                        {pwdStrength.tips.length > 0 && (
                            <p className="text-xs text-slate-400 pl-1">
                                💡 建議：{pwdStrength.tips.slice(0, 2).join('、')}...
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
                  {loading ? '處理中...' : isLoginView ? '立即登入' : '註冊帳號'}
                </button>
              </form>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white text-center text-sm text-gray-500 flex-shrink-0 z-10">
              {isLoginView ? '還沒有帳號嗎？' : '已經有帳號了？'}
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError(''); // 切換時清除錯誤
                }}
                className="text-emerald-600 font-bold ml-2 hover:underline transition"
              >
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