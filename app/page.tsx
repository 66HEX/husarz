"use client";

import Hero from "@/app/sections/Hero/hero";
import Sections from "@/app/sections/Sections/sections";
import Coaches from "@/app/sections/Coaches/coaches";
import FAQ from "@/app/sections/FAQ/faq";
import Contact from "@/app/sections/Contact/contact";

export default function Home() {

  return (
    <div>
      <Hero/>
      <Sections/>
      <Coaches/>
      <FAQ/>
      <Contact/>
    </div>
  );
}
