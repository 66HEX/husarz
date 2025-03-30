"use client";

import { useRef, useEffect } from 'react';
import InfiniteMarquee from './infiniteMarquee';
import { useLanguage } from '@/app/i18n/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Rejestracja plugina GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const InfiniteMarqueeExample = () => {
  const { translations } = useLanguage();
  const items = translations.marquee.items;
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !marqueeRef.current) return;

    // Ukryj marquee na początku (przesunięte w dół)
    gsap.set(marqueeRef.current, { 
      yPercent: 100,
      opacity: 0
    });
    
    // Animacja wyłaniania się z dołu
    gsap.to(marqueeRef.current, {
      yPercent: 0,
      opacity: 1,
      duration: 1.4,
      ease: "CustomEase",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative bg-card py-4 md:py-8 mx-4 md:mx-8 rounded-3xl border border-border overflow-hidden"
    >
      {/* Left vignette */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />

      {/* Wrapper z overflow hidden dla animacji */}
      <div className="overflow-hidden">
        <div ref={marqueeRef}>
          <InfiniteMarquee
            items={items}
            speed={1}
            spacing={40}
            itemClassName="text-5xl md:text-7xl font-bold text-text-primary"
          />
        </div>
      </div>

      {/* Right vignette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

export default InfiniteMarqueeExample;