/**
 * @file Renders the main header and navigation for the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Contains the main Header component, a reusable NavLink component
 * for smooth scrolling, and logic for the mobile navigation menu
 */
import React, { useState, useEffect, useRef } from 'react';

// Modified NavLink to accept an optional onClick handler for mobile menu functionality
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    if (!targetId) return;

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 110; // Offset to account for the sticky header and provide some space
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Call the passed onClick handler, e.g., to close the mobile menu
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="nav-link-cyber relative text-base font-medium px-4 py-2 transition-colors duration-300 text-gray-300 hover:text-blue-300 cursor-pointer"
    >
      {children}
    </a>
  );
};

interface HeaderProps {
  startTyping: boolean;
}

export const Header: React.FC<HeaderProps> = ({ startTyping }) => {
  const fullName = "DYLAN WALSH :)";
  const [name, setName] = useState('');
  const effectRan = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent the effect from running if startTyping is false or if it has already run
    if (!startTyping || effectRan.current) return;
    effectRan.current = true;

    const typingInterval = setInterval(() => {
      setName(prev => {
        if (prev.length < fullName.length) {
          return fullName.substring(0, prev.length + 1);
        } else {
          clearInterval(typingInterval);
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(typingInterval);
  }, [startTyping]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to reset the style when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close menu if open
  };

  const navLinks = [
    { href: "#about", text: "About" },
    { href: "#skills", text: "Skills" },
    { href: "#experience", text: "Experience" },
    { href: "#education", text: "Education" },
    { href: "#projects", text: "Projects" },
    { href: "#interests", text: "Interests" },
    { href: "#contact", text: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-4 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="cyber-header-slashed flex items-center justify-between p-2 max-w-5xl mx-auto">
            <a href="#" onClick={handleScrollToTop} className="relative z-10 flex items-center pl-12 pr-4 text-lg font-bold text-white tracking-wider transition-colors cyber-glow hover:text-blue-300">
              <span className="hidden sm:inline font-mono">{name}</span>
              <span className={`hidden sm:inline blinking-cursor font-mono ${name === fullName ? 'hidden' : ''}`}>_</span>
            </a>

            {/* Desktop Navigation */}
            <div className="relative z-10 hidden lg:flex items-baseline space-x-2 pr-8">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>{link.text}</NavLink>
              ))}
            </div>

            {/* Mobile Burger Menu Button */}
            <div className="lg:hidden flex items-center pr-4 z-[51]">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative h-8 w-8 text-blue-400 focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="absolute left-1/2 top-1/2 block w-7 -translate-x-1/2 -translate-y-1/2">
                  <span aria-hidden="true" className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                  <span aria-hidden="true" className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span aria-hidden="true" className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
             <NavLink key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-2xl font-mono uppercase text-gray-300 hover:text-blue-300 hover:cyber-glow transition-all">
                    {link.text}
                </span>
             </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};