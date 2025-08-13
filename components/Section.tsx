import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen.ts';

interface SectionProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = '' }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-100px');

    return (
        <section
            id={id}
            ref={ref}
            className={`w-full max-w-5xl mx-auto px-6 py-16 md:py-24 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            } ${className}`}
        >
            {children}
        </section>
    );
};