"use client";

import {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import Link from 'next/link';
import gsap from 'gsap';
import {useGSAP} from "@gsap/react";
import { useLenisContext } from "@/app/components/SmoothScrolling/smoothScrolling";
import '@/app/config/gsap';
import { useLanguage } from "@/app/i18n/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher/languageSwitcher";

const Navbar = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef(null);
    const toggleButtonLine1Ref = useRef(null);
    const toggleButtonLine2Ref = useRef(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const lenis = useLenisContext();
    const { translations } = useLanguage();

    useGSAP(() => {
        tlRef.current = gsap.timeline({ paused: true })
            .fromTo(toggleButtonLine1Ref.current,
                {
                    rotation: 0,
                },
                {
                    duration: 0.3,
                    rotation: 45,
                    top: "50%",
                    ease: "CustomEase",
                    transformOrigin: "center center"
                }, 0
            )
            .fromTo(toggleButtonLine2Ref.current,
                {
                    rotation: 0,
                },
                {
                    duration: 0.3,
                    rotation: -45,
                    top: "50%",
                    ease: "CustomEase",
                    transformOrigin: "center center"
                }, 0
            )
            .fromTo(menuRef.current,
                {
                    opacity: 0,
                    display: "none"
                },
                {
                    display: "block",
                    opacity: 1,
                    duration: 0.3,
                    ease: 'CustomEase'
                }, 0
            );
        tlRef.current.progress(0);
    }, []);

    const toggleMenu = () => {
        if (!menuRef.current || !tlRef.current) return;
        setIsOpen(!isOpen);
        return isOpen ? tlRef.current.reverse() : tlRef.current.play();
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();

        // Check if we're on the home page
        const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
        
        if (!isHomePage) {
            // If not on home page, navigate to home page first
            window.location.href = '/';
            // Store the target section in localStorage to scroll after navigation
            localStorage.setItem('scrollTarget', targetId);
            return;
        }

        const section = document.getElementById(targetId);
        if (!section) {
            return;
        }

        if (lenis) {
            lenis.scrollTo(section, { offset: -15 });
        }

        if (isOpen && tlRef.current) {
            setIsOpen(false);
            tlRef.current.reverse();
        }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (isOpen && menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node) &&
            toggleButtonRef.current && !(toggleButtonRef.current as HTMLElement).contains(event.target as Node)) {
            setIsOpen(false);
            tlRef.current?.reverse();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);
    
    // Effect to handle scrolling to target section after navigation
    useEffect(() => {
        const scrollTarget = localStorage.getItem('scrollTarget');
        if (scrollTarget) {
            // Clear the stored target immediately to prevent unwanted scrolling on future loads
            localStorage.removeItem('scrollTarget');
            
            // Small delay to ensure the page is fully loaded
            const timer = setTimeout(() => {
                const section = document.getElementById(scrollTarget);
                if (section && lenis) {
                    lenis.scrollTo(section, { offset: -15 });
                }
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [lenis]);


    return (
        <nav className="fixed top-0 right-0 left-0 flex justify-center z-40 pointer-events-none">
            <div className="w-full flex items-center justify-between mt-4 mx-4 md:mx-8">
                <div className="flex items-center justify-center space-x-2 order-1 md:order-none z-50">
                    <div className="w-12 h-12 bg-navbar relative rounded-icon border border-border overflow-hidden">
                        <Image
                            src={"/logo.png"}
                            alt={"Husarz Logo"}
                            fill
                            className="section-image object-cover"
                        />
                    </div>
                    <p className="text-lg font-bold tracking-tight text-text-primary">
                        Husarz Gym
                    </p>
                </div>

                <button
                    ref={toggleButtonRef}
                    onClick={toggleMenu}
                    className="order-2 h-12 w-12 md:hidden bg-navbar backdrop-blur-md rounded-icon border border-border p-2 text-text-primary relative pointer-events-auto z-50"
                >
                    <div
                        ref={toggleButtonLine1Ref}
                        className="absolute w-5 border border-text-white top-[40%] left-1/2 transform -translate-x-1/2 rounded-sm origin-center"
                        aria-hidden="true"
                    ></div>
                    <div
                        ref={toggleButtonLine2Ref}
                        className="absolute w-5 border border-text-white top-[60%] left-1/2 transform -translate-x-1/2 rounded-sm origin-center"
                        aria-hidden="true"
                    ></div>
                </button>

                <div className="hidden md:flex items-center justify-center bg-navbar backdrop-blur-md py-2 px-2 border border-border rounded-card pointer-events-auto">
                    <div className="flex items-center gap-8 ml-2">
                        {translations.navigation.slice(0, -1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleScroll(e, item.href)}
                                className="text-text-secondary hover:text-text-primary transition-colors duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href={translations.navigation[translations.navigation.length - 1].href}
                            onClick={(e) => handleScroll(e, translations.navigation[translations.navigation.length - 1].href)}
                            className="bg-text-primary text-text-black backdrop-blur-sm border border-border px-3 py-1 rounded-icon"
                        >
                            {translations.navigation[translations.navigation.length - 1].name}
                        </Link>
                    </div>
                    <LanguageSwitcher />
                </div>

                <div
                    ref={menuRef}
                    style={{opacity:0}}
                    className="absolute top-0 left-0 right-0 md:hidden bg-navbar backdrop-blur-md border border-border rounded-b-card p-4 pointer-events-auto"
                >
                    <div className="flex flex-col space-y-4 pt-24">
                        {translations.navigation.slice(0, -1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-text-secondary hover:text-text-primary transition-colors duration-300"
                                onClick={(e) => handleScroll(e, item.href)}

                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href={translations.navigation[translations.navigation.length - 1].href}
                            className="bg-text-primary text-text-black backdrop-blur-sm border border-border px-3 py-1 rounded-icon text-center"
                            onClick={(e) => handleScroll(e, translations.navigation[translations.navigation.length - 1].href)}
                        >
                            {translations.navigation[translations.navigation.length - 1].name}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;