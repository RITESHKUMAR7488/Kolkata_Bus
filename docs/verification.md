# Transit planner audit — 4 October 2026

## Search Console assessment

Checked the signed-in property `https://kolkata-bus.vercel.app/`.

| Period | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 30 June–29 September 2026 | 315 | 9,810 | 3.2% | 6.7 |
| 2–29 September 2026 | 197 | 6,810 | 2.9% | 6.1 |

Visibility is promising: the latest 28 days account for most of the three-month clicks. This is not a like-for-like comparison of consecutive periods. The leading query, “kolkata bus route”, had 19 clicks from 779 impressions in the 28-day view.

The technical weakness was content coverage: one indexed page, and the successful sitemap contained only one page. One excluded URL was the literal template `/?from={from}&to={to}`, classified as a redirect. That template came from the old SearchAction schema, not a missing real bus page. Its validation had failed on 8 August; the index report was last updated 21 September. HTTPS showed one valid URL; Core Web Vitals had insufficient data. New pages are eligible for crawling, not confirmed indexed. Google controls indexing and rankings.

## Repairs

- Replaced failing CARTO API-key tiles with keyless OpenStreetMap tiles and visible attribution.
- Calculated road paths through known bus stop coordinates, including individual transfer legs. Dashed connectors remain if routing is unavailable. The provider is configurable through `VITE_ROAD_ROUTER_URL`; tiles through `VITE_MAP_TILE_URL`.
- Replaced fixed-size metro/train canvases with SVG viewBoxes fitting the complete dataset network on initial load and after reset. Added keyboard station selection and pan/zoom controls.
- Ferry opens on its geographic map; route selection updates highlight styles and fits the selected connection. Mobile puts the map before its route list.
- Restored bus details/results, map scrolling, bus sharing and saved journeys. Shared URLs survive refresh.
- Normalized stop names, deduplicated routes/suggestions, indexed routes by stop, and rejected invalid stops before expensive routing. Added access to further results through Show more.
- Favourites synchronize across components and browser tabs; storage errors and malformed stored data do not crash the app. Theme preference persists and respects the initial system theme.
- Added keyboard autocomplete navigation, visible focus styles, reduced motion support and a loading-error recovery page.
- Removed invented bus fare/frequency claims, unsubstantiated ratings, government-service identity and obsolete template SearchAction markup. Missing coordinates are no longer substituted with invented locations; the data-generation script also keeps missing coordinates null.
- Generated 211 HTML pages: homepage, 160 distinct bus guides, 40 stop guides, transport guides, English/Bengali usage guides, about, corrections and privacy pages. Added a sitemap, real internal links, unique metadata, self-canonicals, visible breadcrumbs with matching schema, reciprocal guide hreflang and initial homepage HTML content. No FAQ rich-result or review claims.
- Split maps and diagrams into deferred bundles, removed the development inspector, and separated the stable dataset and animation bundles for caching. The dataset is still large; further reduction requires a separately loaded search index or backend.
- Added GitHub Actions for lint, production build and regression checks. Preserved XML/plain-text response headers and added basic security headers.

## Verification

Local production build: `npm run build`. Code checks: `npm run lint`. Regression suite: `npm test`.

883 routing/search assertions passed, including normalization, unique segments, forward/reverse endpoints, transfer continuity, invalid inputs, cancelled searches, bus lookup and nearby-stop filtering. SEO validation checked 211 HTML pages and 5,980 internal links, sitemap completeness, titles, descriptions, canonicals, parseable JSON-LD, removed misleading schemas and reciprocal language links.

| Flow | Browser evidence |
| --- | --- |
| Desktop and mobile navigation | All five modes opened; responsive layouts inspected at 1440×900 and 390×844; narrow 320-pixel check recorded separately during release verification |
| Metro schematic | Complete initial network, zoom and fit-reset inspected |
| Metro geographic map | OpenStreetMap tile images loaded; station markers and attribution visible |
| Train schematic/map | Complete initial schematic; geographic map and Howrah line filter inspected |
| Ferry | Initial map loaded; selected line weight 6/opacity 1 and other lines opacity 0.25; route cards expanded |
| Bus search | 12C guide opened the matching bus, 19 listed stops, calculated solid road path, Copy link success, Save action, View on Map scrolling |
| Journey search | Howrah Station → Esplanade shared URL restored results after reload; saved journey persisted |
| Autocomplete and validation | Suggestions, keyboard selection, swap and invalid/empty input checks |
| Sharing | Bus clipboard verified; route-copy fallback available; native share sheet delivery remains device-dependent |
| Fullscreen | Enter/exit controls invoked; fullscreen rendering depends on browser support |
| Static pages | Route guide rendered with its own title/canonical and working planner CTA, independent of app JavaScript |

## Practical limits

This is a dataset-based planner. Current operator service, all boarding points, every direction, fares, train schedules and exact vehicle paths have not been verified. Road routing uses a car profile and can differ from bus routing; rail/ferry drawings are indicative. Metro diagrams include planned corridors. OpenStreetMap tiles and the public road-routing service depend on external availability and fair-use limits. For sustained traffic, configure a supported provider rather than relying on free public services indefinitely.

Nearby-distance logic was tested with public/synthetic coordinates. Actual personal GPS permission and physical-device location success were not granted or claimed. Native mobile share delivery and every hardware/browser combination cannot be guaranteed by these tests. No booking or payment flow exists.

The next SEO work is to verify and maintain the transport data, review new-page coverage after Google recrawls, measure Core Web Vitals once sufficient visits exist, and use query/CTR evidence to improve individual route titles and content. Technical SEO improvements cannot guarantee first position.
