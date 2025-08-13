import { SunIcon } from './icons/SunIcon.js';
import { MoonIcon } from './icons/MoonIcon.js';

function isDarkMode() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateTheme(isDark) {
     const root = document.documentElement;
     if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
     } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
     }
     const toggle = document.getElementById('dark-mode-toggle');
     if(toggle) {
        toggle.innerHTML = isDark ? SunIcon("h-6 w-6") : MoonIcon("h-6 w-6");
     }
}

export function attachHeaderListeners() {
    // Initial theme setup
    updateTheme(isDarkMode());

    // Dark mode toggle
    const toggle = document.getElementById('dark-mode-toggle');
    toggle?.addEventListener('click', () => {
        updateTheme(!isDarkMode());
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 10) {
            header?.classList.add('bg-white/80', 'dark:bg-[var(--bg-header-scroll-dark)]', 'backdrop-blur-sm', 'shadow-md');
            header?.classList.remove('bg-transparent');
        } else {
            header?.classList.remove('bg-white/80', 'dark:bg-[var(--bg-header-scroll-dark)]', 'backdrop-blur-sm', 'shadow-md');
            header?.classList.add('bg-transparent');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                 const targetElement = document.querySelector(href);
                 if (targetElement) {
                     targetElement.scrollIntoView({ behavior: 'smooth' });
                 }
            }
        });
    });
}