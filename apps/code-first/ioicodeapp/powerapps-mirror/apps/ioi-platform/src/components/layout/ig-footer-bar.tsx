// Industrial Governance - Fixed Footer Status Bar
import { motion } from 'motion/react';
import { Activity, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IGFooterBarProps {
  activeAudit?: string;
  syncStatus?: 'synced' | 'syncing' | 'error';
  lastSync?: string;
  className?: string;
}

export function IGFooterBar({
  activeAudit = 'ISO 45001',
  syncStatus = 'synced',
  lastSync = 'Just now',
  className,
}: IGFooterBarProps) {
  return (
    <motion.div
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5, ease: [0.2, 0, 0, 1] as const }}
      className={cn(
        'fixed bottom-0 left-0 right-0 h-8 bg-[#003366]/95 backdrop-blur-sm z-40',
        'flex items-center justify-between px-6',
        'border-t border-[#003366]',
        className
      )}
    >
      {/* Left Section - Active Audit */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-white/70" />
          <span className="ig-label-caps text-[9px] text-white/60">Active Audit</span>
          <span className="ig-data-text-sm text-white font-medium">{activeAudit}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-[#006a6a]" />
          <span className="ig-data-text-sm text-white/80">Compliance Monitoring Active</span>
        </div>
      </div>

      {/* Right Section - Sync Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {syncStatus === 'synced' && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#006a6a]" />
              <span className="ig-data-text-sm text-white/80">Data synced</span>
            </>
          )}
          {syncStatus === 'syncing' && (
            <>
              <Clock className="h-3.5 w-3.5 text-[#d97706] animate-pulse" />
              <span className="ig-data-text-sm text-white/80">Syncing...</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <AlertCircle className="h-3.5 w-3.5 text-[#ba1a1a]" />
              <span className="ig-data-text-sm text-white/80">Sync error</span>
            </>
          )}
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-white/50" />
          <span className="ig-data-text-sm text-white/60">Last updated: {lastSync}</span>
        </div>
      </div>
    </motion.div>
  );
}