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
    // Najpierw sprawdź parametr URL lang (ma najwyższy priorytet)
    const getLanguageFromURL = (): Language | null => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'en' || langParam === 'pl') {
          return langParam as Language;
        }
      }
      return null;
    };

    const urlLanguage = getLanguageFromURL();
    
    // Następnie sprawdź localStorage, jeśli nie ma parametru URL
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    // Ustal język - kolejność: URL > localStorage > domyślny 'pl'
    const detectedLanguage = urlLanguage || 
                            (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl') ? savedLanguage : 'pl');
    
    setLanguageState(detectedLanguage);
    setTranslations(detectedLanguage === 'en' ? en : pl);
    
    // Aktualizuj localStorage, jeśli język pochodzi z URL
    if (urlLanguage && urlLanguage !== savedLanguage) {
      localStorage.setItem('language', urlLanguage);
    }
    
    // Ustaw atrybut lang w HTML
    document.documentElement.lang = detectedLanguage;
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