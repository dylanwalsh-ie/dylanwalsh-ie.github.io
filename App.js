import { renderHeader } from './components/Header.js';
import { renderHero } from './components/Hero.js';
import { renderAbout } from './components/About.js';
import { renderKnowledge } from './components/Knowledge.js';
import { renderProjects } from './components/Projects.js';
import { renderEducation } from './components/Education.js';
import { renderContact } from './components/Contact.js';
import { renderFooter } from './components/Footer.js';
import { renderModal } from './components/Modal.js';

export function App() {
    return `
        <div class="transition-colors duration-300">
            ${renderHeader()}
            <main>
                ${renderHero()}
                ${renderAbout()}
                ${renderKnowledge()}
                ${renderProjects()}
                ${renderEducation()}
                ${renderContact()}
            </main>
            ${renderFooter()}
            ${renderModal()}
        </div>
    `;
}
