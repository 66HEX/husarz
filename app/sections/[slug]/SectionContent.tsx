"use client";

import Image from "next/image";
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '@/app/libs/gsap/SplitText';
import { useGSAP } from "@gsap/react";
import '@/app/config/gsap';

interface Section {
    title: string;
    description: string;
    image: string;
    extendedDescription: string[];
}

interface SectionContentProps {
    section: Section;
}

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function SectionContent({ section }: SectionContentProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const extendedDescRefs = useRef<HTMLParagraphElement[]>([]);

    useGSAP(() => {
        // Main title and description animation
        if (!titleRef.current || !descRef.current) return;

        const childSplit = new SplitText(descRef.current, { type: "lines" });
        const titleSplit = new SplitText(titleRef.current, { type: "lines" });
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        new SplitText(titleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        const texts = childSplit.lines;
        const title = titleSplit.lines;

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

        // Main sequence
        tl.fromTo(
            title,
            { y: '100%' },
            { y: '0%', duration: 0.8 }
        )
            .fromTo(
                texts,
                { y: '100%' },
                { y: '0%', stagger: 0.05, duration: 0.8 },
                "-=0.4"
            )

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
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative md:sticky md:top-0 rounded-r-[3rem] overflow-hidden">
                    <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-12 py-16 md:py-24">
                    <div id="section-content">
                        <div className="mb-16">
                            <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                                {section.title}
                            </h1>
                            <p ref={descRef} className="text-lg md:text-xl text-text-secondary">
                                {section.description}
                            </p>
                        </div>

                        <div className="space-y-8 mb-16">
                            {section.extendedDescription.map((desc, idx) => (
                                <div key={idx} className="overflow-hidden">
                                    <p
                                        ref={(el) => {
                                            if (el) {
                                                extendedDescRefs.current[idx] = el;
                                            }
                                        }}
                                        className="text-text-secondary text-base"
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
    );
}