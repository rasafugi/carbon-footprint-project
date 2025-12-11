import React from 'react';
import { useTranslation } from 'react-i18next'; // ✨ 引入

const AuthHeader = ({ isLoginView }) => {
  const { t } = useTranslation(); // ✨ 使用 hook
  
  const cornerClass = isLoginView ? 'md:rounded-none md:rounded-tr-3xl' : 'md:rounded-none md:rounded-tl-3xl';

  return (
    <div className={`bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex-shrink-0 relative overflow-hidden rounded-t-3xl ${cornerClass} -mr-[1px] -mt-[1px] -ml-[1px] w-[calc(100%+2px)]`}>
        <div className="relative z-10 text-white pl-4">
            <h2 className="text-2xl font-bold tracking-wide">
                {/* ✨ 替換文字 */}
                {isLoginView ? t('auth.welcome') : t('auth.create_account')}
            </h2>
            <p className="text-emerald-100 text-sm mt-1 opacity-90">
                {/* ✨ 替換文字 */}
                {isLoginView ? t('auth.login_desc') : t('auth.register_desc')}
            </p>
        </div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default AuthHeader;