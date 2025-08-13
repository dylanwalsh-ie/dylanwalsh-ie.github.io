
import React, { useState } from 'react';
import { Section } from './Section';
import { MailIcon } from './icons/MailIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { UserIcon } from './icons/UserIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { PencilIcon } from './icons/PencilIcon';

interface FormInputProps {
    id: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required: boolean;
    icon: React.ComponentType<{ className?: string }>;
    rows?: number;
}

const FormInput = ({ id, name, type = 'text', placeholder, value, onChange, required, icon: Icon, rows }: FormInputProps) => {
    const commonProps = {
        id,
        name,
        placeholder,
        value,
        onChange,
        required,
        className: "block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF]"
    };
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            {type === 'textarea' ? (
                <textarea {...commonProps} rows={rows || 4}></textarea>
            ) : (
                <input type={type} {...commonProps} />
            )}
        </div>
    );
};


export const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setResponseMessage('');

        try {
            // Replace with your actual Formspree endpoint
            const response = await fetch('https://formspree.io/f/mvyyeeqq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setResponseMessage('Thank you! Your message has been sent successfully.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                setResponseMessage('Oops! There was a problem submitting your form. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setResponseMessage('An unexpected error occurred. Please check your connection and try again.');
        }
    };


    return (
        <Section id="contact" className="bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-sm">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="text-left">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Let's Connect
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        I'm currently seeking new opportunities and am open to collaboration. Whether you have a question, a project proposal, or just want to say hi, feel free to reach out. I'll do my best to get back to you!
                    </p>
                    <div className="mt-8 space-y-4">
                        <a href="mailto:dylan.walsh@example.com" className="flex items-center space-x-3 text-lg text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors group">
                            <MailIcon className="h-6 w-6 text-[#007BFF]/80 group-hover:text-[#007BFF]" />
                            <span>dylan.walsh@example.com</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-lg text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors group">
                            <LinkedinIcon className="h-6 w-6 text-[#007BFF]/80 group-hover:text-[#007BFF]" />
                            <span>LinkedIn Profile</span>
                        </a>
                    </div>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput id="name" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required icon={UserIcon} />
                        <FormInput id="email" name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required icon={AtSymbolIcon} />
                        <FormInput id="message" name="message" type="textarea" placeholder="Your Message" value={formData.message} onChange={handleChange} required icon={PencilIcon} />
                        
                        <div>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#007BFF] hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                    {responseMessage && (
                        <p className={`mt-4 text-center text-sm font-medium ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {responseMessage}
                        </p>
                    )}
                </div>
            </div>
        </Section>
    );
};
