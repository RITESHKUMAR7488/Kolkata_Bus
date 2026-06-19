import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useFavourites } from '@/hooks/useFavourites';
import RouteCard from './RouteCard';
import BusDetailTimeline from './BusDetailTimeline';
import { SearchX, Star, Share2, Check, Link } from 'lucide-react';

/* ── Share helper ──────────────────────────────────────────────────────────── */
function buildShareUrl(from: string, to: string) {
  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('from', from);
  url.searchParams.set('to', to);
  return url.toString();
}

async function shareRoute(from: string, to: string): Promise<'shared' | 'copied'> {
  const url = buildShareUrl(from, to);
  const title = `Kolkata Travel Router: ${from} → ${to}`;
  const text = `Find bus routes from ${from} to ${to} on Kolkata Travel Router`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch {
      // Fall through to clipboard
    }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export default function ResultsDashboard() {
  const activeTab = useAppStore((s) => s.activeTab);
  const results = useAppStore((s) => s.results);
  const selectedBus = useAppStore((s) => s.selectedBus);
  const loading = useAppStore((s) => s.loading);
  const search = useAppStore((s) => s.search);

  const { isFavourite, toggleFavourite } = useFavourites();
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied'>('idle');

  const from = search.fromStop;
  const to = search.toStop;
  const starred = isFavourite(from, to);

  const handleShare = useCallback(async () => {
    if (!from || !to) return;
    const status = await shareRoute(from, to);
    setShareStatus(status);
    setTimeout(() => setShareStatus('idle'), 2500);
  }, [from, to]);

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
        {/* Header row with favourite + share */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
            {results.length} route{results.length > 1 ? 's' : ''} found
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium hidden sm:block">
              {from} → {to}
            </span>

            {/* Favourite button */}
            <motion.button
              onClick={() => toggleFavourite(from, to)}
              whileTap={{ scale: 0.85 }}
              title={starred ? 'Remove from favourites' : 'Save route'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                starred
                  ? 'bg-[#FEF9C3] dark:bg-[#3E3518] text-[#F59E0B]'
                  : 'bg-[#F3F4F6] dark:bg-[#2E2E3E] text-[#9CA3AF] hover:text-[#F59E0B]'
              }`}
            >
              <Star size={15} fill={starred ? 'currentColor' : 'none'} />
            </motion.button>

            {/* Share button */}
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.85 }}
              title="Share this route"
              className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#2E2E3E] flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
            >
              {shareStatus === 'idle' ? (
                <Share2 size={15} />
              ) : shareStatus === 'copied' ? (
                <Link size={15} className="text-[#3B82F6]" />
              ) : (
                <Check size={15} className="text-[#22C55E]" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Share toast */}
        <AnimatePresence>
          {shareStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 px-3 py-2 bg-[#EFF6FF] dark:bg-[#1E3A5F]/50 border border-[#BFDBFE] dark:border-[#1E40AF]/40 rounded-lg"
            >
              <Check size={13} className="text-[#3B82F6]" />
              <span className="text-[12px] text-[#1D4ED8] dark:text-[#93C5FD]">
                {shareStatus === 'copied' ? 'Link copied to clipboard!' : 'Route shared!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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
