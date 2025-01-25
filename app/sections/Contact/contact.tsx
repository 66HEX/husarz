import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      title: "Main Location",
      description: "123 Fitness Street, Downtown District\nCity Center, 00-123\n\nEasy access from Central Station\nFree parking available 24/7",
      icon: MapPin
    },
    {
      title: "Opening Hours",
      description: "Monday - Friday: 6:00 - 23:00\nWeekends: 8:00 - 22:00\n\n24/7 access available for Premium members\nHoliday hours may vary",
      icon: Clock
    },
    {
      title: "Contact Numbers",
      description: "General: +1 234 567 890\nMembership: +1 234 567 891\n\nWhatsApp available\nEmergency line 24/7",
      icon: Phone
    },
    {
      title: "Get in Touch",
      description: "General: contact@strengthgym.com\nMembership: join@strengthgym.com\n\nResponse within 24 hours\nFollow us on social media",
      icon: Mail
    }
  ];

  return (
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
            <div className="col-span-1 md:col-span-2 mb-8 xl:mb-0">
              <div className="grid grid-cols-2 mb-8 gap-4 md:gap-8">
                <h2 className="col-span-2 md:col-span-1 text-4xl md:text-6xl font-bold tracking-tight">Contact</h2>
                <p className="col-span-2 md:col-span-1 text-text-secondary tracking-tight">
                  Visit our state-of-the-art facility in the heart of the city.
                  Experience premium equipment, expert trainers, and a motivating
                  atmosphere that will help you achieve your fitness goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contactInfo.map((info, index) => (
                    <div key={index} className="space-y-4 rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-6">
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

            <div className="col-span-1 w-full h-full min-h-[400px] rounded-card overflow-hidden relative border border-border">
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