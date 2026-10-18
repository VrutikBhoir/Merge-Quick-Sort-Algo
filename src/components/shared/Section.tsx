import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-gray-600">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
