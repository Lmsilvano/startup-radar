'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { label: 'Métricas', href: '#dashboard', id: 'dashboard' },
    { label: 'Diretório', href: '#listing', id: 'listing' },
];

export function Navbar() {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const observers = navItems.map((item) => {
            const element = document.getElementById(item.id);
            if (!element) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(item.id);
                    }
                },
                { threshold: 0.3, rootMargin: '-10% 0px -70% 0px' }
            );

            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, []);

    return (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground relative">
            {navItems.map((item) => (
                <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className={`relative px-1 py-1 transition-colors hover:text-primary ${
                        activeSection === item.id ? 'text-primary' : ''
                    }`}
                >
                    {item.label}
                    {activeSection === item.id && (
                        <motion.div
                            layoutId="activeNav"
                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                            transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 30,
                            }}
                        />
                    )}
                </a>
            ))}
            <div className="h-4 w-[1px] bg-border mx-2" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                SC Innovation Index
            </span>
        </nav>
    );
}
