import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    const { i18n } = useTranslation();

    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.body.dir = direction;
        document.documentElement.lang = i18n.language;
    }, [direction, i18n.language]);

    return (
        <div className="flex min-h-screen bg-gray-50 w-screen plus-jakarta-sans" dir={direction}>
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;