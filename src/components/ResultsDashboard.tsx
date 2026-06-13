import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import RouteCard from './RouteCard';
import BusDetailTimeline from './BusDetailTimeline';
import { SearchX } from 'lucide-react';

export default function ResultsDashboard() {
  const activeTab = useAppStore((s) => s.activeTab);
  const results = useAppStore((s) => s.results);
  const selectedBus = useAppStore((s) => s.selectedBus);
  const loading = useAppStore((s) => s.loading);

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Journey results
  if (activeTab === 'journey') {
    // No search yet
    if (results === null) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[#E5E7EB] dark:border-[#2E2E3E] rounded-2xl"
        >
          <p className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
            No search yet.
          </p>
          <p className="text-[14px] text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Choose two stands above. Try <span className="italic">Behala → Salt Lake Sector V</span>.
          </p>
        </motion.div>
      );
    }

    // No routes found
    if (results.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] dark:bg-[#3E3518] flex items-center justify-center mb-4">
            <SearchX size={28} className="text-[#F59E0B]" />
          </div>
          <p className="text-[15px] font-medium text-[#1C1C28] dark:text-[#F1F1F4]">
            No routes found
          </p>
          <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] mt-1 max-w-[260px]">
            We couldn't find any connecting routes between these stops. Try different stops nearby.
          </p>
        </motion.div>
      );
    }

    // Results found
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
            {results.length} route{results.length > 1 ? 's' : ''} found
          </h2>
          <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium">
            {useAppStore.getState().search.fromStop} → {useAppStore.getState().search.toStop}
          </span>
        </div>
        <AnimatePresence>
          {results.map((route, i) => (
            <RouteCard key={`${route.type}-${i}`} route={route} index={i} />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Bus tab results
  if (activeTab === 'bus') {
    if (selectedBus) {
      return <BusDetailTimeline bus={selectedBus} />;
    }

    // Empty state
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[#E5E7EB] dark:border-[#2E2E3E] rounded-2xl"
      >
        <p className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
          No bus selected.
        </p>
        <p className="text-[14px] text-[#6B7280] dark:text-[#A1A1AA] mt-1">
          Enter a bus number above to see its route. Try <span className="italic">S-101</span>.
        </p>
      </motion.div>
    );
  }

  return null;
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-24 rounded skeleton-shimmer" />
              <div className="h-4 w-40 rounded skeleton-shimmer" />
              <div className="h-4 w-20 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
