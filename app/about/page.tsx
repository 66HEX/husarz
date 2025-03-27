"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from '@/app/libs/gsap/SplitText';
import { useGSAP } from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const AboutUs = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const statsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        // Utworzenie głównej osi czasu dla wszystkich animacji
        const mainTimeline = gsap.timeline();
        
        // Dodanie animacji obrazu głównego
        mainTimeline.fromTo(
            '#main-image',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            0 // Start na początku osi czasu
        );
        
        // Przetwarzanie wszystkich sekcji
        const sections = Array.from({ length: 5 }, (_, i) => {
            const headingIndex = i;
            const startParagraphIndex = i === 0 ? 0 : 1 + (i - 1) * 2;
            const paragraphCount = i === 0 ? 1 : 2;

            const heading = headingsRef.current[headingIndex];
            const paragraphs = paragraphsRef.current.slice(startParagraphIndex, startParagraphIndex + paragraphCount);

            const headingSplit = heading ? new SplitText(heading, { type: "lines" }) : null;
            if (heading) {
                new SplitText(heading, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
            }

            const paragraphSplits = paragraphs.map(paragraph => {
                if (!paragraph) return null;
                const split = new SplitText(paragraph, { type: "lines" });
                new SplitText(paragraph, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
                return split;
            });

            return {
                heading,
                headingSplit,
                paragraphSplits
            };
        });

        // Dodanie wszystkich animacji do osi czasu w sekwencji
        sections.forEach((section, sectionIndex) => {
            // Animacja nagłówka
            if (section.headingSplit) {
                mainTimeline.fromTo(
                    section.headingSplit.lines,
                    { y: '100%' },
                    { 
                        y: '0%', 
                        duration: 0.8,
                        // Dodanie opóźnienia tylko dla sekcji po pierwszej
                        delay: sectionIndex === 0 ? 0 : 0.2
                    },
                    sectionIndex === 0 ? 0 : ">-=0.4" // Parametr pozycji
                );
            }

            // Animacja paragrafów
            section.paragraphSplits.forEach((split, i) => {
                if (!split) return;
                mainTimeline.fromTo(
                    split.lines,
                    { y: '100%' },
                    {
                        y: '0%',
                        duration: 0.8,
                        stagger: 0.05,
                    },
                    ">-=0.6"  // Nakładanie się z poprzednią animacją
                );
            });
        });

        // Animacja statystyk jeśli istnieją
        statsRef.current.forEach((stat, index) => {
            if (!stat) return;
            mainTimeline.fromTo(
                stat,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1
                },
                ">-=0.4"
            );
        });
    }, []);

    const { translations } = useLanguage();
    
    return (
        <div ref={containerRef} className="min-h-screen bg-background">
            <div className="flex flex-col md:flex-row">
                {/* Sekcja ze stałym obrazem */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative md:sticky md:top-0 rounded-b-[3rem] md:rounded-r-[3rem] overflow-hidden">
                    <Image
                        id="main-image"
                        src="/grey.png"
                        alt="Husarz Gym Interior"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Sekcja z treścią */}
                <div className="w-full md:w-1/2 px-4 md:px-12 py-16 md:py-24" ref={contentRef}>
                    {/* Sekcja główna */}
                    <div className="mb-16">
                        <div className="overflow-hidden mb-4">
                            <h1
                                ref={(el) => {
                                    if (el) headingsRef.current[0] = el;
                                }}
                                className="text-4xl md:text-6xl font-bold"
                            >
                                {translations.about.title}
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <p
                                ref={(el) => {
                                    if (el) paragraphsRef.current[0] = el;
                                }}
                                className="text-text-secondary text-lg md:text-xl"
                            >
                                {translations.about.mainDescription}
                            </p>
                        </div>
                    </div>

                    {/* Sekcje historyczne */}
                    <div className="space-y-16">
                        {translations.about.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                <div className="overflow-hidden mb-4">
                                    <h2
                                        ref={(el) => {
                                            if (el) headingsRef.current[sectionIndex + 1] = el;
                                        }}
                                        className="text-2xl md:text-3xl font-bold"
                                    >
                                        {section.title}
                                    </h2>
                                </div>
                                {section.paragraphs.map((paragraph, paragraphIndex) => {
                                    const globalParagraphIndex = sectionIndex === 0 
                                        ? paragraphIndex + 1 
                                        : 1 + paragraphIndex + (sectionIndex * 2);
                                    
                                    return (
                                        <div key={paragraphIndex} className={`overflow-hidden ${paragraphIndex === 0 ? 'mb-6' : ''}`}>
                                            <p
                                                ref={(el) => {
                                                    if (el) paragraphsRef.current[globalParagraphIndex] = el;
                                                }}
                                                className="text-text-secondary"
                                            >
                                                {paragraph}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;