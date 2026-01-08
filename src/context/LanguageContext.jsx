import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to French, or get from localStorage
    const [targetLanguage, setTargetLanguage] = useState(() => {
        return localStorage.getItem('targetLanguage') || 'French';
    });

    useEffect(() => {
        localStorage.setItem('targetLanguage', targetLanguage);
    }, [targetLanguage]);

    const toggleLanguage = (lang) => {
        setTargetLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ targetLanguage, setTargetLanguage: toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
