"use client";

import {Instagram} from 'lucide-react';
import {coaches} from "@/app/data/coaches";
import { useRef } from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Coaches = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);

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
                trigger: "#coaches",
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
                '.coach-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1
                },
                "-=0.6"
            )
            .fromTo(
                '.specialty-badge',
                { y: 10, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.02
                },
                "-=0.4"
            );
    }, []);

    return (
        <section id="coaches" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-8 gap-4 md:gap-8">
                    <div className="col-span-1 overflow-hidden">
                        <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">Our Coaches</h2>
                    </div>
                    <div className="col-span-1">
                        <p ref={descRef} className="text-text-secondary tracking-tight">
                            Meet our elite team of certified trainers who combine years of experience with cutting-edge
                            training methods. Each coach brings unique expertise and a proven track record of transforming
                            clients lives through personalized fitness guidance.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {coaches.map((coach, index) => (
                        <div
                            key={index}
                            className="coach-card rounded-card overflow-hidden bg-card backdrop-blur-md border border-border"
                        >
                            <div className="relative">
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-64 object-cover"
                                />
                                <a
                                    href={`https://instagram.com/${coach.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 bg-social-icon backdrop-blur-md p-1 rounded-icon border border-border"
                                >
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1 tracking-tight">{coach.name}</h3>
                                        <h4 className="text-text-primary tracking-tight">{coach.title}</h4>
                                    </div>
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        {coach.experience}
                                    </span>
                                </div>
                                <p className="text-text-secondary mb-4 tracking-tight">{coach.description}</p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {coach.specialties.map((specialty, idx) => (
                                                <span
                                                    key={idx}
                                                    className="specialty-badge text-xs bg-card border border-border text-secondary px-3 py-1 rounded-full"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Coaches;