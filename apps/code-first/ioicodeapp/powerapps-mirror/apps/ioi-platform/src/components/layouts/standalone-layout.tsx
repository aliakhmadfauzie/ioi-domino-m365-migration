// Standalone Layout - Minimal header for pages outside department context

import { motion } from 'motion/react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { RouteLoadingWrapper } from '@/components/route-loading-wrapper';
import { useBackNavigation } from '@/lib/navigation';

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  const goBack = useBackNavigation('/');

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 bg-[#003366] flex items-center px-4 gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={goBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-semibold">Enterprise Suite</span>
        </div>
      </header>

      {/* Content - Wrapped with loading state */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        className="pb-20 lg:pb-0"
      >
        <RouteLoadingWrapper message="Loading page data...">
          {children}
        </RouteLoadingWrapper>
      </motion.main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav variant="hub" />
    </div>
  );
}
