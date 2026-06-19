import { useState, useCallback, useEffect } from 'react';
import type { FavouriteRoute } from '@/types';

const KEY = 'ktr_favourites';

function load(): FavouriteRoute[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(items: FavouriteRoute[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteRoute[]>(load);

  // Keep state in sync if another tab changes localStorage
  useEffect(() => {
    const handler = () => setFavourites(load());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
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
