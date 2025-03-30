"use client";

import { useState, useEffect } from 'react';
import { Observer } from 'gsap/Observer';
import gsap from 'gsap';

// Typ kierunku scrollowania
type ScrollDirection = 'up' | 'down' | null;

// Hook do globalnego śledzenia kierunku scrollowania
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    // Upewniamy się, że GSAP Observer jest zarejestrowany
    gsap.registerPlugin(Observer);

    // Tworzymy globalny obserwator scrollowania
    const observer = Observer.create({
      target: window, // nasłuchujemy na całym oknie
      type: 'wheel,touch,scroll', // reagujemy na różne rodzaje scrollowania
      onChangeY: (self) => {
        // Aktualizujemy kierunek na podstawie delty scrollowania
        setScrollDirection(self.deltaY > 0 ? 'down' : 'up');
      },
      // Nie blokujemy domyślnego zachowania scrollowania
      preventDefault: false
    });

    // Czyszczenie przy odmontowaniu komponentu
    return () => {
      observer.kill();
    };
  }, []);

  return scrollDirection;
};

// Opcjonalnie: kontekst do udostępniania stanu kierunku scrollowania w całej aplikacji
import { createContext, useContext, ReactNode } from 'react';

const ScrollDirectionContext = createContext<ScrollDirection>(null);

interface ScrollDirectionProviderProps {
  children: ReactNode;
}

export const ScrollDirectionProvider = ({ children }: ScrollDirectionProviderProps) => {
  const direction = useScrollDirection();

  return (
    <ScrollDirectionContext.Provider value={direction}>
      {children}
    </ScrollDirectionContext.Provider>
  );
};

export const useGlobalScrollDirection = () => {
  return useContext(ScrollDirectionContext);
};