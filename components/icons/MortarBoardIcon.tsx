
import React from 'react';

export const MortarBoardIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 18c0 1.842-.632 3.543-1.682 4.999M4.318 10.578A12.083 12.083 0 013 18c0 1.842.632 3.543 1.682 4.999" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0l-4-2m4 2l4-2" />
    </svg>
);
