import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Bus, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 z-50 h-[60px] bg-white/80 dark:bg-[#1C1C28]/80 backdrop-blur-xl border-b border-[#E5E7EB] dark:border-[#2E2E3E] transition-all duration-300 ${
        scrolled ? 'navbar-scrolled h-[52px]' : ''
      }`}
    >
      <div className="max-w-lg mx-auto h-full px-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/20"
          >
            <Bus size={18} strokeWidth={2.5} />
          </motion.div>
          <div>
            <p className="font-display text-[18px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] leading-tight tracking-tight">
              Kolkata Transit
            </p>
            <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider -mt-0.5">
              Route Planner
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#2E2E3E] flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors ripple ${
            scrolled ? 'w-8 h-8' : ''
          }`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
}
