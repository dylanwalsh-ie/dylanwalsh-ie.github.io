import { MailIcon } from './icons/MailIcon.js';
import { LinkedinIcon } from './icons/LinkedinIcon.js';
import { GithubIcon } from './icons/GithubIcon.js';
import { startTypingEffect } from '../utils/animations.js';

export function renderHero() {
    return `
        <section id="hero" class="min-h-screen flex items-center justify-center text-center pt-20">
            <div class="max-w-4xl mx-auto px-6">
                <h1 class="text-5xl md:text-7xl font-bold mb-4">
                    Dylan Walsh
                </h1>
                <h2 class="text-2xl md:text-3xl text-[#007BFF] font-semibold mb-6 h-10">
                    <span id="hero-headline"></span>
                    <span class="animate-ping">|</span>
                </h2>
                <p class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Passionate IT specialist with a background in academic and database administration. Eager to apply my skills in hardware, networking, and customer support to solve complex technical challenges.
                </p>
                <div class="flex justify-center items-center space-x-6 mb-8">
                    <a href="mailto:dylan.walsh@example.com" class="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="Email">
                        ${MailIcon("h-8 w-8")}
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="LinkedIn">
                        ${LinkedinIcon("h-7 w-7")}
                    </a>
                    <a href="https://github.com/dylan-walsh" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="GitHub">
                        ${GithubIcon("h-7 w-7")}
                    </a>
                </div>
                <div>
                    <a
                        id="view-work-button"
                        href="#projects"
                        class="inline-block bg-[#007BFF] text-white font-bold py-3 px-8 rounded-full hover:bg-[#0056b3] transition-transform transform hover:scale-105"
                    >
                        View My Work
                    </a>
                </div>
            </div>
        </section>
    `;
}

export function attachHeroListeners() {
    startTypingEffect();

    const viewWorkButton = document.getElementById('view-work-button');
    viewWorkButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('projects');
        targetElement?.scrollIntoView({ behavior: 'smooth' });
    });
}
