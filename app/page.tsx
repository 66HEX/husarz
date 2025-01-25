"use client";

import Hero from "@/app/sections/Hero/hero";
import Features from "@/app/sections/Features/features";
import Coaches from "@/app/sections/Coaches/coaches";
import FAQ from "@/app/sections/FAQ/faq";
import Contact from "@/app/sections/Contact/contact";
import {useEffect} from "react";

export default function Home() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <div>
      <Hero/>
      <Features/>
      <Coaches/>
      <FAQ/>
      <Contact/>
    </div>
  );
}
