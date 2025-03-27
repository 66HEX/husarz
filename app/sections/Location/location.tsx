"use client";

import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Location = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);

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
        trigger: "#location",
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
            '#map-container',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            "-=0.4"
        );
  }, []);

  return (
      <section id="location" className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Lokalizacja</h2>
          <p ref={descRef} className="text-text-secondary tracking-tight text-lg">
            Odwiedź nasz nowoczesny obiekt treningowy.
            Doświadcz premium sprzętu, profesjonalnych trenerów i motywującej
            atmosfery, która pomoże Ci osiągnąć Twoje cele.
          </p>
          </div>
          
          <div className=" mx-auto">
              <div id="map-container"
                   className="rounded-card overflow-hidden bg-card backdrop-blur-md border border-border relative h-[600px]">
                  <iframe
                      src="https://www.google.com/maps/embed/v1/place?q=Husarz+GYM,+Trakt+Świętego+Wojciecha,+Gdańsk,+Poland&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                      width="100%"
                      height="100%"
                      style={{border: 0, filter: 'grayscale(85%) invert(92%) hue-rotate(180deg) brightness(100%) contrast(100%)'}}  
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full absolute inset-0"
                  />
              </div>
          </div>
        </div>
      </section>
  );
};

export default Location;