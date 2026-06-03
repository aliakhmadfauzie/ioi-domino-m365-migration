import type { ITIndexTab } from '@/lib/it-index-tabs';

interface ITFormIndexTabsProps {
  activeTab: ITIndexTab;
  onTabChange: (tab: ITIndexTab) => void;
  mySubmissionsCount: number;
  myActionsCount: number;
  totalCount?: number;
}

export function ITFormIndexTabs({
  activeTab,
  onTabChange,
  mySubmissionsCount,
  myActionsCount,
  totalCount,
}: ITFormIndexTabsProps) {
  const tabs: { key: ITIndexTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'mine', label: 'My Submissions', count: mySubmissionsCount },
    { key: 'actions', label: 'My Actions', count: myActionsCount },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={[
              'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isActive
                ? 'text-blue-900 border-b-2 border-blue-700 -mb-px'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={[
                  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[1.25rem]',
                  tab.key === 'actions' && tab.count > 0
                    ? 'bg-amber-100 text-amber-800'
                    : isActive
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
