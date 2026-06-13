import { useAppStore } from '@/store/useAppStore';
import { Bus, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white dark:bg-[#1C1C28] border-b border-[#E5E7EB] dark:border-[#2E2E3E] transition-colors duration-300">
      <div className="max-w-lg mx-auto h-full px-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/20">
            <Bus size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-[18px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] leading-tight tracking-tight">
              Kolkata Transit
            </h1>
            <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider -mt-0.5">
              Route Planner
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#2E2E3E] flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors ripple"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>
      </div>
    </header>
  );
}
