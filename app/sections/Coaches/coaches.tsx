"use client";

import {Instagram, ChevronLeft, ChevronRight} from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import { Observer } from 'gsap/Observer';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";
import { horizontalLoop } from '@/app/libs/loopHelper.js';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP, Observer);

const Coaches = () => {
    const badgeRef = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const coachCardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const coachImagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const overlayTitlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
    const overlayDescsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const overlaySpecialtiesRef = useRef<(HTMLDivElement | null)[]>([]);
    const overlayInstasRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);
    const loopRef = useRef<gsap.core.Timeline | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [maxCardHeight, setMaxCardHeight] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [visibleCards, setVisibleCards] = useState(3);
    const [spacing, setSpacing] = useState(24);
    const [isMobile, setIsMobile] = useState(false);
    const { translations } = useLanguage();

    // Funkcja do pobierania liczby widocznych kart
    const getVisibleCards = () => visibleCards;
    
    // Funkcja do pobierania odstępu między kartami
    const getSpacing = () => spacing;

    // Auto-scrolling effect
    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isAutoPlaying, currentIndex]);

    // Efekt do ustawienia responsywności po stronie klienta
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Funkcja do aktualizacji stanu responsywności
        const updateResponsiveSettings = () => {
            // Ustaw liczbę kart
            if (window.innerWidth >= 1024) {
                setVisibleCards(3); // desktop
                setSpacing(24);
            } else if (window.innerWidth >= 768) {
                setVisibleCards(2); // tablet
                setSpacing(16);
            } else {
                setVisibleCards(1); // mobile
                setSpacing(16);
            }
            
            // Ustaw flagę urządzeń mobilnych
            setIsMobile(window.innerWidth < 768);
        };
        
        // Wywołaj inicjalizację
        updateResponsiveSettings();
        
        // Nasłuchuj na zmiany rozmiaru okna
        window.addEventListener('resize', updateResponsiveSettings);
        
        return () => {
            window.removeEventListener('resize', updateResponsiveSettings);
        };
    }, []);

    // Efekt do aktualizacji liczby widocznych kart przy zmianie rozmiaru okna
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Funkcja do aktualizacji karuzeli przy zmianie rozmiaru ekranu
        const handleResize = () => {
            // Odśwież karty jeśli zmieni się liczba widocznych elementów
            if (loopRef.current) {
                // Zatrzymaj karuzele
                loopRef.current.kill();
                loopRef.current = null;
                
                // Inicjalizuj na nowo po krótkim opóźnieniu (aby pozwolić na przeliczenie DOM)
                setTimeout(() => {
                    if (carouselRef.current) {
                        const cards = gsap.utils.toArray('.coach-card');
                        if (cards.length > 0) {
                            loopRef.current = horizontalLoop(cards, {
                                paused: true,
                                paddingRight: getSpacing(),
                                repeat: -1,
                            });
                        }
                    }
                }, 300);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Efekt do aktualizacji wysokości kart
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Function to calculate and set the max height of all cards
        const updateCardHeights = () => {
            // Reset max height first
            setMaxCardHeight(0);
            
            // Get all coach cards
            const cards = document.querySelectorAll('.coach-card');
            
            // Find the tallest card
            let tallestHeight = 0;
            cards.forEach(card => {
                const height = card.getBoundingClientRect().height;
                if (height > tallestHeight) {
                    tallestHeight = height;
                }
            });
            
            // Set the max height only if it's greater than 0
            if (tallestHeight > 0) {
                setMaxCardHeight(tallestHeight);
            }
        };
        
        // Initial calculation after cards are rendered
        setTimeout(updateCardHeights, 100);
        
        // Update heights on window resize
        window.addEventListener('resize', updateCardHeights);
        
        return () => {
            window.removeEventListener('resize', updateCardHeights);
        };
    }, [translations.coaches]);

    useGSAP(() => {
        // Podstawowe animacje tekstu dla opisu
        const childSplit = new SplitText(descRef.current, { type: "lines" });
        
        new SplitText(descRef.current, {
            type: "lines",
            linesClass: "line-wrapper overflow-hidden",
        });
        
        const texts = childSplit.lines;
        
        // Przygotowanie animacji dla tekstów kart
        const cardTitleSplits: SplitText[] = [];
        const cardTitleLines: HTMLElement[] = [];
        const cardDescSplits: SplitText[] = [];
        const cardDescLines: HTMLElement[] = [];
        
        // Przetwarzanie tytułów kart
        overlayTitlesRef.current.forEach((titleEl) => {
            if (titleEl) {
                // Tworzenie SplitText dla tytułu karty
                const cardTitleSplit = new SplitText(titleEl, { type: "lines" });
                cardTitleSplits.push(cardTitleSplit);
                cardTitleLines.push(...cardTitleSplit.lines);
                
                // Dodanie wrappera dla tytułów kart
                new SplitText(titleEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
            }
        });

        // Przetwarzanie opisów kart
        overlayDescsRef.current.forEach((descEl) => {
            if (descEl) {
                // Tworzenie SplitText dla opisu karty
                const cardDescSplit = new SplitText(descEl, { type: "lines" });
                cardDescSplits.push(cardDescSplit);
                cardDescLines.push(...cardDescSplit.lines);
                
                // Dodanie wrappera dla opisów kart
                new SplitText(descEl, {
                    type: "lines",
                    linesClass: "line-wrapper overflow-hidden",
                });
            }
        });
        
        // Zbieramy wszystkie odznaki specjalizacji z referencji
        const specialtyBadges: HTMLElement[] = [];
        overlaySpecialtiesRef.current.forEach(badgeContainer => {
            if (badgeContainer && badgeContainer.children) {
                Array.from(badgeContainer.children).forEach(badge => {
                    specialtyBadges.push(badge as HTMLElement);
                });
            }
        });
        
        // Główna animacja przy scrollowaniu
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#coaches",
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
        
        tl.fromTo(
            texts,
            { y: '100%' },
            { y: '0%', stagger: 0.05, duration: 0.8 },
            "-=0.4"
        )
        .fromTo(
            coachCardsRef.current.filter(Boolean),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1
            },
            "-=0.6"
        )
        
        // Animacja tytułów kart
        tl.fromTo(
            cardTitleLines,
            { y: '100%' },
            { 
                y: '0%', 
                stagger: 0.03, 
                duration: 0.7,
            },
            "-=0.4"
        )
        
        // Animacja opisów kart
        tl.fromTo(
            cardDescLines,
            { y: '100%' },
            { 
                y: '0%', 
                stagger: 0.02, 
                duration: 0.7,
            },
            "-=0.5"
        )
        
        // Animacja odznak specjalizacji
        tl.fromTo(
            specialtyBadges,
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02
            },
            "-=0.4"
        )
        
        // Animacja linków do instagrama
        tl.fromTo(
            overlayInstasRef.current.filter(Boolean),
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05
            },
            "-=0.3"
        );

        // Inicjalizacja horizontalLoop dla karuzeli
        if (carouselRef.current) {
            // Poczekaj, aż wysokości zostaną zaktualizowane
            setTimeout(() => {
                const cards = gsap.utils.toArray('.coach-card');
                if (cards.length > 0) {
                    loopRef.current = horizontalLoop(cards, {
                        paused: true, // Zaczynamy wstrzymani, by uniknąć konfliktu z auto-play
                        paddingRight: getSpacing(),
                        repeat: -1,
                    });
                }
            }, 200); // Dodaj opóźnienie, aby dać czas na przeliczenie wysokości
        }
    }, [translations]);

    const handlePrev = () => {
        if (loopRef.current && !isAnimating) {
            setIsAnimating(true);
            setIsAutoPlaying(false);
            
            loopRef.current.previous({
                duration: 0.6,
                ease: "CustomEase",
                onComplete: () => {
                    setIsAnimating(false);
                    setCurrentIndex(prev => {
                        const newIndex = prev - 1;
                        return newIndex < 0 ? translations.coaches.length - 1 : newIndex;
                    });
                }
            });
        }
    };

    const handleNext = () => {
        if (loopRef.current && !isAnimating) {
            setIsAnimating(true);
            
            loopRef.current.next({
                duration: 0.6,
                ease: "CustomEase",
                onComplete: () => {
                    setIsAnimating(false);
                    setCurrentIndex(prev => (prev + 1) % translations.coaches.length);
                }
            });
        }
    };
    
    const handleDotClick = (index: number) => {
        if (isAnimating || index === currentIndex) return;
        
        setIsAutoPlaying(false);
        setIsAnimating(true);
        
        if (loopRef.current) {
            // Calculate how many positions to move
            const currentPos = currentIndex;
            const targetPos = index;
            let diff = targetPos - currentPos;
            
            // Adjust for wrapping around the ends
            if (diff < 0 && Math.abs(diff) > translations.coaches.length / 2) {
                diff = translations.coaches.length + diff;
            } else if (diff > 0 && diff > translations.coaches.length / 2) {
                diff = diff - translations.coaches.length;
            }
            
            if (diff > 0) {
                loopRef.current.toIndex(currentIndex + diff, {
                    duration: 0.6,
                    ease: "CustomEase",
                    onComplete: () => {
                        setIsAnimating(false);
                        setCurrentIndex(index);
                    }
                });
            } else if (diff < 0) {
                loopRef.current.toIndex(currentIndex + diff, {
                    duration: 0.6,
                    ease: "CustomEase",
                    onComplete: () => {
                        setIsAnimating(false);
                        setCurrentIndex(index);
                    }
                });
            }
        }
    };

    // Tworzymy dwie kopie tablicy coaches żeby zapewnić płynne przewijanie w pętli
    const loopedCoaches = [
        ...translations.coaches,
        ...translations.coaches,
    ];

    return (
        <section id="coaches" className="overflow-hidden">
            <div className="px-4 md:px-8">
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
                                    {translations.sections.coaches.title || "Trenerzy"}
                                </span>
                            </div>
                        </div>
                        
                        {/* Opis w drugim gridzie od lewej */}
                        <div className="flex items-center col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                            <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
                                {translations.sections.coaches.description}
                            </p>
                        </div>
                        
                        {/* Trzecia kolumna na większych ekranach (pusta) */}
                        <div></div>
                    </div>
                    
                    {/* Kontener karuzeli */}
                    <div className="relative">
                        {/* Karuzela z trenerami */}
                        <div ref={carouselRef} className="overflow-hidden">
                            <div className="flex space-x-4 md:space-x-6">
                                {loopedCoaches.map((coach, index) => (
                                    <div
                                        key={index}
                                        ref={(el: HTMLDivElement | null) => {
                                            coachCardsRef.current[index] = el;
                                        }}
                                        className="coach-card relative rounded-2xl overflow-hidden bg-innercard border border-border flex flex-col flex-shrink-0"
                                        style={{
                                            width: `calc((100% - ${(getVisibleCards() - 1) * getSpacing()}px) / ${getVisibleCards()})`,
                                            height: maxCardHeight > 0 ? `${maxCardHeight}px` : 'auto',
                                            minWidth: isMobile ? '85%' : '250px' // Używamy stanu zamiast window.innerWidth
                                        }}
                                        data-coach-id={index % translations.coaches.length}
                                    >
                                        {/* Kontener obrazu z paddingiem */}
                                        <div className="p-4">
                                            <div className="relative aspect-square overflow-hidden rounded-xl">
                                                <img
                                                    ref={(el: HTMLImageElement | null) => {
                                                        coachImagesRef.current[index] = el;
                                                    }}
                                                    src={coach.image}
                                                    alt={coach.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Informacje i opis */}
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 
                                                ref={(el: HTMLHeadingElement | null) => {
                                                    overlayTitlesRef.current[index] = el;
                                                }}
                                                className="text-xl md:text-2xl font-bold tracking-tight mb-3"
                                            >
                                                {coach.name}
                                            </h3>
                                            
                                            <p 
                                                ref={(el: HTMLParagraphElement | null) => {
                                                    overlayDescsRef.current[index] = el;
                                                }}
                                                className="text-text-secondary tracking-tight mb-4 text-sm"
                                            >
                                                {coach.description}
                                            </p>
                                            
                                            <div 
                                                ref={(el: HTMLDivElement | null) => {
                                                    overlaySpecialtiesRef.current[index] = el;
                                                }}
                                                className="flex flex-wrap gap-2 mt-auto mb-4"
                                            >
                                                {coach.specialties.map((specialty, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="tracking-tight text-xs bg-active border border-border text-white px-2 py-0.5 rounded-full"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            {/* Przycisk zawsze na dole z marginesem auto-top */}
                                            <div className="pt-4">
                                                <a
                                                    ref={(el: HTMLAnchorElement | null) => {
                                                        overlayInstasRef.current[index] = el;
                                                    }}
                                                    href={`https://instagram.com/${coach.instagram}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center bg-active justify-center space-x-2 text-white text-sm border border-borderactive rounded-full px-4 py-2 hover:bg-active2 transition-colors"
                                                >
                                                    <span>@{coach.instagram}</span>
                                                    <Instagram className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Pasek nawigacyjny */}
                        <div className="flex justify-between items-center mt-6">
                            {/* Kropki sygnalizujące pozycję */}
                            <div className="flex gap-2">
                                {translations.coaches.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        disabled={isAnimating}
                                        className={`h-2 rounded-full transition-all duration-300 
                                            ${index === currentIndex
                                            ? 'w-8 bg-active border border-borderactive'
                                            : 'w-2 bg-innercard border border-border hover:bg-border'}`}
                                        aria-label={`Przejdź do trenera ${index + 1}`}
                                    />
                                ))}
                            </div>
                            
                            {/* Przyciski nawigacyjne po prawej stronie */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={handlePrev}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-active text-white hover:bg-active2 transition-colors border border-borderactive"
                                    aria-label="Poprzedni trener"
                                    disabled={isAnimating}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-active text-white hover:bg-active2 transition-colors border border-borderactive"
                                    aria-label="Następny trener"
                                    disabled={isAnimating}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Coaches;