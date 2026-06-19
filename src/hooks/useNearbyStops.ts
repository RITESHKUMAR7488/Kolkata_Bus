import { useState, useCallback } from 'react';
import busData from '@/data/busdata.json';

export type NearbyState = 'idle' | 'loading' | 'found' | 'error';

export interface NearbyStop {
  name: string;
  distanceM: number;
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useNearbyStops() {
  const [state, setState] = useState<NearbyState>('idle');
  const [nearby, setNearby] = useState<NearbyStop[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const findNearby = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported by your browser.');
      setState('error');
      return;
    }

    setState('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const stops = (busData as { stops: Record<string, { lat: number | null; lng: number | null }> }).stops;

        const withDistance: NearbyStop[] = [];
        for (const [name, loc] of Object.entries(stops)) {
          if (loc.lat != null && loc.lng != null) {
            const d = haversineM(latitude, longitude, loc.lat, loc.lng);
            if (d <= 2000) { // within 2 km
              withDistance.push({ name, distanceM: Math.round(d) });
            }
          }
        }

        withDistance.sort((a, b) => a.distanceM - b.distanceM);
        const top = withDistance.slice(0, 6);

        if (top.length === 0) {
          setErrorMsg('No stops found within 2 km. Try typing manually.');
          setState('error');
        } else {
          setNearby(top);
          setState('found');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location access denied. Please allow it in browser settings.');
        } else {
          setErrorMsg('Could not get your location. Please try again.');
        }
        setState('error');
      },
      { timeout: 8000, maximumAge: 30_000 }
    );
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setNearby([]);
    setErrorMsg('');
  }, []);

  return { state, nearby, errorMsg, findNearby, reset };
}
