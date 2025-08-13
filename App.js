import { renderAbout } from './components/About.js';
import { renderKnowledge } from './components/Knowledge.js';
import { renderProjects } from './components/Projects.js';
import { renderEducation } from './components/Education.js';
import { renderContact } from './components/Contact.js';
import { renderFooter } from './components/Footer.js';
import { renderModal } from './components/Modal.js';

export function renderAppContent() {
    return `
        ${renderAbout()}
        ${renderKnowledge()}
        ${renderProjects()}
        ${renderEducation()}
        ${renderContact()}
    `;
}

export function renderFooterAndModal() {
    return {
        footer: renderFooter(),
        modal: renderModal()
    };
}