import { findAllRoutes, getBusByNumber } from './src/lib/routingEngine';

console.log('Testing routing...');

// 3. Test Sector V to Howrah Maidan
console.log('\n--- Sector V to Howrah Maidan ---');
const test3 = findAllRoutes('Sector V', 'Howrah Maidan');
test3.filter(r => r.type === 'direct').forEach(r => console.log('Direct:', r.busNumber));
test3.filter(r => r.type === 'multiHop').forEach(r => console.log('Multi:', r.hops.map(h => h.busNumber).join(' -> ')));
