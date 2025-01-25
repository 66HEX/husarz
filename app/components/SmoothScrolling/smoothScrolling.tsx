"use client";

import Lenis from "lenis";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

export const useLenisContext = () => useContext(LenisContext);

interface SmoothScrollingProps {
    children: ReactNode;
}

const SmoothScrolling = ({ children }: SmoothScrollingProps) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({ lerp: 0.07, duration: 1.5 });

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        setLenis(lenisInstance);

        return () => {
            lenisInstance.destroy();
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
};

export default SmoothScrolling;
