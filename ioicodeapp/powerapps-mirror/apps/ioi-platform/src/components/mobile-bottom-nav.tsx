// Bottom Navigation - Fixed bottom nav for all device sizes

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Home,
  FileText,
  CheckCircle,
  Building2,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDepartmentBasePath } from '@/lib/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

interface BottomNavProps {
  variant?: 'hub' | 'department';
  departmentCode?: string;
  pendingTasks?: number;
}

// Hub navigation items (for department hub / landing page)
const hubNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'submissions', label: 'Submissions', icon: FileText, path: '/my-submissions' },
  { id: 'approvals', label: 'Tasks', icon: CheckCircle, path: '/approvals' },
  { id: 'help', label: 'Help', icon: User, path: '/help' },
];

// Department navigation items (for within a department context)
function getDepartmentNavItems(basePath: string, pendingTasks?: number): NavItem[] {
  return [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: `/${basePath}` },
    { id: 'submissions', label: 'Submissions', icon: FileText, path: `/${basePath}/submissions` },
    { id: 'approvals', label: 'Tasks', icon: CheckCircle, path: `/${basePath}/approvals`, badge: pendingTasks },
    { id: 'hub', label: 'All Depts', icon: Building2, path: '/' },
  ];
}

export function MobileBottomNav({ variant = 'hub', departmentCode, pendingTasks }: BottomNavProps) {
  const location = useLocation();

  const basePath = departmentCode ? getDepartmentBasePath(departmentCode) : '';
  
  const navItems = variant === 'department' && departmentCode
    ? getDepartmentNavItems(basePath, pendingTasks)
    : hubNavItems;

  const isActivePath = (path: string) => {
    if (path === '/' || path === `/${basePath}`) {
      return location.pathname === path || location.pathname === `${path}/`;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav - only on small screens */}
      <div className="h-16 min-[760px]:hidden" aria-hidden="true" />
      
      {/* Bottom Navigation Bar - only visible below 760px */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        className="fixed bottom-0 left-0 right-0 z-50 min-[760px]:hidden"
      >
        {/* Safe area background for notched devices */}
        <div className="bg-white dark:bg-card border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around h-16 px-2 max-w-2xl mx-auto">
            {navItems.map((item: NavItem) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 h-full relative',
                    'transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <div className="relative">
                    <Icon 
                      className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        isActive && 'scale-110'
                      )} 
                    />
                    {/* Badge for notifications */}
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-0 flex items-center justify-center"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <span 
                    className={cn(
                      'text-[10px] mt-1 font-medium transition-all duration-200',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {/* Safe area padding for iOS */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </motion.nav>
    </>
  );
}

export default MobileBottomNav;
