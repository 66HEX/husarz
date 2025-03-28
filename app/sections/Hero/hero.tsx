"use client";

import {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import gsap from 'gsap';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(SplitText, useGSAP);

const Hero = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const containerRef = useRef(null);
    const { translations } = useLanguage();

    useGSAP(() => {
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
        
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;

        const tl = gsap.timeline({ defaults: { ease: "CustomEase" } });

        tl.fromTo(
            title,
            { y: '100%' },
            { y: '0%', duration: 0.8 }
        );

        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 1.2 },
            "-=0.4"
        )
            .fromTo(
                '.sport-badge',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
                "-=0.4"
            )

        tl.fromTo(
            '#hero-image',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            "-=1.2"
        )
            .fromTo(
                '#cta-button',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.8"
            );
    }, [translations]);

    return (
        <section id="home" className="py-24 h-svh md:h-[66vh] xl:h-svh relative">
            <div className="absolute inset-0 rounded-b-[3rem] overflow-hidden border border-border">
                <Image
                    id="hero-image"
                    src="/husarz_26.jpg"
                    alt="Hero image"
                    fill
                    className="object-cover"
                    priority
                />
                <div id="hero-background-overlay" className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                </div>
            
            <div ref={containerRef} className="h-full container mx-auto px-4 md:px-8 relative z-10">
                <div className="h-full flex flex-col justify-center gap-8">
                    <div className="max-w-2xl">
                        <div className="bg-card backdrop-blur-md border border-border p-6 md:p-8 rounded-card">
                        <div className="overflow-hidden mb-4">
                            <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">
                                {translations.sections.hero.title}
                            </h1>
                        </div>
                        <div className="overflow-hidden mb-6">
                            <p ref={descRef} className="text-text-secondary text-base xl:text-xl tracking-tight">
                                {translations.sections.hero.description}
                            </p>
                        </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(translations.sports).map((sport) => (
                                    <span
                                        key={sport.id}
                                        className="sport-badge tracking-tight text-xs bg-card backdrop-blur-md border border-border text-secondary px-3 py-1 rounded-full"
                                    >
                                        {sport.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center md:justify-start">
                        <Link
                            href="/about"
                            id="cta-button"
                            className="bg-text-primary tracking-tight text-text-black backdrop-blur-sm border border-border px-6 py-2 rounded-icon font-medium"
                        >
                            {translations.homebutton}
                        </Link>
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
                #home .text-transparent {
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-fill-color: transparent;
                }
            `}</style>  
          
        </section>
    );
};

export default Hero;