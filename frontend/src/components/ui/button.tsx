import React, {ButtonHTMLAttributes} from 'react';

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "solid" | "outline" | "black";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: ButtonSize;
    variant?: ButtonVariant;
}

export function Button({
                           children,
                           size = "md",
                           variant = "solid",
                           ...props
                       }: ButtonProps): JSX.Element {
    const sizes: Record<ButtonSize, string> = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    const variants: Record<ButtonVariant, string> = {
        solid: "bg-blue-600 hover:bg-blue-700 text-white",
        outline: "border border-gray-700 text-gray-300 hover:bg-gray-700",
        black: "bg-gray-950 hover:bg-gray-950 text-white",
    };

    return (
        <button
            className={`rounded ${sizes[size]} ${variants[variant]} flex items-center ${props.className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}

