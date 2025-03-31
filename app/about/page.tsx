"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from '@/app/libs/gsap/SplitText';
import { useGSAP } from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const AboutUs = () => {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const descRef = useRef<HTMLParagraphElement | null>(null);
    const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const imageRef = useRef(null);
    const imageContainerRef = useRef(null);
    const cardRef = useRef(null);
    const contentContainerRef = useRef(null);
    const { translations } = useLanguage();
    const [imageLoaded, setImageLoaded] = useState(false);

    useGSAP(() => {
        // Nie uruchamiaj animacji, dopóki obraz nie zostanie załadowany
        if (!imageLoaded) return;

        try {
            // Tworzenie efektu sticky dla obrazu przy użyciu GSAP ScrollTrigger
            if (imageContainerRef.current && contentContainerRef.current) {
                ScrollTrigger.create({
                    trigger: contentContainerRef.current,
                    start: "top top",
                    endTrigger: contentContainerRef.current,
                    end: "bottom+=200 bottom",
                    pin: imageContainerRef.current,
                    pinSpacing: false,
                    pinReparent: false,
                    anticipatePin: 1,
                    markers: false, // Ustaw na true podczas debugowania
                });
            }

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
            if (imageRef.current) {
                tl.fromTo(
                    imageRef.current,
                    { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
                );
            }

            // Card animation
            if (cardRef.current) {
                tl.fromTo(
                    cardRef.current,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.8 },
                    "-=0.6"
                );
            }

            // Title animation
            if (titleLines && titleLines.length > 0) {
                tl.fromTo(
                    titleLines,
                    { y: '100%' },
                    { y: '0%', stagger: 0.05, duration: 0.8 },
                    "-=0.4"
                );
            }

            // Description animation
            if (descLines && descLines.length > 0) {
                tl.fromTo(
                    descLines,
                    { y: '100%' },
                    { y: '0%', stagger: 0.05, duration: 0.8 },
                    "-=0.6"
                );
            }

            // Animate each section in sequence (heading followed by its paragraphs)
            sectionAnimationGroups.forEach((group, index) => {
                // First animate the heading
                if (group.heading.lines && group.heading.lines.length > 0) {
                    tl.fromTo(
                        group.heading.lines,
                        { y: '100%' },
                        {
                            y: '0%',
                            duration: 0.7,
                        },
                        index === 0 ? "-=0.4" : "-=0.2" // Different offset for first heading
                    );
                }

                // Then animate its paragraphs
                group.paragraphs.forEach(paragraph => {
                    if (paragraph.lines && paragraph.lines.length > 0) {
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
                    }
                });
            });
        } catch (error) {
            console.error("Animation initialization error:", error);
        }
    }, [translations, imageLoaded]);

    // Czyszczenie ScrollTrigger przy odmontowaniu komponentu
    useEffect(() => {
        return () => {
            // Zabija wszystkie ScrollTriggery przy odmontowaniu komponentu
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const handleImageLoad = () => {
        console.log("Image loaded successfully");
        setImageLoaded(true);
    };

    return (
        <div id="about-us" className="min-h-screen bg-background pt-20 md:pt-24 pb-4 md:pb-8">
            <div className="px-2 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Image container - left column */}
                    <div
                        ref={imageContainerRef}
                        className="h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden border border-border"
                    >
                        <div
                            ref={imageRef}
                            className="relative w-full h-full opacity-0">
                            <Image
                                src="/grey.png"
                                alt={translations.about.title}
                                fill
                                className="object-cover rounded-3xl"
                                priority
                                onLoad={handleImageLoad}
                                onError={(e) => {
                                    console.error("Image failed to load:", e);
                                    setImageLoaded(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Content container - right column */}
                    <div ref={contentContainerRef}>
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