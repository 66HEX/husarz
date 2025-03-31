"use client";

import {useState, useRef, useEffect} from 'react';
import {ChevronDown, Info} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('general');
    const answersRef = useRef<(HTMLDivElement | null)[]>([]);
    const arrowsRef = useRef<(SVGElement | null)[]>([]);
    const contentHeights = useRef<number[]>([]);
    const badgeRef = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const faqItemsRef = useRef<HTMLDivElement>(null);
    const categoriesContainerRef = useRef<HTMLDivElement>(null);
    const categoryTabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const faqItemsLeftRef = useRef<(HTMLDivElement | null)[]>([]);
    const faqItemsRightRef = useRef<(HTMLDivElement | null)[]>([]);
    const { translations, language } = useLanguage();
    
    // Kategorie FAQ dla grupowania
    const categories = [
        { id: 'general', name: translations.sections.faq.categories.general, icon: <Info size={18} /> },
        { id: 'membership', name: translations.sections.faq.categories.membership, icon: <Info size={18} /> },
        { id: 'training', name: translations.sections.faq.categories.training, icon: <Info size={18} /> }
    ];

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
    }, [activeCategory]); // Recalculate when category changes

    useGSAP(() => {
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#faq",
                start: "top 80%",
                end: "bottom bottom",
            },
            defaults: { ease: "CustomEase" }
        });

        // Animacja badge zamiast headera
        tl.fromTo(
            badgeRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6 },
        );
        
        // Kontynuujemy z pozostałymi animacjami używając refs zamiast klas
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        );
        
        // Animacja kontenera kategorii
        if (categoriesContainerRef.current) {
            tl.fromTo(
                categoriesContainerRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.4"
            );
        }
        
        // Animacja przycisków kategorii
        const categoryTabs = categoryTabsRef.current.filter(Boolean);
        if (categoryTabs.length > 0) {
            tl.fromTo(
                categoryTabs,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
                "-=0.5"
            );
        }
        
        // Animacja elementów FAQ z lewej kolumny
        const faqItemsLeft = faqItemsLeftRef.current.filter(Boolean);
        if (faqItemsLeft.length > 0) {
            tl.fromTo(
                faqItemsLeft,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.2, stagger: 0.1 },
                "-=0.2"
            );
        }
        
        // Animacja elementów FAQ z prawej kolumny
        const faqItemsRight = faqItemsRightRef.current.filter(Boolean);
        if (faqItemsRight.length > 0) {
            tl.fromTo(
                faqItemsRight,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.2, stagger: 0.1 },
                "-=0.2"
            );
        }
    }, [translations]);

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
            // Ensure we have the correct height before animating
            if (!isCurrentlyOpen && contentHeights.current[index] === 0) {
                // Force recalculation of height if it's zero
                contentHeights.current[index] = currentContent.scrollHeight;
            }
            
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
        <section id="faq" className="overflow-hidden">
            <div className="px-2 md:px-8">
                <div className='py-4 md:py-8 border bg-card border-border rounded-3xl p-4 md:p-8'>
                    {/* Grid identyczny jak w komponencie Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-4 md:mb-8">
                        <div className="flex flex-col">
                            {/* Badge w lewym górnym rogu z ref dla animacji */}
                            <div className="mb-4">
                                <span 
                                    ref={badgeRef}
                                    className="inline-block tracking-tight text-sm bg-active border border-border text-white px-3 py-1 rounded-full"
                                >
                                    {translations.sections.faq.title || "FAQ"}
                                </span>
                            </div>
                        </div>
                        
                        {/* Opis w drugim gridzie od lewej */}
                        <div className="flex items-center col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                            <p ref={descRef} className="text-text-secondary tracking-tight text-base md:text-lg">
                                {translations.sections.faq.description}
                            </p>
                        </div>
                        
                        {/* Trzecia kolumna na większych ekranach (pusta) */}
                        <div></div>
                    </div>

                    {/* Kategorie FAQ */}
                    <div 
                        ref={categoriesContainerRef}
                        className="mb-8"
                    >
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category, idx) => (
                                <button 
                                    key={idx}
                                    ref={(el) => {
                                        categoryTabsRef.current[idx] = el;
                                    }}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setOpenIndex(null); // Reset open accordion when changing category
                                    }}
                                    className={`faq-category-tab flex items-center px-5 py-2 rounded-full border transition-all duration-300 text-sm md:text-base
                                            ${activeCategory === category.id ? 'bg-active text-white border-borderactive' : 'bg-innercard border-border hover:bg-active'}`}
                                >
                                    <span className="mr-2">{category.icon}</span>
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8" ref={faqItemsRef}>
                        {/* Filtrowanie pytań według aktywnej kategorii */}
                        {(() => {
                            // Filtrujemy pytania według aktywnej kategorii
                            const filteredFaqs = translations.faqs.filter(faq => faq.category === activeCategory);
                            const halfLength = Math.ceil(filteredFaqs.length / 2);
                            
                            return (
                                <>
                                    {/* Lewa kolumna FAQ */}
                                    <div className="md:w-1/2 space-y-4">
                                        {filteredFaqs.slice(0, halfLength).map((faq, index) => {
                                            // Znajdź oryginalny indeks w pełnej tablicy pytań
                                            const originalIndex = translations.faqs.findIndex(f => f.question === faq.question);
                                            return (
                                                <div
                                                    key={originalIndex}
                                                    ref={(el) => {
                                                        faqItemsLeftRef.current[index] = el;
                                                    }}
                                                    className="faq-item rounded-2xl overflow-hidden bg-innercard border border-border transition-all duration-300"
                                                >
                                                    <button
                                                        className="w-full p-4 md:p-5 flex justify-between items-center text-left"
                                                        onClick={() => toggleAccordion(originalIndex)}
                                                    >
                                                        <h3 className="text-base font-bold tracking-tight pr-4">{faq.question}</h3>
                                                        <div 
                                                            className={`min-w-8 h-8 flex items-center justify-center rounded-full border border-border transition-colors duration-300 ${
                                                                openIndex === originalIndex ? 'bg-active2 border-primary' : 'bg-active'
                                                            }`}
                                                        >
                                                            <ChevronDown
                                                                ref={(el) => {
                                                                    arrowsRef.current[originalIndex] = el;
                                                                }}
                                                                className={`w-5 h-5 transition-colors duration-300 ${
                                                                    openIndex === originalIndex ? 'text-white' : 'text-primary'
                                                                }`}
                                                            />
                                                        </div>
                                                    </button>
                                                    <div
                                                        ref={(el) => {
                                                            // Ensure the ref is set at the correct index
                                                            answersRef.current[originalIndex] = el;
                                                            // Recalculate height after ref is set
                                                            if (el) {
                                                                contentHeights.current[originalIndex] = el.scrollHeight;
                                                            }
                                                        }}
                                                        className="overflow-hidden"
                                                        style={{ height: 0 }}
                                                    >
                                                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                            <div className="pt-1 border-t border-border mb-3"></div>
                                                            <p className="text-text-secondary tracking-tight text-sm">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Prawa kolumna FAQ */}
                                    <div className="md:w-1/2 space-y-4">
                                        {filteredFaqs.slice(halfLength).map((faq, index) => {
                                            // Znajdź oryginalny indeks w pełnej tablicy pytań
                                            const originalIndex = translations.faqs.findIndex(f => f.question === faq.question);
                                            const rightIndex = halfLength + index;
                                            
                                            return (
                                                <div
                                                    key={originalIndex}
                                                    ref={(el) => {
                                                        faqItemsRightRef.current[rightIndex] = el;
                                                    }}
                                                    className="faq-item rounded-2xl overflow-hidden bg-innercard border border-border transition-all duration-300"
                                                >
                                                    <button
                                                        className="w-full p-4 md:p-5 flex justify-between items-center text-left"
                                                        onClick={() => toggleAccordion(originalIndex)}
                                                    >
                                                        <h3 className="text-base font-bold tracking-tight pr-4">{faq.question}</h3>
                                                        <div 
                                                            className={`min-w-8 h-8 flex items-center justify-center rounded-full border border-border transition-colors duration-300 ${
                                                                openIndex === originalIndex ? 'bg-active2 border-primary' : 'bg-active'
                                                            }`}
                                                        >
                                                            <ChevronDown
                                                                ref={(el) => {
                                                                    arrowsRef.current[originalIndex] = el;
                                                                }}
                                                                className={`w-5 h-5 transition-colors duration-300 ${
                                                                    openIndex === originalIndex ? 'text-white' : 'text-primary'
                                                                }`}
                                                            />
                                                        </div>
                                                    </button>
                                                    <div
                                                        ref={(el) => {
                                                            // Ensure the ref is set at the correct index
                                                            answersRef.current[originalIndex] = el;
                                                            // Recalculate height after ref is set
                                                            if (el) {
                                                                contentHeights.current[originalIndex] = el.scrollHeight;
                                                            }
                                                        }}
                                                        className="overflow-hidden"
                                                        style={{ height: 0 }}
                                                    >
                                                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                                                            <div className="pt-1 border-t border-border mb-3"></div>
                                                            <p className="text-text-secondary tracking-tight text-sm">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()} 
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;