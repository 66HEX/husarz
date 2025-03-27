'use client';

import React, { useCallback } from 'react';
import { useLanguage } from '@/app/i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = useCallback((newLanguage: 'en' | 'pl') => {
    // Zapisujemy nowy język w localStorage bez wywoływania setLanguage
    localStorage.setItem('language', newLanguage);
    
    // Dodajemy parametr do URL, aby wymusić pełne odświeżenie strony
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLanguage);
      window.location.href = url.toString();
    }
  }, []);

  return (
    <div className="flex items-center space-x-2 ml-2">
      <button
        onClick={() => handleLanguageChange('pl')}
        className={`text-sm px-2 py-1 rounded-icon transition-colors duration-300 ${language === 'pl' ? 'bg-text-primary text-text-black' : 'text-text-secondary hover:text-text-primary'}`}
      >
        PL
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`text-sm px-2 py-1 rounded-icon transition-colors duration-300 ${language === 'en' ? 'bg-text-primary text-text-black' : 'text-text-secondary hover:text-text-primary'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;