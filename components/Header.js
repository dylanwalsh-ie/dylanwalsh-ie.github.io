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

export function renderHeader() {
    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#knowledge', label: 'Articles' },
        { href: '#projects', label: 'Projects' },
        { href: '#education', label: 'Education' },
        { href: '#contact', label: 'Contact' },
    ];
    const dark = isDarkMode();

    return `
        <header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <a href="#hero" class="nav-link text-xl font-bold text-[#007BFF]">
                            Dylan Walsh
                        </a>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            ${navLinks.map(link => `
                                <a 
                                    href="${link.href}" 
                                    class="nav-link text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    ${link.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button
                            id="dark-mode-toggle"
                            class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF]"
                            aria-label="Toggle dark mode"
                        >
                            ${dark ? SunIcon("h-6 w-6") : MoonIcon("h-6 w-6")}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    `;
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
