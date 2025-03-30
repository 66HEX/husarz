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
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const imageRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const { translations } = useLanguage();

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
        
        // Define types for our animation groups
        interface ParagraphAnimation {
            el: HTMLParagraphElement;
            lines: HTMLElement[];
        }
        
        interface HeadingAnimation {
            el: HTMLHeadingElement;
            lines: HTMLElement[];
        }
        
        interface SectionAnimationGroup {
            heading: HeadingAnimation;
            paragraphs: ParagraphAnimation[];
        }
        
        // Process section headings and paragraphs but keep track of which paragraphs belong to which heading
        const sectionAnimationGroups: SectionAnimationGroup[] = [];
        
        // Prepare the section groups for animation
        translations.about.sections.forEach((section, index) => {
            const headingEl = headingsRef.current[index];
            if (!headingEl) return;
            
            // Process the heading
            const headingSplit = new SplitText(headingEl, { type: "lines" });
            new SplitText(headingEl, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
            
            // Find the corresponding paragraphs
            const paragraphEls: HTMLParagraphElement[] = [];
            section.paragraphs.forEach((_, pIndex) => {
                const paragraphEl = paragraphsRef.current[index * 2 + pIndex];
                if (paragraphEl) {
                    paragraphEls.push(paragraphEl);
                }
            });
            
            // Process the paragraphs
            const paragraphSplits = paragraphEls.map(paragraphEl => {
                const split = new SplitText(paragraphEl, { type: "lines" });
                new SplitText(paragraphEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
                return split;
            });
            
            // Add this group to the animation sequence
            sectionAnimationGroups.push({
                heading: {
                    el: headingEl,
                    lines: headingSplit.lines
                },
                paragraphs: paragraphSplits.map((split, i) => ({
                    el: paragraphEls[i],
                    lines: split.lines
                }))
            });
        });
        
        // Create the main timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about-us",
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
        
        // Animate each section in sequence (heading followed by its paragraphs)
        sectionAnimationGroups.forEach((group, index) => {
            // First animate the heading
            tl.fromTo(
                group.heading.lines,
                { y: '100%' },
                { 
                    y: '0%', 
                    duration: 0.7,
                },
                index === 0 ? "-=0.4" : "-=0.2" // Different offset for first heading
            );
            
            // Then animate its paragraphs
            group.paragraphs.forEach(paragraph => {
                tl.fromTo(
                    paragraph.lines,
                    { y: '100%' },
                    { 
                        y: '0%', 
                        stagger: 0.02, 
                        duration: 0.7,
                    },
                    "-=0.5"
                );
            });
        });
    }, [translations]);

    return (
        <div id="about-us" className="min-h-screen bg-background pt-16 md:pt-24 pb-4 md:pb-8">
            <div className="px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Image container - left column */}
                    <div 
                        className="h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden md:sticky md:top-24 border border-border"
                    >
                        <div
                        ref={imageRef}
                        className="relative w-full h-full">
                            <Image
                                src="/grey.png"
                                alt={translations.about.title}
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
                                    {translations.about.title}
                                </h1>
                                
                                <p 
                                    ref={descRef} 
                                    className="text-text-secondary tracking-tight text-lg"
                                >
                                    {translations.about.mainDescription}
                                </p>
                            </div>
                            
                            {/* Content sections */}
                            <div className="space-y-10">
                                {translations.about.sections.map((section, index) => (
                                    <div key={index} className="about-section">
                                        <h2 
                                            ref={(el: HTMLHeadingElement | null) => {
                                                headingsRef.current[index] = el;
                                            }}
                                            className="text-xl md:text-2xl font-bold tracking-tight mb-4"
                                        >
                                            {section.title}
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            {section.paragraphs.map((paragraph, pIndex) => (
                                                <p 
                                                    key={pIndex}
                                                    ref={(el: HTMLParagraphElement | null) => {
                                                        paragraphsRef.current[index * 2 + pIndex] = el;
                                                    }}
                                                    className="text-text-secondary tracking-tight"
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;