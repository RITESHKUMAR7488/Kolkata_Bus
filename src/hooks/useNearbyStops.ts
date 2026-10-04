import { useState, useCallback, useRef } from 'react';
import { findNearbyStops } from '@/lib/nearbyStops';
import { getAllStops } from '@/lib/routingEngine';
import busData from '@/data/busdata.json';

export type NearbyState = 'idle' | 'loading' | 'found' | 'error';

export interface NearbyStop {
  name: string;
  distanceM: number;
}

export function useNearbyStops() {
  const request = useRef(0);
  const [state, setState] = useState<NearbyState>('idle');
  const [nearby, setNearby] = useState<NearbyStop[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const findNearby = useCallback(() => {
    const current = ++request.current;
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported by your browser.');
      setState('error');
      return;
    }

    setState('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (current !== request.current) return;
        const { latitude, longitude } = pos.coords;
        const stops = (busData as { stops: Record<string, { lat: number | null; lng: number | null }> }).stops;

        const top = findNearbyStops(latitude, longitude, stops, new Set(getAllStops()));

        if (top.length === 0) {
          setErrorMsg('No stops found within 2 km. Try typing manually.');
          setState('error');
        } else {
          setNearby(top);
          setState('found');
        }
      },
      (err) => {
        if (current !== request.current) return;
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location access denied. Type a stop instead, or change your browser permission.');
        } else {
          setErrorMsg('Could not get your location. Please try again.');
        }
        setState('error');
      },
      { timeout: 8000, maximumAge: 30_000 }
    );
  }, []);

  const reset = useCallback(() => {
    request.current++;
    setState('idle');
    setNearby([]);
    setErrorMsg('');
  }, []);

  return { state, nearby, errorMsg, findNearby, reset };
}
