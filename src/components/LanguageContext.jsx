import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('kisanmitra_language') || 'hi';
    });

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('kisanmitra_language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const t = (translations) => {
    const { language } = useLanguage();
    return translations[language] || translations.hi || translations.en || '';
};