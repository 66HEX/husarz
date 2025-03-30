"use client";

import { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisContext } from '@/app/components/SmoothScrolling/smoothScrolling';
import '@/app/config/gsap';

// Importujemy funkcję horizontalLoop z pliku loopHelper.js
import { horizontalLoop } from '@/app/libs/loopHelper.js';
import { useScrollDirection } from '@/app/hooks/useScrollDirection'; // Zakładamy, że stworzymy taki hook

interface InfiniteMarqueeProps {
  items: string[];
  className?: string;
  itemClassName?: string;
  speed?: number;
  spacing?: number;
  reversed?: boolean;
  repeat?: number;
}

const InfiniteMarquee = ({
  items,
  className = '',
  itemClassName = '',
  speed = 1,
  spacing = 20,
  reversed = false,
  repeat = -1
}: InfiniteMarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const loopRef = useRef<gsap.core.Timeline | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  
  // Rejestrujemy wtyczki GSAP
  gsap.registerPlugin(ScrollTrigger, Observer);
  
  // Używamy globalnego hooka do śledzenia kierunku scrollowania
  const scrollDirection = useScrollDirection();

  useLayoutEffect(() => {
    if (marqueeRef.current && itemsRef.current.length > 0) {
      // Czekamy na załadowanie fontów
      document.fonts.ready.then(() => {
        // Upewniamy się, że mamy wystarczającą liczbę elementów dla płynnej pętli
        // Tworzymy wystarczającą liczbę kopii elementów, aby zapełnić całą szerokość kontenera
        const originalElements = [...itemsRef.current];
        
        // Tworzymy animację marquee
        const loop = horizontalLoop(itemsRef.current, {
          repeat,
          speed,
          reversed,
          paddingRight: spacing // Dodajemy paddingRight równy spacing dla ostatniego elementu
        });
        
        loopRef.current = loop;
      });
    }
    
    // Czyszczenie przy odmontowaniu komponentu
    return () => {
      if (loopRef.current) {
        loopRef.current.kill();
      }
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [speed, spacing, reversed, repeat]);
  
  // Efekt reagujący na zmiany kierunku scrollowania
  useEffect(() => {
    if (loopRef.current) {
      // Zatrzymujemy poprzednią animację zmiany kierunku jeśli istnieje
      tlRef.current && tlRef.current.kill();
      
      // Określamy kierunek na podstawie globalnego stanu
      const factor = scrollDirection === 'down' ? 1 : -1;
      
      // Tworzymy nową animację płynnej zmiany kierunku
      tlRef.current = gsap.timeline()
        .to(loopRef.current, { timeScale: speed * factor, duration: 0.125 })
        .to(loopRef.current, { timeScale: 1 * factor, duration: 0.5 });
    }
  }, [scrollDirection, speed]);

  return (
    <div 
      ref={marqueeRef} 
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div className="flex">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className={`inline-block ${itemClassName}`}
            style={{ 
              marginRight: `${spacing}px`,
              paddingRight: index === items.length - 1 ? `${spacing / 4}px` : '0'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMarquee;