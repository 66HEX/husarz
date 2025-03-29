"use client";

import {Instagram} from 'lucide-react';
import { useRef, RefObject } from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Coaches = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const coachCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const coachImagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const overlaysRef = useRef<(HTMLDivElement | null)[]>([]);
    const overlayTitlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const overlayDescsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const overlaySpecialtiesRef = useRef<(HTMLDivElement | null)[]>([]);
    const overlayInstasRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const { translations } = useLanguage();

    useGSAP(() => {
        // Podstawowe animacje tekstu
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        const titleSplit = new SplitText(titleRef.current, { type: "lines"});
        
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        new SplitText(titleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;
        const title = titleSplit.lines;
        // Główna animacja przy scrollowaniu
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#coaches",
                start: "top 80%",
                end: "bottom bottom",
            },
            defaults: { ease: "CustomEase" }
        });

        tl.fromTo(
            title,
            { y: '100%' },
            { y: '0%', duration: 0.8 }
        )
        
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        )
        .fromTo(
            '.coach-card',
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1
            },
            "-=0.6"
        )
        .fromTo(
            '.specialty-badge',
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02
            },
            "-=0.4"
        );
        
        // Animacje hoveru dla kart trenerów z GSAP - identycznie jak w komponencie Sections
        coachCardsRef.current.forEach((card, index) => {
            if (!card) return;
            
            const coachImage = coachImagesRef.current[index];
            const overlay = overlaysRef.current[index];
            const overlayTitle = overlayTitlesRef.current[index];
            const overlayDesc = overlayDescsRef.current[index];
            const overlaySpecialties = overlaySpecialtiesRef.current[index];
            const overlayInsta = overlayInstasRef.current[index];
            
            // Ustawiamy początkowe style dla elementów nakładki
            if (overlay) {
                gsap.set(overlay, { opacity: 0 });
            }
            
            const elementsToAnimate = [overlayTitle, overlayDesc, overlaySpecialties, overlayInsta].filter(Boolean);
            gsap.set(elementsToAnimate, { 
                y: 15, 
                opacity: 0 
            });
            
            // Tworzymy timeline dla efektu hover
            const hoverTl = gsap.timeline({ paused: true });
            
            // Animacja obrazu i nakładki
            if (coachImage && overlay) {
                hoverTl
                    .to(coachImage, { 
                        scale: 1.05, 
                        duration: 0.7, 
                        ease: "power2.out" 
                    }, 0)
                    .to(overlay, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power1.out"
                    }, 0);
            }
            
            // Animacja tytułu
            if (overlayTitle) {
                hoverTl.to(overlayTitle, { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.1);
            }
            
            // Animacja opisu
            if (overlayDesc) {
                hoverTl.to(overlayDesc, { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.2);
            }
            
            // Animacja specjalizacji
            if (overlaySpecialties) {
                hoverTl.to(overlaySpecialties, { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.3);
            }
            
            // Animacja linku do instagrama
            if (overlayInsta) {
                hoverTl.to(overlayInsta, { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.4);
            }
            
            // Dodaj event listenery do karty
            if (card) {
                card.addEventListener('mouseenter', () => {
                    hoverTl.play();
                    // Włącz pointer-events aby linki były klikalne
                    if (overlay) {
                        gsap.set(overlay, { pointerEvents: 'auto' });
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    hoverTl.reverse();
                    // Po zakończeniu animacji wyłącz pointer-events
                    setTimeout(() => {
                        if (overlay && !card.matches(':hover')) {
                            gsap.set(overlay, { pointerEvents: 'none' });
                        }
                    }, 200);
                });
            }
        });
    }, [translations]);

    return (
        <section id="coaches" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 
                        ref={titleRef} 
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        {translations.sections.coaches.title}
                    </h2>
                    <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                        {translations.sections.coaches.description}
                    </p>
                </div>
                    
                {/* Układ dla pionowych zdjęć */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {translations.coaches.map((coach, index) => (
                        <div
                            key={index}
                            ref={(el: HTMLDivElement | null) => {
                                coachCardsRef.current[index] = el;
                            }}
                            className="coach-card relative rounded-card overflow-hidden bg-card backdrop-blur-md border border-border flex flex-col h-full coach-container"
                            data-coach-id={index}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    ref={(el: HTMLImageElement | null) => {
                                        coachImagesRef.current[index] = el;
                                    }}
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-full object-cover transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                
                                <a
                                    href={`https://instagram.com/${coach.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 flex items-center justify-center bg-black p-2 rounded-icon z-10 hover:shadow-lg transition-all duration-300 hidden"
                                >
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                                
                                {/* Informacje o trenerze umieszczone na zdjęciu - zawsze widoczne */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{coach.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {coach.specialties.slice(0, 2).map((specialty, idx) => (
                                            <span
                                                key={idx}
                                                className="specialty-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                        {coach.specialties.length > 2 && (
                                            <span className="specialty-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full">
                                                +{coach.specialties.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Panel z pełnymi informacjami - pokazywany na hover z animacjami jak w Sections */}
                            <div 
                                ref={(el: HTMLDivElement | null) => {
                                    overlaysRef.current[index] = el;
                                }}
                                className="coach-overlay absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex flex-col justify-end overflow-y-auto pointer-events-none">
                                <h3 
                                    ref={(el: HTMLHeadingElement | null) => {
                                        overlayTitlesRef.current[index] = el;
                                    }}
                                    className="overlay-title text-xl md:text-2xl font-bold tracking-tight mb-2 text-white">{coach.name}</h3>
                                <p 
                                    ref={(el: HTMLParagraphElement | null) => {
                                        overlayDescsRef.current[index] = el;
                                    }}
                                    className="overlay-description text-white/80 tracking-tight mb-4 text-sm">{coach.description}</p>
                                <div 
                                    ref={(el: HTMLDivElement | null) => {
                                        overlaySpecialtiesRef.current[index] = el;
                                    }}
                                    className="overlay-specialties flex flex-wrap gap-2">
                                    {coach.specialties.map((specialty, idx) => (
                                        <span
                                            key={idx}
                                            className="specialty-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    ref={(el: HTMLAnchorElement | null) => {
                                        overlayInstasRef.current[index] = el;
                                    }}
                                    href={`https://instagram.com/${coach.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="overlay-insta mt-4 inline-flex items-center justify-center space-x-2 text-white text-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                                >
                                    <Instagram className="w-4 h-4" />
                                    <span>@{coach.instagram}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Coaches;