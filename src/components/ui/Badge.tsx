import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'priority' | 'source' | 'neutral';
  status?: string;
  priority?: string;
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'neutral',
  status,
  priority,
  className = '',
  dot = false,
}: BadgeProps) {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  const normalizedStatus = (status || '').toLowerCase();

  if (variant === 'status' && status) {
    if (normalizedStatus.includes('new')) {
      colorStyles = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      dotColor = 'bg-blue-500';
    } else if (normalizedStatus.includes('contact')) {
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
      dotColor = 'bg-amber-500';
    } else if (normalizedStatus.includes('test') || normalizedStatus.includes('progress')) {
      colorStyles = 'bg-purple-50 text-purple-700 border-purple-200 font-medium';
      dotColor = 'bg-purple-500';
    } else if (normalizedStatus.includes('won')) {
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      dotColor = 'bg-emerald-500';
    } else if (normalizedStatus.includes('lost')) {
      colorStyles = 'bg-slate-100 text-slate-500 border-slate-200 font-medium';
      dotColor = 'bg-slate-400';
    }
  } else if (variant === 'priority' && priority) {
    const p = priority.toLowerCase();
    if (p.includes('urgent') || p.includes('high')) {
      colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      dotColor = 'bg-rose-500';
    } else if (p.includes('medium')) {
      colorStyles = 'bg-sky-50 text-sky-700 border-sky-200 font-medium';
      dotColor = 'bg-sky-500';
    } else {
      colorStyles = 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
      dotColor = 'bg-slate-400';
    }
  } else if (variant === 'source') {
    colorStyles = 'bg-slate-100 text-slate-800 border-slate-200 font-medium';
    dotColor = 'bg-slate-600';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${colorStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
