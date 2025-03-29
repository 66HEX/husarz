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

const Contact = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
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
      
      new SplitText(descRef.current, {
          type: "lines",
          linesClass: "line-wrapper overflow-hidden",
      });
      
      const texts = childSplit.lines;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        end: "bottom bottom",
      },
      defaults: { ease: "CustomEase" }
    });

    tl.fromTo(
      title,
      { y: '100%' },
      { y: '0%', duration: 0.8 },
  );
    
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
      <section id="contact" className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {translations.sections.contact.title}
            </h2>
            <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
              {translations.sections.contact.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lewa kolumna z informacjami kontaktowymi */}
            <div className="lg:col-span-1" ref={contactRef}>
              <div className="rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-6 h-full">
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{translations.sections.contact.gymName}</h3>
                
                <div className="space-y-6">
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-icon bg-card border border-border">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{translations.sections.contact.address}</h4>
                      <p className="text-text-secondary text-sm mb-2">Trakt św. Wojciecha 235A</p>
                      <p className="text-text-secondary text-sm">80-017 Gdańsk</p>
                    </div>
                  </div>
                  
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-icon bg-card border border-border">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{translations.sections.contact.phone}</h4>
                      <a href="tel:+48500123456" className="text-text-secondary text-sm hover:text-primary transition-colors">
                        +48 500 123 456
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-info flex items-start">
                    <div className="p-2 mr-4 rounded-icon bg-card border border-border">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{translations.sections.contact.openingHours}</h4>
                      <p className="text-text-secondary text-sm mb-1">{translations.sections.contact.weekdays}</p>
                      <p className="text-text-secondary text-sm mb-1">{translations.sections.contact.saturday}</p>
                      <p className="text-text-secondary text-sm">{translations.sections.contact.sunday}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">{translations.sections.contact.amenities}</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="info-badge tracking-tight text-xs bg-card backdrop-blur-sm border border-border text-text-primary px-2 py-0.5 rounded-full">
                      {translations.sections.contact.freeParking}
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card backdrop-blur-sm border border-border text-text-primary px-2 py-0.5 rounded-full">
                      {translations.sections.contact.changingRooms}
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card backdrop-blur-sm border border-border text-text-primary px-2 py-0.5 rounded-full">
                      {translations.sections.contact.cardioZone}
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card backdrop-blur-sm border border-border text-text-primary px-2 py-0.5 rounded-full">
                      {translations.sections.contact.saunas}
                    </span>
                    <span className="info-badge tracking-tight text-xs bg-card backdrop-blur-sm border border-border text-text-primary px-2 py-0.5 rounded-full">
                      {translations.sections.contact.supplementStore}
                    </span>
                  </div>
                </div>
                
                <a 
                  href="https://maps.google.com/maps?ll=54.3211,18.6259&z=16&t=m&hl=pl&gl=PL&q=Husarz+GYM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center space-x-2 bg-card text-text-primary text-sm border border-border rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                >
                  <span>{translations.sections.contact.directions}</span>
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
      </section>
  );
};

export default Contact;