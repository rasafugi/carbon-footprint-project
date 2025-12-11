// frontend/src/components/Auth/RegisterFields.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';
import { taiwanPlaces, occupations } from '../../data/options';

const RegisterFields = ({ formData, handleChange }) => {
  return (
    <motion.div 
        initial={{ opacity: 0, height: 0 }} 
        animate={{ opacity: 1, height: 'auto' }} 
        exit={{ opacity: 0, height: 0 }} 
        className="space-y-4 overflow-hidden"
    >
        <div className="relative group pt-1">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400 transition group-focus-within:text-emerald-600" />
            <input 
                type="email" // ✨ 確保 type 是 email，瀏覽器會自動驗證格式
                name="email" 
                placeholder="電子信箱 (example@mail.com)" 
                required 
                value={formData.email} // ✨ 綁定 value
                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                onChange={handleChange} 
            />
        </div>
        
        <div className="relative group">
            <span className="absolute left-4 top-3 text-gray-400 transition group-focus-within:text-emerald-600 text-lg">📝</span>
            <input type="text" name="fullName" placeholder="真實姓名" required 
                className="w-full pl-11 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                onChange={handleChange} />
        </div>

        {/* 性別選擇 */}
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

        {/* 地區選擇 */}
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

        {/* 生日與職業 */}
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
  );
};

export default RegisterFields;