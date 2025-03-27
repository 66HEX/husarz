"use client";

import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import {MapPin, Phone, Clock, ExternalLink} from 'lucide-react';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Location = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const gradientTitleRef = useRef(null);
  const contactRef = useRef(null);
  const { translations } = useLanguage();

  useGSAP(() => {
      const childSplit = new SplitText(descRef.current, { type: "lines" });
      
      // Obsługa dla zwykłego tytułu (jeśli będzie używany)
      let titleSplit;
      let title = [];
      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, { type: "lines" });
        title = titleSplit.lines;
        
        new SplitText(titleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
      }
      
      // Osobna obsługa dla gradientowego tytułu
      let gradientTitleSplit;
      let gradientTitle = [];
      if (gradientTitleRef.current) {
        
        // Pierwszy podział na linie
        gradientTitleSplit = new SplitText(gradientTitleRef.current, { type: "lines" });
        gradientTitle = gradientTitleSplit.lines;
        
        
        // Dodajemy klasę do linii, aby kontrolować overflow
        new SplitText(gradientTitleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        // TERAZ aplikujemy gradient do każdej linii
        gradientTitle.forEach(line => {
            line.style.backgroundImage = 'linear-gradient(to bottom, #FFFFFF, rgba(15, 23, 42, 0.1))';
            line.style.webkitBackgroundClip = 'text';
            line.style.webkitTextFillColor = 'transparent';
            line.style.backgroundClip = 'text';
            line.style.color = 'transparent';
            line.style.display = 'block';
        });
      }
      
      new SplitText(descRef.current, {
          type: "lines",
          linesClass: "line-wrapper overflow-hidden",
      });
      
      const texts = childSplit.lines;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#location",
        start: "top 80%",
        end: "bottom bottom",
      },
      defaults: { ease: "CustomEase" }
    });

    // Jeśli mamy gradient title, animujemy to
    if (gradientTitle.length > 0) {
      tl.fromTo(
          gradientTitle,
          { y: '100%' },
          { y: '0%', duration: 0.8 }
      );
    }
    
    // Jeśli mamy zwykły title, animujemy to (warunkowe - w zależności czy używasz titleRef czy gradientTitleRef)
    if (title.length > 0) {
      tl.fromTo(
          title,
          { y: '100%' },
          { y: '0%', duration: 0.8 },
          gradientTitle.length > 0 ? "-=0.4" : ""
      );
    }
    
    // Reszta animacji
    tl.fromTo(
        texts,
        { y: '100%' },
        { y: '0%', stagger: 0.05, duration: 0.8 },
        "-=0.4"
    )
    .fromTo(
        '#map-container',
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
        "-=0.4"
    )
    .fromTo(
        '.contact-info',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
        "-=0.8"
    )
    .fromTo(
        '.info-badge',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
        "-=0.4"
    );
  }, [translations]);

  return (
      <section id="location" className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 ref={gradientTitleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {translations.sections.location.title}
            </h2>
            <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
              {translations.sections.location.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lewa kolumna z informacjami kontaktowymi */}
            <div className="lg:col-span-1" ref={contactRef}>
              <div className="rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-6 h-full">
                <h3 className="text-2xl font-bold mb-6 tracking-tight">Husarz GYM</h3>
                
                <div className="space-y-6">
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-full bg-card/50 border border-border">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Adres</h4>
                      <p className="text-text-secondary text-sm mb-2">Trakt Świętego Wojciecha 235A</p>
                      <p className="text-text-secondary text-sm">80-017 Gdańsk</p>
                    </div>
                  </div>
                  
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-full bg-card/50 border border-border">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Telefon</h4>
                      <a href="tel:+48500123456" className="text-text-secondary text-sm hover:text-primary transition-colors">
                        +48 500 123 456
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-full bg-card/50 border border-border">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Godziny otwarcia</h4>
                      <p className="text-text-secondary text-sm mb-1">Poniedziałek - Piątek: 6:00 - 22:00</p>
                      <p className="text-text-secondary text-sm mb-1">Sobota: 8:00 - 20:00</p>
                      <p className="text-text-secondary text-sm">Niedziela: 9:00 - 18:00</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Udogodnienia</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="info-badge tracking-tight text-xs bg-card/50 border border-border text-secondary px-2 py-0.5 rounded-full">
                      Darmowy parking
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card/50 border border-border text-secondary px-2 py-0.5 rounded-full">
                      Szatnie z prysznicami
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card/50 border border-border text-secondary px-2 py-0.5 rounded-full">
                      Strefa kardio
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card/50 border border-border text-secondary px-2 py-0.5 rounded-full">
                      Sauny
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card/50 border border-border text-secondary px-2 py-0.5 rounded-full">
                      Sklep z suplementami
                    </span>
                  </div>
                </div>
                
                <a 
                  href="https://maps.google.com/maps?ll=54.3211,18.6259&z=16&t=m&hl=pl&gl=PL&q=Husarz+GYM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                >
                  <span>Wyznacz trasę w Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            
            {/* Prawa kolumna z mapą - teraz zajmuje 2/3 szerokości */}
            <div className="lg:col-span-2">
              <div id="map-container"
                   className="rounded-card overflow-hidden bg-card backdrop-blur-md border border-border relative h-full min-h-[400px]">
                  <iframe
                      src="https://www.google.com/maps/embed/v1/place?q=Husarz+GYM,+Trakt+Świętego+Wojciecha,+Gdańsk,+Poland&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                      width="100%"
                      height="100%"
                      style={{border: 0, filter: 'grayscale(85%) invert(92%) hue-rotate(180deg) brightness(100%) contrast(100%)'}}  
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full absolute inset-0"
                  />
              </div>
            </div>
          </div>
        </div>
        
        <style jsx global>{`
            .line-wrapper {
                display: block;
                overflow: hidden;
            }
            
            #location .text-transparent {
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
            }
        `}</style>
      </section>
  );
};

export default Location;