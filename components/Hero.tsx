import React, { useState, useEffect } from 'react';
import { MailIcon } from './icons/MailIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';

const subHeadlines = [
    "Aspiring IT Support Specialist",
    "Database Administrator",
    "Tech Enthusiast"
];

export const Hero = () => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentText, setCurrentText] = useState('');

    useEffect(() => {
        if (isDeleting) {
            if (subIndex === 0) {
                setIsDeleting(false);
                setIndex((prevIndex) => (prevIndex + 1) % subHeadlines.length);
            } else {
                const timer = setTimeout(() => {
                    setCurrentText(subHeadlines[index].substring(0, subIndex - 1));
                    setSubIndex(subIndex - 1);
                }, 100);
                return () => clearTimeout(timer);
            }
        } else {
            if (subIndex === subHeadlines[index].length) {
                const timer = setTimeout(() => setIsDeleting(true), 2000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setCurrentText(subHeadlines[index].substring(0, subIndex + 1));
                    setSubIndex(subIndex + 1);
                }, 150);
                return () => clearTimeout(timer);
            }
        }
    }, [subIndex, isDeleting, index]);

    const handleViewWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.getElementById('projects');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center text-center pt-20">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                    Dylan Walsh
                </h1>
                <h2 className="text-2xl md:text-3xl text-[#007BFF] font-semibold mb-6 h-10">
                    {currentText}
                    <span className="animate-ping">|</span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Passionate IT specialist with a background in academic and database administration. Eager to apply my skills in hardware, networking, and customer support to solve complex technical challenges.
                </p>
                <div className="flex justify-center items-center space-x-6 mb-8">
                    <a href="mailto:dylan.walsh@example.com" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="Email">
                        <MailIcon className="h-8 w-8" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="LinkedIn">
                        <LinkedinIcon className="h-7 w-7" />
                    </a>
                    <a href="https://github.com/dylan-walsh" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="GitHub">
                        <GithubIcon className="h-7 w-7" />
                    </a>
                </div>
                <div>
                    <a
                        href="#projects"
                        onClick={handleViewWorkClick}
                        className="inline-block bg-[#007BFF] text-white font-bold py-3 px-8 rounded-full hover:bg-[#0056b3] transition-transform transform hover:scale-105"
                    >
                        View My Work
                    </a>
                </div>
            </div>
        </section>
    );
};