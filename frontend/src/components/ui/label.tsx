import {LabelHTMLAttributes} from 'react';

type LabelSize = "sm" | "md" | "lg";
type LabelVariant = "default" | "muted";

interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'size'> {
    size?: LabelSize;
    variant?: LabelVariant;
    className?: string;
}

export function Label({
                          size = "md",
                          variant = "default",
                          className,
                          ...props
                      }: LabelProps): JSX.Element {
    const sizes: Record<LabelSize, string> = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    const variants: Record<LabelVariant, string> = {
        default: "text-gray-100",
        muted: "text-gray-400",
    };

    return (
        <label
            className={`font-medium ${sizes[size]} ${variants[variant]} ${className || ''}`}
            {...props}
        />
    );
}

