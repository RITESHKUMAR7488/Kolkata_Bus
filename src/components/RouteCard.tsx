import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DirectRoute, MultiHopRoute, RouteResult } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import {
  Bus,
  Train,
  ChevronDown,
  ArrowRight,
  Navigation,
  Footprints,
  List,
  Route as RouteIcon
} from 'lucide-react';

interface RouteCardProps {
  route: RouteResult;
  index: number;
}

export default function RouteCard({ route, index }: RouteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const setSelectedRoute = useAppStore((s) => s.selectRoute);
  const setShowMap = useAppStore((s) => s.setShowMap);

  const handleShowOnMap = () => {
    setSelectedRoute(route);
    setShowMap(true);
  };

  if (route.type === 'direct') {
    return <DirectRouteCard route={route} index={index} expanded={expanded} setExpanded={setExpanded} onShowMap={handleShowOnMap} />;
  }
  return <MultiHopRouteCard route={route} index={index} expanded={expanded} setExpanded={setExpanded} onShowMap={handleShowOnMap} />;
}

/* ─── Direct Route Card ─── */
function DirectRouteCard({
  route,
  index,
  expanded,
  setExpanded,
  onShowMap,
}: {
  route: DirectRoute;
  index: number;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  onShowMap: () => void;
}) {
  const [viewMode, setViewMode] = useState<'summarized' | 'detailed'>('summarized');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm overflow-hidden transition-colors duration-300"
    >
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start gap-3 hover:bg-[#FAFAFA] dark:hover:bg-[#242434] transition-colors"
        aria-expanded={expanded}
      >
        {/* Bus Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${route.busType === 'metro' ? 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20' : route.busType === 'train' ? 'bg-[#DC2626]/10 dark:bg-[#DC2626]/20' : 'bg-[#F3F4F6] dark:bg-[#2E2E3E]'}`}>
          {route.busType === 'metro' ? (
            <Train size={20} className="text-[#3B82F6]" />
          ) : route.busType === 'train' ? (
            <Train size={20} className="text-[#DC2626]" />
          ) : (
            <Bus size={20} className="text-[#008080]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 bg-[#F3F4F6] dark:bg-[#2E2E3E] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-md text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
              {route.busNumber}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${route.busType === 'metro' ? 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#3B82F6]' : route.busType === 'train' ? 'bg-[#DC2626]/10 dark:bg-[#DC2626]/20 text-[#DC2626]' : 'bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 text-[#FF6B35]'}`}>
              {route.busType === 'metro' ? 'Metro' : route.busType === 'train' ? 'Local Train' : route.busType === 'ac' ? 'AC' : 'Suburban'}
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] truncate">
            {route.origin} <ArrowRight size={12} className="inline mx-1" /> {route.destination}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[12px] font-medium text-[#008080] bg-[#008080]/10 dark:bg-[#008080]/20 px-2 py-0.5 rounded">
              {route.totalStops} stops
            </span>
            <span className="text-[12px] text-[#9CA3AF]">
              Direct
            </span>
          </div>
        </div>

        {/* Expand Chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-2 text-[#9CA3AF]"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Expanded Timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#E5E7EB] dark:border-[#2E2E3E]">
              {/* View Toggle */}
              <div className="flex bg-[#F3F4F6] dark:bg-[#2E2E3E] p-1 rounded-lg mt-3 mb-2">
                <button
                  onClick={() => setViewMode('summarized')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md transition-colors ${
                    viewMode === 'summarized'
                      ? 'bg-white dark:bg-[#1C1C28] text-[#1C1C28] dark:text-[#F1F1F4] shadow-sm'
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  <RouteIcon size={14} /> Turn-by-Turn
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-white dark:bg-[#1C1C28] text-[#1C1C28] dark:text-[#F1F1F4] shadow-sm'
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  <List size={14} /> All Stops
                </button>
              </div>

              <BusTimeline stops={route.fullRoute} viewMode={viewMode} />

              {/* Show on Map Button */}
              <button
                onClick={onShowMap}
                className="mt-3 w-full py-2.5 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg text-[13px] font-medium text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={14} />
                Show on Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Multi-Hop Route Card ─── */
function MultiHopRouteCard({
  route,
  index,
  expanded,
  setExpanded,
  onShowMap,
}: {
  route: MultiHopRoute;
  index: number;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  onShowMap: () => void;
}) {
  const [viewMode, setViewMode] = useState<'summarized' | 'detailed'>('summarized');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm overflow-hidden transition-colors duration-300"
    >
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-[#FAFAFA] dark:hover:bg-[#242434] transition-colors"
        aria-expanded={expanded}
      >
        {/* Bus pills row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {route.hops.map((hop, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-[#F3F4F6] dark:bg-[#2E2E3E] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-md text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
                {hop.busNumber}
              </span>
              {i < route.hops.length - 1 && (
                <ArrowRight size={14} className="text-[#9CA3AF]" />
              )}
            </div>
          ))}
          <span className="inline-flex items-center px-2 py-0.5 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 rounded-md text-[11px] font-medium text-[#F59E0B] ml-auto">
            {route.hops.length - 1} change{route.hops.length > 2 ? 's' : ''}
          </span>
        </div>

        {/* Junction Info */}
        <div className="flex items-center gap-2 mb-1.5">
          <Footprints size={14} className="text-[#FF6B35]" />
          <span className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            Change at: <strong className="text-[#FF6B35]">{route.junctionStop}</strong>
          </span>
        </div>

        {/* Stops count */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#008080] bg-[#008080]/10 dark:bg-[#008080]/20 px-2 py-0.5 rounded">
            {route.totalStops} total stops
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-[#9CA3AF]"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Expanded Timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#E5E7EB] dark:border-[#2E2E3E]">
              {/* View Toggle */}
              <div className="flex bg-[#F3F4F6] dark:bg-[#2E2E3E] p-1 rounded-lg mt-3 mb-2">
                <button
                  onClick={() => setViewMode('summarized')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md transition-colors ${
                    viewMode === 'summarized'
                      ? 'bg-white dark:bg-[#1C1C28] text-[#1C1C28] dark:text-[#F1F1F4] shadow-sm'
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  <RouteIcon size={14} /> Turn-by-Turn
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-white dark:bg-[#1C1C28] text-[#1C1C28] dark:text-[#F1F1F4] shadow-sm'
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  <List size={14} /> All Stops
                </button>
              </div>

              {route.hops.map((hop, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 py-2">
                    {hop.busType === 'metro' ? (
                      <Train size={16} className="text-[#3B82F6]" />
                    ) : hop.busType === 'train' ? (
                      <Train size={16} className="text-[#DC2626]" />
                    ) : (
                      <Bus size={16} className="text-[#008080]" />
                    )}
                    <span className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
                      {hop.busNumber}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${hop.busType === 'metro' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : hop.busType === 'train' ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-[#FF6B35]/10 text-[#FF6B35]'}`}>
                      {hop.busType === 'metro' ? 'Metro' : hop.busType === 'train' ? 'Local Train' : 'Bus'}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      {hop.from} → {hop.to} ({hop.stops} stops)
                    </span>
                  </div>
                  <BusTimeline stops={hop.route} viewMode={viewMode} />
                  {i < route.hops.length - 1 && (
                    <div className="flex items-center gap-2 py-2 my-1 border-y border-dashed border-[#FF6B35]/30 dark:border-[#FF6B35]/20">
                      <Footprints size={14} className="text-[#FF6B35]" />
                      <span className="text-[12px] font-medium text-[#FF6B35]">
                        Change here for {route.hops[i + 1].busNumber}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={onShowMap}
                className="mt-3 w-full py-2.5 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg text-[13px] font-medium text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={14} />
                Show on Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── BusTimeline Component ─── */
function BusTimeline({
  stops,
  viewMode = 'detailed',
}: {
  stops: { name: string; isJunction: boolean }[];
  viewMode?: 'summarized' | 'detailed';
}) {
  const isSummarized = viewMode === 'summarized' && stops.length > 3;

  if (isSummarized) {
    const first = stops[0];
    const last = stops[stops.length - 1];
    const intermediateCount = stops.length - 2;
    // Show up to 3 intermediate stops in the text
    const passesThrough = stops
      .slice(1, Math.min(4, stops.length - 1))
      .map((s) => s.name)
      .join(', ');
    const hasMore = intermediateCount > 3 ? '...' : '';

    return (
      <div className="pl-5 py-2">
        {/* First Stop */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center w-5 shrink-0">
            <div className="h-3" />
            <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0 bg-[#008080] border-[#008080]" />
            <div className="w-0.5 flex-1 min-h-[16px] bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
          </div>
          <div className="pb-2 -mt-0.5">
            <span className="text-[13px] font-medium text-[#1C1C28] dark:text-[#F1F1F4]">
              {first.name}
            </span>
          </div>
        </div>

        {/* Summarized Intermediate Section */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center w-5 shrink-0">
            {/* We use a dotted line or standard line to connect */}
            <div className="w-0.5 h-8 bg-[#E5E7EB] dark:bg-[#3E3E4E] border-dashed" />
          </div>
          <div className="py-1">
            <p className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA] leading-snug pr-4">
              <strong className="text-[#1C1C28] dark:text-[#F1F1F4]">{intermediateCount} stops</strong>
              {' · Passes through '}
              {passesThrough}{hasMore}
            </p>
          </div>
        </div>

        {/* Last Stop */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center w-5 shrink-0">
            <div className="w-0.5 h-3 bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
            <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0 bg-[#008080] border-[#008080]" />
            <div className="h-1" />
          </div>
          <div className="pb-2 -mt-0.5">
            <span className="text-[13px] font-medium text-[#1C1C28] dark:text-[#F1F1F4]">
              {last.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Detailed View (original behavior)
  return (
    <div className="pl-5 py-2">
      {stops.map((stop, i) => {
        const isFirst = i === 0;
        const isLast = i === stops.length - 1;

        return (
          <motion.div
            key={`${stop.name}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            className="flex items-start gap-3"
          >
            {/* Timeline column */}
            <div className="flex flex-col items-center w-5 shrink-0">
              {/* Top line */}
              {!isFirst && (
                <div className="w-0.5 h-3 bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
              )}
              {isFirst && <div className="h-3" />}

              {/* Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${
                  stop.isJunction
                    ? 'bg-[#FF6B35] border-[#FF6B35]'
                    : isFirst || isLast
                    ? 'bg-[#008080] border-[#008080]'
                    : 'bg-white dark:bg-[#1C1C28] border-[#008080]'
                }`}
              />

              {/* Bottom line */}
              {!isLast && (
                <div className="w-0.5 flex-1 min-h-[16px] bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
              )}
              {isLast && <div className="h-1" />}
            </div>

            {/* Stop name */}
            <div className="pb-2 -mt-0.5">
              <span
                className={`text-[13px] ${
                  stop.isJunction
                    ? 'font-semibold text-[#FF6B35]'
                    : isFirst || isLast
                    ? 'font-medium text-[#1C1C28] dark:text-[#F1F1F4]'
                    : 'text-[#6B7280] dark:text-[#A1A1AA]'
                }`}
              >
                {stop.name}
              </span>
              {stop.isJunction && (
                <span className="ml-1.5 text-[10px] font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-1.5 py-0.5 rounded">
                  Junction
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
