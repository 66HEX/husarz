"use client";

import {Instagram, ChevronLeft, ChevronRight} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import { Observer } from 'gsap/Observer';
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";

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
    const carouselInnerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [maxCardHeight, setMaxCardHeight] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [visibleCards, setVisibleCards] = useState(3);
    const [spacing, setSpacing] = useState(24);
    const [isMobile, setIsMobile] = useState(false);
    const [isResponsiveReady, setIsResponsiveReady] = useState(false);
    const { translations } = useLanguage();

    // Funkcja do pobierania liczby widocznych kart
    const getVisibleCards = () => visibleCards;
    
    // Funkcja do pobierania odstępu między kartami
    const getSpacing = () => spacing;

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
            
            // Mark responsive settings as ready
            setTimeout(() => {
                setIsResponsiveReady(true);
            }, 50);
        };
        
        // Wywołaj inicjalizację
        updateResponsiveSettings();
        
        // Nasłuchuj na zmiany rozmiaru okna
        window.addEventListener('resize', updateResponsiveSettings);
        
        return () => {
            window.removeEventListener('resize', updateResponsiveSettings);
        };
    }, []);

    // Funkcja do pobierania szerokości karty
    const getCardWidth = () => {
        if (!carouselRef.current) return 0;
        
        const containerWidth = carouselRef.current.clientWidth;
        const currentSpacing = getSpacing();
        const visibleCardsCount = getVisibleCards();
        const totalSpacing = currentSpacing * (visibleCardsCount - 1);
        
        return (containerWidth - totalSpacing) / visibleCardsCount;
    };

    // Funkcja do przesuwania do wybranego indeksu
    const scrollToIndex = (index: number) => {
        if (!carouselInnerRef.current || isAnimating) return;
        
        setIsAnimating(true);
        
        // Pobierz rzeczywistą szerokość kart bezpośrednio z DOM
        const cards = document.querySelectorAll('.coach-card');
        if (cards.length === 0) {
            setIsAnimating(false);
            return;
        }
        
        // Oblicz rzeczywistą szerokość i odstęp pierwszej karty
        const firstCard = cards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const cardSpacing = getSpacing();
        
        // Oblicz dokładną pozycję docelową
        const position = index * (cardWidth + cardSpacing);
            
        // Animuj przesunięcie
        gsap.to(carouselInnerRef.current, {
            duration: 0.6,
            ease: "CustomEase",
            x: -position,
            onComplete: () => {
                setIsAnimating(false);
            }
        });
    };

    // Efekt do aktualizacji widoku przy zmianie rozmiaru okna
    useEffect(() => {
        if (typeof window === 'undefined' || !carouselInnerRef.current) return;
        
        let resizeTimeout: NodeJS.Timeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Aktualizuj pozycję karuzeli po zmianie rozmiaru
                scrollToIndex(currentIndex);
            }, 300);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [currentIndex, visibleCards, spacing]);

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

    // Modify useGSAP to wait for responsive settings to be ready
    useGSAP(() => {
        // Skip GSAP animations if responsive settings aren't ready yet
        if (!isResponsiveReady) return;
        
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

        // Upewnij się, że karuzela jest na początku
        if (carouselInnerRef.current) {
            gsap.set(carouselInnerRef.current, { x: 0 });
        }
    }, [isResponsiveReady, translations]); // Add isResponsiveReady as dependency

    const handleNext = () => {
        if (isAnimating) return;
        
        // Oblicz maksymalny indeks ze względu na liczbę widocznych kart
        const maxIndex = Math.max(0, translations.coaches.length - getVisibleCards());
        
        // Sprawdź, czy można przejść dalej
        if (currentIndex < maxIndex) {
            // Aktualizuj indeks przed animacją
            setCurrentIndex(prev => prev + 1);
            setIsAutoPlaying(false);
            
            // Przewiń do nowego indeksu
            scrollToIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (isAnimating) return;
        
        // Sprawdź, czy można przejść wstecz
        if (currentIndex > 0) {
            // Aktualizuj indeks przed animacją
            setCurrentIndex(prev => prev - 1);
            setIsAutoPlaying(false);
            
            // Przewiń do nowego indeksu
            scrollToIndex(currentIndex - 1);
        }
    };

    const handleDotClick = (index: number) => {
        if (isAnimating || index === currentIndex) return;
        
        // Oblicz maksymalny indeks
        const maxIndex = Math.max(0, translations.coaches.length - getVisibleCards());
        
        // Upewnij się, że indeks nie przekracza maksymalnego
        const safeIndex = Math.min(index, maxIndex);
        
        // Aktualizuj stan
        setIsAutoPlaying(false);
        setCurrentIndex(safeIndex);
        
        // Przewiń do wybranego indeksu
        scrollToIndex(safeIndex);
    };

    // Funkcja pomocnicza do sprawdzenia czy przycisk powinien być aktywny
    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= translations.coaches.length - getVisibleCards();

    return (
        <section id="coaches" className="overflow-hidden">
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
                                    {translations.sections.coaches.title || "Trenerzy"}
                                </span>
                            </div>
                        </div>
                        
                        {/* Opis w drugim gridzie od lewej */}
                        <div className="flex items-center col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                            <p ref={descRef} className="text-text-secondary tracking-tight text-base md:text-lg">
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
                            <div ref={carouselInnerRef} className="flex space-x-4 md:space-x-6">
                                {translations.coaches.map((coach, index) => (
                                    <div
                                        key={`coach-${index}`}
                                        ref={(el: HTMLDivElement | null) => {
                                            coachCardsRef.current[index] = el;
                                        }}
                                        className="coach-card relative rounded-2xl overflow-hidden bg-innercard border border-border flex flex-col flex-shrink-0"
                                        style={{
                                            width: `calc((100% - ${(getVisibleCards() - 1) * getSpacing()}px) / ${getVisibleCards()})`,
                                            height: maxCardHeight > 0 ? `${maxCardHeight}px` : 'auto',
                                            boxSizing: 'border-box',
                                        }}
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
                                {translations.coaches.slice(0, translations.coaches.length - getVisibleCards() + 1).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        disabled={isAnimating}
                                        className={`h-2 rounded-full transition-all duration-300 
                                            ${index === currentIndex
                                            ? 'w-8 bg-active2 border border-borderactive'
                                            : 'w-2 bg-active border border-border hover:bg-border'}`}
                                        aria-label={`Przejdź do trenera ${index + 1}`}
                                    />
                                ))}
                            </div>
                            
                            {/* Przyciski nawigacyjne po prawej stronie */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={handlePrev}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full text-white border border-borderactive transition-colors ${
                                        isPrevDisabled 
                                            ? 'bg-active opacity-50 cursor-not-allowed' 
                                            : 'bg-active hover:bg-active2 cursor-pointer'
                                    }`}
                                    aria-label="Poprzedni trener"
                                    disabled={isAnimating || isPrevDisabled}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full text-white border border-borderactive transition-colors ${
                                        isNextDisabled 
                                            ? 'bg-active opacity-50 cursor-not-allowed' 
                                            : 'bg-active hover:bg-active2 cursor-pointer'
                                    }`}
                                    aria-label="Następny trener"
                                    disabled={isAnimating || isNextDisabled}
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