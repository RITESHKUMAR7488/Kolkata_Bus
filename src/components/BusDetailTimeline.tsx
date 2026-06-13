import { motion } from 'framer-motion';
import type { BusRoute } from '@/types';
import { getBusFullRoute } from '@/lib/routingEngine';
import { useAppStore } from '@/store/useAppStore';
import { Bus, Navigation, Clock, MapPin, DollarSign, Share2, Bookmark } from 'lucide-react';

interface BusDetailTimelineProps {
  bus: BusRoute;
}

export default function BusDetailTimeline({ bus }: BusDetailTimelineProps) {
  const fullRoute = getBusFullRoute(bus.busNumber);
  const setShowMap = useAppStore((s) => s.setShowMap);

  if (!fullRoute) return null;

  const totalStops = fullRoute.length;
  const estimatedFare = bus.type === 'ac' ? 'Rs 20-35' : 'Rs 10-20';
  const frequency = bus.type === 'ac' ? 'Every 20 min' : 'Every 10-15 min';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-4 space-y-4"
    >
      {/* Bus Header Card */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 flex items-center justify-center">
            <Bus size={24} className="text-[#FF6B35]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1C1C28] dark:text-[#F1F1F4]">
                {bus.busNumber}
              </h2>
              <span className="px-2 py-0.5 bg-[#008080]/10 dark:bg-[#008080]/20 rounded-md text-[11px] font-medium text-[#008080]">
                {bus.type === 'ac' ? 'AC Bus' : 'Suburban'}
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA]">
              {bus.stops[0]} → {bus.stops[bus.stops.length - 1]}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg p-3 text-center">
            <Clock size={18} className="mx-auto text-[#6B7280] dark:text-[#A1A1AA] mb-1" />
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Frequency</p>
            <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mt-0.5">{frequency}</p>
          </div>
          <div className="bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg p-3 text-center">
            <MapPin size={18} className="mx-auto text-[#6B7280] dark:text-[#A1A1AA] mb-1" />
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Total Stops</p>
            <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mt-0.5">{totalStops}</p>
          </div>
          <div className="bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg p-3 text-center">
            <DollarSign size={18} className="mx-auto text-[#6B7280] dark:text-[#A1A1AA] mb-1" />
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Fare</p>
            <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mt-0.5">{estimatedFare}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowMap(true)}
            className="flex-1 h-10 bg-[#FF6B35] text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#E55A2B] active:bg-[#D44F24] transition-colors ripple"
          >
            <Navigation size={14} />
            View on Map
          </button>
          <button className="w-10 h-10 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors">
            <Share2 size={16} />
          </button>
          <button className="w-10 h-10 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors">
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {/* Full Timeline Card */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-4 shadow-sm transition-colors duration-300">
        <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-3">
          Complete Route
        </h3>

        <div className="space-y-0">
          {fullRoute.map((stop, i) => {
            const isFirst = i === 0;
            const isLast = i === fullRoute.length - 1;

            return (
              <motion.div
                key={stop.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.5), duration: 0.2 }}
                className="flex items-start gap-3"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center w-6 shrink-0">
                  {!isFirst && (
                    <div className="w-0.5 h-4 bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
                  )}
                  {isFirst && <div className="h-4" />}

                  <div
                    className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                      isFirst
                        ? 'bg-[#22C55E] border-[#22C55E]'
                        : isLast
                        ? 'bg-[#EF4444] border-[#EF4444]'
                        : 'bg-white dark:bg-[#1C1C28] border-[#008080]'
                    }`}
                  />

                  {!isLast && (
                    <div className="w-0.5 flex-1 min-h-[20px] bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
                  )}
                  {isLast && <div className="h-1" />}
                </div>

                {/* Stop Info */}
                <div className="pb-3 -mt-0.5 flex-1">
                  <span
                    className={`text-[14px] ${
                      isFirst || isLast
                        ? 'font-semibold text-[#1C1C28] dark:text-[#F1F1F4]'
                        : 'text-[#6B7280] dark:text-[#A1A1AA]'
                    }`}
                  >
                    {stop.name}
                  </span>
                  {isFirst && (
                    <span className="ml-2 text-[10px] font-medium text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded">
                      Start
                    </span>
                  )}
                  {isLast && (
                    <span className="ml-2 text-[10px] font-medium text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">
                      End
                    </span>
                  )}
                  <span className="block text-[11px] text-[#9CA3AF] mt-0.5">
                    Stop {stop.sequence}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
