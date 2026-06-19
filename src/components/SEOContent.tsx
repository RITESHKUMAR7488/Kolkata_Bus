import {
  Bus,
  Train,
  Ship,
  LocateFixed,
  Star,
  Share2,
  Map,
  Moon,
  Smartphone,
  Gift,
  GitBranch,
  ArrowRight,
  MapPin,
  ChevronRight,
} from 'lucide-react';

/* ── Transport Mode Card ─────────────────────────────────────────────────── */
function ModeCard({
  icon,
  color,
  bg,
  title,
  description,
  points,
}: {
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm flex flex-col">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
        <span className={color}>{icon}</span>
      </div>
      <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed mb-4 flex-1">
        {description}
      </p>
      <ul className="space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            <ChevronRight size={12} className={color} />
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ── Feature Item ────────────────────────────────────────────────────────── */
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-[#F3F4F6] dark:bg-[#2E2E3E] rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[#6B7280] dark:text-[#A1A1AA]">
        {icon}
      </div>
      <div>
        <h3 className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-0.5">
          {title}
        </h3>
        <p className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function SEOContent() {
  return (
    <section
      aria-label="About Kolkata Travel Router"
      className="mt-16 border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-12 pb-4"
    >
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-4 leading-tight tracking-tight">
          Kolkata's Smartest Public Transport Planner
        </h2>
        <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[15px] leading-relaxed">
          A free, interactive tool to plan journeys across Kolkata using buses, the Metro,
          suburban rail, and Hooghly River ferries. Search hundreds of CSTC and WBTC bus routes,
          explore metro lines, browse Sealdah &amp; Howrah rail networks, and discover scenic
          river ferry routes — all in one place.
        </p>
      </div>

      {/* Transport Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <ModeCard
          icon={<Bus size={18} />}
          color="text-[#FF6B35]"
          bg="bg-[#FFF0EB] dark:bg-[#2E1A10]"
          title="Bus Route Finder"
          description="Search hundreds of routes operated by CSTC, WBTC, and private mini-bus services. Enter any two stops to find direct and connecting buses."
          points={['CSTC & WBTC routes', 'AC and non-AC buses', 'Mini-bus services', 'Stop-by-stop route view']}
        />
        <ModeCard
          icon={<Train size={18} />}
          color="text-[#008080]"
          bg="bg-[#E8F5F5] dark:bg-[#0A2020]"
          title="Kolkata Metro Map"
          description="Explore India's first metro system. View all lines including the North-South corridor and the East-West Green Line from Howrah Maidan to Salt Lake Sector V."
          points={['All lines & stations', 'East-West Green Line', 'Schematic & map view', 'Interchange stations']}
        />
        <ModeCard
          icon={<Train size={18} />}
          color="text-[#DC2626]"
          bg="bg-[#FEF2F2] dark:bg-[#3E1A1A]"
          title="Local Train Network"
          description="Navigate suburban rail from Howrah and Sealdah stations covering routes to Bandel, Bardhaman, Diamond Harbour, Namkhana, and Shantipur."
          points={['Sealdah division lines', 'Howrah division lines', 'Suburban rail stations', 'Schematic & map views']}
        />
        <ModeCard
          icon={<Ship size={18} />}
          color="text-[#3B82F6]"
          bg="bg-[#EFF6FF] dark:bg-[#1E3A5F]"
          title="Hooghly River Ferry"
          description="Discover ferry routes operated by WBSTC across the Hooghly River. Cross between Howrah and Kolkata ghats quickly and cheaply from ₹6 per trip."
          points={['10+ river ferry routes', 'Fares & timings', 'Ghat locations on map', 'Howrah ↔ Fairlie, Baghbazar']}
        />
      </div>

      {/* App Features */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-6 mb-12 shadow-sm">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-6 tracking-tight">
          Built for Kolkata Commuters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureItem
            icon={<LocateFixed size={15} />}
            title="Nearby Stops"
            description="Tap the locate button to instantly find bus stops closest to your GPS position."
          />
          <FeatureItem
            icon={<Star size={15} />}
            title="Favourite Routes"
            description="Save your daily commute for one-tap access every time you return to the app."
          />
          <FeatureItem
            icon={<Share2 size={15} />}
            title="Share a Route"
            description="Share any bus route via WhatsApp or copy a direct link that auto-runs the search."
          />
          <FeatureItem
            icon={<Map size={15} />}
            title="Interactive Map"
            description="View routes on a live Leaflet map with all stops and junction points highlighted."
          />
          <FeatureItem
            icon={<GitBranch size={15} />}
            title="Multi-hop Routes"
            description="Finds journeys that require changing buses at shared junction stops."
          />
          <FeatureItem
            icon={<Moon size={15} />}
            title="Dark Mode"
            description="A comfortable dark theme for late-night planning and low-light environments."
          />
          <FeatureItem
            icon={<Smartphone size={15} />}
            title="Mobile Friendly"
            description="Fully responsive layout that works seamlessly on any phone or tablet."
          />
          <FeatureItem
            icon={<Gift size={15} />}
            title="Completely Free"
            description="No account, no ads, no app download. Open in any browser and go."
          />
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-6 mb-12 shadow-sm">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-6 tracking-tight">
          How to Plan Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              title: 'Choose Transport Mode',
              body: 'Select Bus, Metro, Train, or Ferry from the navigation tabs at the top of the page.',
            },
            {
              n: '02',
              title: 'Enter Your Route',
              body: 'Type your starting stop and destination, or tap the locate button to auto-fill the nearest stop.',
            },
            {
              n: '03',
              title: 'View, Save & Share',
              body: 'See your route on the interactive map. Star it to save, or share a link directly to this search.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div className="shrink-0">
                <span className="text-[28px] font-black text-[#E5E7EB] dark:text-[#2E2E3E] leading-none select-none">
                  {n}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-1.5 text-[14px] tracking-tight">
                  {title}
                </h3>
                <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Areas */}
      <div className="mb-12">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-1.5 tracking-tight">
          Areas &amp; Ghats Covered
        </h2>
        <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] mb-4">
          Bus stops, metro stations, suburban rail halts, and Hooghly River ferry ghats across the
          Kolkata Metropolitan Area.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Howrah', 'Sealdah', 'Esplanade', 'Park Street', 'Salt Lake', 'New Town',
            'Dum Dum', 'Barasat', 'Barrackpore', 'Garia', 'Jadavpur', 'Tollygunge',
            'Behala', 'Ballygunge', 'Shyambazar', 'Ultadanga', 'Rajarhat', 'Airport',
            'Bandel', 'Bardhaman', 'Diamond Harbour', 'Namkhana', 'Shantipur',
            'Dakshineswar', 'Kavi Subhas', 'Noapara',
            'Chandpal Ghat', 'Fairlie Place Ghat', 'Baghbazar Ghat', 'Belur Math Ghat',
            'Millennium Park Ghat', 'Garden Reach Ghat', 'Botanical Garden Ghat',
          ].map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F6F9] dark:bg-[#242434] text-[#4B5563] dark:text-[#A1A1AA] text-[12px] rounded-full border border-[#E5E7EB] dark:border-[#2E2E3E]"
            >
              <MapPin size={9} className="text-[#9CA3AF]" />
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-5 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {[
            {
              q: 'How do I find a bus route in Kolkata?',
              a: 'Use the Plan Journey tab. Enter your starting stop and destination — or tap the locate button to auto-fill your nearest stop — and the app instantly finds all matching bus routes with stop-by-stop timelines and an interactive map.',
            },
            {
              q: 'Which bus routes are covered?',
              a: 'Hundreds of routes operated by CSTC (Calcutta State Transport Corporation), WBTC (West Bengal Transport Corporation), AC buses, and private mini-bus services across the Kolkata metropolitan area.',
            },
            {
              q: 'How many metro lines does Kolkata have?',
              a: 'Kolkata Metro operates Line 1 (North-South / Blue Line: Dakshineswar to Kavi Subhas), Line 2 (East-West / Green Line: Howrah Maidan to Salt Lake Sector V), and several upcoming corridors. The metro map shows all operational stations and interchange points.',
            },
            {
              q: 'Can I plan a local train journey in Kolkata?',
              a: "The Train tab covers Kolkata's suburban rail — Sealdah division lines to Barasat, Basirhat, Diamond Harbour, Namkhana, Shantipur, and Bandel, plus Howrah division lines — operated by Eastern Railway and South Eastern Railway.",
            },
            {
              q: 'What Hooghly River ferry routes are available?',
              a: 'The Ferry tab shows 10+ WBSTC routes including Howrah ↔ Fairlie Place, Howrah ↔ Chandpal Ghat, Chandpal ↔ Belur Math, Fairlie ↔ Dakshineswar, and more. Fares start from ₹6. All routes are shown on an interactive map with ghat markers.',
            },
            {
              q: 'How do I save and share a route?',
              a: 'After a search returns results, use the star icon to save the route to your favourites — it appears as a quick-access card on next visit. The share icon generates a direct link (or opens the native share sheet on mobile) that anyone can open to see the same search.',
            },
            {
              q: 'Is Kolkata Travel Router free to use?',
              a: 'Yes — completely free. No account, no registration, no app download. Open in any browser and start planning.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-[#1C1C28] dark:text-[#F1F1F4] hover:text-[#FF6B35] transition-colors list-none text-[14px] tracking-tight">
                <span>{q}</span>
                <ArrowRight
                  size={14}
                  className="text-[#9CA3AF] shrink-0 ml-4 group-open:rotate-90 transition-transform duration-200"
                />
              </summary>
              <p className="px-5 pb-4 text-[13px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed border-t border-[#F3F4F6] dark:border-[#242434] pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
