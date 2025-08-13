import { renderAppContent, renderFooterAndModal } from './App.js';
import { attachHeaderListeners } from './components/Header.js';
import { attachHeroListeners } from './components/Hero.js';
import { attachKnowledgeListeners } from './components/Knowledge.js';
import { attachProjectListeners } from './components/Projects.js';
import { attachContactListeners } from './components/Contact.js';
import { initializeScrollAnimations } from './utils/animations.js';

function main() {
    const mainContent = document.getElementById('main-content');
    const footerContainer = document.getElementById('footer-container');
    const modalPlaceholder = document.getElementById('modal-placeholder');
    
    if (!mainContent || !footerContainer || !modalPlaceholder) {
        console.error("Critical layout elements not found");
        return;
    }

    // Render content below the fold
    mainContent.innerHTML = renderAppContent();

    // Render footer and modal placeholder, which live outside the main flow
    const { footer, modal } = renderFooterAndModal();
    footerContainer.innerHTML = footer;
    modalPlaceholder.innerHTML = modal;

    // After rendering, attach all event listeners
    attachHeaderListeners();
    attachHeroListeners();
    attachKnowledgeListeners();
    attachProjectListeners();
    attachContactListeners();

    // Initialize global animations for dynamically added content
    initializeScrollAnimations();
}

// Run the app
main();