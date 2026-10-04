const links = [['/bus-routes/', 'Bus route directory'], ['/stops/', 'Bus stops'], ['/metro/', 'Metro lines & stations'], ['/trains/', 'Local train network'], ['/ferries/', 'Ferry connections'], ['/guide/', 'How to use the planner'], ['/bn/guide/', 'বাংলায় নির্দেশিকা'], ['/about/', 'About & data sources'], ['/contact/', 'Report a correction']];
export default function ExploreLinks() {
  return <nav aria-label="Explore Kolkata transport" className="mt-6 rounded-2xl bg-white dark:bg-[#1C1C28] border border-slate-200 dark:border-slate-700 p-5">
    <h2 className="font-semibold mb-3 text-slate-900 dark:text-white">Explore Kolkata transport</h2>
    <div className="flex flex-wrap gap-2">{links.map(([url, label]) => <a key={url} href={url} className="px-3 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500">{label}</a>)}</div>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Independent journey planner. Routes are from the project dataset; no live arrivals. Verify service, fares and timings before travel.</p>
  </nav>;
}
