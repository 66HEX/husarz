import React from 'react';
import Image from "next/image"

const Features = () => {
    const features = [
        {
            title: "Premium Gym Equipment",
            description: "Our 1000m² facility features top-tier Hammer Strength and Life Fitness machines. The free weights area is equipped with competition-grade equipment.",
            equipment: ["Hammer Strength HD Elite", "Eleiko Plates", "Competition Racks"]
        },
        {
            title: "Professional Training Sections",
            description: "Whether you're into powerlifting, combat sports, or armwrestling, we have dedicated spaces with competition racks, specialized bars, and a professional boxing ring.",
            equipment: ["Competition Racks", "Pro Boxing Ring", "Specialized Bars"]
        },
        {
            title: "Expert Guidance",
            description: "Train under certified coaches specializing in various disciplines. Our team ensures proper technique and optimal progress for every member.",
            equipment: ["Form Check Areas", "Analysis Tools", "Progress Tracking"]
        },
        {
            title: "Recovery Zone",
            description: "State-of-the-art recovery facilities to help you perform at your best. Including massage therapy, physiotherapy, and rehabilitation equipment.",
            equipment: ["Recovery Systems", "Massage Tables", "Rehab Equipment"]
        }
    ];

    return (
        <section id="features" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
                    <div className="col-span-1 md:col-span-2 mb-8 xl:mb-0">
                        <div className="grid grid-cols-2 mb-8 gap-4 md:gap-8">
                            <h2 className="col-span-2 md:col-span-1 text-4xl md:text-6xl font-bold tracking-tight">Features</h2>
                            <p className="col-span-2 md:col-span-1 text-text-secondary tracking-tight">
                                Step into a world where strength meets combat sports excellence. With dedicated sections
                                for powerlifting, combat sports, and armwrestling, we've created a unique space where strength
                                disciplines converge under one roof.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="space-y-4 rounded-card overflow-hidden bg-card backdrop-blur-md border border-border p-6">
                                    <div>
                                        <h4 className="text-xl font-bold tracking-tight mb-2">{feature.title}</h4>
                                        <p className="text-text-secondary tracking-tight mb-4">{feature.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {feature.equipment.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-card border border-border text-secondary px-3 py-1 rounded-full"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 w-full h-full min-h-[400px] rounded-card overflow-hidden relative border border-border">
                        <Image
                            src="/grey.png"
                            alt="Gym facilities"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;