"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'Coaches', href: '#coaches' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 right-0 left-0  z-50 flex justify-center">
            <div className="w-full flex items-center justify-between mt-4 mx-4 md:mx-8">
                <div className="flex items-center space-x-2 order-1 md:order-none z-50">
                    <div className="w-8 h-8 bg-white rounded-icon"></div>
                    <div className="w-32 h-8 bg-text-secondary rounded-icon"></div>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="order-2 md:hidden bg-navbar backdrop-blur-md rounded-icon border border-border p-2 text-text-primary"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center justify-center bg-navbar backdrop-blur-md py-2 px-2 border border-border rounded-card">
                    <div className="flex items-center gap-8 ml-2">
                        {navigation.slice(0, -1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-text-secondary hover:text-white transition-colors duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href={navigation[navigation.length - 1].href}
                            className="bg-text-primary text-text-black backdrop-blur-sm border border-border px-3 py-1 rounded-icon"
                        >
                            {navigation[navigation.length - 1].name}
                        </Link>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {isOpen && (
                    <div className="absolute top-0 left-0 right-0 md:hidden bg-navbar backdrop-blur-md border border-border rounded-card p-4">
                        <div className="flex flex-col space-y-4 pt-24">
                            {navigation.slice(0, -1).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-text-secondary hover:text-white transition-colors duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href={navigation[navigation.length - 1].href}
                                className="bg-text-primary text-text-black backdrop-blur-sm border border-border px-3 py-1 rounded-icon text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                {navigation[navigation.length - 1].name}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;