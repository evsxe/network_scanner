import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export function Badge({children, className}: BadgeProps): JSX.Element {
    return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${className || ''}`}>
      {children}
    </span>
    );
}

