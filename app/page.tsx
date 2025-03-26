"use client";

import Hero from "@/app/sections/Hero/hero";
import Sections from "@/app/sections/Sections/sections";
import Coaches from "@/app/sections/Coaches/coaches";
import FAQ from "@/app/sections/FAQ/faq";
import Location from "@/app/sections/Location/location";
import {useEffect} from "react";


export default function Home() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <div>
      <Hero/>
      <Sections/>
      <Coaches/>
      <Location/>
      <FAQ/>
    </div>
  );
}
