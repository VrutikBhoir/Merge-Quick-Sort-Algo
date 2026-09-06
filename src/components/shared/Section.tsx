import type { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  const { theme } = useTheme();
  return (
    <section
      id={id}
      className={`rounded-2xl border ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-800'
          : 'bg-white border-gray-200'
      } shadow-lg backdrop-blur-sm p-6 md:p-8 animate-fade-in ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className={`mt-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
