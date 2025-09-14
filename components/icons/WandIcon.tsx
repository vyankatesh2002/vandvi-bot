import React from 'react';

export const WandIcon: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.06-3.06l-2.45 2.45a3 3 0 004.24 4.24l2.45-2.45z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.636 8.878l2.45-2.45a3 3 0 00-4.24-4.24l-2.45 2.45a3 3 0 004.24 4.24z" />
    </svg>
);
