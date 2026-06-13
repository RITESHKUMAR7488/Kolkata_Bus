import { create } from 'zustand';
import type { AppState, RouteResult } from '@/types';
import {
  findAllRoutes,
  searchStops,
  searchBuses,
  getBusByNumber,
  isValidStop,
} from '@/lib/routingEngine';

interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: 'journey' | 'bus' | 'metro' | 'train') => void;
  setMetroView: (view: 'schematic' | 'map') => void;
  setTrainView: (view: 'schematic' | 'map') => void;
  setFromStop: (stop: string) => void;
  setToStop: (stop: string) => void;
  setBusNumber: (num: string) => void;
  updateFromSuggestions: (query: string) => void;
  updateToSuggestions: (query: string) => void;
  updateBusSuggestions: (query: string) => void;
  setShowFromDropdown: (show: boolean) => void;
  setShowToDropdown: (show: boolean) => void;
  setShowBusDropdown: (show: boolean) => void;
  selectFromSuggestion: (stop: string) => void;
  selectToSuggestion: (stop: string) => void;
  selectBusSuggestion: (num: string) => void;
  swapStops: () => void;
  searchRoutes: () => void;
  searchBus: () => void;
  selectRoute: (route: RouteResult | null) => void;
  setSelectedTrainLine: (lineId: string | null) => void;
  setShowMap: (show: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

type AppStore = AppState & AppActions;

const baseState: AppState = {
  theme: 'light',
  activeTab: 'journey',
  metroView: 'schematic',
  trainView: 'schematic',
  search: {
    fromStop: '',
    toStop: '',
    busNumber: '',
    fromSuggestions: [],
    toSuggestions: [],
    busSuggestions: [],
    showFromDropdown: false,
    showToDropdown: false,
    showBusDropdown: false,
  },
  results: null,
  selectedBus: null,
  selectedRoute: null,
  selectedTrainLine: null,
  loading: false,
  error: null,
  showMap: false,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...baseState,

  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'light' ? 'dark' : 'light';
    set({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
      results: null,
      selectedBus: null,
      selectedRoute: null,
      error: null,
      showMap: false,
    }),

  setMetroView: (view) => set({ metroView: view }),

  setTrainView: (view) => set({ trainView: view }),

  setFromStop: (stop) =>
    set((state) => ({
      search: { ...state.search, fromStop: stop },
    })),

  setToStop: (stop) =>
    set((state) => ({
      search: { ...state.search, toStop: stop },
    })),

  setBusNumber: (num) =>
    set((state) => ({
      search: { ...state.search, busNumber: num },
    })),

  updateFromSuggestions: (query) =>
    set((state) => ({
      search: {
        ...state.search,
        fromSuggestions: searchStops(query),
        showFromDropdown: query.trim().length > 0,
      },
    })),

  updateToSuggestions: (query) =>
    set((state) => ({
      search: {
        ...state.search,
        toSuggestions: searchStops(query),
        showToDropdown: query.trim().length > 0,
      },
    })),

  updateBusSuggestions: (query) =>
    set((state) => ({
      search: {
        ...state.search,
        busSuggestions: searchBuses(query),
        showBusDropdown: query.trim().length > 0,
      },
    })),

  setShowFromDropdown: (show) =>
    set((state) => ({
      search: { ...state.search, showFromDropdown: show },
    })),

  setShowToDropdown: (show) =>
    set((state) => ({
      search: { ...state.search, showToDropdown: show },
    })),

  setShowBusDropdown: (show) =>
    set((state) => ({
      search: { ...state.search, showBusDropdown: show },
    })),

  selectFromSuggestion: (stop) =>
    set((state) => ({
      search: {
        ...state.search,
        fromStop: stop,
        fromSuggestions: [],
        showFromDropdown: false,
      },
    })),

  selectToSuggestion: (stop) =>
    set((state) => ({
      search: {
        ...state.search,
        toStop: stop,
        toSuggestions: [],
        showToDropdown: false,
      },
    })),

  selectBusSuggestion: (num) =>
    set((state) => ({
      search: {
        ...state.search,
        busNumber: num,
        busSuggestions: [],
        showBusDropdown: false,
      },
    })),

  swapStops: () =>
    set((state) => ({
      search: {
        ...state.search,
        fromStop: state.search.toStop,
        toStop: state.search.fromStop,
      },
    })),

  searchRoutes: () => {
    const { search } = get();
    const from = search.fromStop.trim();
    const to = search.toStop.trim();

    if (!from || !to) {
      set({ error: 'Please enter both starting point and destination' });
      return;
    }
    if (!isValidStop(from)) {
      set({ error: `"${from}" is not a valid stop name` });
      return;
    }
    if (!isValidStop(to)) {
      set({ error: `"${to}" is not a valid stop name` });
      return;
    }
    if (from === to) {
      set({ error: 'Starting point and destination cannot be the same' });
      return;
    }

    set({ loading: true, error: null, results: null, selectedRoute: null });

    setTimeout(() => {
      const results = findAllRoutes(from, to);
      set({ loading: false, results });
    }, 400);
  },

  searchBus: () => {
    const { search } = get();
    const num = search.busNumber.trim();

    if (!num) {
      set({ error: 'Please enter a bus number' });
      return;
    }

    set({ loading: true, error: null, selectedBus: null, results: null });

    setTimeout(() => {
      const bus = getBusByNumber(num);
      if (bus) {
        set({ loading: false, selectedBus: bus });
      } else {
        set({
          loading: false,
          error: `Bus "${num}" not found. Try S-101, AC-47, S-24, etc.`,
        });
      }
    }, 300);
  },

  selectRoute: (route) => set({ selectedRoute: route }),

  setSelectedTrainLine: (lineId) => set({ selectedTrainLine: lineId }),

  setShowMap: (show) => set({ showMap: show }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...baseState,
      theme: get().theme,
    }),
}));
