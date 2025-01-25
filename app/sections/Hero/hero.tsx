import React from 'react';
import Image from "next/image";

const Hero = () => {
    const sports = {
        powerlifting: { name: 'Powerlifting', id: 1 },
        boxing: { name: 'Boxing', id: 2 },
        mma: { name: 'MMA', id: 3 },
        armwrestling: { name: 'Armwrestling', id: 4 }
    };

    return (
        <section id="hero" className="py-24 h-svh">
            <div className="h-full container mx-auto px-4 md:px-8">
                <div className="h-full grid grid-rows-[auto_1fr] gap-8">
                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
                                Husarz Gym
                            </h1>
                            <div className="flex flex-wrap gap-2 ">
                                {Object.values(sports).map((sport) => (
                                    <span
                                        key={sport.id}
                                        className="text-sm bg-card backdrop-blur-md border border-border text-secondary px-3 py-1 rounded-full"
                                    >
                                        {sport.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1 flex items-end">
                            <p className="text-text-secondary text-base md:text-xl tracking-tight">
                                Professional training facility bringing together strength sports and combat arts.
                                Join our community of dedicated athletes and experience training at the highest level.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-full rounded-card overflow-hidden relative border border-border">
                        <Image
                            src="/grey.png"
                            alt="Hero image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;