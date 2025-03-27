'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from './en';
import { pl } from './pl';

type Language = 'en' | 'pl';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
}

const defaultLanguageContext: LanguageContextType = {
  language: 'pl',
  translations: pl,
  setLanguage: () => {}
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pl');
  const [translations, setTranslations] = useState<Translations>(pl);

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl')) {
      setLanguageState(savedLanguage);
      setTranslations(savedLanguage === 'en' ? en : pl);
    }
    
    // Set the html lang attribute to match the current language
    document.documentElement.lang = language;
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setTranslations(newLanguage === 'en' ? en : pl);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
  };

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};