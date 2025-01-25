import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    const navigation = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'Coaches', href: '#coaches' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-4 left-8 right-8 z-50 flex justify-center">
            <div className="inline-flex px-4 md:px-8 bg-navbar backdrop-blur-md p-4 border border-border rounded-card">
                <div className="flex items-center justify-center">
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.slice(0, -1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href={navigation[navigation.length - 1].href}
                            className="bg-text-secondary backdrop-blur-sm border border-border px-3 py-1 rounded-icon"
                        >
                            {navigation[navigation.length - 1].name}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;