import { App } from './App.js';
import { attachHeaderListeners } from './components/Header.js';
import { attachHeroListeners } from './components/Hero.js';
import { attachKnowledgeListeners } from './components/Knowledge.js';
import { attachProjectListeners } from './components/Projects.js';
import { attachContactListeners } from './components/Contact.js';
import { initializeScrollAnimations } from './utils/animations.js';

function main() {
    const root = document.getElementById('root');
    if (!root) {
        console.error("Root element not found");
        return;
    }

    // Render the entire app's HTML
    root.innerHTML = App();

    // After rendering, attach all event listeners
    attachHeaderListeners();
    attachHeroListeners();
    attachKnowledgeListeners();
    attachProjectListeners();
    attachContactListeners();

    // Initialize global animations
    initializeScrollAnimations();
}

// Run the app
main();
