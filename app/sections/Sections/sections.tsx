"use client";

import Image from "next/image";
import Link from "next/link";
import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import {ArrowUpRight} from 'lucide-react';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Sections = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const featuresRef = useRef(null);
    const gradientTitleRef = useRef(null);
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

        // Osobna obsługa dla gradientTitleRef
        let gradientTitleSplit;
        let gradientTitle = [];
        if (gradientTitleRef.current) {
            
            // Pierwszy podział na linie
            gradientTitleSplit = new SplitText(gradientTitleRef.current, { type: "lines" });
            gradientTitle = gradientTitleSplit.lines;
            
            
            // Bardzo ważne - najpierw stosujemy klasę do linii
            new SplitText(gradientTitleRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
            
            // TERAZ aplikujemy gradient do każdej linii stworzonej przez SplitText
            // Ważne: musimy to zrobić PO drugim SplitText, aby zastosować style
            // do aktualnych elementów DOM
            gradientTitle.forEach(line => {
                line.style.backgroundImage = 'linear-gradient(to bottom, #FFFFFF, rgba(15, 23, 42, 0.1))';
                line.style.webkitBackgroundClip = 'text';
                line.style.webkitTextFillColor = 'transparent';
                line.style.backgroundClip = 'text';
                line.style.color = 'transparent';
                line.style.display = 'block';
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

        // Animacja dla gradientowego tytułu (jeśli istnieje)
        if (gradientTitle.length > 0) {
            tl.fromTo(
                gradientTitle,
                { y: '100%' },
                { y: '0%', duration: 0.8 }
            );
        }
        
        // Animacja dla zwykłego tytułu (jeśli istnieje)
        if (title.length > 0) {
            tl.fromTo(
                title,
                { y: '100%' },
                { y: '0%', duration: 0.8 },
                gradientTitle.length > 0 ? "-=0.4" : ""
            );
        }
        
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
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card) => {
            const image = card.querySelector('.section-image');
            const overlay = card.querySelector('.section-hidden-details');
            const overlayTitle = card.querySelector('.overlay-title');
            const overlayDesc = card.querySelector('.overlay-description');
            const overlayBadges = card.querySelectorAll('.overlay-badges .equipment-badge');
            const overlayButton = card.querySelector('.overlay-button');
            
            // Ustawiamy początkowe style dla elementów nakładki
            gsap.set(overlay, { opacity: 0 });
            gsap.set([overlayTitle, overlayDesc, overlayBadges, overlayButton], { 
                y: 15, 
                opacity: 0 
            });
            
            // Tworzymy timeline dla efektu hover
            const hoverTl = gsap.timeline({ paused: true });
            
            // Animacja obrazu i nakładki
            hoverTl
                .to(image, { 
                    scale: 1.05, 
                    duration: 0.7, 
                    ease: "power2.out" 
                }, 0)
                .to(overlay, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power1.out"
                }, 0);
            
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
            
            // Animacja odznak
            if (overlayBadges.length > 0) {
                hoverTl.to(overlayBadges, { 
                    y: 0, 
                    opacity: 1, 
                    stagger: 0.03, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.3);
            }
            
            // Animacja przycisku
            if (overlayButton) {
                hoverTl.to(overlayButton, { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }, 0.4);
            }
            
            // Dodaj event listenery do karty
            card.addEventListener('mouseenter', () => {
                hoverTl.play();
            });
            
            card.addEventListener('mouseleave', () => {
                hoverTl.reverse();
            });
            
            // Animacja dla przycisku w górnym rogu
            const cornerButton = card.querySelector('.corner-button');
            if (cornerButton) {
                const buttonTl = gsap.timeline({ paused: true });
                buttonTl
                    .to(cornerButton, {
                        scale: 0.9,
                        duration: 0.1,
                        ease: "power1.inOut"
                    })
                    .to(cornerButton, {
                        scale: 1.1,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    });
                
                cornerButton.addEventListener('mousedown', () => {
                    buttonTl.play();
                });
                
                cornerButton.addEventListener('mouseup', () => {
                    buttonTl.reverse();
                });
                
                cornerButton.addEventListener('mouseleave', () => {
                    if (buttonTl.progress() > 0 && buttonTl.progress() < 1) {
                        buttonTl.reverse();
                    }
                });
            }
        });
    }, [translations]);

    return (
        <section id="sections" className="py-16 md:py-24 mt-16 md:mt-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {/* Używamy tylko gradientTitleRef dla tytułu */}
                    <h2 
                        ref={gradientTitleRef}  
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        {translations.sections.sections.title}
                    </h2>
                    <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                        {translations.sections.sections.description}
                    </p>
                </div>

                <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                    {translations.features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="feature-card relative rounded-card overflow-hidden bg-card backdrop-blur-md border border-border transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                {/* Obraz sekcji */}
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="section-image object-cover"
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
                                <div className="section-hidden-details absolute inset-0 bg-black/75 backdrop-blur-sm p-5 flex flex-col justify-end">
                                    <h3 className="overlay-title text-xl md:text-2xl font-bold tracking-tight mb-2 text-white">{feature.title}</h3>
                                    <p className="overlay-description text-white/80 tracking-tight mb-4 text-sm">{feature.description}</p>
                                    
                                    <div className="overlay-badges flex flex-wrap gap-2 mt-1 mb-3">
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
                                        className="overlay-button mt-2 inline-flex items-center justify-center space-x-2 text-white text-sm border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                                    >
                                        <span>{translations.seeDetails || "Zobacz szczegóły"}</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                
                                {/* Przycisk w prawym górnym rogu */}
                                <Link
                                    href={`/sections/${feature.slug}`}
                                    className="corner-button absolute top-4 right-4 z-10 flex items-center justify-center bg-white p-2 rounded-icon hover:shadow-lg transition-shadow duration-300"
                                >
                                    <ArrowUpRight className="w-5 h-5 text-black" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style jsx global>{`
                /* Upewnijmy się, że linie mają poprawne style dla gradientu */
                .line-wrapper {
                    display: block;
                    overflow: hidden;
                }
                
                /* Dodatkowe zabezpieczenie dla animacji */
                #sections .text-transparent {
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-fill-color: transparent;
                }
                
                /* Dla płynniejszych animacji */
                .feature-card {
                    will-change: transform, opacity;
                    transform: translateZ(0);
                }
                
                .section-image {
                    will-change: transform;
                    transform: translateZ(0);
                    transition: transform 0.7s ease-out;
                }
                
                /* Efekt hover */
                .feature-card:hover .section-image {
                    transform: scale(1.05);
                }
                
                /* Zapobieganie blikom podczas animacji */
                .overlay-title,
                .overlay-description,
                .equipment-badge,
                .overlay-button {
                    backface-visibility: hidden;
                    transform: translateZ(0);
                    will-change: transform, opacity;
                }
            `}</style>
        </section>
    );
};

export default Sections;