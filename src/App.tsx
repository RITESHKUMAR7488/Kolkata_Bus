import { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SegmentedControl from '@/components/SegmentedControl';
import SearchPanel from '@/components/SearchPanel';
import ResultsDashboard from '@/components/ResultsDashboard';
import MapLegend from '@/components/MapLegend';
import SEOContent from '@/components/SEOContent';
import Footer from '@/components/Footer';
import ExploreLinks from '@/components/ExploreLinks';
import './App.css';
const MapView = lazy(() => import('@/components/MapView'));
const MetroDiagram = lazy(() => import('@/components/MetroDiagram'));
const TrainDiagram = lazy(() => import('@/components/TrainDiagram'));
const FerryDiagram = lazy(() => import('@/components/FerryDiagram'));

/* ── Stagger container for page-load entrance ── */
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

function App() {
  const activeTab = useAppStore((s) => s.activeTab);
  const metroView = useAppStore((s) => s.metroView);
  const setMetroView = useAppStore((s) => s.setMetroView);
  const trainView = useAppStore((s) => s.trainView);
  const setTrainView = useAppStore((s) => s.setTrainView);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('ktr_theme'); } catch { /* Storage may be unavailable. */ }
    useAppStore.getState().setTheme(saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  }, []);

  // ── Read URL params on mount (Share Route feature) ──────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const to = params.get('to');
    const bus = params.get('bus');
    const mode = params.get('mode');
    const store = useAppStore.getState();
    if (mode === 'metro' || mode === 'train' || mode === 'ferry') store.setActiveTab(mode);
    if (bus) {
      store.setActiveTab('bus');
      store.setBusNumber(bus);
      store.searchBus();
    } else if (from && to && !/[{}]/.test(from + to)) {
      store.setActiveTab('journey');
      store.setFromStop(from);
      store.setToStop(to);
      store.searchRoutes();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#111118] transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        {/* Staggered entrance for the main content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {/* Hero splash — only on journey tab */}
          {activeTab === 'journey' && (
            <motion.div variants={fadeSlideUp}>
              <Hero />
            </motion.div>
          )}

          <motion.div variants={fadeSlideUp}>
            <SegmentedControl />
          </motion.div>

          <Suspense fallback={<p role="status" className="p-8 text-center min-h-[400px]">Loading transport map…</p>}>
          {activeTab === 'metro' ? (
            <div className="flex flex-col gap-4 mt-6">
              <motion.div
                variants={fadeSlideUp}
                initial="hidden"
                animate="show"
                className="flex justify-center"
              >
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
              </motion.div>

              <motion.div
                key={`metro-${metroView}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {metroView === 'schematic' ? (
                  <MetroDiagram />
                ) : (
                  <div className="flex flex-col-reverse lg:flex-row gap-6 items-start">
                    <div className="w-full lg:w-64 shrink-0">
                      <MapLegend type="metro" />
                    </div>
                    <div className="w-full lg:flex-1 h-[60svh] min-h-[400px] lg:h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E]">
                      <MapView />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          ) : activeTab === 'train' ? (
            <div className="flex flex-col gap-4 mt-6">
              <motion.div
                variants={fadeSlideUp}
                initial="hidden"
                animate="show"
                className="flex justify-center"
              >
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
              </motion.div>

              <motion.div
                key={`train-${trainView}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {trainView === 'schematic' ? (
                  <TrainDiagram />
                ) : (
                  <div className="flex flex-col-reverse lg:flex-row gap-6 items-start">
                    <div className="w-full lg:w-64 shrink-0">
                      <MapLegend type="train" />
                    </div>
                    <div className="w-full lg:flex-1 h-[60svh] min-h-[400px] lg:h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-[#2E2E3E]">
                      <MapView />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          ) : activeTab === 'ferry' ? (
            <motion.div
              key="ferry"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <FerryDiagram />
            </motion.div>
          ) : (
            <motion.div variants={fadeSlideUp}>
              <SearchPanel />
            </motion.div>
          )}

          </Suspense>
          {(activeTab === 'journey' || activeTab === 'bus') && (
            <motion.div variants={fadeSlideUp}>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 items-start">
                <div className="flex flex-col gap-4">
                  <ResultsDashboard />
                </div>

                {/* Map */}
                <div id="route-map" className="lg:sticky lg:top-6 h-[400px] md:h-[500px] lg:h-[600px] scroll-mt-20">
                  <Suspense fallback={<p role="status" className="p-8">Loading map…</p>}><MapView /></Suspense>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeSlideUp}>
            <ExploreLinks />
            <SEOContent />
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
