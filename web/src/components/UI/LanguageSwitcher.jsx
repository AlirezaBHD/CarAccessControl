import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2 text-sm font-bold bg-white/10 p-1 rounded-lg">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-accent1 text-primary' : 'text-gray-500'}`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('ar')}
                className={`px-3 py-1 rounded transition-colors ${i18n.language === 'ar' ? 'bg-accent1 text-primary' : 'text-gray-500'}`}
            >
                العربية
            </button>
        </div>
    );
};

export default LanguageSwitcher;