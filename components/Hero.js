import { startTypingEffect } from '../utils/animations.js';

export function attachHeroListeners() {
    startTypingEffect();

    const viewWorkButton = document.getElementById('view-work-button');
    viewWorkButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('projects');
        targetElement?.scrollIntoView({ behavior: 'smooth' });
    });
}