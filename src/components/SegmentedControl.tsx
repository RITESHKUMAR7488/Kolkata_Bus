import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { MapPin, Bus, Train } from 'lucide-react';

export default function SegmentedControl() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <div className="bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-xl p-1 flex relative transition-colors duration-300">
      {/* Sliding background */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-[#FF6B35] shadow-md shadow-[#FF6B35]/25"
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: 'calc(25% - 4px)',
          left: activeTab === 'journey' ? '4px' : activeTab === 'bus' ? 'calc(25% + 2px)' : activeTab === 'metro' ? 'calc(50%)' : 'calc(75% - 2px)',
        }}
      />

      {/* Plan Journey Tab */}
      <button
        onClick={() => setActiveTab('journey')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          activeTab === 'journey'
            ? 'text-white'
            : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
        }`}
        aria-pressed={activeTab === 'journey'}
        aria-label="Plan journey from A to B"
      >
        <MapPin size={16} strokeWidth={2} />
        Plan Journey
      </button>

      {/* Find Bus Tab */}
      <button
        onClick={() => setActiveTab('bus')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          activeTab === 'bus'
            ? 'text-white'
            : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
        }`}
        aria-pressed={activeTab === 'bus'}
        aria-label="Find specific bus"
      >
        <Bus size={16} strokeWidth={2} />
        Find Bus
      </button>

      {/* Metro Tab */}
      <button
        onClick={() => setActiveTab('metro')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          activeTab === 'metro'
            ? 'text-white'
            : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
        }`}
        aria-pressed={activeTab === 'metro'}
        aria-label="Metro Network"
      >
        <Train size={16} strokeWidth={2} />
        Metro
      </button>

      {/* Train Tab */}
      <button
        onClick={() => setActiveTab('train')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          activeTab === 'train'
            ? 'text-white'
            : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
        }`}
        aria-pressed={activeTab === 'train'}
        aria-label="Local Trains"
      >
        <Train size={16} strokeWidth={2} />
        Trains
      </button>
    </div>
  );
}
