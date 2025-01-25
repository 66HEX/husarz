"use client";
import Lenis from "@studio-freight/lenis";
import { ReactNode, useEffect } from "react";

interface SmoothScrollingProps {
    children: ReactNode;
}

function SmoothScrolling({ children }: SmoothScrollingProps) {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.07, duration: 1.5 });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

export default SmoothScrolling;