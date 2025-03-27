"use client";

import Image from "next/image";
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '@/app/libs/gsap/SplitText';
import { useGSAP } from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

interface Section {
    title: string;
    description: string;
    image: string;
    extendedDescription: string[];
    slug: string;
}

interface SectionContentProps {
    section: Section;
}

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function SectionContent({ section }: SectionContentProps) {
    const { language, translations } = useLanguage();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const gradientTitleRef = useRef<HTMLHeadingElement>(null); // Dodajemy referencję dla tytułu z gradientem
    const descRef = useRef<HTMLParagraphElement>(null);
    const extendedDescRefs = useRef<HTMLParagraphElement[]>([]);
    
    // Znajdź odpowiednią sekcję w tłumaczeniach na podstawie slug
    const translatedSection = translations.features.find(
        (feature) => feature.slug === section.slug
    ) || section;

    useGSAP(() => {
        // Main title and description animation
        if (!descRef.current) return;

        const childSplit = new SplitText(descRef.current, { type: "lines" });
        
        // Obsługa zwykłego tytułu (jeśli jest używany)
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
        
        // Obsługa gradientowego tytułu
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

        // Extended description splits
        const extendedSplits = extendedDescRefs.current.map((ref) => {
            const split = new SplitText(ref, { type: "lines" });
            new SplitText(ref, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
            return split.lines;
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section-content",
                start: "top 80%",
                end: "bottom 20%",
            },
            defaults: { ease: "CustomEase" }
        });
        
        // Add image animation at the beginning
        tl.fromTo(
            '#section-image',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            0
        );

        // Animacja gradientowego tytułu (jeśli istnieje)
        if (gradientTitle.length > 0) {
            tl.fromTo(
                gradientTitle,
                { y: '100%' },
                { y: '0%', duration: 0.8 }
            );
        }
        // Animacja zwykłego tytułu (jeśli istnieje i nie ma gradientowego)
        else if (title.length > 0) {
            tl.fromTo(
                title,
                { y: '100%' },
                { y: '0%', duration: 0.8 }
            );
        }
        
        // Animacja tekstu opisu
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        );

        // Add extended description animations to the timeline
        extendedSplits.forEach((split) => {
            tl.fromTo(
                split,
                { y: '100%' },
                {
                    y: '0%',
                    duration: 0.8,
                    stagger: 0.05,
                },
                "-=0.6"
            );
        });
    }, [translations]);

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative md:sticky md:top-0 rounded-b-[3rem] md:rounded-r-[3rem] overflow-hidden">
                    <Image
                        id="section-image"
                        src={translatedSection.image}
                        alt={translatedSection.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-12 py-16 md:py-24">
                    <div id="section-content">
                        <div className="mb-16">
                            <h1 ref={gradientTitleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                                {translatedSection.title}
                            </h1>
                            <p ref={descRef} className="text-lg md:text-xl text-text-primary tracking-tight">
                                {translatedSection.description}
                            </p>
                        </div>

                        <div className="space-y-8 mb-16">
                            {translatedSection.extendedDescription.map((desc, idx) => (
                                <div key={idx} className="overflow-hidden">
                                    <p
                                        ref={(el) => {
                                            if (el) {
                                                extendedDescRefs.current[idx] = el;
                                            }
                                        }}
                                        className="text-text-secondary text-base tracking-tight"
                                    >
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Dodajemy style dla lepszej obsługi gradientu */}
            <style jsx global>{`
                /* Upewnijmy się, że linie mają poprawne style dla gradientu */
                .line-wrapper {
                    display: block;
                    overflow: hidden;
                }
                
                /* Dodatkowe zabezpieczenie dla animacji */
                .text-transparent {
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}