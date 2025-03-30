"use client";

import {useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import gsap from 'gsap';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(SplitText, useGSAP);

const Hero = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const badgesContainerRef = useRef<HTMLDivElement>(null);
    const sportBadgesRefs = useRef<HTMLSpanElement[]>([]);
    const ctaButtonRef = useRef<HTMLAnchorElement>(null);
    const { translations } = useLanguage();

    // Function to add refs to sport badges with proper TypeScript typing
    const addToBadgesRefs = (el: HTMLSpanElement | null) => {
        if (el && !sportBadgesRefs.current.includes(el)) {
            sportBadgesRefs.current.push(el);
        }
    };

    useGSAP(() => {
        // Title animation setup with SplitText
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
        
        // Subtitle animation setup
        let subtitleSplit;
        let subtitle = [];
        if (subtitleRef.current) {
            subtitleSplit = new SplitText(subtitleRef.current, { type: "lines" });
            subtitle = subtitleSplit.lines;
            
            new SplitText(subtitleRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
        }
        
        // Description animation setup
        if (descRef.current) {
            const childSplit = new SplitText(descRef.current, { type: "lines" });
            new SplitText(descRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
            
            let texts = childSplit.lines;

            // Create main timeline with enhanced animations
            const tl = gsap.timeline({ defaults: { ease: "CustomEase" } });

            // Initial overlay animation
            if (overlayRef.current) {
                tl.fromTo(
                    overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 1.2 },
                    0
                );
            }

            // Image scale animation - using ref instead of selector
            if (heroImageRef.current) {
                tl.fromTo(
                    heroImageRef.current,
                    { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.5 },
                    0
                );
            }

            // Title animation with staggered effect
            tl.fromTo(
                title,
                { y: '100%' },
                { y: '0%', duration: 1, stagger: 0.1 },
                0.5
            );

            // Subtitle animation
            tl.fromTo(
                subtitle,
                { y: '100%' },
                { y: '0%', duration: 0.8, stagger: 0.05 },
                0.8
            );

            // Description text animation
            tl.fromTo(
                texts,
                { y: '100%' },
                { y: '0%', stagger: 0.05, duration: 0.8 },
                1.0
            );

            // Sport badges animation with improved stagger - using refs array
            tl.fromTo(
                sportBadgesRefs.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
                1.2
            );

            // CTA button animation with bounce effect
            if (ctaButtonRef.current) {
                tl.fromTo(
                    ctaButtonRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    1.4
                );
            }

            // Add scroll-triggered animations for parallax effect
            if (imageContainerRef.current && containerRef.current) {
                gsap.to(imageContainerRef.current, {
                    y: '10%',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }
    }, [translations]);

    return (
        <section id='home' ref={containerRef} className=" w-full flex items-center justify-center pt-20 md:pt-24 overflow-hidden">
            <div className="px-2 md:px-8 h-full w-full">
                <div className="h-full border border-border rounded-3xl p-8 bg-card relative overflow-hidden">
                    {/* Full-width image container with parallax effect */}
                    <div 
                        ref={imageContainerRef}
                        className="absolute inset-0 overflow-hidden z-0"
                    >
                        <Image
                            ref={heroImageRef}
                            src="/husarz_26.jpg"
                            alt="Hero image"
                            fill
                            className="object-cover"
                            priority
                        />
                        
                        {/* Enhanced gradient overlay with more dramatic effect */}
                        <div 
                            ref={overlayRef}
                            className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"
                        ></div>
                    </div>
                    
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                        <div className="max-w-4xl mx-auto">
                            {/* Main title with larger size and dramatic styling */}
                            <div className="overflow-hidden mb-2">
                                <h1 
                                    ref={titleRef} 
                                    className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white"
                                >
                                    {translations.sections.hero.title}
                                </h1>
                            </div>
                            
                            {/* Added subtitle for more visual hierarchy */}
                            <div className="overflow-hidden mb-4">
                                <h2 
                                    ref={subtitleRef} 
                                    className="text-2xl md:text-3xl font-bold tracking-tight text-white/90"
                                >
                                    Strength & Combat
                                </h2>
                            </div>
                            
                            {/* Description with improved styling */}
                            <div className="overflow-hidden mb-8 max-w-2xl mx-auto">
                                <p 
                                    ref={descRef} 
                                    className="text-text-secondary text-base md:text-xl tracking-tight"
                                >
                                    {translations.sections.hero.description}
                                </p>
                            </div>
                            
                            {/* Sport badges with improved styling */}
                            <div 
                                ref={badgesContainerRef}
                                className="flex flex-wrap justify-center gap-3 mb-8"
                            >
                                {Object.values(translations.sports).map((sport, index) => (
                                    <span
                                        key={sport.id}
                                        ref={addToBadgesRefs}
                                        className="sport-badge tracking-tight text-sm bg-active border border-border text-text-primary px-4 py-1.5 rounded-full"
                                    >
                                        {sport.name}
                                    </span>
                                ))}
                            </div>
                            
                            {/* CTA button with enhanced styling and animation */}
                            <div className="mt-6">
                                <Link
                                    href="/about"
                                    ref={ctaButtonRef}
                                    className="inline-flex items-center justify-center bg-text-primary tracking-tight text-text-black border border-border px-8 py-3 rounded-icon font-medium hover:bg-white/90 transition-all duration-300 group"
                                >
                                    <span className="mr-2">{translations.homebutton}</span>
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;