import {InputHTMLAttributes} from 'react';

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: InputSize;
    variant?: InputVariant;
    className?: string;
}

export function Input({
                          size = "md",
                          variant = "default",
                          className,
                          ...props
                      }: InputProps): JSX.Element {
    const sizes: Record<InputSize, string> = {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2",
        lg: "px-4 py-3 text-lg",
    };

    const variants: Record<InputVariant, string> = {
        default: "bg-gray-700 border border-gray-600 focus:border-blue-500 text-gray-100",
        filled: "bg-gray-800 focus:bg-gray-700 text-gray-100",
    };

    return (
        <input
            className={`rounded outline-none transition-colors ${sizes[size]} ${variants[variant]} ${className || ''}`}
            {...props}
        />
    );
}

