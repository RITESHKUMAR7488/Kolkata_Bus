import { Train } from 'lucide-react';
import { metroLines } from '@/data/metroData';
import { trainLines } from '@/data/trainData';
import { useAppStore } from '@/store/useAppStore';

interface MapLegendProps {
  type: 'metro' | 'train';
}

export default function MapLegend({ type }: MapLegendProps) {
  const selectedTrainLine = useAppStore((s) => s.selectedTrainLine);
  const setSelectedTrainLine = useAppStore((s) => s.setSelectedTrainLine);

  return (
    <div className="w-full bg-white dark:bg-[#1C1C28] p-4 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E] flex flex-col gap-4">
      {type === 'train' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#4B5563] dark:text-[#A1A1AA]">Filter Line</label>
          <select 
            value={selectedTrainLine || ''} 
            onChange={(e) => setSelectedTrainLine(e.target.value || null)}
            className="bg-[#F9FAFB] dark:bg-[#242434] px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#3E3E4E] text-sm font-medium text-[#1C1C28] dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-[#DC2626]/50 transition-shadow appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="">All Train Lines</option>
            {trainLines.map(line => (
              <option key={line.id} value={line.id}>{line.name}</option>
            ))}
          </select>
          <div className="w-full h-px bg-[#E5E7EB] dark:bg-[#3E3E4E] my-1" />
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-[#111118] dark:text-[#F1F1F4] mb-3 flex items-center gap-2">
          <Train size={18} className={type === 'metro' ? "text-[#FF6B35]" : "text-[#DC2626]"} /> 
          {type === 'metro' ? 'Metro Lines' : 'Train Lines'}
        </h3>
        <div className="flex flex-col gap-2.5">
          {(type === 'metro' ? metroLines : trainLines).map(l => (
            <div key={l.id} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full shadow-inner shrink-0" style={{ backgroundColor: l.color }} />
              <span className="text-[13px] font-semibold text-[#4B5563] dark:text-[#A1A1AA] tracking-wide">{l.name}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#3E3E4E] flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#FF6B35] bg-white dark:bg-[#1C1C28] flex items-center justify-center shrink-0">
               <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full" />
            </div>
            <span className="text-[12px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">Interchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}
