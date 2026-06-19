import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ferryRoutes, ghats } from '@/data/ferryData';
import type { FerryRoute } from '@/types';
import { Clock, Banknote, Ship, Anchor, Navigation, ChevronDown } from 'lucide-react';

export default function FerryDiagram() {
  const [view, setView] = useState<'routes' | 'map'>('routes');
  const [selected, setSelected] = useState<FerryRoute | null>(null);

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#E5E7EB] dark:bg-[#2E2E3E] p-1 rounded-lg flex items-center">
          <button
            onClick={() => setView('routes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'routes'
                ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm'
                : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
            }`}
          >
            Route Cards
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'map'
                ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm'
                : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {view === 'routes' ? (
        <RoutesView selected={selected} setSelected={setSelected} />
      ) : (
        <FerryMapView selected={selected} setSelected={setSelected} />
      )}
    </div>
  );
}

/* ── Route Cards View ── */
function RoutesView({
  selected,
  setSelected,
}: {
  selected: FerryRoute | null;
  setSelected: (r: FerryRoute | null) => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A5F] flex items-center justify-center">
          <Ship size={18} className="text-[#3B82F6]" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
            Hooghly River Ferry Services
          </h2>
          <p className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            {ferryRoutes.length} routes · Operated by WBSTC
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#EFF6FF] dark:bg-[#1E3A5F]/40 border border-[#BFDBFE] dark:border-[#1E40AF]/40 rounded-xl p-3 mb-4 flex items-start gap-2">
        <Anchor size={14} className="text-[#3B82F6] mt-0.5 shrink-0" />
        <p className="text-[12px] text-[#1D4ED8] dark:text-[#93C5FD] leading-relaxed">
          Ferries are a quick, cheap, and scenic way to cross the Hooghly River. Beat the Howrah Bridge traffic!
        </p>
      </div>

      {/* Route Cards */}
      <div className="space-y-3">
        {ferryRoutes.map((route, i) => (
          <FerryRouteCard
            key={route.id}
            route={route}
            index={i}
            expanded={selected?.id === route.id}
            onToggle={() => setSelected(selected?.id === route.id ? null : route)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Single Ferry Route Card ── */
function FerryRouteCard({
  route,
  index,
  expanded,
  onToggle,
}: {
  route: FerryRoute;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center gap-3 hover:bg-[#FAFAFA] dark:hover:bg-[#242434] transition-colors"
      >
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: route.color }}
        />

        {/* Route name + ghats */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] truncate">
            {route.name}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              <Clock size={11} />
              {route.duration}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              <Banknote size={11} />
              {route.fare}
            </span>
            <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              {route.frequency}
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#9CA3AF]"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#E5E7EB] dark:border-[#2E2E3E]">
              {/* Journey line */}
              <div className="flex items-center gap-3 mt-4 mb-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
                  <div className="w-0.5 h-8 bg-[#E5E7EB] dark:bg-[#3E3E4E]" />
                  <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: route.color }} />
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
                      {route.from.name}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {route.from.bank === 'west' ? 'West Bank (Howrah)' : 'East Bank (Kolkata)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">
                      {route.to.name}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {route.to.bank === 'west' ? 'West Bank (Howrah)' : 'East Bank (Kolkata)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Duration', value: route.duration, icon: <Clock size={12} /> },
                  { label: 'Fare', value: route.fare, icon: <Banknote size={12} /> },
                  { label: 'Frequency', value: route.frequency, icon: <Ship size={12} /> },
                  { label: 'Timings', value: route.timings, icon: <Clock size={12} /> },
                  { label: 'Operator', value: route.operator, icon: <Anchor size={12} /> },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="bg-[#F8FAFC] dark:bg-[#242434] rounded-lg p-2.5"
                  >
                    <div className="flex items-center gap-1 mb-0.5 text-[#9CA3AF]">
                      {icon}
                      <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Ferry Map View ── */
function FerryMapView({
  selected,
  setSelected,
}: {
  selected: FerryRoute | null;
  setSelected: (r: FerryRoute | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let map: import('leaflet').Map;

    async function init() {
      const L = await import('leaflet');

      if (!mapRef.current || leafletMapRef.current) return;

      map = L.map(mapRef.current, {
        center: [22.5726, 88.36],
        zoom: 12,
        zoomControl: true,
      });

      leafletMapRef.current = map;

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Draw all ferry routes as polylines
      ferryRoutes.forEach((route) => {
        const line = L.polyline(
          [
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng],
          ],
          {
            color: route.color,
            weight: selected?.id === route.id ? 5 : 3,
            opacity: selected ? (selected.id === route.id ? 1 : 0.3) : 0.8,
            dashArray: '8 4',
          }
        ).addTo(map);

        line.on('click', () => setSelected(selected?.id === route.id ? null : route));
        line.bindTooltip(route.name, { sticky: true, className: 'leaflet-ferry-tooltip' });
      });

      // Draw ghat markers
      const ghatIcon = (color: string) =>
        L.divIcon({
          className: '',
          html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.6)"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

      ghats.forEach((ghat) => {
        const color = ghat.bank === 'west' ? '#60A5FA' : '#34D399';
        L.marker([ghat.lat, ghat.lng], { icon: ghatIcon(color) })
          .addTo(map)
          .bindTooltip(ghat.name, { className: 'leaflet-ferry-tooltip' });
      });

      // Legend — use class-based Control to avoid TypeScript callable error
      const LegendControl = L.Control.extend({
        onAdd() {
          const div = L.DomUtil.create('div', '');
          div.innerHTML = `
            <div style="background:rgba(28,28,40,0.9);border:1px solid #2E2E3E;border-radius:8px;padding:8px 10px;font-family:Inter,sans-serif;font-size:11px;color:#A1A1AA">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <div style="width:10px;height:10px;border-radius:50%;background:#60A5FA;border:2px solid white"></div>
                <span>West Bank (Howrah)</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:10px;height:10px;border-radius:50%;background:#34D399;border:2px solid white"></div>
                <span>East Bank (Kolkata)</span>
              </div>
            </div>`;
          return div;
        },
      });
      new LegendControl({ position: 'bottomright' }).addTo(map);
    }

    init();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* Sidebar */}
      <div className="w-full lg:w-64 shrink-0 space-y-2 max-h-[500px] overflow-y-auto pr-1">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium px-1 mb-2">
          Click a route to highlight
        </p>
        {ferryRoutes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(selected?.id === r.id ? null : r)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors text-[13px] border ${
              selected?.id === r.id
                ? 'border-transparent text-white'
                : 'border-[#E5E7EB] dark:border-[#2E2E3E] bg-white dark:bg-[#1C1C28] text-[#1C1C28] dark:text-[#F1F1F4] hover:bg-[#F3F4F6] dark:hover:bg-[#242434]'
            }`}
            style={selected?.id === r.id ? { backgroundColor: r.color } : {}}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: selected?.id === r.id ? 'white' : r.color }}
            />
            <span className="truncate font-medium">{r.name}</span>
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="w-full lg:flex-1 h-[500px] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm relative">
        <div ref={mapRef} className="w-full h-full" />
        {selected && (
          <div className="absolute top-3 left-3 z-[1000] bg-[#1C1C28]/95 text-white rounded-xl p-3 shadow-lg max-w-[220px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
              <p className="text-[12px] font-semibold">{selected.name}</p>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">{selected.duration} · {selected.fare} · {selected.frequency}</p>
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1 bg-[#1C1C28]/80 rounded-lg px-2.5 py-1.5">
          <Navigation size={12} className="text-[#3B82F6]" />
          <span className="text-[11px] text-white">Hooghly River Ferry Map</span>
        </div>
      </div>
    </div>
  );
}
