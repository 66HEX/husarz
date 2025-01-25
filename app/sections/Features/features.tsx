"use client";

import {features} from "@/app/data/features";
import Image from "next/image";
import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Features = () => {
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
            .fromTo(
                imageRef.current,
                { opacity: 0, filter: 'blur(20px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
                "-=0.8"
            );
    }, []);

    return (
        <section id="features" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
                    <div className="col-span-1 md:col-span-2 mb-8 xl:mb-0">
                        <div className="grid grid-cols-2 mb-8 gap-4 md:gap-8">
                            <div className="col-span-2 md:col-span-1">
                                <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">
                                    Features
                                </h2>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <p ref={descRef} className="text-text-secondary tracking-tight">
                                    Step into a world where strength meets combat sports excellence. With dedicated sections
                                    for powerlifting, combat sports, and armwrestling, we've created a unique space where strength
                                    disciplines converge under one roof.
                                </p>
                            </div>
                        </div>

                        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card space-y-4 rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-4 md:p-6">
                                    <div>
                                        <h4 className="text-xl font-bold tracking-tight mb-2">{feature.title}</h4>
                                        <p className="text-text-secondary tracking-tight mb-4">{feature.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {feature.equipment.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="equipment-badge text-xs bg-card border border-border text-secondary px-3 py-1 rounded-full"
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

                    <div className="col-span-1 w-full h-full min-h-[400px] rounded-card overflow-hidden relative">
                        <Image
                            ref={imageRef}
                            src="/grey.png"
                            alt="Gym facilities"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;