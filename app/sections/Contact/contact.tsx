"use client";

import {contact} from "@/app/data/contact";
import {useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from '@/app/libs/gsap/SplitText';
import {useGSAP} from "@gsap/react";
import '@/app/config/gsap';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Contact = () => {
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
        trigger: "#contact",
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
            '.contact-card',
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
            '#map-container',
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 1.2 },
            "-=0.8"
        );
  }, []);

  return (
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
            <div className="col-span-1 md:col-span-2 mb-8 xl:mb-0">
              <div className="grid grid-cols-2 mb-8 gap-4 md:gap-8">
                <div className="col-span-2 md:col-span-1 overflow-hidden">
                  <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight">Contact</h2>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p ref={descRef} className="text-text-secondary tracking-tight">
                    Visit our state-of-the-art facility in the heart of the city.
                    Experience premium equipment, expert trainers, and a motivating
                    atmosphere that will help you achieve your fitness goals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contact.map((info, index) => (
                    <div key={index} className="contact-card space-y-4 rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-4 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-icon backdrop-blur-md border border-border rounded-icon">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold tracking-tight mb-2">{info.title}</h4>
                          <p className="text-text-secondary tracking-tight whitespace-pre-line">{info.description}</p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            <div id="map-container" className="col-span-1 w-full h-full min-h-[400px] rounded-card overflow-hidden relative">
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1234.5678!2d19.123456!3d50.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDA3JzM0LjQiTiAxOcKwMDcnNDQuNCJF!5e0!3m2!1spl!2spl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) contrast(120%) brightness(90%)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
  );
};

export default Contact;