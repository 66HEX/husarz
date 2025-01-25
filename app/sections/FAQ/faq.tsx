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

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const answersRef = useRef<Array<HTMLDivElement | null>>([]);
    const arrowsRef = useRef<Array<SVGSVGElement | null>>([]);
    const contentHeights = useRef<number[]>([]);
    const titleRef = useRef(null);
    const descRef = useRef(null);

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
        <section id="faq" className="py-16 md:py-24">
            <div className="container mx-auto flex flex-col items-center px-4 md:px-8">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-8 gap-4 md:gap-8">
                    <div className="col-span-1 overflow-hidden">
                        <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">FAQ</h2>
                    </div>
                    <div className="col-span-1">
                        <p ref={descRef} className="text-text-secondary tracking-tight">
                            Find answers to commonly asked questions about our facilities,
                            memberships, and services. If you need more information,
                            don&apos;t hesitate to contact us.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-3 xl:col-span-1 space-y-4">
                        {faqs.map((faq, index) => (
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
                    <div className="col-span-3 xl:col-span-2 w-full h-[430px] rounded-card overflow-hidden relative">
                        <Image
                            id="faq-image"
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

export default FAQ;