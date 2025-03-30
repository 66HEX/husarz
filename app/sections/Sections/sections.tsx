"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import {ArrowUpRight} from 'lucide-react';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

const Sections = () => {
    const badgeRef = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardTitlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const cardDescsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const equipmentBadgesRef = useRef<(HTMLDivElement | null)[]>([]);
    const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const { translations } = useLanguage();

    useGSAP(() => {
        // Inicjalizacja SplitText dla opisu
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        
        // Dodaj wrapper do descRef
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;

        // Przygotowanie animacji dla tekstów kart
        const cardTitleSplits: SplitText[] = [];
        const cardTitleLines: HTMLElement[] = [];
        const cardDescSplits: SplitText[] = [];
        const cardDescLines: HTMLElement[] = [];
        
        // Kolekcje elementów do animacji (z referencji)
        const featureCards: HTMLDivElement[] = featureCardsRef.current.filter(Boolean) as HTMLDivElement[];
        const equipmentBadges: HTMLDivElement[] = [];
        equipmentBadgesRef.current.forEach(badgeContainer => {
            if (badgeContainer && badgeContainer.children) {
                Array.from(badgeContainer.children).forEach(badge => {
                    equipmentBadges.push(badge as HTMLDivElement);
                });
            }
        });
        const buttons: HTMLAnchorElement[] = buttonRefs.current.filter(Boolean) as HTMLAnchorElement[];

        // Przetwarzanie tytułów kart
        cardTitlesRef.current.forEach((titleEl) => {
            if (titleEl) {
                // Tworzenie SplitText dla tytułu karty
                const cardTitleSplit = new SplitText(titleEl, { type: "lines" });
                cardTitleSplits.push(cardTitleSplit);
                cardTitleLines.push(...cardTitleSplit.lines);
                
                // Dodanie wrappera dla tytułów kart
                new SplitText(titleEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
            }
        });

        // Przetwarzanie opisów kart
        cardDescsRef.current.forEach((descEl) => {
            if (descEl) {
                // Tworzenie SplitText dla opisu karty
                const cardDescSplit = new SplitText(descEl, { type: "lines" });
                cardDescSplits.push(cardDescSplit);
                cardDescLines.push(...cardDescSplit.lines);
                
                // Dodanie wrappera dla opisów kart
                new SplitText(descEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
            }
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#sections",
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
        
        // Dalsza część animacji
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        )
        tl.fromTo(
            featureCards,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1
            },
            "-=0.6"
        )
        
        // Animacja tytułów kart
        tl.fromTo(
            cardTitleLines,
            { y: '100%' },
            { 
                y: '0%', 
                stagger: 0.03, 
                duration: 0.7,
            },
            "-=0.4"
        )
        
        // Animacja opisów kart
        tl.fromTo(
            cardDescLines,
            { y: '100%' },
            { 
                y: '0%', 
                stagger: 0.02, 
                duration: 0.7,
            },
            "-=0.5"
        )
        
        // Animacja odznak wyposażenia
       tl.fromTo(
            equipmentBadges,
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02
            },
            "-=0.4"
        )
        
        // Animacja przycisków
        tl.fromTo(
            buttons,
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05
            },
            "-=0.3"
        );
    }, [translations]);

    return (
        <section id="sections" className="overflow-hidden">
            <div className="px-2 md:px-8">
                <div className='py-4 md:py-8 border bg-card border-border rounded-3xl p-4 md:p-8 '>
                    {/* Grid identyczny jak ten dla kart poniżej */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-4 md:mb-8">
                        <div className="flex flex-col">
                            {/* Badge w lewym górnym rogu z ref dla animacji */}
                            <div className="mb-4">
                                <span 
                                    ref={badgeRef}
                                    className="inline-block tracking-tight text-sm bg-active border border-border text-white px-3 py-1 rounded-full"
                                >
                                    {translations.sections.sections.title || "Sekcje"}
                                </span>
                            </div>
                        </div>
                        
                        {/* Opis w drugim gridzie od lewej */}
                        <div className="flex items-center col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                            <p ref={descRef} className="text-text-secondary tracking-tight text-base md:text-lg">
                                {translations.sections.sections.description}
                            </p>
                        </div>
                        
                        {/* Trzecia kolumna na większych ekranach (pusta) */}
                        <div></div>
                    </div>

                    <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {translations.features.map((feature, index) => (
                            <div 
                                key={index}
                                ref={(el: HTMLDivElement | null) => {
                                    featureCardsRef.current[index] = el;
                                }}
                                className="relative rounded-2xl overflow-hidden bg-innercard border border-border flex flex-col h-full"
                            >
                                {/* Kontener obrazu z paddingiem */}
                                <div className="p-4">
                                    <div className="relative aspect-square overflow-hidden rounded-xl">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Informacje i opis */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 
                                        ref={(el: HTMLHeadingElement | null) => {
                                            cardTitlesRef.current[index] = el;
                                        }}
                                        className="text-xl md:text-2xl font-bold tracking-tight mb-3"
                                    >
                                        {feature.title}
                                    </h3>
                                    
                                    <p 
                                        ref={(el: HTMLParagraphElement | null) => {
                                            cardDescsRef.current[index] = el;
                                        }}
                                        className="text-text-secondary tracking-tight mb-4 text-sm"
                                    >
                                        {feature.description}
                                    </p>
                                    
                                    <div 
                                        ref={(el: HTMLDivElement | null) => {
                                            equipmentBadgesRef.current[index] = el;
                                        }}
                                        className="flex flex-wrap gap-2 mt-auto mb-4"
                                    >
                                        {feature.equipment.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {/* Przycisk zawsze na dole z marginesem auto-top */}
                                    <div className="pt-4">
                                        <Link
                                            href={`/sections/${feature.slug}`}
                                            ref={(el: HTMLAnchorElement | null) => {
                                                buttonRefs.current[index] = el;
                                            }}
                                            className="w-full inline-flex items-center bg-active justify-center space-x-2 text-white text-sm border border-borderactive rounded-full px-4 py-2 hover:bg-active2 transition-colors"
                                        >
                                            <span>{translations.seeDetails || "Zobacz szczegóły"}</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sections;