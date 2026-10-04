import busData from '@/data/busdata.json';
import type {
  BusData,
  BusRoute,
  DirectRoute,
  MultiHopRoute,
  RouteResult,
  RouteStop,
} from '@/types';

const rawData = busData as BusData;
const seenRoutes = new Set<string>();
const data: BusData = { ...rawData, routes: rawData.routes.filter(route => {
  const key = `${route.busNumber}|${route.stops.join('|')}`;
  if (seenRoutes.has(key)) return false;
  seenRoutes.add(key);
  return true;
}) };
const allStops = Array.from(new Set(data.routes.flatMap(route => route.stops))).sort();
const stopNames = new Map(allStops.map(name => [name.toLowerCase(), name]));
const routesByStop = new Map<string, BusRoute[]>();
for (const route of data.routes) for (const stop of new Set(route.stops)) {
  const routes = routesByStop.get(stop) ?? [];
  routes.push(route);
  routesByStop.set(stop, routes);
}
export function normalizeStop(name: string) { return stopNames.get(name.trim().toLowerCase()) ?? name.trim(); }

/**
 * Get all unique stop names from the bus data
 */
export function getAllStops(): string[] {
  return allStops;
}

/**
 * Get all bus numbers
 */
export function getAllBusNumbers(): string[] {
  return Array.from(new Set(data.routes.map((r) => r.busNumber))).sort();
}

/**
 * Search stops by query string (case-insensitive prefix match)
 */
export function searchStops(query: string): string[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const allStops = getAllStops();
  return allStops.filter((stop) => stop.toLowerCase().includes(q)).slice(0, 8);
}

/**
 * Search bus numbers by query
 */
export function searchBuses(query: string): string[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return getAllBusNumbers()
    .filter((num) => num.toLowerCase().includes(q))
    .slice(0, 8);
}

/**
 * Find the location for a stop name
 */
export function getStopLocation(stopName: string): { lat: number | null; lng: number | null } | null {
  const loc = data.stops[stopName];
  if (loc) return loc;
  return null;
}

/**
 * Build full route stop objects with lat/lng for a bus route segment
 */
function buildRouteSegment(
  busRoute: BusRoute,
  fromStop: string,
  toStop: string
): RouteStop[] {
  const fromIdx = busRoute.stops.indexOf(fromStop);
  const toIdx = busRoute.stops.indexOf(toStop);
  if (fromIdx === -1 || toIdx === -1) return [];

  const segment: RouteStop[] = [];
  const step = fromIdx <= toIdx ? 1 : -1;

  for (let i = fromIdx; step > 0 ? i <= toIdx : i >= toIdx; i += step) {
    const stopName = busRoute.stops[i];
    const loc = getStopLocation(stopName);
    segment.push({
      name: stopName,
      lat: loc?.lat ?? null,
      lng: loc?.lng ?? null,
      isJunction: false,
      sequence: segment.length + 1,
    });
  }
  return segment;
}

/**
 * ALGORITHM 1: Direct Route
 * Find buses that contain both start and end stops in their route.
 */
export function findDirectRoutes(fromStop: string, toStop: string): DirectRoute[] {
  const results: DirectRoute[] = [];
  const segments = new Set<string>();

  for (const route of data.routes) {
    const fromIdx = route.stops.indexOf(fromStop);
    const toIdx = route.stops.indexOf(toStop);

    if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
      const totalStops = Math.abs(toIdx - fromIdx);
      const step = fromIdx < toIdx ? 1 : -1;
      const intermediateStops = [];
      for (let i = fromIdx + step; i !== toIdx; i += step) {
        intermediateStops.push(route.stops[i]);
      }
      const fullRoute = buildRouteSegment(route, fromStop, toStop);
      const segmentKey = `${route.busNumber}|${fullRoute.map(stop => stop.name).join('|')}`;
      if (segments.has(segmentKey)) continue;
      segments.add(segmentKey);

      results.push({
        type: 'direct',
        busNumber: route.busNumber,
        busType: route.type,
        origin: fromStop,
        destination: toStop,
        totalStops,
        intermediateStops,
        fullRoute,
      });
    }
  }

  // Sort by fewer stops first, giving priority to metro and train
  return results.sort((a, b) => {
    const scoreA = a.totalStops * (a.busType === 'metro' || a.busType === 'train' ? 0.2 : 1);
    const scoreB = b.totalStops * (b.busType === 'metro' || b.busType === 'train' ? 0.2 : 1);
    return scoreA - scoreB;
  });
}

/**
 * ALGORITHM 2: One-Change Journey
 * Find a common junction stop where user transfers from Bus A to Bus B.
 */
export function findOneChangeRoutes(
  fromStop: string,
  toStop: string
): MultiHopRoute[] {
  const results: MultiHopRoute[] = [];
  const visited = new Set<string>();

  // Find all buses that pass through fromStop
  const busesFromOrigin = routesByStop.get(fromStop) ?? [];

  // Find all buses that pass through toStop
  const busesToDest = routesByStop.get(toStop) ?? [];

  for (const busA of busesFromOrigin) {
    const fromIdxA = busA.stops.indexOf(fromStop);

    for (const busB of busesToDest) {
      // Skip same bus (already handled by direct)
      if (busA.busNumber === busB.busNumber) continue;

      const toIdxB = busB.stops.indexOf(toStop);

      // Find common junction stops (stops on both bus A and bus B)
      // Bus A must reach the junction AFTER fromStop
      // Bus B must reach toStop AFTER the junction
      const junctionCandidates = busA.stops.filter((stop, idxA) => {
        if (idxA === fromIdxA) return false;
        const idxB = busB.stops.indexOf(stop);
        return idxB !== -1 && idxB !== toIdxB;
      });

      for (const junction of junctionCandidates) {
        const key = `${busA.busNumber}|${junction}|${busB.busNumber}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const junctionIdxA = busA.stops.indexOf(junction);
        const junctionIdxB = busB.stops.indexOf(junction);
        const stopsA = Math.abs(junctionIdxA - fromIdxA);
        const stopsB = Math.abs(toIdxB - junctionIdxB);

        const routeA = buildRouteSegment(busA, fromStop, junction);
        const routeB = buildRouteSegment(busB, junction, toStop);

        // Mark junction in routes
        if (routeA.length > 0) {
          routeA[routeA.length - 1].isJunction = true;
        }
        if (routeB.length > 0) {
          routeB[0].isJunction = true;
        }

        results.push({
          type: 'multiHop',
          hops: [
            {
              busNumber: busA.busNumber,
              busType: busA.type,
              from: fromStop,
              to: junction,
              stops: stopsA,
              route: routeA,
            },
            {
              busNumber: busB.busNumber,
              busType: busB.type,
              from: junction,
              to: toStop,
              stops: stopsB,
              route: routeB,
            },
          ],
          junctionStop: junction,
          totalStops: stopsA + stopsB,
        });
      }
    }
  }

  // Sort by total stops, prioritizing metros and trains
  return results.sort((a, b) => {
    const scoreA = a.hops.reduce((sum, hop) => sum + hop.stops * (hop.busType === 'metro' || hop.busType === 'train' ? 0.2 : 1), 0);
    const scoreB = b.hops.reduce((sum, hop) => sum + hop.stops * (hop.busType === 'metro' || hop.busType === 'train' ? 0.2 : 1), 0);
    return scoreA - scoreB;
  }).slice(0, 6);
}

/**
 * ALGORITHM 3: Two-Change Journey
 * Fallback for complex routes requiring two transfers.
 */
export function findTwoChangeRoutes(
  fromStop: string,
  toStop: string
): MultiHopRoute[] {
  const results: MultiHopRoute[] = [];
  const visited = new Set<string>();

  const busesFromOrigin = routesByStop.get(fromStop) ?? [];
  const busesToDest = routesByStop.get(toStop) ?? [];

  for (const busA of busesFromOrigin) {
    const fromIdxA = busA.stops.indexOf(fromStop);

    // Find all intermediate stops Bus A can reach
    for (let i = 0; i < busA.stops.length; i++) {
      if (i === fromIdxA) continue;
      const junction1 = busA.stops[i];

      // Find all buses that pass through junction1
      const busesViaJunction1 = (routesByStop.get(junction1) ?? []).filter(
        (r) => r.busNumber !== busA.busNumber && r.stops.includes(junction1)
      );

      for (const busB of busesViaJunction1) {
        const j1IdxB = busB.stops.indexOf(junction1);

        // Find all stops Bus B can reach after junction1
        for (let j = 0; j < busB.stops.length; j++) {
          if (j === j1IdxB) continue;
          const junction2 = busB.stops[j];

          // Check if any bus goes from junction2 to toStop
          for (const busC of busesToDest) {
            if (busC.busNumber === busB.busNumber) continue;
            const j2IdxC = busC.stops.indexOf(junction2);
            const toIdxC = busC.stops.indexOf(toStop);

            if (j2IdxC !== -1 && toIdxC !== -1 && j2IdxC !== toIdxC) {
              const key = `${busA.busNumber}|${junction1}|${busB.busNumber}|${junction2}|${busC.busNumber}`;
              if (visited.has(key)) continue;
              visited.add(key);

              const stopsA = Math.abs(i - fromIdxA);
              const stopsB = Math.abs(j - j1IdxB);
              const stopsC = Math.abs(toIdxC - j2IdxC);

              const routeA = buildRouteSegment(busA, fromStop, junction1);
              const routeB = buildRouteSegment(busB, junction1, junction2);
              const routeC = buildRouteSegment(busC, junction2, toStop);

              if (routeA.length > 0) routeA[routeA.length - 1].isJunction = true;
              if (routeB.length > 0) {
                routeB[0].isJunction = true;
                routeB[routeB.length - 1].isJunction = true;
              }
              if (routeC.length > 0) routeC[0].isJunction = true;

              results.push({
                type: 'multiHop',
                hops: [
                  {
                    busNumber: busA.busNumber,
                    busType: busA.type,
                    from: fromStop,
                    to: junction1,
                    stops: stopsA,
                    route: routeA,
                  },
                  {
                    busNumber: busB.busNumber,
                    busType: busB.type,
                    from: junction1,
                    to: junction2,
                    stops: stopsB,
                    route: routeB,
                  },
                  {
                    busNumber: busC.busNumber,
                    busType: busC.type,
                    from: junction2,
                    to: toStop,
                    stops: stopsC,
                    route: routeC,
                  },
                ],
                junctionStop: `${junction1} → ${junction2}`,
                totalStops: stopsA + stopsB + stopsC,
              });
            }
          }
        }
      }
    }
  }

  return results.sort((a, b) => {
    const scoreA = a.hops.reduce((sum, hop) => sum + hop.stops * (hop.busType === 'metro' || hop.busType === 'train' ? 0.2 : 1), 0);
    const scoreB = b.hops.reduce((sum, hop) => sum + hop.stops * (hop.busType === 'metro' || hop.busType === 'train' ? 0.2 : 1), 0);
    return scoreA - scoreB;
  }).slice(0, 4);
}

/**
 * Main routing function: finds all possible routes
 */
export function findAllRoutes(
  fromStop: string,
  toStop: string
): RouteResult[] {
  fromStop = normalizeStop(fromStop);
  toStop = normalizeStop(toStop);
  if (!fromStop || !toStop || fromStop === toStop) return [];
  if (!isValidStop(fromStop) || !isValidStop(toStop)) return [];

  // 1. Try direct routes first
  const direct = findDirectRoutes(fromStop, toStop);

  // 2. Try one-change routes
  const oneChange = findOneChangeRoutes(fromStop, toStop);

  // 3. If still no routes, try two-change
  const twoChange =
    direct.length === 0 && oneChange.length === 0
      ? findTwoChangeRoutes(fromStop, toStop)
      : [];

  return [...direct, ...oneChange, ...twoChange];
}

/**
 * Get bus details by bus number
 */
export function getBusByNumber(busNumber: string): BusRoute | null {
  const bus = data.routes.find(
    (r) => r.busNumber.toLowerCase() === busNumber.trim().toLowerCase()
  );
  return bus ?? null;
}

/**
 * Build full route with locations for a bus
 */
export function getBusFullRoute(busNumber: string): RouteStop[] | null {
  const bus = getBusByNumber(busNumber);
  if (!bus) return null;

  return bus.stops.map((name, i) => {
    const loc = getStopLocation(name);
    return {
      name,
      lat: loc?.lat ?? null,
      lng: loc?.lng ?? null,
      isJunction: false,
      sequence: i + 1,
    };
  });
}

/**
 * Validate if a stop name exists in our data
 */
export function isValidStop(stopName: string): boolean {
  return stopNames.has(stopName.trim().toLowerCase());
}
