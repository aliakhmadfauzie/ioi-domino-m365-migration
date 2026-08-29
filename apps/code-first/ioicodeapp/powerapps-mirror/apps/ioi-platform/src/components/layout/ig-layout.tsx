import { type ReactNode } from 'react';
import { IGTopbar } from './ig-topbar';
import { cn } from '@/lib/utils';

interface IGLayoutProps {
  children: ReactNode;
  showCanvas?: boolean;
  className?: string;
}

export function IGLayout({ children, showCanvas = false, className }: IGLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <IGTopbar />
      
      <main
        className={cn(
          'min-h-screen transition-all duration-200 ease-out',
          showCanvas && 'ig-canvas-bg',
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}