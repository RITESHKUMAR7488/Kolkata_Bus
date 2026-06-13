import { findAllRoutes, getBusByNumber } from './src/lib/routingEngine';

console.log('Testing routing...');

// 1. Test finding a metro directly
const metro = getBusByNumber('Metro Blue Line');
console.log('Found Metro Blue Line:', metro ? metro.stops.slice(0, 5) : 'NO');

// 2. Test direct routing using metro
const direct = findAllRoutes('Dakshineswar', 'Garia Metro');
console.log('\n--- Direct Routes ---');
direct.filter(r => r.type === 'direct').forEach(r => console.log(r.busNumber, r.busType));

// 3. Test multi-hop routing using metro
const multi = findAllRoutes('Dumdum', 'Behala Chowrasta');
console.log('\n--- Multi-Hop Routes ---');
multi.filter(r => r.type === 'multiHop').forEach(r => {
  console.log('Hops:', r.hops.map(h => h.busNumber).join(' -> '));
});
