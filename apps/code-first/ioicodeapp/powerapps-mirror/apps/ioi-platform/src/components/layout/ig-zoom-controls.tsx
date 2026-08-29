import { Minus, Plus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IGZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export function IGZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  className,
}: IGZoomControlsProps) {
  return (
    <div className={cn('ig-zoom-controls', className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onZoomOut}
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="ig-data-text text-foreground min-w-[40px] text-center font-semibold">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onZoomIn}
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <div className="w-px h-4 bg-muted mx-1" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onReset}
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}