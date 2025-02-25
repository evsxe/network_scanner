interface ProgressProps {
    value: number;
    max: number;
    className?: string;
    indicatorClassName?: string;
}

export function Progress({value, max, className, indicatorClassName}: ProgressProps): JSX.Element {
    return (
        <div className={`relative ${className || ''}`}>
            <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
            <div
                className={`absolute inset-0 rounded-full ${indicatorClassName || ''}`}
                style={{width: `${(value / max) * 100}%`}}
            ></div>
        </div>
    );
}

