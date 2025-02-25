import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export function Table({ children, className = '' }: TableProps): JSX.Element {
    return (
        <table className={`w-full border-collapse ${className}`}>
            {children}
        </table>
    );
}

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps): JSX.Element {
    return (
        <thead className={`bg-gray-700 ${className}`}>
        {children}
        </thead>
    );
}

interface TableBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps): JSX.Element {
    return (
        <tbody className={`${className}`}>
        {children}
        </tbody>
    );
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

export function TableRow({ children, className = '' }: TableRowProps): JSX.Element {
    return (
        <tr className={`border-b border-gray-700 ${className}`}>
            {children}
        </tr>
    );
}

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps): JSX.Element {
    return (
        <th className={`p-2 text-left font-semibold text-gray-300 ${className}`}>
            {children}
        </th>
    );
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps): JSX.Element {
    return (
        <td className={`p-2 text-gray-400 ${className}`}>
            {children}
        </td>
    );
}

