"use client";

import {sports} from "@/app/data/sports";
import  {useRef} from 'react';
import Image from "next/image";
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
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        tl.fromTo(
            title,
            { y: '100%' },
            { y: '0%', duration: 0.8 }
        )

        if (isMobile) {
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
        } else {
            tl.fromTo(
                '.sport-badge',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
                "-=0.4"
            )
                .fromTo(
                    texts,
                    { y: '100%' },
                    { y: '0%', stagger: 0.05, duration: 1.2 },
                    "-=0.4"
                )
        }

        tl.fromTo(
            '#hero-image',
            { opacity: 0, filter: 'blur(20px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            "-=1.2"
        );
    }, []);

    return (
        <section id="home" className="py-24 h-svh md:h-[50vh] xl:h-svh">
            <div ref={containerRef} className="h-full container mx-auto px-4 md:px-8">
                <div className="h-full grid grid-rows-[auto_1fr] gap-8">
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="overflow-hidden mb-0 md:mb-4">
                                <h1 ref={titleRef} className="text-5xl xl:text-7xl font-bold tracking-tight">
                                    Husarz Gym
                                </h1>
                            </div>
                            <div className="flex-wrap gap-2 hidden md:flex">
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
                        <div className="col-span-2 md:col-span-1 flex items-end overflow-hidden">
                            <p ref={descRef} className="text-text-secondary text-base xl:text-xl tracking-tight">
                                Professional training facility bringing together strength sports and combat arts.
                                Join our community of dedicated athletes and experience training at the highest level.
                            </p>
                        </div>
                        <div className="flex-wrap gap-2 block md:hidden">
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

                    <div className="w-full h-full rounded-card overflow-hidden relative">
                        <Image
                            id="hero-image"
                            src="/grey.png"
                            alt="Hero image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;