import React from 'react';

const Footer = () => {
  const navigation = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'Coaches', href: '#coaches' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
      <footer className="text-white py-8 font-medium">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row w-full justify-between items-center pt-6 border-t border-border gap-4 md:gap-0">
            <div className="flex items-center space-x-2 order-1 md:order-none">
              <div className="w-8 h-8 bg-white rounded-icon"></div>
              <div className="w-32 h-8 bg-text-secondary rounded-icon"></div>
            </div>

            <span className="text-text-secondary text-sm tracking-tight order-3 md:order-none md:absolute md:left-1/2 md:-translate-x-1/2">
            © {new Date().getFullYear()} Husarz Gym
          </span>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm tracking-tight order-2 md:order-none">
              {navigation.map(({ name, href }) => (
                  <a
                      key={name}
                      href={href}
                      className="text-text-secondary hover:text-white transition-colors duration-300"
                  >
                    {name}
                  </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;