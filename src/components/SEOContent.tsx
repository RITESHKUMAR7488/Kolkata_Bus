export default function SEOContent() {
  return (
    <section
      aria-label="About Kolkata Travel Router"
      className="mt-16 border-t border-[#E5E7EB] dark:border-[#2E2E3E] pt-12 pb-16"
    >
      {/* ── Hero Description ── */}
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-4 leading-tight">
          Kolkata's Smartest Public Transport Planner
        </h2>
        <p className="text-[#6B7280] dark:text-[#A1A1AA] text-base md:text-lg leading-relaxed">
          Kolkata Travel Router is a free, interactive tool to plan journeys across Kolkata using
          buses, the Kolkata Metro, and local suburban trains. Search hundreds of CSTC and WBTC bus
          routes, explore all metro lines, and browse Sealdah &amp; Howrah rail networks — all in
          one place.
        </p>
      </div>

      {/* ── Feature Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {/* Bus */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-11 h-11 bg-[#FFF0EB] dark:bg-[#2E1A10] rounded-xl flex items-center justify-center text-2xl mb-4">
            🚌
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Bus Route Finder
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-sm leading-relaxed">
            Search hundreds of bus routes operated by CSTC (Calcutta State Transport Corporation),
            WBTC (West Bengal Transport Corporation), and private mini-bus services. Enter your
            start and end stop to find which Kolkata buses connect them, along with all intermediate
            stops.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> CSTC &amp; WBTC routes</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> AC and non-AC buses</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> Mini-bus routes</li>
            <li className="flex items-center gap-2"><span className="text-[#FF6B35]">✓</span> Stop-by-stop route view</li>
          </ul>
        </article>

        {/* Metro */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-11 h-11 bg-[#E8F5F5] dark:bg-[#0A2020] rounded-xl flex items-center justify-center text-2xl mb-4">
            🚇
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Metro Map
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-sm leading-relaxed">
            Explore Kolkata's growing metro network — India's first metro system. View all
            operational lines including the North-South corridor (Line 1), the East-West Metro
            (Line 2 / Green Line) connecting Howrah Maidan to Salt Lake Sector V, and all stations
            across the network.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> All metro lines &amp; stations</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> East-West Green Line</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> Schematic &amp; map view</li>
            <li className="flex items-center gap-2"><span className="text-[#008080]">✓</span> Interchange stations</li>
          </ul>
        </article>

        {/* Train */}
        <article className="bg-white dark:bg-[#1C1C28] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#2E2E3E] shadow-sm">
          <div className="w-11 h-11 bg-[#FFFBEB] dark:bg-[#1A1400] rounded-xl flex items-center justify-center text-2xl mb-4">
            🚂
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-2">
            Kolkata Local Train Network
          </h3>
          <p className="text-[#6B7280] dark:text-[#A1A1AA] text-sm leading-relaxed">
            Navigate Kolkata's extensive suburban rail network. Browse lines from Howrah Station
            and Sealdah Station covering routes to Bandel, Bardhaman, Diamond Harbour, Namkhana,
            Shantipur, and more — operated by Eastern Railway and South Eastern Railway.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Sealdah division lines</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Howrah division lines</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Suburban rail stations</li>
            <li className="flex items-center gap-2"><span className="text-[#F4C430]">✓</span> Geographic &amp; schematic maps</li>
          </ul>
        </article>
      </div>

      {/* ── How to Use ── */}
      <div className="bg-white dark:bg-[#1C1C28] rounded-2xl border border-[#E5E7EB] dark:border-[#2E2E3E] p-8 mb-14 shadow-sm">
        <h2 className="text-xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-6">
          How to Plan Your Kolkata Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">1</div>
            <div>
              <h3 className="font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-1">Choose Your Mode</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
                Select Bus, Metro, or Train from the tab bar at the top of the page.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">2</div>
            <div>
              <h3 className="font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-1">Enter Your Route</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
                For buses, type your starting stop and destination to search matching routes.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">3</div>
            <div>
              <h3 className="font-semibold text-[#1C1C28] dark:text-[#F1F1F4] mb-1">Explore on the Map</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
                View your route on the interactive Leaflet map with all stops highlighted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Coverage Areas ── */}
      <div className="mb-14">
        <h2 className="text-xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-4">
          Areas Covered in Kolkata
        </h2>
        <p className="text-[#6B7280] dark:text-[#A1A1AA] text-sm mb-5 leading-relaxed">
          Kolkata Travel Router covers the entire Kolkata Metropolitan Area including major
          neighbourhoods, transit hubs, and suburban regions:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Howrah', 'Sealdah', 'Esplanade', 'Park Street', 'Salt Lake', 'New Town',
            'Dum Dum', 'Barasat', 'Barrackpore', 'Garia', 'Jadavpur', 'Tollygunge',
            'Behala', 'Ballygunge', 'Shyambazar', 'Ultadanga', 'Rajarhat', 'Airport',
            'Bandel', 'Bardhaman', 'Diamond Harbour', 'Namkhana', 'Shantipur',
            'Dakshineswar', 'Kavi Subhas', 'Noapara'
          ].map((area) => (
            <span
              key={area}
              className="px-3 py-1 bg-[#F4F6F9] dark:bg-[#242434] text-[#4B5563] dark:text-[#A1A1AA] text-sm rounded-full border border-[#E5E7EB] dark:border-[#2E2E3E]"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div>
        <h2 className="text-xl font-bold text-[#1C1C28] dark:text-[#F1F1F4] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'How do I find a bus route in Kolkata?',
              a: 'Use the Bus tab in Kolkata Travel Router. Enter your starting stop and destination to instantly find all matching bus routes. The app shows each bus number, all intermediate stops, and highlights the route on an interactive map.',
            },
            {
              q: 'Which bus routes are covered?',
              a: 'Kolkata Travel Router covers hundreds of routes operated by CSTC (Calcutta State Transport Corporation), WBTC (West Bengal Transport Corporation), and private mini-bus services across the Kolkata metropolitan area.',
            },
            {
              q: 'How many metro lines does Kolkata have?',
              a: 'Kolkata Metro currently operates multiple lines including Line 1 (North-South, Blue Line from Dakshineswar to Kavi Subhas), Line 2 (East-West Green Line from Howrah Maidan to Salt Lake Sector V), and several upcoming corridors. Our metro map shows all operational stations.',
            },
            {
              q: 'Can I plan a local train journey in Kolkata?',
              a: "Yes! Switch to the Train tab to explore Kolkata's suburban rail network. It covers Sealdah division lines (to Barasat, Basirhat, Diamond Harbour, Namkhana, Shantipur, Bandel) and Howrah division lines — operated by Eastern Railway and South Eastern Railway.",
            },
            {
              q: 'Is Kolkata Travel Router free to use?',
              a: 'Yes, Kolkata Travel Router is completely free. No sign-up, no registration, no app download required. Just open the website and start planning your journey.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="bg-white dark:bg-[#1C1C28] rounded-xl border border-[#E5E7EB] dark:border-[#2E2E3E] overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-[#1C1C28] dark:text-[#F1F1F4] hover:text-[#FF6B35] transition-colors list-none">
                <span>{q}</span>
                <span className="text-[#9CA3AF] group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4">▾</span>
              </summary>
              <p className="px-6 pb-5 text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed border-t border-[#F3F4F6] dark:border-[#242434] pt-4">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
