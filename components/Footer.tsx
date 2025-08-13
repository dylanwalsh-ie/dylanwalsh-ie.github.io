
import React from 'react';
import { MailIcon } from './icons/MailIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                 <div className="flex justify-center items-center space-x-6 mb-4">
                    <a href="mailto:dylan.walsh@example.com" className="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="Email">
                        <MailIcon className="h-6 w-6" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="LinkedIn">
                        <LinkedinIcon className="h-5 w-5" />
                    </a>
                    <a href="https://github.com/dylan-walsh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors" aria-label="GitHub">
                        <GithubIcon className="h-5 w-5" />
                    </a>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {currentYear} Dylan Walsh. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
