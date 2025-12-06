import React from 'react';
import LanguageSwitcher from "../UI/LanguageSwitcher.jsx";
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold inline-block text-primary">{t('header.title')}</h1>
                    <span className="ps-1.5 text-gray-500">{t('header.beta')}</span>
                    <p className="text-secondary text-sm mt-1">{t('header.subtitle')}</p>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher/>
                </div>
            </div>
        </header>
    );
};

export default Header;