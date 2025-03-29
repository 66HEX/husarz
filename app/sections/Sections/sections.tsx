"use client";

import Image from "next/image";
import Link from "next/link";
import {useRef, RefObject} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import {ArrowUpRight} from 'lucide-react';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Sections = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const sectionImagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const overlaysRef = useRef<(HTMLDivElement | null)[]>([]);
    const overlayTitlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const overlayDescsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const overlayBadgesRef = useRef<(HTMLDivElement | null)[]>([]);
    const overlayButtonsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const cornerButtonsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const { translations } = useLanguage();

    useGSAP(() => {
        // Inicjalizacja SplitText dla różnych elementów
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        
        // Najpierw sprawdzamy czy elementu istnieją przed użyciem SplitText
        // Zabezpieczenie dla titleRef
        let titleSplit;
        let title = [];
        if (titleRef.current) {
            titleSplit = new SplitText(titleRef.current, { type: "lines" });
            title = titleSplit.lines;
            
            // Dodaj wrapper do titleRef
            new SplitText(titleRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
        }

        // Dodaj wrapper do descRef
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#sections",
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
        
        // Dalsza część animacji
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        )
        .fromTo(
            '.feature-card',
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1
            },
            "-=0.6"
        )
        .fromTo(
            '.equipment-badge',
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02
            },
            "-=0.4"
        );
        
        // Animacje hover dla kart sekcji
        featureCardsRef.current.forEach((card, index) => {
            if (!card) return;
            
            const image = sectionImagesRef.current[index];
            const overlay = overlaysRef.current[index];
            const overlayTitle = overlayTitlesRef.current[index];
            const overlayDesc = overlayDescsRef.current[index];
            const overlayBadges = overlayBadgesRef.current[index];
            const overlayButton = overlayButtonsRef.current[index];
            
            // Ustawiamy początkowe style dla elementów nakładki
            if (overlay) {
                gsap.set(overlay, { opacity: 0 });
            }
            
            const elementsToAnimate = [overlayTitle, overlayDesc, overlayBadges, overlayButton].filter(Boolean);
            gsap.set(elementsToAnimate, { 
                y: 15, 
                opacity: 0 
            });
            
            // Tworzymy timeline dla efektu hover
            const hoverTl = gsap.timeline({ paused: true });
            
            // Animacja obrazu i nakładki
            if (image && overlay) {
                hoverTl
                    .fromTo(image, 
                        { scale: 1 },
                        { 
                            scale: 1.05, 
                            duration: 0.7, 
                            ease: "power2.out" 
                        }, 0)
                    .fromTo(overlay, 
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 0.3,
                            ease: "power1.out"
                        }, 0);
            }
            
            // Animacja tytułu
            if (overlayTitle) {
                hoverTl.fromTo(overlayTitle, 
                    { y: 15, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.4, 
                        ease: "back.out(1.7)" 
                    }, 0.1);
            }
            
            // Animacja opisu
            if (overlayDesc) {
                hoverTl.fromTo(overlayDesc, 
                    { y: 15, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.4, 
                        ease: "back.out(1.7)" 
                    }, 0.2);
            }
            
            // Animacja odznak
            if (overlayBadges) {
                hoverTl.fromTo(overlayBadges, 
                    { y: 15, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        stagger: 0.03, 
                        duration: 0.4, 
                        ease: "back.out(1.7)" 
                    }, 0.3);
            }
            
            // Animacja przycisku
            if (overlayButton) {
                hoverTl.fromTo(overlayButton, 
                    { y: 15, opacity: 0 },
                    { 
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
                });
                
                card.addEventListener('mouseleave', () => {
                    hoverTl.reverse();
                });
            }
        });
    }, [translations]);

    return (
        <section id="sections" className="py-16 md:py-24 mt-16 md:mt-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {/* Używamy tylko titleRef dla tytułu */}
                    <h2 
                        ref={titleRef}  
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        {translations.sections.sections.title}
                    </h2>
                    <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                        {translations.sections.sections.description}
                    </p>
                </div>

                <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {translations.features.map((feature, index) => (
                        <div 
                            key={index} 
                            ref={(el: HTMLDivElement | null) => {
                                featureCardsRef.current[index] = el;
                            }}
                            className="feature-card relative rounded-card overflow-hidden bg-card backdrop-blur-md border border-border transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                {/* Obraz sekcji */}
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                    ref={(el: HTMLImageElement | null) => {
                                        sectionImagesRef.current[index] = el;
                                    }}
                                />
                                
                                {/* Nakładka gradientowa */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                
                                {/* Podstawowe informacje zawsze widoczne */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{feature.title}</h3>
                                    
                                    {/* Pokaż dwa pierwsze elementy wyposażenia */}
                                    <div className="flex flex-wrap gap-2">
                                        {feature.equipment.slice(0, 2).map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="equipment-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                        {feature.equipment.length > 2 && (
                                            <span className="equipment-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full">
                                                +{feature.equipment.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Szczegółowy opis - pokazywany na hover z animacjami */}
                                <div 
                                    ref={(el: HTMLDivElement | null) => {
                                        overlaysRef.current[index] = el;
                                    }}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-sm p-5 flex flex-col justify-end"
                                >
                                    <h3 
                                        ref={(el: HTMLHeadingElement | null) => {
                                            overlayTitlesRef.current[index] = el;
                                        }}
                                        className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-white"
                                    >
                                        {feature.title}
                                    </h3>
                                    <p 
                                        ref={(el: HTMLParagraphElement | null) => {
                                            overlayDescsRef.current[index] = el;
                                        }}
                                        className="text-white/80 tracking-tight mb-4 text-sm"
                                    >
                                        {feature.description}
                                    </p>
                                    
                                    <div 
                                        ref={(el: HTMLDivElement | null) => {
                                            overlayBadgesRef.current[index] = el;
                                        }}
                                        className="flex flex-wrap gap-2 mt-1 mb-3"
                                    >
                                        {feature.equipment.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="equipment-badge tracking-tight text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2 py-0.5 rounded-full"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {/* Przycisk Zobacz szczegóły */}
                                    <Link
                                        href={`/sections/${feature.slug}`}
                                        ref={(el: HTMLAnchorElement | null) => {
                                            overlayButtonsRef.current[index] = el;
                                        }}
                                        className="mt-2 inline-flex items-center justify-center space-x-2 text-white text-sm border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                                    >
                                        <span>{translations.seeDetails || "Zobacz szczegóły"}</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                
                                {/* Przycisk w prawym górnym rogu */}
                                <Link
                                    href={`/sections/${feature.slug}`}
                                    ref={(el: HTMLAnchorElement | null) => {
                                        cornerButtonsRef.current[index] = el;
                                    }}
                                    className="absolute top-4 right-4 z-10 flex items-center justify-center bg-black p-2 rounded-icon hover:shadow-lg transition-shadow duration-300 hidden"
                                >
                                    <ArrowUpRight className="w-5 h-5 text-white" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Sections;