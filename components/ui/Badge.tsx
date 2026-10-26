'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Section, Outcome, ReattemptResult } from '@/lib/types';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'section' | 'outcome' | 'priority' | 'reattempt' | 'neutral';
  value?: Section | Outcome | PriorityLevel | ReattemptResult | string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', value, className, size = 'md' }: BadgeProps) {
  const textValue = (value !== undefined ? String(value) : String(children)).trim();

  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';

  if (variant === 'section') {
    switch (textValue) {
      case 'VARC':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'DILR':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Quant':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      default:
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  } else if (variant === 'outcome') {
    switch (textValue) {
      case 'Correct':
        colorClasses = 'bg-green-50 text-green-700 border-green-200';
        break;
      case 'Incorrect':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'Skipped':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
      case 'Partial':
        colorClasses = 'bg-yellow-50 text-yellow-800 border-yellow-200';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';
    }
  } else if (variant === 'priority') {
    switch (textValue) {
      case 'Critical':
        colorClasses = 'bg-red-50 text-red-700 border-red-300 font-semibold';
        break;
      case 'High':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-300 font-semibold';
        break;
      case 'Medium':
        colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
      case 'Low':
        colorClasses = 'bg-gray-50 text-gray-600 border-gray-200';
        break;
      default:
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  } else if (variant === 'reattempt') {
    switch (textValue) {
      case 'Solved Independently':
      case 'Solved':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300';
        break;
      case 'Needed Hint':
      case 'Hint':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-300';
        break;
      case 'Could Not Solve':
      case 'Failed':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-300';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        colorClasses,
        className
      )}
    >
      {children}
    </span>
  );
}
