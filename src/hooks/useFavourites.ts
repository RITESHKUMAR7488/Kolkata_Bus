import { useState, useCallback, useEffect } from 'react';
import type { FavouriteRoute } from '@/types';

const KEY = 'ktr_favourites';

function load(): FavouriteRoute[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is FavouriteRoute => item && typeof item.from === 'string' && typeof item.to === 'string' && typeof item.savedAt === 'number').slice(0, 10) : [];
  } catch {
    return [];
  }
}

function save(items: FavouriteRoute[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* Storage can be disabled. */ }
  // The native storage event only fires in other tabs.
  queueMicrotask(() => window.dispatchEvent(new Event('ktr-favourites-changed')));
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteRoute[]>(load);

  // Keep state in sync if another tab changes localStorage
  useEffect(() => {
    const handler = () => setFavourites(load());
    window.addEventListener('storage', handler);
    window.addEventListener('ktr-favourites-changed', handler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('ktr-favourites-changed', handler); };
  }, []);

  const isFavourite = useCallback(
    (from: string, to: string) =>
      favourites.some(
        (f) => f.from.toLowerCase() === from.toLowerCase() && f.to.toLowerCase() === to.toLowerCase()
      ),
    [favourites]
  );

  const toggleFavourite = useCallback(
    (from: string, to: string) => {
      setFavourites((prev) => {
        const exists = prev.some(
          (f) => f.from.toLowerCase() === from.toLowerCase() && f.to.toLowerCase() === to.toLowerCase()
        );
        const next = exists
          ? prev.filter(
              (f) => !(f.from.toLowerCase() === from.toLowerCase() && f.to.toLowerCase() === to.toLowerCase())
            )
          : [{ from, to, savedAt: Date.now() }, ...prev].slice(0, 10); // max 10
        save(next);
        return next;
      });
    },
    []
  );

  const removeFavourite = useCallback((from: string, to: string) => {
    setFavourites((prev) => {
      const next = prev.filter(
        (f) => !(f.from.toLowerCase() === from.toLowerCase() && f.to.toLowerCase() === to.toLowerCase())
      );
      save(next);
      return next;
    });
  }, []);

  return { favourites, isFavourite, toggleFavourite, removeFavourite };
}
