import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({children, className}: CardProps): JSX.Element {
    return (
        <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className || ''}`}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
}

export function CardHeader({children}: CardHeaderProps): JSX.Element {
    return <div className="p-4 border-b border-gray-700">{children}</div>;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function CardTitle({children, className}: CardTitleProps): JSX.Element {
    return <h2 className={`text-xl font-bold ${className || ''}`}>{children}</h2>;
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({children, className}: CardDescriptionProps): JSX.Element {
    return <p className={`text-gray-400 ${className || ''}`}>{children}</p>;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({children, className}: CardContentProps): JSX.Element {
    return <div className={`p-4 ${className || ''}`}>{children}</div>;
}

