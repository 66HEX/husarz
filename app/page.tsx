"use client";

import Hero from "@/app/sections/Hero/hero";
import Map from "@/app/sections/Contact/contact";
import Coaches from "@/app/sections/Coaches/coaches";
import Features from "@/app/sections/Features/features";

export default function Home() {
  return (
    <div>
      <Hero/>
        <Features/>
      <Coaches/>
      <Map/>
    </div>
  );
}
