export default function SEOContent() {
  return (
    <section
      aria-label="About Kolkata Travel Router"
      className="mt-16 border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-12 pb-4"
    >
      {/* ── Hero Description ── */}
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-4 leading-tight">
          Kolkata's Smartest Public Transport Planner
        </h2>
        <p className="text-[#6B7280] dark:text-[#A1A1AA] text-base md:text-lg leading-relaxed">
          Kolkata Travel Router is a free, interactive tool to plan journeys across Kolkata using
          buses, the Kolkata Metro, local suburban trains, and Hooghly River ferries. Search
          hundreds of CSTC and WBTC bus routes, explore all metro lines, browse Sealdah &amp;
          Howrah rail networks, and discover scenic ferry ghat routes — all in one place.
        </p>
      </div>

      {/* ── Transport Mode Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {/* Bus */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-10 h-10 bg-[#FFF0EB] dark:bg-[#2E1A10] rounded-xl flex items-center justify-center text-xl mb-3">🚌</div>
          <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Bus Route Finder
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[13px] leading-relaxed mb-3">
            Search hundreds of bus routes operated by CSTC, WBTC, and private mini-bus services.
            Find which Kolkata buses connect any two stops with all intermediate stops listed.
          </p>
          <ul className="space-y-1 text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> CSTC &amp; WBTC routes</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> AC and non-AC buses</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> Mini-bus routes</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> Stop-by-stop route view</li>
          </ul>
        </article>

        {/* Metro */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-10 h-10 bg-[#E8F5F5] dark:bg-[#0A2020] rounded-xl flex items-center justify-center text-xl mb-3">🚇</div>
          <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Metro Map
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[13px] leading-relaxed mb-3">
            Explore Kolkata's metro network — India's first metro system. View all lines including
            Line 1 (North-South) and Line 2 (East-West Green Line from Howrah Maidan to Salt Lake
            Sector V).
          </p>
          <ul className="space-y-1 text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> All metro lines &amp; stations</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> East-West Green Line</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> Schematic &amp; map view</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> Interchange stations</li>
          </ul>
        </article>

        {/* Train */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-10 h-10 bg-[#FFFBEB] dark:bg-[#1A1400] rounded-xl flex items-center justify-center text-xl mb-3">🚂</div>
          <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Local Train Network
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[13px] leading-relaxed mb-3">
            Navigate Kolkata's suburban rail from Howrah and Sealdah stations — covering routes to
            Bandel, Bardhaman, Diamond Harbour, Namkhana, Shantipur, and more via Eastern Railway.
          </p>
          <ul className="space-y-1 text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Sealdah division lines</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Howrah division lines</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Suburban rail stations</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Geographic &amp; schematic maps</li>
          </ul>
        </article>

        {/* Ferry */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-10 h-10 bg-[#EFF6FF] dark:bg-[#1E3A5F] rounded-xl flex items-center justify-center text-xl mb-3">🛥️</div>
          <h3 className="text-[15px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Hooghly River Ferry Services
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[13px] leading-relaxed mb-3">
            Discover Kolkata's scenic Hooghly River ferry routes operated by WBSTC. Cross between
            Howrah and Kolkata ghats quickly and cheaply — starting from just ₹6 per trip.
          </p>
          <ul className="space-y-1 text-[12px] text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#3B82F6]">✓</span> 10+ river ferry routes</li>
            <li className="flex items-center gap-2"><span className="text-[#3B82F6]">✓</span> Fares &amp; timings</li>
            <li className="flex items-center gap-2"><span className="text-[#3B82F6]">✓</span> Ghat locations on map</li>
            <li className="flex items-center gap-2"><span className="text-[#3B82F6]">✓</span> Howrah ↔ Fairlie, Baghbazar</li>
          </ul>
        </article>
      </div>

      {/* ── App Features ── */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-6 mb-14 shadow-sm">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-5">
          App Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '📍', title: 'Nearby Stops', desc: 'Tap "Near Me" to instantly find bus stops closest to your current GPS location.' },
            { icon: '⭐', title: 'Favourite Routes', desc: 'Save your daily commute routes for one-tap access every time you open the app.' },
            { icon: '📤', title: 'Share Route', desc: 'Share any bus route with friends via WhatsApp or copy a direct link.' },
            { icon: '🗺️', title: 'Interactive Maps', desc: 'View your route on a live Leaflet map with all stops and junctions highlighted.' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Comfortable dark theme for night-time travel planning.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive — works perfectly on any phone or tablet.' },
            { icon: '🔀', title: 'Multi-hop Routes', desc: 'Finds routes that require changing buses at junction stops.' },
            { icon: '🆓', title: 'Completely Free', desc: 'No sign-up, no ads, no app download. Just open and go.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <span className="text-xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <h3 className="text-[13px] font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-0.5">{title}</h3>
                <p className="text-[12px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to Use ── */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-6 mb-14 shadow-sm">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-5">
          How to Plan Your Kolkata Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: '1', title: 'Choose Your Mode', body: 'Select Bus, Metro, Train, or Ferry from the tab bar at the top of the page.' },
            { n: '2', title: 'Enter Your Route', body: 'For buses, type your starting stop and destination — or tap 📍 to auto-fill your nearest stop.' },
            { n: '3', title: 'Explore the Map', body: 'View your route on the interactive map with all stops. Save it ⭐ or share it 📤 instantly.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">{n}</div>
              <div>
                <h3 className="font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-1 text-[14px]">{title}</h3>
                <p className="text-[13px] text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Coverage Areas ── */}
      <div className="mb-14">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
          Areas &amp; Ghats Covered in Kolkata
        </h2>
        <p className="text-[#6B7280] dark:text-[#A1A1AA] text-[13px] mb-4 leading-relaxed">
          Kolkata Travel Router covers the entire Kolkata Metropolitan Area — bus stops, metro
          stations, suburban rail stations, and Hooghly River ferry ghats:
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
              className="px-3 py-1 bg-[#F4F6F9] dark:bg-[#242434] text-[#4B5563] dark:text-[#A1A1AA] text-[12px] rounded-full border border-[#E5E7EB] dark:border-[#2E2E3E]"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mb-2">
        <h2 className="text-[17px] font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: 'How do I find a bus route in Kolkata?',
              a: 'Use the Plan Journey tab. Enter your starting stop and destination to instantly find all matching bus routes. The app shows each bus number, all intermediate stops, and highlights the route on an interactive map. You can also tap the 📍 Near Me button to auto-fill your nearest stop.',
            },
            {
              q: 'Which bus routes are covered?',
              a: 'Kolkata Travel Router covers hundreds of routes operated by CSTC (Calcutta State Transport Corporation), WBTC (West Bengal Transport Corporation), AC buses, and private mini-bus services across the Kolkata metropolitan area.',
            },
            {
              q: 'How many metro lines does Kolkata have?',
              a: 'Kolkata Metro currently operates Line 1 (North-South / Blue Line from Dakshineswar to Kavi Subhas), Line 2 (East-West / Green Line from Howrah Maidan to Salt Lake Sector V), and several upcoming corridors. Our metro map shows all operational stations and interchange points.',
            },
            {
              q: 'Can I plan a local train journey in Kolkata?',
              a: "Yes! Switch to the Train tab to explore Kolkata's suburban rail. It covers Sealdah division lines (Barasat, Basirhat, Diamond Harbour, Namkhana, Shantipur, Bandel) and Howrah division lines — operated by Eastern Railway and South Eastern Railway.",
            },
            {
              q: 'What are the Hooghly River ferry routes?',
              a: 'The Ferry tab shows 10+ ferry routes operated by WBSTC across the Hooghly River, including Howrah ↔ Fairlie Place, Howrah ↔ Chandpal Ghat, Chandpal ↔ Belur Math, Fairlie ↔ Dakshineswar, and more. Fares start from ₹6. View all routes on an interactive map.',
            },
            {
              q: 'How do I save and share a route?',
              a: 'After searching for a route, click the ⭐ star icon to save it to your favourites — it will appear as a quick-access card next time. Click the 📤 share icon to share via WhatsApp or copy a direct link that anyone can open to see the same route.',
            },
            {
              q: 'Is Kolkata Travel Router free to use?',
              a: 'Yes, completely free. No sign-up, no registration, no app download required. Just open the website and start planning your journey.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-[#1C1C28] dark:text-[#F1F1F4] hover:text-[#FF6B35] transition-colors list-none text-[14px]">
                <span>{q}</span>
                <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4">▾</span>
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
