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
    const answersRef = useRef<Array<HTMLDivElement | null>>([]);
    const arrowsRef = useRef<Array<SVGSVGElement | null>>([]);
    const contentHeights = useRef<number[]>([]);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const gradientTitleRef = useRef(null);
    const faqItemsRef = useRef(null);
    const { translations, language } = useLanguage();
    
    // Kategorie FAQ dla grupowania
    const categories = [
        { id: 'general', name: language === 'pl' ? 'Ogólne' : 'General', icon: <Info size={18} /> },
        { id: 'membership', name: language === 'pl' ? 'Członkostwo' : 'Membership', icon: <Info size={18} /> },
        { id: 'training', name: language === 'pl' ? 'Treningi' : 'Training', icon: <Info size={18} /> }
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
        
        // Obsługa dla zwykłego tytułu (jeśli będzie używany)
        let titleSplit;
        let title = [];
        if (titleRef.current) {
            titleSplit = new SplitText(titleRef.current, { type: "lines" });
            title = titleSplit.lines;
            
            new SplitText(titleRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
        }
        
        // Obsługa dla gradientowego tytułu
        let gradientTitleSplit;
        let gradientTitle = [];
        if (gradientTitleRef.current) {
            
            // Pierwszy podział na linie
            gradientTitleSplit = new SplitText(gradientTitleRef.current, { type: "lines" });
            gradientTitle = gradientTitleSplit.lines;
            
            
            // Dodajemy klasę do linii, aby kontrolować overflow
            new SplitText(gradientTitleRef.current, {
                type: "lines",
                linesClass: "line-wrapper overflow-hidden",
            });
            
            // TERAZ aplikujemy gradient do każdej linii
            gradientTitle.forEach(line => {
                line.style.backgroundImage = 'linear-gradient(to bottom, #FFFFFF, rgba(15, 23, 42, 0.1))';
                line.style.webkitBackgroundClip = 'text';
                line.style.webkitTextFillColor = 'transparent';
                line.style.backgroundClip = 'text';
                line.style.color = 'transparent';
                line.style.display = 'block';
            });
        }
        
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

        // Jeśli mamy gradient title, animujemy to
        if (gradientTitle.length > 0) {
            tl.fromTo(
                gradientTitle,
                { y: '100%' },
                { y: '0%', duration: 0.8 }
            );
        }
        
        // Jeśli mamy zwykły title, animujemy to (warunkowe)
        if (title.length > 0) {
            tl.fromTo(
                title,
                { y: '100%' },
                { y: '0%', duration: 0.8 },
                gradientTitle.length > 0 ? "-=0.4" : ""
            );
        }
        
        // Kontynuujemy z pozostałymi animacjami
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        )
        .fromTo(
            '.faq-categories-tabs',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4"
        )
        .fromTo(
            '.faq-category-tab',
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
            "-=0.5"
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
        );
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
        <section id="faq" className="py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <h2 ref={gradientTitleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        {translations.sections.faq.title}
                    </h2>
                    <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                        {translations.sections.faq.description}
                    </p>
                </div>

                {/* Kategorie FAQ */}
                <div className="faq-categories-tabs max-w-3xl mx-auto mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setOpenIndex(null); // Reset open accordion when changing category
                                }}
                                className={`faq-category-tab flex items-center px-5 py-2 rounded-full border transition-all duration-300 
                                           ${activeCategory === category.id ? 'bg-primary text-white border-primary' : 'bg-card border-border hover:bg-card/80'}`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto" ref={faqItemsRef}>
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
                                                className="faq-item rounded-card overflow-hidden bg-card backdrop-blur-md border border-border transition-all duration-300 hover:shadow-md"
                                            >
                                                <button
                                                    className="w-full p-4 md:p-5 flex justify-between items-center text-left"
                                                    onClick={() => toggleAccordion(originalIndex)}
                                                >
                                                    <h3 className="text-base font-bold tracking-tight pr-4">{faq.question}</h3>
                                                    <div 
                                                        className={`min-w-8 h-8 flex items-center justify-center rounded-full border border-border transition-colors duration-300 ${
                                                            openIndex === originalIndex ? 'bg-primary border-primary' : 'bg-card'
                                                        }`}
                                                    >
                                                        <ChevronDown
                                                            ref={(el) => {
                                                                if (arrowsRef.current) {
                                                                    arrowsRef.current[originalIndex] = el;
                                                                }
                                                            }}
                                                            className={`w-5 h-5 transition-colors duration-300 ${
                                                                openIndex === originalIndex ? 'text-white' : 'text-primary'
                                                            }`}
                                                        />
                                                    </div>
                                                </button>
                                                <div
                                                    ref={(el) => {
                                                        if (answersRef.current) {
                                                            // Ensure the ref is set at the correct index
                                                            answersRef.current[originalIndex] = el;
                                                            // Recalculate height after ref is set
                                                            if (el) {
                                                                contentHeights.current[originalIndex] = el.scrollHeight;
                                                            }
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
                                        return (
                                            <div
                                                key={originalIndex}
                                                className="faq-item rounded-card overflow-hidden bg-card backdrop-blur-md border border-border transition-all duration-300 hover:shadow-md"
                                            >
                                                <button
                                                    className="w-full p-4 md:p-5 flex justify-between items-center text-left"
                                                    onClick={() => toggleAccordion(originalIndex)}
                                                >
                                                    <h3 className="text-base font-bold tracking-tight pr-4">{faq.question}</h3>
                                                    <div 
                                                        className={`min-w-8 h-8 flex items-center justify-center rounded-full border border-border transition-colors duration-300 ${
                                                            openIndex === originalIndex ? 'bg-primary border-primary' : 'bg-card'
                                                        }`}
                                                    >
                                                        <ChevronDown
                                                            ref={(el) => {
                                                                if (arrowsRef.current) {
                                                                    arrowsRef.current[originalIndex] = el;
                                                                }
                                                            }}
                                                            className={`w-5 h-5 transition-colors duration-300 ${
                                                                openIndex === originalIndex ? 'text-white' : 'text-primary'
                                                            }`}
                                                        />
                                                    </div>
                                                </button>
                                                <div
                                                    ref={(el) => {
                                                        if (answersRef.current) {
                                                            // Ensure the ref is set at the correct index
                                                            answersRef.current[originalIndex] = el;
                                                            // Recalculate height after ref is set
                                                            if (el) {
                                                                contentHeights.current[originalIndex] = el.scrollHeight;
                                                            }
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
                
                {/* Call-to-Action na dole */}
                <div className="max-w-3xl mx-auto mt-12 text-center">
                    <p className="text-text-secondary mb-4">Masz więcej pytań? Skontaktuj się z nami!</p>
                    <a 
                        href="#contact" 
                        className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300"
                    >
                        Napisz do nas
                    </a>
                </div>
            </div>
            
            <style jsx global>{`
                .line-wrapper {
                    display: block;
                    overflow: hidden;
                }
                
                #faq .text-transparent {
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-fill-color: transparent;
                }
                
                /* Efekt podświetlenia aktywnego elementu */
                .faq-item.active {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 1px var(--color-primary);
                }
            `}</style>
        </section>
    );
};

export default FAQ;