"use client";

import {useEffect, useRef} from 'react';
import gsap from 'gsap';

const CursorFollower = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const verticalLineRef = useRef<HTMLDivElement>(null);
    const horizontalLineRef = useRef<HTMLDivElement>(null);
    const crossRef = useRef<HTMLDivElement>(null);
    const currentRotation = useRef(0);

    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const cursor = cursorRef.current;
        const verticalLine = verticalLineRef.current;
        const horizontalLine = horizontalLineRef.current;
        const cross = crossRef.current;

        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (!cursor) return;

            gsap.to(cursor, {
                x: mouse.current.x,
                y: mouse.current.y,
                duration: 0.8,
                ease: "expo.out"
            });

            gsap.set(verticalLine, {
                height: '20px',
                width: '1.5px',
                x: -0.75,
                y: -10,
            });

            gsap.set(horizontalLine, {
                width: '20px',
                height: '1.5px',
                x: -10,
                y: -0.75,
            });
        };

        const onClick = () => {
            if (!cross) return;
            currentRotation.current += 360;

            gsap.to(cross, {
                rotation: currentRotation.current,
                duration: 0.6,
                ease: "power2.out",
                transformOrigin: "center center",
                overwrite: true
            });
        };

        const onHover = () => {
            if (!cross) return;
            currentRotation.current += 45;

            gsap.to(cross, {
                scale: 2,
                rotation: currentRotation.current,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
            });
        };

        const onLeave = () => {
            if (!cross) return;
            currentRotation.current += 45;

            gsap.to(cross, {
                scale: 1,
                rotation: currentRotation.current,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
            });
        };

        const interactiveElements = document.querySelectorAll('a, button');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', onHover);
            element.addEventListener('mouseleave', onLeave);
        });

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            interactiveElements.forEach(element => {
                element.removeEventListener('mouseenter', onHover);
                element.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="hidden md:block fixed pointer-events-none z-50 mix-blend-difference"
            style={{ transform: 'translate(-50%, -50%)' }}
        >
            <div ref={crossRef}>
                <div
                    ref={verticalLineRef}
                    className="absolute bg-white"
                />
                <div
                    ref={horizontalLineRef}
                    className="absolute bg-white"
                />
            </div>
        </div>
    );
};

export default CursorFollower;