import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IGPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function IGPageHeader({ title, subtitle, actions, className }: IGPageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between py-5 px-6 border-b border-[#cbd5e1] bg-white', className)}>
      <div className="flex flex-col">
        <h1 className="ig-heading-xl text-[#0f172a]">{title}</h1>
        {subtitle && (
          <p className="ig-data-text text-[#64748b] mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}