import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const origin = 'https://kolkata-bus.vercel.app';
const paths = JSON.parse(await readFile('dist/seo-manifest.json', 'utf8'));
const known = new Set(paths);
const titles = new Set();
let links = 0;
for (const path of paths) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Missing or duplicate title ${path}`); titles.add(title);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), `Canonical mismatch ${path}`);
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) ?? []).length, 1, `One meaningful h1 ${path}`);
  assert.ok(!html.includes('noindex'), `Unexpected noindex ${path}`);
  assert.ok(html.match(/name="description" content="[^"]{30,}"/), `Description missing ${path}`);
  assert.ok(!/aggregateRating|reviewCount|SearchAction|\{from\}|\{to\}|GovernmentService/.test(html), `Misleading or obsolete structured data ${path}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  for (const match of html.matchAll(/<a[^>]+href="(\/[^"?#]*)[^\"]*"/g)) {
    links++;
    assert.ok(known.has(match[1]), `Broken internal link ${match[1]} from ${path}`);
  }
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, paths.length);
assert.ok(!(await readFile('dist/index.html', 'utf8')).includes('<div id="root"></div>'), 'Homepage content is pre-rendered');
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex'));
for (const path of ['/guide/', '/bn/guide/']) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  assert.ok(html.includes('hreflang="bn-IN"') && html.includes('hreflang="en-IN"'), 'Reciprocal language links');
}
console.log(`PASS: ${paths.length} HTML pages, ${links} internal links, sitemap, canonicals, metadata, schemas and language alternates.`);
