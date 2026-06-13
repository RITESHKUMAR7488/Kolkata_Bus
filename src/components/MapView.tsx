import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useAppStore } from '@/store/useAppStore';
import { getBusFullRoute } from '@/lib/routingEngine';
import type { RouteResult } from '@/types';
import { Navigation, ZoomIn, ZoomOut, Maximize, Train } from 'lucide-react';
import L from 'leaflet';
import { useRef } from 'react';
import { metroLines, metroStations } from '@/data/metroData';
import { trainLines, trainStations } from '@/data/trainData';
import busDataRaw from '@/data/busdata.json';
import trainGeometriesRaw from '@/data/trainGeometries.json';
import type { BusData } from '@/types';

const busData = busDataRaw as BusData;
const trainGeometries = trainGeometriesRaw as Record<string, [number, number][]>;

// Custom marker icons
const startIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:18px;height:18px;background:#22C55E;border:3px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(34,197,94,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const endIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:18px;height:18px;background:#EF4444;border:3px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(239,68,68,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const stopIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:10px;height:10px;background:#008080;border:2px solid white;border-radius:50%;"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const junctionIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:14px;height:14px;background:#FF6B35;border:3px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(255,107,53,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const metroStopIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:12px;height:12px;background:#FFFFFF;border:3px solid #111118;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const metroInterchangeIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:18px;height:18px;background:#FFFFFF;border:4px solid #FF6B35;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Auto-center map on route
function MapAutoCenter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useMemo(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, bounds]);
  return null;
}

// Trackpad Gestures Handler
function MapGestures() {
  const map = useMap();
  
  useEffect(() => {
    const container = map.getContainer();
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.deltaMode === 1) { // DOM_DELTA_LINE
        dx *= 40;
        dy *= 40;
      } else if (e.deltaMode === 2) { // DOM_DELTA_PAGE
        dx *= 800;
        dy *= 800;
      }

      if (e.ctrlKey) {
        // Pinch-to-zoom or Ctrl+Wheel
        const zoomDelta = -dy * 0.01;
        const rect = container.getBoundingClientRect();
        const point = L.point(e.clientX - rect.left, e.clientY - rect.top);
        map.setZoomAround(point, map.getZoom() + zoomDelta, { animate: false });
      } else {
        // Two-finger pan or normal Wheel pan
        map.panBy([dx, dy], { animate: false });
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [map]);
  
  return null;
}

// Map Controls component to handle map instance inside
function MapControls({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const map = useMap();

  const handleFullscreen = () => {
    if (wrapperRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapperRef.current.requestFullscreen();
      }
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 bg-white/90 dark:bg-[#242434]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#E5E7EB] dark:border-[#3E3E4E] shadow-lg">
        <button onClick={() => map.zoomIn()} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => map.setZoom(13)} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Reset Zoom">
          <span className="text-xs font-bold">1:1</span>
        </button>
        <button onClick={() => map.zoomOut()} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <div className="w-full h-px bg-[#E5E7EB] dark:bg-[#3E3E4E] my-1" />
        <button onClick={handleFullscreen} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Toggle Fullscreen">
          <Maximize size={20} />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-[400]">
        <button
          onClick={() => {
            // Recenter could go here
          }}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#1C1C28] shadow-md hover:bg-white transition-colors"
          title="My Location"
        >
          <Navigation size={18} />
        </button>
      </div>
    </>
  );
}

export default function MapView() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedRoute = useAppStore((s) => s.selectedRoute);
  const selectedBus = useAppStore((s) => s.selectedBus);
  const results = useAppStore((s) => s.results);
  const theme = useAppStore((s) => s.theme);
  const activeTab = useAppStore((s) => s.activeTab);
  const metroView = useAppStore((s) => s.metroView);
  const trainView = useAppStore((s) => s.trainView);
  const selectedTrainLine = useAppStore((s) => s.selectedTrainLine);
  const setSelectedTrainLine = useAppStore((s) => s.setSelectedTrainLine);

  // Determine what to show on the map
  const mapData = useMemo(() => {
    // If we are in metro actual map view, show all metro lines
    if (activeTab === 'metro' && metroView === 'map') {
      const allLines = metroLines.map(line => {
        const positions: L.LatLngTuple[] = [];
        const stops: { position: L.LatLngTuple; name: string }[] = [];
        
        line.stations.forEach(stationId => {
          const s = metroStations[stationId];
          if (s) {
            positions.push([s.lat, s.lng]);
            stops.push({ position: [s.lat, s.lng], name: s.name });
          }
        });
        
        return {
          id: line.id,
          color: line.color,
          positions,
          stops
        };
      }).filter(line => line.positions.length > 0);

      const allPositions = allLines.flatMap(l => l.positions);
      const allMarkers: { position: L.LatLngTuple; name: string; type: string }[] = [];
      const seenStations = new Set<string>();
      
      allLines.forEach(l => {
        l.stops.forEach(s => {
          if (!seenStations.has(s.name)) {
            seenStations.add(s.name);
            const isInterchange = Object.values(metroStations).find(st => st.name === s.name)?.isInterchange;
            allMarkers.push({
              position: s.position,
              name: s.name,
              type: isInterchange ? 'metro-interchange' : 'metro-stop'
            });
          }
        });
      });

      return {
        isMetroNetwork: true,
        lines: allLines,
        markers: allMarkers,
        center: [22.5646, 88.3518] as L.LatLngTuple, // Esplanade
        bounds: L.latLngBounds(allPositions),
      };
    }

    if (activeTab === 'train' && trainView === 'map') {
      const activeTrainLines = selectedTrainLine 
        ? trainLines.filter(l => l.id === selectedTrainLine) 
        : trainLines;

      const allLines = activeTrainLines.map(line => {
        let positions: L.LatLngTuple[] = [];
        const stops: { position: L.LatLngTuple; name: string }[] = [];
        
        line.stations.forEach(stationId => {
          const stopData = trainStations[stationId];
          if (stopData && stopData.lat && stopData.lng) {
            stops.push({ position: [stopData.lat, stopData.lng], name: stationId });
          }
        });
        
        // Use actual track geometry if available, else fallback to station lines
        if (trainGeometries[line.id]) {
          positions = trainGeometries[line.id] as L.LatLngTuple[];
        } else {
          positions = stops.map(s => s.position);
        }
        
        return {
          id: line.id,
          color: line.color,
          positions,
          stops
        };
      }).filter(line => line.positions.length > 0);
      
      const allPositions = allLines.flatMap(l => l.positions);
      const allMarkers: { position: L.LatLngTuple; name: string; type: string }[] = [];
      const seenStations = new Set<string>();
      
      allLines.forEach(l => {
        l.stops.forEach(s => {
          if (!seenStations.has(s.name)) {
            seenStations.add(s.name);
            const isInterchange = Object.values(trainStations).find(st => st.name === s.name)?.isInterchange;
            allMarkers.push({
              position: s.position,
              name: s.name,
              type: isInterchange ? 'metro-interchange' : 'metro-stop'
            });
          }
        });
      });

      return {
        isMetroNetwork: true,
        lines: allLines,
        markers: allMarkers,
        center: [22.5646, 88.3518] as L.LatLngTuple,
        bounds: allPositions.length > 0 ? L.latLngBounds(allPositions) : null,
      };
    }

    // Regular routing / bus view logic
    let regularData = null;
    if (selectedRoute) {
      regularData = getRouteMapData(selectedRoute);
    } else if (selectedBus) {
      const route = getBusFullRoute(selectedBus.busNumber);
      if (route) {
        const validStops = route.filter((s) => s.lat !== null && s.lng !== null);
        const positions: L.LatLngTuple[] = validStops.map((s) => [s.lat!, s.lng!]);
        regularData = {
          isMetroNetwork: false,
          lines: [{ id: 'bus', color: '#FF6B35', positions }],
          markers: validStops.map((s, i) => ({
            position: [s.lat!, s.lng!] as L.LatLngTuple,
            name: s.name,
            type: i === 0 ? 'start' : i === validStops.length - 1 ? 'end' : 'stop',
          })),
          center: positions.length > 0 ? positions[Math.floor(positions.length / 2)] : [22.5726, 88.3639] as L.LatLngTuple,
          bounds: positions.length > 0 ? L.latLngBounds(positions) : null,
        };
      }
    } else if (results && results.length > 0) {
      regularData = getRouteMapData(results[0]);
    }
    
    if (regularData) return regularData;

    // Default: Kolkata center
    return {
      isMetroNetwork: false,
      lines: [] as { id: string, color: string, positions: L.LatLngTuple[] }[],
      markers: [] as { position: L.LatLngTuple; name: string; type: string }[],
      center: [22.5726, 88.3639] as L.LatLngTuple,
      bounds: null as L.LatLngBounds | null,
    };
  }, [selectedRoute, selectedBus, results, activeTab, metroView, trainView, selectedTrainLine]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[400px] md:min-h-[500px] bg-[#F3F4F6] dark:bg-[#1A1A2E] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E] relative">

      <MapContainer
        center={mapData.center}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false} // Disabled default to use custom Trackpad Gestures
      >
        <MapGestures />
        <MapControls wrapperRef={wrapperRef} />
        <TileLayer
          url={
            theme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Auto center */}
        {mapData.bounds && <MapAutoCenter bounds={mapData.bounds} />}

        {/* Route Lines */}
        {mapData.lines.map(line => line.positions.length > 1 && (
          <Polyline
            key={line.id}
            positions={line.positions}
            pathOptions={{
              color: line.color,
              weight: mapData.isMetroNetwork ? 6 : 4,
              opacity: mapData.isMetroNetwork ? 1 : 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            }}
            className={mapData.isMetroNetwork ? '' : 'route-line-animated'}
          />
        ))}

        {/* Markers */}
        {mapData.markers.map((marker, i) => {
          let icon = stopIcon;
          if (marker.type === 'start') icon = startIcon;
          else if (marker.type === 'end') icon = endIcon;
          else if (marker.type === 'junction') icon = junctionIcon;
          else if (marker.type === 'metro-stop') icon = metroStopIcon;
          else if (marker.type === 'metro-interchange') icon = metroInterchangeIcon;

          return (
            <Marker
              key={`${marker.name}-${i}`}
              position={marker.position}
              icon={icon}
              zIndexOffset={marker.type.includes('interchange') ? 100 : 0}
            >
              {mapData.isMetroNetwork ? (
                <Tooltip 
                  direction="right" 
                  offset={[10, 0]} 
                  opacity={1} 
                  permanent 
                  className="bg-transparent border-0 shadow-none text-[11px] md:text-[12px] font-bold text-[#111118] dark:text-white"
                >
                  <span style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.8)' }} className="dark:!text-shadow-none dark:drop-shadow-md">
                    {marker.name}
                  </span>
                </Tooltip>
              ) : (
                <Popup className="dark-popup">
                  <span className="text-[13px] font-medium text-[#1C1C28]">
                    {marker.name}
                  </span>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

/* ─── Helper: Extract map data from a RouteResult ─── */
function getRouteMapData(route: RouteResult) {
  const positions: L.LatLngTuple[] = [];
  const markers: { position: L.LatLngTuple; name: string; type: string }[] = [];

  if (route.type === 'direct') {
    route.fullRoute.forEach((stop, i) => {
      if (stop.lat === null || stop.lng === null) return;
      const pos: L.LatLngTuple = [stop.lat, stop.lng];
      positions.push(pos);
      markers.push({
        position: pos,
        name: stop.name,
        type: i === 0 ? 'start' : i === route.fullRoute.length - 1 ? 'end' : 'stop',
      });
    });
  } else {
    // Multi-hop
    route.hops.forEach((hop, hopIdx) => {
      hop.route.forEach((stop, i) => {
        if (stop.lat === null || stop.lng === null) return;
        const pos: L.LatLngTuple = [stop.lat, stop.lng];

        // Avoid duplicate positions for junction stops
        const isDuplicate = positions.some(
          (p) => Math.abs(p[0] - pos[0]) < 0.0001 && Math.abs(p[1] - pos[1]) < 0.0001
        );

        if (!isDuplicate) {
          positions.push(pos);
          let type = 'stop';
          if (hopIdx === 0 && i === 0) type = 'start';
          else if (hopIdx === route.hops.length - 1 && i === hop.route.length - 1)
            type = 'end';
          else if (stop.isJunction) type = 'junction';

          markers.push({ position: pos, name: stop.name, type });
        }
      });
    });
  }

  return {
    isMetroNetwork: false,
    lines: [{ id: 'route', color: '#FF6B35', positions }],
    markers,
    center: positions.length > 0 ? positions[Math.floor(positions.length / 2)] : ([22.5726, 88.3639] as L.LatLngTuple),
    bounds: positions.length > 0 ? L.latLngBounds(positions) : null,
  };
}
