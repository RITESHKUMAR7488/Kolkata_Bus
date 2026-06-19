import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useFavourites } from '@/hooks/useFavourites';
import { useNearbyStops } from '@/hooks/useNearbyStops';
import {
  MapPin,
  ArrowUpDown,
  Bus,
  Search,
  Check,
  AlertCircle,
  LocateFixed,
  Star,
  Loader2,
  Clock,
  Trash2,
} from 'lucide-react';

export default function SearchPanel() {
  const activeTab = useAppStore((s) => s.activeTab);
  const search = useAppStore((s) => s.search);
  const error = useAppStore((s) => s.error);
  const setFromStop = useAppStore((s) => s.setFromStop);
  const setToStop = useAppStore((s) => s.setToStop);
  const setBusNumber = useAppStore((s) => s.setBusNumber);
  const updateFromSuggestions = useAppStore((s) => s.updateFromSuggestions);
  const updateToSuggestions = useAppStore((s) => s.updateToSuggestions);
  const updateBusSuggestions = useAppStore((s) => s.updateBusSuggestions);
  const selectFromSuggestion = useAppStore((s) => s.selectFromSuggestion);
  const selectToSuggestion = useAppStore((s) => s.selectToSuggestion);
  const selectBusSuggestion = useAppStore((s) => s.selectBusSuggestion);
  const setShowFromDropdown = useAppStore((s) => s.setShowFromDropdown);
  const setShowToDropdown = useAppStore((s) => s.setShowToDropdown);
  const setShowBusDropdown = useAppStore((s) => s.setShowBusDropdown);
  const swapStops = useAppStore((s) => s.swapStops);
  const searchRoutes = useAppStore((s) => s.searchRoutes);
  const searchBus = useAppStore((s) => s.searchBus);
  const clearError = useAppStore((s) => s.clearError);

  const { favourites, removeFavourite } = useFavourites();
  const { state: nearbyState, nearby, errorMsg: nearbyError, findNearby, reset: resetNearby } = useNearbyStops();
  const [showNearby, setShowNearby] = useState(false);

  const [isSwapping, setIsSwapping] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const busInputRef = useRef<HTMLInputElement>(null);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);
  const busDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node) &&
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target as Node)
      ) {
        setShowFromDropdown(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node) &&
        toInputRef.current &&
        !toInputRef.current.contains(event.target as Node)
      ) {
        setShowToDropdown(false);
      }
      if (
        busDropdownRef.current &&
        !busDropdownRef.current.contains(event.target as Node) &&
        busInputRef.current &&
        !busInputRef.current.contains(event.target as Node)
      ) {
        setShowBusDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shake animation trigger
  useEffect(() => {
    if (error) {
      setShakeError(true);
      const timer = setTimeout(() => setShakeError(false), 600);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSwap = () => {
    setIsSwapping(true);
    swapStops();
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSearchJourney = () => {
    clearError();
    searchRoutes();
  };

  const handleSearchBus = () => {
    clearError();
    searchBus();
  };

  const isValidFrom = search.fromStop.length > 0;
  const isValidTo = search.toStop.length > 0;
  const isValidBus = search.busNumber.length > 0;
  const hasNoSearch = !search.fromStop && !search.toStop;

  const handleNearMe = () => {
    setShowNearby(true);
    findNearby();
  };

  const handlePickNearby = (stopName: string) => {
    setFromStop(stopName);
    setShowNearby(false);
    resetNearby();
    toInputRef.current?.focus();
  };

  const handleUseFavourite = (from: string, to: string) => {
    clearError();
    setFromStop(from);
    setToStop(to);
    setTimeout(() => searchRoutes(), 50);
  };

  return (
    <motion.div
      className={`mt-4 bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-4 shadow-sm transition-colors duration-300 ${
        shakeError ? 'animate-shake' : ''
      }`}
      layout
    >
      <AnimatePresence mode="wait">
        {activeTab === 'journey' ? (
          <motion.div
            key="journey"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4"
          >
            {/* From Input */}
            <div className="relative flex-1" ref={fromDropdownRef}>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22C55E]"
                />
                <input
                  ref={fromInputRef}
                  type="text"
                  value={search.fromStop}
                  onChange={(e) => {
                    setFromStop(e.target.value);
                    updateFromSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    if (search.fromStop.trim()) updateFromSuggestions(search.fromStop);
                  }}
                  placeholder="Search start stop"
                  className="w-full h-12 pl-11 pr-10 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl text-[15px] text-[#1C1C28] dark:text-[#F1F1F4] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                  aria-label="Starting stop"
                  aria-autocomplete="list"
                  aria-controls="from-suggestions"
                  aria-expanded={search.showFromDropdown}
                />
                {isValidFrom && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <Check size={16} className="text-[#22C55E]" />
                  </motion.div>
                )}
              </div>

              {/* From Autocomplete Dropdown */}
              <AnimatePresence>
                {search.showFromDropdown && search.fromSuggestions.length > 0 && (
                  <motion.div
                    id="from-suggestions"
                    role="listbox"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl shadow-lg shadow-black/10 max-h-[200px] overflow-y-auto"
                  >
                    {search.fromSuggestions.map((stop) => (
                      <button
                        key={stop}
                        role="option"
                        onClick={() => {
                          selectFromSuggestion(stop);
                          toInputRef.current?.focus();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E] transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#9CA3AF] shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="text-[13px] text-[#1C1C28] dark:text-[#E4E4E7] truncate">
                          {stop}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-3 lg:my-0 relative z-10 shrink-0">
              <motion.button
                onClick={handleSwap}
                animate={{ rotate: isSwapping ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-9 h-9 rounded-full bg-[#F3F4F6] dark:bg-[#2E2E3E] border-2 border-white dark:border-[#1C1C28] flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] shadow-sm ripple transition-colors"
                aria-label="Swap origin and destination"
              >
                <ArrowUpDown size={16} />
              </motion.button>
            </div>

            {/* To Input */}
            <div className="relative flex-1" ref={toDropdownRef}>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EF4444]"
                />
                <input
                  ref={toInputRef}
                  type="text"
                  value={search.toStop}
                  onChange={(e) => {
                    setToStop(e.target.value);
                    updateToSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    if (search.toStop.trim()) updateToSuggestions(search.toStop);
                  }}
                  placeholder="Search destination stop"
                  className="w-full h-12 pl-11 pr-10 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl text-[15px] text-[#1C1C28] dark:text-[#F1F1F4] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                  aria-label="Destination stop"
                  aria-autocomplete="list"
                  aria-controls="to-suggestions"
                  aria-expanded={search.showToDropdown}
                />
                {isValidTo && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <Check size={16} className="text-[#22C55E]" />
                  </motion.div>
                )}
              </div>

              {/* To Autocomplete Dropdown */}
              <AnimatePresence>
                {search.showToDropdown && search.toSuggestions.length > 0 && (
                  <motion.div
                    id="to-suggestions"
                    role="listbox"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl shadow-lg shadow-black/10 max-h-[200px] overflow-y-auto"
                  >
                    {search.toSuggestions.map((stop) => (
                      <button
                        key={stop}
                        role="option"
                        onClick={() => selectToSuggestion(stop)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E] transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#9CA3AF] shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="text-[13px] text-[#1C1C28] dark:text-[#E4E4E7] truncate">
                          {stop}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Near Me + Search Buttons */}
            <div className="flex gap-2 w-full lg:w-auto shrink-0">
              <motion.button
                onClick={handleNearMe}
                whileTap={{ scale: 0.97 }}
                title="Use my location"
                className="h-12 w-12 shrink-0 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-xl flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#3E3E4E] transition-colors border border-[#E5E7EB] dark:border-[#3E3E4E]"
                aria-label="Find nearby stops"
              >
                {nearbyState === 'loading' ? (
                  <Loader2 size={18} className="animate-spin text-[#FF6B35]" />
                ) : (
                  <LocateFixed size={18} />
                )}
              </motion.button>
              <motion.button
                onClick={handleSearchJourney}
                whileTap={{ scale: 0.98 }}
                className="flex-1 lg:w-32 h-12 bg-[#FF6B35] text-white rounded-xl font-semibold text-[15px] shadow-md shadow-[#FF6B35]/25 hover:bg-[#E55A2B] active:bg-[#D44F24] transition-colors ripple flex items-center justify-center gap-2"
                aria-label="Show available buses"
              >
                <Search size={18} />
                Find
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="bus"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4"
          >
            {/* Bus Number Input */}
            <div className="relative flex-1" ref={busDropdownRef}>
              <div className="relative">
                <Bus
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#008080]"
                />
                <input
                  ref={busInputRef}
                  type="text"
                  value={search.busNumber}
                  onChange={(e) => {
                    setBusNumber(e.target.value);
                    updateBusSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    if (search.busNumber.trim()) updateBusSuggestions(search.busNumber);
                  }}
                  placeholder="Enter Bus Number (e.g., S-101, AC-47)"
                  className="w-full h-12 pl-11 pr-10 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl text-[15px] text-[#1C1C28] dark:text-[#F1F1F4] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                  aria-label="Bus number"
                  aria-autocomplete="list"
                  aria-controls="bus-suggestions"
                  aria-expanded={search.showBusDropdown}
                />
                {isValidBus && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <Check size={16} className="text-[#22C55E]" />
                  </motion.div>
                )}
              </div>

              {/* Bus Autocomplete Dropdown */}
              <AnimatePresence>
                {search.showBusDropdown && search.busSuggestions.length > 0 && (
                  <motion.div
                    id="bus-suggestions"
                    role="listbox"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 left-0 right-0 mt-2 bg-white dark:bg-[#242434] border border-[#E5E7EB] dark:border-[#3E3E4E] rounded-xl shadow-lg shadow-black/10 max-h-[200px] overflow-y-auto"
                  >
                    {search.busSuggestions.map((num) => (
                      <button
                        key={num}
                        role="option"
                        onClick={() => selectBusSuggestion(num)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E] transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <Bus
                          size={16}
                          className="text-[#9CA3AF] shrink-0"
                        />
                        <span className="text-[13px] text-[#1C1C28] dark:text-[#E4E4E7]">
                          {num}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Find Bus Button */}
            <div className="w-full lg:w-40 shrink-0">
              <motion.button
                onClick={handleSearchBus}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 bg-[#FF6B35] text-white rounded-xl font-semibold text-[15px] shadow-md shadow-[#FF6B35]/25 hover:bg-[#E55A2B] active:bg-[#D44F24] transition-colors ripple flex items-center justify-center gap-2"
                aria-label="Find bus route"
              >
                <Bus size={18} />
                Find Bus
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-3 py-2.5 bg-[#FEF2F2] dark:bg-[#3E1A1A] border border-[#FECACA] dark:border-[#7F2A2A] rounded-lg"
            role="alert"
          >
            <AlertCircle size={16} className="text-[#EF4444] shrink-0" />
            <span className="text-[13px] text-[#EF4444] dark:text-[#FCA5A5]">
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nearby Stops Panel ── */}
      <AnimatePresence>
        {showNearby && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] flex items-center gap-1">
                  <LocateFixed size={13} className="text-[#FF6B35]" /> Nearby Stops
                </p>
                <button onClick={() => { setShowNearby(false); resetNearby(); }} className="text-[11px] text-[#9CA3AF] hover:text-[#6B7280]">
                  Close
                </button>
              </div>
              {nearbyState === 'loading' && (
                <p className="text-[12px] text-[#9CA3AF] flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Getting your location…</p>
              )}
              {nearbyState === 'error' && (
                <p className="text-[12px] text-[#EF4444] flex items-center gap-1"><AlertCircle size={12} /> {nearbyError}</p>
              )}
              {nearbyState === 'found' && (
                <div className="flex flex-wrap gap-2">
                  {nearby.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => handlePickNearby(s.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF4EF] dark:bg-[#2E1A10] border border-[#FF6B35]/30 rounded-lg text-[12px] text-[#FF6B35] font-medium hover:bg-[#FF6B35] hover:text-white transition-colors"
                    >
                      <MapPin size={11} />
                      {s.name}
                      <span className="text-[10px] opacity-70">{s.distanceM}m</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Favourites Quick-Access ── */}
      <AnimatePresence>
        {activeTab === 'journey' && hasNoSearch && favourites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-3">
              <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] flex items-center gap-1 mb-2">
                <Star size={13} className="text-[#F59E0B]" fill="currentColor" /> Saved Routes
              </p>
              <div className="space-y-1.5">
                {favourites.slice(0, 5).map((fav) => (
                  <div key={`${fav.from}-${fav.to}`} className="flex items-center gap-2">
                    <button
                      onClick={() => handleUseFavourite(fav.from, fav.to)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] dark:bg-[#242434] rounded-lg text-left hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E] transition-colors"
                    >
                      <Clock size={12} className="text-[#9CA3AF] shrink-0" />
                      <span className="text-[12px] text-[#1C1C28] dark:text-[#F1F1F4] truncate">
                        {fav.from} → {fav.to}
                      </span>
                    </button>
                    <button
                      onClick={() => removeFavourite(fav.from, fav.to)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                      title="Remove favourite"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
