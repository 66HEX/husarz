"use client";

import {features} from "@/app/data/features";
import Image from "next/image";
import Link from "next/link";
import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import {ArrowUpRight} from 'lucide-react';
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Sections = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const featuresRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
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

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#features",
                start: "top 80%",
                end: "bottom bottom",
            },
            defaults: { ease: "CustomEase" }
        });

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
            .fromTo(
                '.feature-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1
                },
                "-=0.6"
            )
            .fromTo(
                '.equipment-badge',
                { y: 10, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.02
                },
                "-=0.4"
            )
    }, []);

    return (
        <section id="sections" className="py-16 md:py-24 mt-16 md:mt-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Sekcje
                </h2>
                <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                    Nasz klub sportowy oferuje profesjonalne sekcje: sekcję trójboju siłowego,
                    sekcję sztuk walki, sekcję armwrestlingu oraz w pełni wyposażoną siłownię.
                    Każda sekcja prowadzona jest przez doświadczonych trenerów.
                </p>
                </div>

                <div ref={featuresRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="feature-card relative rounded-card overflow-hidden bg-card backdrop-blur-md border border-border"
                        >
                            <div className="aspect-[16/9] relative overflow-hidden">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover h-72"
                                />
                                <Link
                                        href={`/sections/${feature.slug}`}
                                        className="absolute top-4 right-4 section-button flex items-center justify-center bg-white p-2 rounded-icon z-30"
                                    >
                                        <ArrowUpRight className="w-6 h-6 text-black" />
                                    </Link>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{feature.title}</h3>
                                </div>
                                <p className="text-text-secondary tracking-tight mb-6 text-base xl:text-lg">{feature.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {feature.equipment.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="equipment-badge text-sm bg-card border border-border text-secondary px-3 py-1 rounded-full"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Sections;