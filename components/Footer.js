import { MailIcon } from './icons/MailIcon.js';
import { LinkedinIcon } from './icons/LinkedinIcon.js';
import { GithubIcon } from './icons/GithubIcon.js';

export const renderFooter = () => {
    const currentYear = new Date().getFullYear();
    return `
        <footer class="border-t border-gray-200 dark:border-gray-800">
            <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                 <div class="flex justify-center items-center space-x-6 mb-4">
                    <a href="mailto:dylan.walsh@example.com" class="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="Email">
                        ${MailIcon("h-6 w-6")}
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="LinkedIn">
                        ${LinkedinIcon("h-5 w-5")}
                    </a>
                    <a href="https://github.com/dylan-walsh" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="GitHub">
                        ${GithubIcon("h-5 w-5")}
                    </a>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    &copy; ${currentYear} Dylan Walsh. All Rights Reserved.
                </p>
            </div>
        </footer>
    `;
};
