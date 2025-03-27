"use client";

import {navigation} from "@/app/data/navigation";
import {social} from "@/app/data/social";
import { useLenisContext } from "@/app/components/SmoothScrolling/smoothScrolling";

const Footer = () => {
    const lenis = useLenisContext();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();

        const section = document.getElementById(targetId);
        if (!section) {
            return;
        }

        if (lenis) {
            lenis.scrollTo(section, { offset: -15 });
        }
    };

  return (
      <footer id="contact" className="text-white py-16 md:py-24 font-medium bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="col-span-2 lg:col-span-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-icon"></div>
                <div className="w-32 h-8 bg-text-secondary rounded-icon"></div>
              </div>
              <p className="text-text-secondary text-sm tracking-tight w-full md:w-2/3">
                Profesjonalny obiekt treningowy łączący sporty siłowe i sztuki walki.
                Dołącz do naszej społeczności oddanych sportowców i doświadcz treningu na najwyższym poziomie.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="col-span-1 w-fit"> 
              <h3 className="text-lg font-bold mb-4 tracking-tight">Szybkie Linki</h3>
              <div className="flex flex-col space-y-2">
                {navigation.map(({name, href}) => (
                  <a
                    key={name}
                    href={href}
                    onClick={(e) => handleScroll(e, href)}
                    className="text-text-secondary hover:text-white transition-colors duration-300 text-sm tracking-tight"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Social Media */}
            <div className="col-span-1 w-fit">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Obserwuj Nas</h3>
              <div className="flex flex-col space-y-2">
                {social.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-white transition-colors duration-300 text-sm tracking-tight"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/*  Address */}
            <div className="col-span-1 w-48">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Adres</h3>
              <p className="text-text-secondary text-sm tracking-tight whitespace-pre-line">
              Trakt Świętego Wojciecha 243,
              80-058 Gdańsk
              </p>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row w-full justify-between items-center pt-6 border-t border-border gap-4 md:gap-0">
            <div className="text-text-secondary text-sm tracking-tight order-2 md:order-1">
              © {new Date().getFullYear()} Husarz Gym. Wszelkie prawa zastrzeżone.
            </div>
            
            <div className="text-text-secondary text-sm tracking-tight order-1 md:order-2">
              Zaprojektowane przez
              <a href="https://hexthecoder.pl" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors duration-300 ml-1">
                HEX
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;