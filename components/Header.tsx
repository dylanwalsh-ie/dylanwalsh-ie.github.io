import React, { useState, useEffect } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#knowledge', label: 'Articles' },
        { href: '#projects', label: 'Projects' },
        { href: '#education', label: 'Education' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-[var(--bg-header-scroll-dark)] backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="text-xl font-bold text-[#007BFF]">
                            Dylan Walsh
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    onClick={(e) => handleNavClick(e, link.href)} 
                                    className="text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF]"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};