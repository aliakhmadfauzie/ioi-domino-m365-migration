import { cn } from '@/lib/utils';

interface Site {
  id: string;
  label: string;
}

interface IGSiteSwitcherProps {
  sites: Site[];
  activeSite: string;
  onChange: (siteId: string) => void;
  className?: string;
}

export function IGSiteSwitcher({ sites, activeSite, onChange, className }: IGSiteSwitcherProps) {
  return (
    <div className={cn('ig-site-switcher', className)}>
      {sites.map((site: Site) => (
        <button
          key={site.id}
          onClick={() => onChange(site.id)}
          className={cn(
            'ig-site-switcher-btn',
            activeSite === site.id && 'active'
          )}
        >
          {site.label}
        </button>
      ))}
    </div>
  );
}