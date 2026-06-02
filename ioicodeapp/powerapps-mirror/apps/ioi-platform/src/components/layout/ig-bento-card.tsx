import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IGBentoCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function IGBentoCard({
  title,
  icon,
  children,
  className,
  headerClassName,
  bodyClassName,
}: IGBentoCardProps) {
  return (
    <div className={cn('ig-bento-card overflow-hidden', className)}>
      <div className={cn('ig-bento-card-header flex items-center gap-2', headerClassName)}>
        {icon}
        <span className="ig-label-caps">{title}</span>
      </div>
      <div className={cn('ig-bento-card-body', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}