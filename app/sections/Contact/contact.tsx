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
  const badgeRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const { translations } = useLanguage();

  useGSAP(() => {
      const childSplit = new SplitText(descRef.current, { type: "lines" });
      
      new SplitText(descRef.current, {
          type: "lines",
          linesClass: "line-wrapper overflow-hidden",
      });
      
      const texts = childSplit.lines;

      // Referencje do elementów w karcie kontaktowej
      const contactCard = document.querySelector('.contact-card');
      const contactTitle = document.querySelector('.contact-card h3');
      const contactIcons = document.querySelectorAll('.contact-icon-container');
      const contactLabels = document.querySelectorAll('.contact-info h4');
      const contactTexts = document.querySelectorAll('.contact-text');
      const amenitiesTitle = document.querySelector('.amenities-title');
      const contactButton = document.querySelector('.contact-button');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 80%",
          end: "bottom bottom",
        },
        defaults: { ease: "CustomEase" }
      });

      // Animacja badge zamiast headera
      tl.fromTo(
          badgeRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6 },
      );
      
      // Animacja tekstu opisu
      tl.fromTo(
          texts,
          { y: '100%' },
          { y: '0%', stagger: 0.05, duration: 0.8 },
          "-=0.4"
      );

      // Animacja karty kontaktowej i mapy (równolegle)
      tl.fromTo(
          contactCard,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
      )
      .fromTo(
          '#map-container',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.8"
      );
      
      // Animacja tytułu karty
      tl.fromTo(
          contactTitle,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.6"
      );
      
      // Animacja ikon
      tl.fromTo(
          contactIcons,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5 },
          "-=0.4"
      );
      
      // Animacja etykiet kontaktowych
      tl.fromTo(
          contactLabels,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
          "-=0.7"
      );
      
      // Animacja tekstów kontaktowych
      tl.fromTo(
          contactTexts,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 },
          "-=0.8"
      );

      // Animacja tytułu sekcji udogodnień
      tl.fromTo(
          amenitiesTitle,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.6"
      );
      
      // Animacja odznak udogodnień
      tl.fromTo(
          '.info-badge',
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
          "-=0.4"
      );
      
      // Animacja przycisku
      tl.fromTo(
          contactButton,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
      );
  }, [translations]);

  return (
      <section id="contact" className="overflow-hidden">
        <div className="px-4 md:px-8">
          <div className='py-4 md:py-8 border bg-card border-border rounded-3xl p-4 md:p-8'>
            {/* Grid identyczny jak w komponentach Sections, Coaches i FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-4 md:mb-8">
              <div className="flex flex-col">
                {/* Badge w lewym górnym rogu z ref dla animacji */}
                <div className="mb-4">
                  <span 
                    ref={badgeRef}
                    className="inline-block tracking-tight text-sm bg-active border border-border text-white px-3 py-1 rounded-full"
                  >
                    {translations.sections.contact.title || "Kontakt"}
                  </span>
                </div>
              </div>
              
              {/* Opis w drugim gridzie od lewej */}
              <div className="flex items-center col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                  {translations.sections.contact.description}
                </p>
              </div>
              
              {/* Trzecia kolumna na większych ekranach (pusta) */}
              <div></div>
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lewa kolumna z informacjami kontaktowymi */}
              <div className="lg:col-span-1" ref={contactRef}>
                <div className="contact-card rounded-2xl overflow-hidden bg-innercard border border-border p-6 h-full">
                  <h3 className="text-2xl font-bold mb-6 tracking-tight">{translations.sections.contact.gymName}</h3>
                  
                  <div className="space-y-6">
                    <div className="contact-info flex items-start">
                      <div className="contact-icon-container p-2 mr-4 rounded-full bg-active border border-border">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{translations.sections.contact.address}</h4>
                        <p className="contact-text text-text-secondary text-sm mb-2">Trakt św. Wojciecha 235A</p>
                        <p className="contact-text text-text-secondary text-sm">80-017 Gdańsk</p>
                      </div>
                    </div>
                    
                    <div className="contact-info flex items-start">
                      <div className="contact-icon-container p-2 mr-4 rounded-full bg-active border border-border">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{translations.sections.contact.phone}</h4>
                        <a href="tel:+48500123456" className="contact-text text-text-secondary text-sm hover:text-primary transition-colors">
                          +48 500 123 456
                        </a>
                      </div>
                    </div>
                    
                    <div className="contact-info flex items-start">
                      <div className="contact-icon-container p-2 mr-4 rounded-full bg-active border border-border">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{translations.sections.contact.openingHours}</h4>
                        <p className="contact-text text-text-secondary text-sm mb-1">{translations.sections.contact.weekdays}</p>
                        <p className="contact-text text-text-secondary text-sm mb-1">{translations.sections.contact.saturday}</p>
                        <p className="contact-text text-text-secondary text-sm">{translations.sections.contact.sunday}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="amenities-title font-medium mb-3">{translations.sections.contact.amenities}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="info-badge tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full">
                        {translations.sections.contact.freeParking}
                      </span>
                      <span className="info-badge tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full">
                        {translations.sections.contact.changingRooms}
                      </span>
                      <span className="info-badge tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full">
                        {translations.sections.contact.cardioZone}
                      </span>
                      <span className="info-badge tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full">
                        {translations.sections.contact.saunas}
                      </span>
                      <span className="info-badge tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full">
                        {translations.sections.contact.supplementStore}
                      </span>
                    </div>
                  </div>
                  
                  <a 
                    href="https://maps.google.com/maps?ll=54.3211,18.6259&z=16&t=m&hl=pl&gl=PL&q=Husarz+GYM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-button mt-8 inline-flex w-full items-center justify-center space-x-2 bg-active text-white text-sm border border-borderactive rounded-full px-4 py-2 hover:bg-active2 transition-colors"
                  >
                    <span>{translations.sections.contact.directions}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              
              {/* Prawa kolumna z mapą - teraz zajmuje 2/3 szerokości */}
              <div className="lg:col-span-2">
                <div id="map-container"
                     className="rounded-2xl overflow-hidden bg-innercard border border-border relative h-full min-h-[400px]">
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
        </div>
      </section>
  );
};

export default Contact;