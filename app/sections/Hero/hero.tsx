"use client";

import {sports} from "@/app/data/sports";
import {useRef} from 'react';
import Image from "next/image";
import Link from "next/link";
import gsap from 'gsap';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(SplitText, useGSAP);

const Hero = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const titleSplit = new SplitText(titleRef.current, { type: "lines" });
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        new SplitText(titleRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        const title = titleSplit.lines;
        const texts = childSplit.lines;

        const tl = gsap.timeline({ defaults: { ease: "CustomEase" } });

        tl.fromTo(
            title,
            { y: '100%' },
            { y: '0%', duration: 0.8 }
        )

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
    }, []);

    return (
        <section id="home" className="py-24 h-svh md:h-[66vh] xl:h-svh relative">
            <div className="absolute inset-0 rounded-b-[3rem] overflow-hidden">
                <Image
                    id="hero-image"
                    src="/grey.png"
                    alt="Hero image"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <div ref={containerRef} className="h-full container mx-auto px-4 md:px-8 relative z-10">
                <div className="h-full flex flex-col justify-center gap-8">
                    <div className="max-w-2xl">
                        <div className="bg-card backdrop-blur-md border border-border p-6 md:p-8 rounded-card">
                            <div className="overflow-hidden mb-4">
                                <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">
                                    Husarz Gym
                                </h1>
                            </div>
                            <div className="overflow-hidden mb-6">
                                <p ref={descRef} className="text-text-secondary text-base xl:text-xl tracking-tight">
                                    Professional training facility bringing together strength sports and combat arts.
                                    Join our community of dedicated athletes and experience training at the highest level.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(sports).map((sport) => (
                                    <span
                                        key={sport.id}
                                        className="sport-badge text-xs bg-card backdrop-blur-md border border-border text-secondary px-3 py-1 rounded-full"
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
                            className="bg-text-primary text-text-black backdrop-blur-sm border border-border px-6 py-2 rounded-icon font-medium"
                        >
                            About us
                        </Link>
                    </div>
                </div>
            </div>  
          
        </section>
    );
};

export default Hero;