import { useEffect, useState } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
const cache = new Map<string, LatLngTuple[]>();
export default function RoadPolyline({ positions, color, road }: { positions: LatLngTuple[]; color: string; road: boolean }) {
  const key = positions.map(p => `${p[1]},${p[0]}`).join(';');
  const [resolved, setResolved] = useState<{ key: string; points: LatLngTuple[] } | null>(null);
  useEffect(() => {
    if (!road || positions.length < 2 || positions.length > 80) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const existing = cache.get(key);
    if (existing) { queueMicrotask(() => setResolved({ key, points: existing })); clearTimeout(timeout); return; }
    const base = import.meta.env.VITE_ROAD_ROUTER_URL || 'https://routing.openstreetmap.de/routed-car/route/v1/driving';
    fetch(`${base}/${key}?overview=full&geometries=geojson&steps=false`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('Routing unavailable'); return r.json(); })
      .then(data => {
        if (controller.signal.aborted || data.code !== 'Ok') return;
        const coordinates: unknown = data.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(coordinates) || coordinates.length < 2 || !coordinates.every(c => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]))) return;
        const points: LatLngTuple[] = coordinates.map(c => [c[1], c[0]]);
        if (cache.size >= 50) cache.delete(cache.keys().next().value!);
        cache.set(key, points); setResolved({ key, points });
      }).catch(() => { /* Dashed stop connections remain available offline. */ }).finally(() => clearTimeout(timeout));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [key, road, positions.length]);
  const actual = road && resolved?.key === key;
  return <Polyline positions={actual ? resolved.points : positions} pathOptions={{ color, weight: 4, opacity: .9, dashArray: actual ? undefined : '7 6' }}><Tooltip sticky>{actual ? 'Calculated road path via stops; actual bus path may differ' : 'Stop connections; exact path not available'}</Tooltip></Polyline>;
}
