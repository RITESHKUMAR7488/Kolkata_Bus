import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; }
try {
  const engine = await server.ssrLoadModule('/src/lib/routingEngine.ts');
  const { findNearbyStops } = await server.ssrLoadModule('/src/lib/nearbyStops.ts');
  const locations = { Near: { lat: 22.57, lng: 88.36 }, Far: { lat: 23.5, lng: 88.36 }, Missing: { lat: null, lng: null }, Unused: { lat: 22.57, lng: 88.36 } };
  check(findNearbyStops(22.57, 88.36, locations, new Set(['Near', 'Far', 'Missing'])).map(stop => stop.name).join() === 'Near', 'Nearby stops respect distance, missing coordinates and searchable names');
  check(findNearbyStops(NaN, 88.36, locations, new Set(['Near'])).length === 0, 'Invalid location rejected');
  check(engine.isValidStop(' howrah station '), 'Case-insensitive stop validation');
  check(engine.normalizeStop(' esplanade ') === 'Esplanade', 'Stop normalization');
  check(engine.searchStops('HOWRAH').includes('Howrah Station'), 'Autocomplete finds the station');
  check(new Set(engine.getAllBusNumbers()).size === engine.getAllBusNumbers().length, 'Bus suggestions are unique');
  check(engine.getBusByNumber(' 12c (howrah station) ')?.busNumber === '12C (Howrah Station)', 'Bus lookup tolerates case and whitespace');
  check(engine.getStopLocation('Unknown test stop') === null, 'Unknown stops do not get invented map coordinates');
  check(engine.findAllRoutes('Unknown test stop', 'Esplanade').length === 0, 'Invalid endpoints do not trigger transfer search');
  check(engine.findAllRoutes('Esplanade', ' esplanade ').length === 0, 'Same-stop normalized search is empty');
  for (const [from, to] of [['Howrah Station', 'Esplanade'], ['Esplanade', 'Howrah Station'], ['Dumdum', 'Behala Chowrasta'], ['Dakshineswar', 'Garia Metro']]) {
    const start = performance.now();
    const routes = engine.findAllRoutes(from.toLowerCase(), ` ${to} `);
    check(routes.length > 0, `${from} to ${to} has results`);
    check(performance.now() - start < 5000, 'Routing completes in bounded time');
    const keys = routes.filter(route => route.type === 'direct').map(route => `${route.busNumber}|${route.fullRoute.map(stop => stop.name).join('|')}`);
    check(new Set(keys).size === keys.length, 'Direct results are distinct');
    for (const route of routes) {
      const segments = route.type === 'direct' ? [route.fullRoute] : route.hops.map(hop => hop.route);
      check(segments[0][0].name === from && segments.at(-1).at(-1).name === to, 'Journey begins and ends at requested stops');
      for (let i = 1; i < segments.length; i++) check(segments[i - 1].at(-1).name === segments[i][0].name, 'Transfer segments join at the same stop');
      for (const segment of segments) check(segment.every((stop, i) => stop.sequence === i + 1 && (stop.lat === null || Number.isFinite(stop.lat))), 'Stop ordering and coordinates valid');
    }
  }
  const { useAppStore } = await server.ssrLoadModule('/src/store/useAppStore.ts');
  let store = useAppStore.getState();
  store.reset(); store.searchRoutes();
  check(Boolean(useAppStore.getState().error), 'Empty journey rejected');
  store.setFromStop('Howrah Station'); store.setToStop('Esplanade'); store.searchRoutes(); store.setActiveTab('metro');
  await new Promise(resolve => setTimeout(resolve, 500));
  check(useAppStore.getState().results === null && !useAppStore.getState().loading, 'Switching tabs cancels stale journey results');
  store.setActiveTab('bus'); store.setBusNumber('12C (Howrah Station)'); store.searchBus();
  await new Promise(resolve => setTimeout(resolve, 400));
  check(useAppStore.getState().selectedBus?.busNumber === '12C (Howrah Station)', 'Bus search commits correct details');
  console.log(`PASS: ${checks} routing and search-state assertions.`);
} finally { await server.close(); }
