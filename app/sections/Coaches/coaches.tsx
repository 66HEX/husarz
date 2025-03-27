"use client";

import {Instagram} from 'lucide-react';
import {coaches} from "@/app/data/coaches";
import { useRef } from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Coaches = () => {
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const { translations } = useLanguage();

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
                <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    {translations.sections.coaches.title}
                </h2>
                <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                    {translations.sections.coaches.description}
                </p>
                    </div>
                    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {translations.coaches.map((coach, index) => (
                        <div
                            key={index}
                            className="coach-card rounded-card overflow-hidden bg-card backdrop-blur-md border border-border"
                        >
                            <div className="relative">
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <a
                                    href={`https://instagram.com/${coach.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 flex items-center justify-center bg-white p-2 rounded-icon"
                                >
                                    <Instagram className="w-6 h-6 text-black" />
                                </a>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{coach.name}</h3>
                                        <h4 className="text-xl text-text-primary tracking-tight hidden">{coach.title}</h4>
                                    </div>
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full hidden">
                                        {coach.title}
                                    </span>
                                </div>
                                <p className="text-text-secondary tracking-tight mb-6 text-base xl:text-lg ">{coach.description}</p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {coach.specialties.map((specialty, idx) => (
                                                <span
                                                    key={idx}
                                                    className="specialty-badge text-sm bg-card border border-border text-secondary px-3 py-1 rounded-full"
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