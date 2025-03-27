"use client";

import {useState, useRef, useEffect} from 'react';
import {faqs} from "@/app/data/faqs";
import {ChevronDown} from 'lucide-react';
import Image from "next/image";
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const answersRef = useRef<Array<HTMLDivElement | null>>([]);
    const arrowsRef = useRef<Array<SVGSVGElement | null>>([]);
    const contentHeights = useRef<number[]>([]);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const { translations } = useLanguage();

    useEffect(() => {
        const calculateHeights = () => {
            contentHeights.current = answersRef.current.map(ref =>
                ref ? ref.scrollHeight : 0
            );
        };

        calculateHeights();
        window.addEventListener('resize', calculateHeights);

        return () => {
            window.removeEventListener('resize', calculateHeights);
        };
    }, []);

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
                trigger: "#faq",
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
                '.faq-item',
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
                '#faq-image',
                { opacity: 0, filter: 'blur(10px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
                "-=0.8"
            );
    }, []);

    const toggleAccordion = (index: number) => {
        const tl = gsap.timeline({ defaults: { duration: 0.3, ease: "CustomEase" } });

        const previousOpenIndex = openIndex;
        const isCurrentlyOpen = index === openIndex;

        if (previousOpenIndex !== null && previousOpenIndex !== index) {
            const previousContent = answersRef.current[previousOpenIndex];
            const previousArrow = arrowsRef.current[previousOpenIndex];

            if (previousContent) {
                tl.to(previousContent, {
                    height: 0,
                    force3D: true
                }, 0);
            }

            if (previousArrow) {
                tl.to(previousArrow, {
                    rotation: 0,
                    transformOrigin: "center center",
                    force3D: true
                }, 0);
            }
        }

        setOpenIndex(isCurrentlyOpen ? null : index);

        const currentContent = answersRef.current[index];
        const currentArrow = arrowsRef.current[index];

        if (currentContent) {
            tl.to(currentContent, {
                height: isCurrentlyOpen ? 0 : contentHeights.current[index],
                force3D: true
            }, 0);
        }

        if (currentArrow) {
            tl.to(currentArrow, {
                rotation: isCurrentlyOpen ? 0 : 180,
                transformOrigin: "center center",
                force3D: true
            }, 0);
        }
    };

    return (
        <section id="faq" className="py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{translations.sections.faq.title}</h2>
                <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                    {translations.sections.faq.description}
                </p>
                </div>

                <div className="flex justify-center">
                    <div className="space-y-4 max-w-3xl">
                        {translations.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="faq-item rounded-card overflow-hidden bg-card backdrop-blur-md border border-border"
                            >
                                <button
                                    className="w-full p-4 md:p-6 flex justify-between items-center text-left"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h3 className="text-base font-bold tracking-tight">{faq.question}</h3>
                                    <ChevronDown
                                        style={{minWidth: '24px', minHeight: '24px'}}
                                        ref={(el) => {
                                            if (arrowsRef.current) {
                                                arrowsRef.current[index] = el;
                                            }
                                        }}
                                        className="w-6 h-6 ml-8"
                                    />
                                </button>
                                <div
                                    ref={(el) => {
                                        if (answersRef.current) {
                                            answersRef.current[index] = el;
                                        }
                                    }}
                                    className="overflow-hidden"
                                    style={{ height: 0 }}
                                >
                                    <p className="px-4 md:px-6 pb-4 md:pb-6 text-text-secondary tracking-tight">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;