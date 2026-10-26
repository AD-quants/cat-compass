'use client';

import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
        {
          'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-100': variant === 'primary',
          'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-100': variant === 'danger',
          'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 shadow-none': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
