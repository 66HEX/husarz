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
    const { translations } = useLanguage();
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const extendedDescRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const imageRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Znajdź odpowiednią sekcję w tłumaczeniach na podstawie slug
    const translatedSection = translations.features.find(
        (feature) => feature.slug === section.slug
    ) || section;

    useGSAP(() => {
        // Title and description text splits
        const titleSplit = new SplitText(titleRef.current, { type: "lines" });
        const descSplit = new SplitText(descRef.current, { type: "lines" });
        
        new SplitText(titleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const titleLines = titleSplit.lines;
        const descLines = descSplit.lines;
        
        // Define types for paragraph animations
        interface ParagraphAnimation {
            el: HTMLParagraphElement;
            lines: HTMLElement[];
        }
        
        // Process extended description paragraphs
        const paragraphAnimations: ParagraphAnimation[] = [];
        
        extendedDescRefs.current.forEach((paragraphEl) => {
            if (paragraphEl) {
                const paragraphSplit = new SplitText(paragraphEl, { type: "lines" });
                
                new SplitText(paragraphEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
                
                paragraphAnimations.push({
                    el: paragraphEl,
                    lines: paragraphSplit.lines
                });
            }
        });
        
        // Create the main timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section-content",
                start: "top 80%",
                end: "bottom bottom",
            },
            defaults: { ease: "CustomEase" }
        });
        
        // Image animation
        tl.fromTo(
            imageRef.current,
            { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
        );
        
        // Card animation
        tl.fromTo(
            cardRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.8 },
            "-=0.6"
        );
        
        // Title animation
        tl.fromTo(
            titleLines,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        );
        
        // Description animation
        tl.fromTo(
            descLines,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.6"
        );
        
        // Animate each paragraph in sequence
        paragraphAnimations.forEach((paragraph, index) => {
            tl.fromTo(
                paragraph.lines,
                { y: '100%' },
                { 
                    y: '0%', 
                    stagger: 0.02, 
                    duration: 0.7,
                },
                index === 0 ? "-=0.5" : "-=0.6"
            );
        });
    }, [translations]);

    return (
        <div id="section-content" className="bg-background pt-16 md:pt-24 pb-4 md:pb-8">
            <div className="px-2 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Image container - left column */}
                    <div 
                        className="h-full rounded-3xl border border-border overflow-hidden md:top-24"
                    >
                        <div
                        ref={imageRef}
                        className="relative w-full h-full aspect-square">
                            <Image
                                src={translatedSection.image}
                                alt={translatedSection.title}
                                fill
                                className="object-cover rounded-3xl"
                                priority
                            />
                        </div>
                    </div>
                    
                    {/* Content container - right column */}
                    <div>
                        <div 
                            ref={cardRef} 
                            className="bg-card border border-border rounded-3xl p-6 md:p-8"
                        >
                            {/* Header */}
                            <div className="mb-10">
                                <h1 
                                    ref={titleRef}
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
                                >
                                    {translatedSection.title}
                                </h1>
                                
                                <p 
                                    ref={descRef} 
                                    className="text-text-secondary tracking-tight text-lg"
                                >
                                    {translatedSection.description}
                                </p>
                            </div>
                            
                            {/* Extended descriptions */}
                            <div className="space-y-6">
                                {translatedSection.extendedDescription.map((desc, idx) => (
                                    <div key={idx} className="overflow-hidden">
                                        <p
                                            ref={(el) => {
                                                extendedDescRefs.current[idx] = el;
                                            }}
                                            className="text-text-secondary tracking-tight"
                                        >
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}