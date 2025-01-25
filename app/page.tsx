import Hero from "@/app/sections/Hero/hero";
import Contact from "@/app/sections/Contact/contact";
import Coaches from "@/app/sections/Coaches/coaches";
import Features from "@/app/sections/Features/features";
import FAQ from "@/app/sections/FAQ/faq";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Features/>
      <Coaches/>
      <Contact/>
      <FAQ/>
    </div>
  );
}
