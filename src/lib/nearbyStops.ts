import type { StopLocation } from '@/types';
export function findNearbyStops(latitude: number, longitude: number, stops: Record<string, StopLocation>, validNames: Set<string>) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
  const radians = (degrees: number) => degrees * Math.PI / 180;
  return Object.entries(stops).flatMap(([name, location]) => {
    if (!validNames.has(name) || location.lat === null || location.lng === null || !Number.isFinite(location.lat) || !Number.isFinite(location.lng)) return [];
    const a = Math.sin(radians(location.lat - latitude) / 2) ** 2 + Math.cos(radians(latitude)) * Math.cos(radians(location.lat)) * Math.sin(radians(location.lng - longitude) / 2) ** 2;
    const distanceM = Math.round(6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))));
    return distanceM <= 2000 ? [{ name, distanceM }] : [];
  }).sort((a, b) => a.distanceM - b.distanceM).slice(0, 6);
}
