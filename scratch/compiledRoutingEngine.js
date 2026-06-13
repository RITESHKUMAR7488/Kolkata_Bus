"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStops = getAllStops;
exports.getAllBusNumbers = getAllBusNumbers;
exports.searchStops = searchStops;
exports.searchBuses = searchBuses;
exports.getStopLocation = getStopLocation;
exports.findDirectRoutes = findDirectRoutes;
exports.findOneChangeRoutes = findOneChangeRoutes;
exports.findTwoChangeRoutes = findTwoChangeRoutes;
exports.findAllRoutes = findAllRoutes;
exports.getBusByNumber = getBusByNumber;
exports.getBusFullRoute = getBusFullRoute;
exports.isValidStop = isValidStop;
var busdata_json_1 = require('../src/data/busdata.json');
var data = busdata_json_1.default;
/**
 * Get all unique stop names from the bus data
 */
function getAllStops() {
    var stops = new Set();
    data.routes.forEach(function (route) {
        route.stops.forEach(function (stop) { return stops.add(stop); });
    });
    return Array.from(stops).sort();
}
/**
 * Get all bus numbers
 */
function getAllBusNumbers() {
    return data.routes.map(function (r) { return r.busNumber; }).sort();
}
/**
 * Search stops by query string (case-insensitive prefix match)
 */
function searchStops(query) {
    if (!query || query.trim().length === 0)
        return [];
    var q = query.toLowerCase().trim();
    var allStops = getAllStops();
    return allStops.filter(function (stop) { return stop.toLowerCase().includes(q); }).slice(0, 8);
}
/**
 * Search bus numbers by query
 */
function searchBuses(query) {
    if (!query || query.trim().length === 0)
        return [];
    var q = query.toLowerCase().trim();
    return getAllBusNumbers()
        .filter(function (num) { return num.toLowerCase().includes(q); })
        .slice(0, 8);
}
/**
 * Find the location for a stop name
 */
function getStopLocation(stopName) {
    var loc = data.stops[stopName];
    if (loc)
        return loc;
    // Fallback: search in routes
    for (var _i = 0, _a = data.routes; _i < _a.length; _i++) {
        var route = _a[_i];
        if (route.stops.includes(stopName)) {
            // Return a nearby stop's location as approximation
            for (var i = 0; i < route.stops.length; i++) {
                var altLoc = data.stops[route.stops[i]];
                if (altLoc)
                    return altLoc;
            }
        }
    }
    return null;
}
/**
 * Build full route stop objects with lat/lng for a bus route segment
 */
function buildRouteSegment(busRoute, fromStop, toStop) {
    var _a, _b;
    var fromIdx = busRoute.stops.indexOf(fromStop);
    var toIdx = busRoute.stops.indexOf(toStop);
    if (fromIdx === -1 || toIdx === -1)
        return [];
    var segment = [];
    var step = fromIdx <= toIdx ? 1 : -1;
    for (var i = fromIdx; step > 0 ? i <= toIdx : i >= toIdx; i += step) {
        var stopName = busRoute.stops[i];
        var loc = getStopLocation(stopName);
        segment.push({
            name: stopName,
            lat: (_a = loc === null || loc === void 0 ? void 0 : loc.lat) !== null && _a !== void 0 ? _a : null,
            lng: (_b = loc === null || loc === void 0 ? void 0 : loc.lng) !== null && _b !== void 0 ? _b : null,
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
function findDirectRoutes(fromStop, toStop) {
    var results = [];
    for (var _i = 0, _a = data.routes; _i < _a.length; _i++) {
        var route = _a[_i];
        var fromIdx = route.stops.indexOf(fromStop);
        var toIdx = route.stops.indexOf(toStop);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
            var totalStops = Math.abs(toIdx - fromIdx);
            var step = fromIdx < toIdx ? 1 : -1;
            var intermediateStops = [];
            for (var i = fromIdx + step; i !== toIdx; i += step) {
                intermediateStops.push(route.stops[i]);
            }
            var fullRoute = buildRouteSegment(route, fromStop, toStop);
            results.push({
                type: 'direct',
                busNumber: route.busNumber,
                busType: route.type,
                origin: fromStop,
                destination: toStop,
                totalStops: totalStops,
                intermediateStops: intermediateStops,
                fullRoute: fullRoute,
            });
        }
    }
    // Sort by fewer stops first, giving priority to metro
    return results.sort(function (a, b) {
        var scoreA = a.totalStops * (a.busType === 'metro' ? 0.2 : 1);
        var scoreB = b.totalStops * (b.busType === 'metro' ? 0.2 : 1);
        return scoreA - scoreB;
    });
}
/**
 * ALGORITHM 2: One-Change Journey
 * Find a common junction stop where user transfers from Bus A to Bus B.
 */
function findOneChangeRoutes(fromStop, toStop) {
    var results = [];
    var visited = new Set();
    // Find all buses that pass through fromStop
    var busesFromOrigin = data.routes.filter(function (r) { return r.stops.includes(fromStop); });
    // Find all buses that pass through toStop
    var busesToDest = data.routes.filter(function (r) { return r.stops.includes(toStop); });
    var _loop_1 = function (busA) {
        var fromIdxA = busA.stops.indexOf(fromStop);
        var _loop_2 = function (busB) {
            // Skip same bus (already handled by direct)
            if (busA.busNumber === busB.busNumber)
                return "continue";
            var toIdxB = busB.stops.indexOf(toStop);
            // Find common junction stops (stops on both bus A and bus B)
            // Bus A must reach the junction AFTER fromStop
            // Bus B must reach toStop AFTER the junction
            var junctionCandidates = busA.stops.filter(function (stop, idxA) {
                if (idxA === fromIdxA)
                    return false;
                var idxB = busB.stops.indexOf(stop);
                return idxB !== -1 && idxB !== toIdxB;
            });
            for (var _b = 0, junctionCandidates_1 = junctionCandidates; _b < junctionCandidates_1.length; _b++) {
                var junction = junctionCandidates_1[_b];
                var key = "".concat(busA.busNumber, "|").concat(junction, "|").concat(busB.busNumber);
                if (visited.has(key))
                    continue;
                visited.add(key);
                var junctionIdxA = busA.stops.indexOf(junction);
                var junctionIdxB = busB.stops.indexOf(junction);
                var stopsA = Math.abs(junctionIdxA - fromIdxA);
                var stopsB = Math.abs(toIdxB - junctionIdxB);
                var routeA = buildRouteSegment(busA, fromStop, junction);
                var routeB = buildRouteSegment(busB, junction, toStop);
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
        };
        for (var _a = 0, busesToDest_1 = busesToDest; _a < busesToDest_1.length; _a++) {
            var busB = busesToDest_1[_a];
            _loop_2(busB);
        }
    };
    for (var _i = 0, busesFromOrigin_1 = busesFromOrigin; _i < busesFromOrigin_1.length; _i++) {
        var busA = busesFromOrigin_1[_i];
        _loop_1(busA);
    }
    // Sort by total stops, prioritizing metros
    return results.sort(function (a, b) {
        var scoreA = a.hops.reduce(function (sum, hop) { return sum + hop.stops * (hop.busType === 'metro' ? 0.2 : 1); }, 0);
        var scoreB = b.hops.reduce(function (sum, hop) { return sum + hop.stops * (hop.busType === 'metro' ? 0.2 : 1); }, 0);
        return scoreA - scoreB;
    }).slice(0, 6);
}
/**
 * ALGORITHM 3: Two-Change Journey
 * Fallback for complex routes requiring two transfers.
 */
function findTwoChangeRoutes(fromStop, toStop) {
    var results = [];
    var visited = new Set();
    var busesFromOrigin = data.routes.filter(function (r) { return r.stops.includes(fromStop); });
    var busesToDest = data.routes.filter(function (r) { return r.stops.includes(toStop); });
    var _loop_3 = function (busA) {
        var fromIdxA = busA.stops.indexOf(fromStop);
        var _loop_4 = function (i) {
            if (i === fromIdxA)
                return "continue";
            var junction1 = busA.stops[i];
            // Find all buses that pass through junction1
            var busesViaJunction1 = data.routes.filter(function (r) { return r.busNumber !== busA.busNumber && r.stops.includes(junction1); });
            for (var _a = 0, busesViaJunction1_1 = busesViaJunction1; _a < busesViaJunction1_1.length; _a++) {
                var busB = busesViaJunction1_1[_a];
                var j1IdxB = busB.stops.indexOf(junction1);
                // Find all stops Bus B can reach after junction1
                for (var j = 0; j < busB.stops.length; j++) {
                    if (j === j1IdxB)
                        continue;
                    var junction2 = busB.stops[j];
                    // Check if any bus goes from junction2 to toStop
                    for (var _b = 0, busesToDest_2 = busesToDest; _b < busesToDest_2.length; _b++) {
                        var busC = busesToDest_2[_b];
                        if (busC.busNumber === busB.busNumber)
                            continue;
                        var j2IdxC = busC.stops.indexOf(junction2);
                        var toIdxC = busC.stops.indexOf(toStop);
                        if (j2IdxC !== -1 && toIdxC !== -1 && j2IdxC !== toIdxC) {
                            var key = "".concat(busA.busNumber, "|").concat(junction1, "|").concat(busB.busNumber, "|").concat(junction2, "|").concat(busC.busNumber);
                            if (visited.has(key))
                                continue;
                            visited.add(key);
                            var stopsA = Math.abs(i - fromIdxA);
                            var stopsB = Math.abs(j - j1IdxB);
                            var stopsC = Math.abs(toIdxC - j2IdxC);
                            var routeA = buildRouteSegment(busA, fromStop, junction1);
                            var routeB = buildRouteSegment(busB, junction1, junction2);
                            var routeC = buildRouteSegment(busC, junction2, toStop);
                            if (routeA.length > 0)
                                routeA[routeA.length - 1].isJunction = true;
                            if (routeB.length > 0) {
                                routeB[0].isJunction = true;
                                routeB[routeB.length - 1].isJunction = true;
                            }
                            if (routeC.length > 0)
                                routeC[0].isJunction = true;
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
                                junctionStop: "".concat(junction1, " \u2192 ").concat(junction2),
                                totalStops: stopsA + stopsB + stopsC,
                            });
                        }
                    }
                }
            }
        };
        // Find all intermediate stops Bus A can reach
        for (var i = 0; i < busA.stops.length; i++) {
            _loop_4(i);
        }
    };
    for (var _i = 0, busesFromOrigin_2 = busesFromOrigin; _i < busesFromOrigin_2.length; _i++) {
        var busA = busesFromOrigin_2[_i];
        _loop_3(busA);
    }
    return results.sort(function (a, b) {
        var scoreA = a.hops.reduce(function (sum, hop) { return sum + hop.stops * (hop.busType === 'metro' ? 0.2 : 1); }, 0);
        var scoreB = b.hops.reduce(function (sum, hop) { return sum + hop.stops * (hop.busType === 'metro' ? 0.2 : 1); }, 0);
        return scoreA - scoreB;
    }).slice(0, 4);
}
/**
 * Main routing function: finds all possible routes
 */
function findAllRoutes(fromStop, toStop) {
    if (!fromStop || !toStop || fromStop === toStop)
        return [];
    // 1. Try direct routes first
    var direct = findDirectRoutes(fromStop, toStop);
    // 2. Try one-change routes
    var oneChange = findOneChangeRoutes(fromStop, toStop);
    // 3. If still no routes, try two-change
    var twoChange = direct.length === 0 && oneChange.length === 0
        ? findTwoChangeRoutes(fromStop, toStop)
        : [];
    return __spreadArray(__spreadArray(__spreadArray([], direct, true), oneChange, true), twoChange, true);
}
/**
 * Get bus details by bus number
 */
function getBusByNumber(busNumber) {
    var bus = data.routes.find(function (r) { return r.busNumber.toLowerCase() === busNumber.toLowerCase(); });
    return bus !== null && bus !== void 0 ? bus : null;
}
/**
 * Build full route with locations for a bus
 */
function getBusFullRoute(busNumber) {
    var bus = getBusByNumber(busNumber);
    if (!bus)
        return null;
    return bus.stops.map(function (name, i) {
        var _a, _b;
        var loc = getStopLocation(name);
        return {
            name: name,
            lat: (_a = loc === null || loc === void 0 ? void 0 : loc.lat) !== null && _a !== void 0 ? _a : null,
            lng: (_b = loc === null || loc === void 0 ? void 0 : loc.lng) !== null && _b !== void 0 ? _b : null,
            isJunction: false,
            sequence: i + 1,
        };
    });
}
/**
 * Validate if a stop name exists in our data
 */
function isValidStop(stopName) {
    return getAllStops().includes(stopName);
}
