import { renderSection } from './Section.js';
import { MailIcon } from './icons/MailIcon.js';
import { LinkedinIcon } from './icons/LinkedinIcon.js';
import { UserIcon } from './icons/UserIcon.js';
import { AtSymbolIcon } from './icons/AtSymbolIcon.js';
import { PencilIcon } from './icons/PencilIcon.js';

const FormInput = ({ id, name, type = 'text', placeholder, icon, rows }) => {
    const Icon = icon;
    const inputHtml = type === 'textarea'
        ? `<textarea id="${id}" name="${name}" placeholder="${placeholder}" required rows="${rows || 4}" class="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF]"></textarea>`
        : `<input type="${type}" id="${id}" name="${name}" placeholder="${placeholder}" required class="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF]" />`;

    return `
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                ${Icon("h-5 w-5 text-gray-400")}
            </div>
            ${inputHtml}
        </div>
    `;
};

export function renderContact() {
    const content = `
        <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div class="text-left">
                <h2 class="text-3xl md:text-4xl font-bold">
                    Let's Connect
                </h2>
                <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    I'm currently seeking new opportunities and am open to collaboration. Whether you have a question, a project proposal, or just want to say hi, feel free to reach out. I'll do my best to get back to you!
                </p>
                <div class="mt-8 space-y-4">
                    <a href="mailto:dylan.walsh@example.com" class="flex items-center space-x-3 text-lg text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors group">
                        ${MailIcon("h-6 w-6 text-[#007BFF]/80 group-hover:text-[#007BFF]")}
                        <span>dylan.walsh@example.com</span>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-3 text-lg text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors group">
                        ${LinkedinIcon("h-6 w-6 text-[#007BFF]/80 group-hover:text-[#007BFF]")}
                        <span>LinkedIn Profile</span>
                    </a>
                </div>
            </div>

            <div>
                <form id="contact-form" class="space-y-6">
                    ${FormInput({ id: 'name', name: 'name', placeholder: 'Your Name', icon: UserIcon })}
                    ${FormInput({ id: 'email', name: 'email', type: 'email', placeholder: 'Your Email', icon: AtSymbolIcon })}
                    ${FormInput({ id: 'message', name: 'message', type: 'textarea', placeholder: 'Your Message', icon: PencilIcon, rows: 4 })}
                    
                    <div>
                        <button
                            id="contact-submit-btn"
                            type="submit"
                            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#007BFF] hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
                <p id="contact-status-msg" class="mt-4 text-center text-sm font-medium"></p>
            </div>
        </div>
    `;
    return renderSection('contact', content, 'bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-sm');
}

export function attachContactListeners() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusMsg = document.getElementById('contact-status-msg');

    if (!form || !submitBtn || !statusMsg) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        statusMsg.textContent = '';
        statusMsg.className = 'mt-4 text-center text-sm font-medium';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://formspree.io/f/mvyyeeqq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
                statusMsg.classList.add('text-green-600', 'dark:text-green-400');
                form.reset();
            } else {
                statusMsg.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                statusMsg.classList.add('text-red-600', 'dark:text-red-400');
            }
        } catch (error) {
            statusMsg.textContent = 'An unexpected error occurred. Please check your connection and try again.';
            statusMsg.classList.add('text-red-600', 'dark:text-red-400');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
