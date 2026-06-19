import { useAppStore } from '@/store/useAppStore';
import { Bus, Ship, Train, MapPin, Star, Share2, LocateFixed, Moon, Sun } from 'lucide-react';

export default function Footer() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-[#E5E7EB] dark:border-[#2E2E3E] bg-white dark:bg-[#1C1C28] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/20">
                <Bus size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-[16px] text-[#1C1C28] dark:text-[#F1F1F4] leading-tight">
                  Kolkata Travel Router
                </p>
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">
                  Free Transit Planner
                </p>
              </div>
            </div>
            <p className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
              Plan your journey across Kolkata using buses, metro, local trains, and Hooghly River
              ferries — all for free.
            </p>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg text-[12px] text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors"
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
              {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </button>
          </div>

          {/* Transport Modes */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] uppercase tracking-wider mb-3">
              Transport Modes
            </h3>
            <ul className="space-y-2">
              {[
                { icon: <Bus size={13} />, label: 'Bus Route Finder', tab: 'journey' as const },
                { icon: <Bus size={13} />, label: 'Find Bus by Number', tab: 'bus' as const },
                { icon: <Train size={13} />, label: 'Kolkata Metro Map', tab: 'metro' as const },
                { icon: <Train size={13} />, label: 'Local Train Network', tab: 'train' as const },
                { icon: <Ship size={13} />, label: 'Hooghly River Ferry', tab: 'ferry' as const },
              ].map(({ icon, label, tab }) => (
                <li key={label}>
                  <button
                    onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex items-center gap-2 text-[13px] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors"
                  >
                    <span className="text-[#9CA3AF]">{icon}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* App Features */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] uppercase tracking-wider mb-3">
              Features
            </h3>
            <ul className="space-y-2">
              {[
                { icon: <LocateFixed size={13} />, label: 'Nearby Stops (GPS)' },
                { icon: <Star size={13} />, label: 'Favourite Routes' },
                { icon: <Share2 size={13} />, label: 'Share Route Links' },
                { icon: <MapPin size={13} />, label: 'Interactive Leaflet Map' },
                { icon: <span className="text-[11px]">🌙</span>, label: 'Dark Mode Support' },
                { icon: <span className="text-[11px]">📱</span>, label: 'Mobile Friendly' },
                { icon: <span className="text-[11px]">🆓</span>, label: 'Completely Free' },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[13px] text-[#6B7280] dark:text-[#A1A1AA]">
                  <span className="text-[#9CA3AF]">{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] uppercase tracking-wider mb-3">
              Key Areas Covered
            </h3>
            <ul className="space-y-1.5 text-[13px] text-[#6B7280] dark:text-[#A1A1AA]">
              {[
                'Howrah · Sealdah · Esplanade',
                'Salt Lake · New Town · Rajarhat',
                'Dum Dum · Barasat · Barrackpore',
                'Garia · Jadavpur · Tollygunge',
                'Behala · Ballygunge · Shyambazar',
                'Bandel · Bardhaman · Shantipur',
                'Chandpal · Fairlie · Baghbazar Ghat',
                'Belur Math · Dakshineswar Ghat',
              ].map((area) => (
                <li key={area} className="text-[12px] leading-snug">{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-[#9CA3AF] text-center sm:text-left">
              © {year} Kolkata Travel Router · Free bus, metro, train &amp; ferry planner for Kolkata, West Bengal
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[#9CA3AF]">
                Data: CSTC · WBTC · Kolkata Metro · Eastern Railway · WBSTC
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
