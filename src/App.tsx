import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/Navbar';
import SegmentedControl from '@/components/SegmentedControl';
import SearchPanel from '@/components/SearchPanel';
import ResultsDashboard from '@/components/ResultsDashboard';
import MapView from '@/components/MapView';
import MapLegend from '@/components/MapLegend';
import MetroDiagram from '@/components/MetroDiagram';
import TrainDiagram from '@/components/TrainDiagram';
import FerryDiagram from '@/components/FerryDiagram';
import SEOContent from '@/components/SEOContent';
import './App.css';

function App() {
  const theme = useAppStore((s) => s.theme);
  const activeTab = useAppStore((s) => s.activeTab);
  const metroView = useAppStore((s) => s.metroView);
  const setMetroView = useAppStore((s) => s.setMetroView);
  const trainView = useAppStore((s) => s.trainView);
  const setTrainView = useAppStore((s) => s.setTrainView);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && theme === 'light') {
      useAppStore.getState().setTheme('dark');
    }
  }, []);

  // ── Read URL params on mount (Share Route feature) ──────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const to = params.get('to');
    if (from && to) {
      const store = useAppStore.getState();
      store.setFromStop(from);
      store.setToStop(to);
      // Small delay to let the store hydrate
      setTimeout(() => {
        useAppStore.getState().searchRoutes();
      }, 200);
      // Clean the URL so it doesn't re-trigger on refresh
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#111118] transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        <SegmentedControl />
        
        {activeTab === 'metro' ? (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-center">
              <div className="bg-[#E5E7EB] dark:bg-[#2E2E3E] p-1 rounded-lg flex items-center">
                <button
                  onClick={() => setMetroView('schematic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    metroView === 'schematic' 
                      ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm' 
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  Schematic Map
                </button>
                <button
                  onClick={() => setMetroView('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    metroView === 'map' 
                      ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm' 
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  Actual Map
                </button>
              </div>
            </div>
            
            {metroView === 'schematic' ? (
              <MetroDiagram />
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-64 shrink-0">
                  <MapLegend type="metro" />
                </div>
                <div className="w-full lg:flex-1 h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E]">
                  <MapView />
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'train' ? (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-center">
              <div className="bg-[#E5E7EB] dark:bg-[#2E2E3E] p-1 rounded-lg flex items-center">
                <button
                  onClick={() => setTrainView('schematic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    trainView === 'schematic' 
                      ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm' 
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  Schematic Map
                </button>
                <button
                  onClick={() => setTrainView('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    trainView === 'map' 
                      ? 'bg-white dark:bg-[#1C1C28] text-[#111118] dark:text-[#F1F1F4] shadow-sm' 
                      : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111118] dark:hover:text-[#F1F1F4]'
                  }`}
                >
                  Actual Map
                </button>
              </div>
            </div>
            
            {trainView === 'schematic' ? (
              <TrainDiagram />
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-64 shrink-0">
                  <MapLegend type="train" />
                </div>
                <div className="w-full lg:flex-1 h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E]">
                  <MapView />
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'ferry' ? (
          <FerryDiagram />
        ) : (
          <>
            <SearchPanel />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 items-start">
              <div className="flex flex-col gap-4">
                <ResultsDashboard />
              </div>

              {/* Map */}
              <div className="lg:sticky lg:top-6 h-[400px] lg:h-[600px]">
                <MapView />
              </div>
            </div>
          </>
        )}

        <SEOContent />
      </main>
    </div>
  );
}

export default App;
