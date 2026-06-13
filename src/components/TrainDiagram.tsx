import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Train } from 'lucide-react';
import { trainStations, trainLines } from '@/data/trainData';

export default function TrainDiagram() {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Prevent default browser zoom and handle internal zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent browser full-page zoom
        const zoomDelta = -e.deltaY * 0.01;
        setScale(s => Math.min(Math.max(0.2, s + zoomDelta), 3));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleZoom = (delta: number) => {
    setScale(s => Math.min(Math.max(0.2, s + delta), 2));
  };

  const handleFullscreen = () => {
    if (wrapperRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapperRef.current.requestFullscreen();
      }
    }
  };

  const getLabelStyle = (orientation: string, isInterchange: boolean) => {
    const base = "absolute whitespace-nowrap pointer-events-none transition-all duration-200 ";
    const textStyle = isInterchange 
      ? 'text-[#111118] dark:text-white text-[14px] font-bold bg-white/70 dark:bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-[#E5E7EB] dark:border-[#3E3E4E]' 
      : 'text-[#4B5563] dark:text-[#A1A1AA] text-[13px] font-medium drop-shadow-sm';

    switch (orientation) {
      case 'right': return base + `left-5 top-1/2 -translate-y-1/2 ${textStyle}`;
      case 'left': return base + `right-5 top-1/2 -translate-y-1/2 ${textStyle}`;
      case 'bottom-angled': return base + `left-3 top-3 origin-top-left rotate-45 ${textStyle}`;
      case 'top-angled': return base + `left-3 bottom-3 origin-bottom-left -rotate-45 ${textStyle}`;
      case 'top': return base + `bottom-5 left-1/2 -translate-x-1/2 ${textStyle}`;
      case 'bottom': return base + `top-5 left-1/2 -translate-x-1/2 ${textStyle}`;
      default: return base + `left-5 top-1/2 -translate-y-1/2 ${textStyle}`;
    }
  };

  // Generate path coordinates for a line
  const OFFSET_Y = 500;
  
  const generateLinePath = (stations: string[]) => {
    let d = "";
    stations.forEach((stationId, index) => {
      const station = trainStations[stationId];
      if (!station) return;
      const nx = station.x;
      const ny = station.y + OFFSET_Y;
      
      if (index === 0) {
        d += `M ${nx} ${ny} `;
      } else {
        d += `L ${nx} ${ny} `;
      }
    });
    return d;
  };

  return (
    <div 
      ref={wrapperRef}
      className="relative w-full bg-[#FAFAFA] dark:bg-[#161622] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] overflow-hidden shadow-sm flex flex-col"
      style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 dark:bg-[#242434]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#E5E7EB] dark:border-[#3E3E4E] shadow-lg">
        <button onClick={() => handleZoom(0.2)} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => setScale(0.7)} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Reset View">
          <span className="text-xs font-bold">1:1</span>
        </button>
        <button onClick={() => handleZoom(-0.2)} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <div className="w-full h-px bg-[#E5E7EB] dark:bg-[#3E3E4E] my-1" />
        <button onClick={handleFullscreen} className="p-2.5 text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#FF6B35] transition-colors rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2E2E3E]" title="Toggle Fullscreen">
          <Maximize size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-[#242434]/90 backdrop-blur-md p-4 rounded-xl border border-[#E5E7EB] dark:border-[#3E3E4E] shadow-lg pointer-events-none">
        <h3 className="text-sm font-bold text-[#111118] dark:text-[#F1F1F4] mb-3 flex items-center gap-2">
          <Train size={18} className="text-[#DC2626]" /> Train Lines
        </h3>
        <div className="flex flex-col gap-2.5">
          {trainLines.map(l => (
            <div key={l.id} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: l.color }} />
              <span className="text-[13px] font-semibold text-[#4B5563] dark:text-[#A1A1AA] tracking-wide">{l.name}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#3E3E4E] flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#FF6B35] bg-white dark:bg-[#1C1C28] flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full" />
            </div>
            <span className="text-[12px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">Interchange</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Area */}
      <div ref={containerRef} className="flex-1 overflow-auto custom-scrollbar relative">
        <div 
          className="origin-top-left absolute top-0 left-0"
          style={{ width: 3000, height: 4000, transform: `scale(${scale})` }}
        >
          {/* Static SVG for lines to prevent rendering bugs */}
          <svg width="3000" height="4000" className="absolute inset-0 pointer-events-none">
            {/* Draw thick lines */}
            {trainLines.map(line => (
              <path
                key={line.id}
                d={generateLinePath(line.stations)}
                stroke={line.color}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
            ))}
            
            {/* Draw nodes as SVG elements to guarantee perfect alignment */}
            {Object.values(trainStations).map(node => {
              const nx = node.x;
              const ny = node.y + OFFSET_Y;
              
              return node.isInterchange ? (
                <circle
                  key={`bg-${node.id}`}
                  cx={nx}
                  cy={ny}
                  r={9}
                  fill="#FFFFFF"
                  stroke="#DC2626"
                  strokeWidth={4}
                  className="drop-shadow-md"
                />
              ) : (
                <line
                  key={`bg-${node.id}`}
                  x1={node.orientation === 'right' || node.orientation === 'left' ? nx - 8 : nx}
                  y1={node.orientation === 'right' || node.orientation === 'left' ? ny : ny - 8}
                  x2={node.orientation === 'right' || node.orientation === 'left' ? nx + 8 : nx}
                  y2={node.orientation === 'right' || node.orientation === 'left' ? ny : ny + 8}
                  stroke={trainLines.find(l => l.id === node.lines[0])?.color || '#FFFFFF'}
                  strokeWidth={6}
                  strokeLinecap="round"
                  transform={node.orientation.includes('angled') ? `rotate(45 ${nx} ${ny})` : ''}
                />
              );
            })}
          </svg>

          {/* HTML Overlay for Labels & Interactions */}
          {Object.values(trainStations).map(node => {
            const nx = node.x;
            const ny = node.y + OFFSET_Y;
            return (
            <div
              key={node.id}
              className="absolute group z-10"
              style={{ left: nx, top: ny }}
            >
              {/* Hitbox area */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full cursor-pointer" />
              
              {/* Label */}
              <div className={getLabelStyle(node.orientation, !!node.isInterchange)}>
                {node.name}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
