"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from '@/app/libs/gsap/SplitText';
import { useGSAP } from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const AboutUs = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const statsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        // Create the main timeline
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
                trigger: heading,
                headingSplit,
                paragraphSplits
            };
        });

        sections.forEach((section) => {
            if (!section.trigger) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section.trigger,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });

            // Animate heading
            if (section.headingSplit) {
                tl.fromTo(
                    section.headingSplit.lines,
                    { y: '100%' },
                    { y: '0%', duration: 0.8 }
                );
            }

            // Animate paragraphs
            section.paragraphSplits.forEach((split, i) => {
                if (!split) return;
                tl.fromTo(
                    split.lines,
                    { y: '100%' },
                    {
                        y: '0%',
                        duration: 0.8,
                        stagger: 0.05,
                    },
                    i === 0 ? "-=0.4" : "-=0.6"  // Overlap with previous animation
                );
            });
        });

        // Animate stats if they exist
        statsRef.current.forEach((stat) => {
            if (!stat) return;
            gsap.fromTo(
                stat,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-background">
            <div className="flex flex-col md:flex-row">
                {/* Fixed Image Section */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative md:sticky md:top-0">
                    <Image
                        src="/grey.png"
                        alt="Husarz Gym interior"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 px-4 md:px-12 py-16 md:py-24" ref={contentRef}>
                    {/* Hero Section */}
                    <div className="mb-16">
                        <div className="overflow-hidden mb-4">
                            <h1
                                ref={(el) => {
                                    if (el) headingsRef.current[0] = el;
                                }}
                                className="text-4xl md:text-6xl font-bold"
                            >
                                Our Story
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <p
                                ref={(el) => {
                                    if (el) paragraphsRef.current[0] = el;
                                }}
                                className="text-text-secondary text-lg md:text-xl"
                            >
                                Since 2015, Husarz Gym has been a cornerstone of powerlifting excellence,
                                fostering a community dedicated to strength and personal growth.
                            </p>
                        </div>
                    </div>

                    {/* History Sections */}
                    <div className="space-y-16">
                        <div>
                            <div className="overflow-hidden mb-4">
                                <h2
                                    ref={(el) => {
                                        if (el) headingsRef.current[1] = el;
                                    }}
                                    className="text-2xl md:text-3xl font-bold"
                                >
                                    Our Beginnings
                                </h2>
                            </div>
                            <div className="overflow-hidden mb-6">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[1] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Founded by passionate powerlifters, Husarz Gym started as a small training facility
                                    dedicated to proper form and technique in powerlifting. What began with just a few
                                    power racks and dedicated lifters has grown into a comprehensive strength training facility.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[2] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Our founding principle was simple: create a space where serious lifters could train
                                    without compromise, with quality equipment and knowledgeable guidance.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="overflow-hidden mb-4">
                                <h2
                                    ref={(el) => {
                                        if (el) headingsRef.current[2] = el;
                                    }}
                                    className="text-2xl md:text-3xl font-bold"
                                >
                                    Competition Success
                                </h2>
                            </div>
                            <div className="overflow-hidden mb-6">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[3] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Over the years, our members have achieved remarkable success in powerlifting competitions
                                    at both national and international levels. We`&apos;ve proudly produced multiple national
                                    champions and record holders across various weight classes.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[4] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Our competition team has grown from a handful of dedicated lifters to over 30 active
                                    competitors, making us one of the most successful powerlifting clubs in the region.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="overflow-hidden mb-4">
                                <h2
                                    ref={(el) => {
                                        if (el) headingsRef.current[3] = el;
                                    }}
                                    className="text-2xl md:text-3xl font-bold"
                                >
                                    Training Philosophy
                                </h2>
                            </div>
                            <div className="overflow-hidden mb-6">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[5] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    At Husarz Gym, we believe in a methodical, science-based approach to strength training.
                                    Our coaching staff emphasizes proper technique, structured programming, and sustainable
                                    progression to help athletes achieve their goals while minimizing injury risk.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[6] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    We prioritize building a strong foundation in the three main lifts: squat, bench press,
                                    and deadlift, while incorporating auxiliary exercises for complete strength development.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="overflow-hidden mb-4">
                                <h2
                                    ref={(el) => {
                                        if (el) headingsRef.current[4] = el;
                                    }}
                                    className="text-2xl md:text-3xl font-bold"
                                >
                                    Community & Future
                                </h2>
                            </div>
                            <div className="overflow-hidden mb-6">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[7] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Today, Husarz Gym is more than just a training facility – it`&apos;s a community of dedicated
                                    athletes supporting each other`&apos;s journey in strength sports. Our members range from
                                    beginners to elite competitors, all training together in an atmosphere of mutual respect
                                    and encouragement.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p
                                    ref={(el) => {
                                        if (el) paragraphsRef.current[8] = el;
                                    }}
                                    className="text-text-secondary"
                                >
                                    Looking ahead, we continue to expand our facilities and programs while maintaining our
                                    core focus on powerlifting excellence and community building.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;