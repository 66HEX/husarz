"use client";

import Hero from "@/app/sections/Hero/hero";
import Sections from "@/app/sections/Sections/sections";
import Coaches from "@/app/sections/Coaches/coaches";
import FAQ from "@/app/sections/FAQ/faq";
import Contact from "@/app/sections/Contact/contact";
import InfiniteMarqueeExample from "./components/InfiniteMarquee/example";
import { ScrollDirectionProvider } from "./hooks/useScrollDirection";

export default function Home() {

  return (
    <ScrollDirectionProvider>
      <div className="flex flex-col gap-4 md:gap-8 mb-4 md:mb-8">
        <Hero/>
        <InfiniteMarqueeExample/>
        <Sections/>
        <Coaches/>
        <FAQ/>
        <Contact/>
      </div>
    </ScrollDirectionProvider>
  );
}
