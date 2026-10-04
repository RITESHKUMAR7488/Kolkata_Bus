import { useMemo, useRef, useState } from 'react';
import { Maximize, Minus, Plus, Scan } from 'lucide-react';
type Station = { name: string; x: number; y: number; isInterchange?: boolean; orientation?: string };
type Line = { id: string; name: string; color: string; stations: string[] };
export default function NetworkDiagram({ stations, lines, label }: { stations: Record<string, Station>; lines: Line[]; label: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const bounds = useMemo(() => {
    const points = Object.values(stations);
    const x = Math.min(...points.map(s => s.x)) - 250, y = Math.min(...points.map(s => s.y)) - 250;
    return { x, y, width: Math.max(...points.map(s => s.x)) - x + 240, height: Math.max(...points.map(s => s.y)) - y + 180 };
  }, [stations]);
  const width = bounds.width / zoom, height = bounds.height / zoom;
  return <section className="space-y-3" aria-label={`${label} schematic network`}>
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">{lines.map(line => <span key={line.id} className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: line.color }} />{line.name}</span>)}</div>
    <div ref={wrapper} className="relative w-full h-[60svh] min-h-[360px] max-h-[720px] bg-white dark:bg-[#161622] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <svg role="img" aria-label={`Full ${label} network; zoom in to read station names`} width="100%" height="100%" viewBox={`${bounds.x + (bounds.width - width) / 2 + pan.x} ${bounds.y + (bounds.height - height) / 2 + pan.y} ${width} ${height}`} className="touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={e => { if ((e.target as Element).closest('[data-station]')) return; e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }; }}
        onPointerMove={e => { if (!drag.current) return; const rect = e.currentTarget.getBoundingClientRect(), ratio = Math.max(width / rect.width, height / rect.height); setPan({ x: drag.current.panX - (e.clientX - drag.current.x) * ratio, y: drag.current.panY - (e.clientY - drag.current.y) * ratio }); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        <title>{label} network diagram</title>
        {lines.map(line => <polyline key={line.id} points={line.stations.filter(id => stations[id]).map(id => `${stations[id].x},${stations[id].y}`).join(' ')} stroke={line.color} strokeWidth="7" fill="none" strokeLinejoin="round" strokeLinecap="round" />)}
        {Object.entries(stations).map(([id, station]) => <g key={id} data-station={id} role="button" tabIndex={0} aria-label={station.name} className="cursor-pointer" onClick={() => setSelected(id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(id); } }}>
          <circle cx={station.x} cy={station.y} r={station.isInterchange ? 8 : 5} fill="white" stroke={selected === id || station.isInterchange ? '#ea580c' : '#475569'} strokeWidth="3" />
          <text x={station.orientation === 'left' ? station.x - 13 : station.x + 13} y={station.orientation === 'bottom' ? station.y + 22 : station.y - 10} textAnchor={station.orientation === 'left' ? 'end' : 'start'} transform={station.orientation?.includes('top') ? `rotate(-45 ${station.x + 13} ${station.y - 10})` : undefined} fontSize="15" className="fill-slate-700 dark:fill-slate-200" paintOrder="stroke" strokeWidth="3" stroke="var(--diagram-label-bg,white)">{station.name}</text>
        </g>)}
      </svg>
      <div className="absolute right-3 top-3 flex flex-col rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow p-1">
        <button className="p-3" aria-label="Zoom In" onClick={() => setZoom(z => Math.min(8, z * 1.4))}><Plus size={18} /></button>
        <button className="p-3" aria-label="Fit full network" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><Scan size={18} /></button>
        <button className="p-3" aria-label="Zoom Out" onClick={() => setZoom(z => Math.max(1, z / 1.4))}><Minus size={18} /></button>
        <button className="p-3" aria-label="Toggle Fullscreen" onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await wrapper.current?.requestFullscreen(); } catch { setMessage('Fullscreen is unavailable in this browser.'); } }}><Maximize size={18} /></button>
      </div>
      <p className="absolute bottom-3 left-3 rounded-lg bg-white/95 dark:bg-slate-800/95 px-3 py-2 text-xs max-w-[70%]" role="status">{selected ? `${stations[selected].name}${stations[selected].isInterchange ? ' · Interchange' : ''}` : 'Full network · Zoom to read stops · Drag to pan'}{message && ` · ${message}`}</p>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400">Diagram includes the lines in our dataset. Planned corridors may appear; check operator notices for current service.</p>
  </section>;
}
