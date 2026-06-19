import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { MapPin, Bus, Train, Ship } from 'lucide-react';

type Tab = 'journey' | 'bus' | 'metro' | 'train' | 'ferry';

const TABS: { id: Tab; label: string; icon: React.ReactNode; ariaLabel: string }[] = [
  { id: 'journey', label: 'Plan Journey', icon: <MapPin size={15} strokeWidth={2} />, ariaLabel: 'Plan journey from A to B' },
  { id: 'bus',     label: 'Find Bus',     icon: <Bus  size={15} strokeWidth={2} />, ariaLabel: 'Find specific bus' },
  { id: 'metro',   label: 'Metro',        icon: <Train size={15} strokeWidth={2} />, ariaLabel: 'Metro Network' },
  { id: 'train',   label: 'Trains',       icon: <Train size={15} strokeWidth={2} />, ariaLabel: 'Local Trains' },
  { id: 'ferry',   label: 'Ferry',        icon: <Ship  size={15} strokeWidth={2} />, ariaLabel: 'Hooghly River Ferry' },
];

export default function SegmentedControl() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const pct = 100 / TABS.length;

  return (
    <div className="bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-xl p-1 flex relative transition-colors duration-300">
      {/* Sliding background */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-[#FF6B35] shadow-md shadow-[#FF6B35]/25"
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: `calc(${pct}% - 4px)`,
          left: `calc(${activeIndex * pct}% + ${activeIndex === 0 ? 4 : activeIndex === TABS.length - 1 ? -2 : 1}px)`,
        }}
      />

      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#1C1C28] dark:hover:text-[#F1F1F4]'
          }`}
          aria-pressed={activeTab === tab.id}
          aria-label={tab.ariaLabel}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
