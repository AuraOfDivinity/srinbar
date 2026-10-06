import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Exercise the actual shared metadata implementation, without a CMS or server.
const source = await readFile(new URL("../lib/seo.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const seo = await import(moduleUrl);
const page = seo.pageMetadata({ title: "Bamboo research", description: "  Research\n in Sri Lanka. ", path: "/events/research" });
assert.equal(page.description, "Research in Sri Lanka.");
assert.equal(page.alternates.canonical, `${seo.SITE_URL}/events/research`);
assert.equal(page.openGraph.url, page.alternates.canonical);
assert.equal(page.twitter.images[0].url, page.openGraph.images[0].url);
assert.equal(page.openGraph.images[0].width, 1200);
assert.ok(seo.metaDescription("bamboo ".repeat(50)).length <= 160);
assert.equal(seo.breadcrumbs([{ name: "Events", path: "/events" }]).itemListElement[1].position, 2);
const originalNoindex = process.env.SITE_NOINDEX;
process.env.SITE_NOINDEX = "true";
assert.equal((await import(`${moduleUrl}#preview`)).INDEXABLE, false);
if (originalNoindex === undefined) delete process.env.SITE_NOINDEX;
else process.env.SITE_NOINDEX = originalNoindex;
console.log("Metadata, canonical, social-image and preview-indexing checks passed.");

// Optional integration audit against a running production server.
const base = process.env.SEO_TEST_URL;
if (!base) process.exit(0);
const request = async path => {
  const response = await fetch(new URL(path, base), { headers: { "User-Agent": "Googlebot" }, redirect: "manual" });
  return { response, html: await response.text() };
};
const { response: sitemapResponse, html: sitemap } = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]));
assert.ok(urls.length >= 4);
assert.equal(new Set(urls.map(url => url.href)).size, urls.length);
assert.ok(urls.every(url => !/^\/(studio|api|article)(\/|$)/.test(url.pathname)));
const blogEnabled = /BLOG_ENABLED:\s*boolean\s*=\s*true/.test(await readFile(new URL("../lib/features.ts", import.meta.url), "utf8"));
if (!blogEnabled) assert.ok(urls.every(url => !url.pathname.startsWith("/blog")));
const titles = new Set();
const decode = text => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
for (const url of urls) {
  const { response, html } = await request(url.pathname);
  assert.equal(response.status, 200, url.pathname);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Missing or duplicate title: ${url.pathname}`);
  titles.add(title);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(new URL(decode(canonical?.[1] || "")).href, url.href);
  for (const tag of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:url"', 'property="og:image"', 'name="twitter:card"', 'name="twitter:image"']) {
    assert.ok(html.includes(tag), `Missing ${tag}: ${url.pathname}`);
  }
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, `Heading: ${url.pathname}`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  assert.ok(schemas.length, `Missing structured data: ${url.pathname}`);
  for (const schema of schemas) JSON.parse(schema[1]);
  console.log(`Verified ${url.pathname}`);
}
const { html: robots } = await request("/robots.txt");
assert.ok(robots.includes(`Sitemap: ${urls[0].origin}/sitemap.xml`));
for (const path of ["/events/seo-check-missing", ...(blogEnabled ? ["/blog/seo-check-missing"] : ["/blog", "/blog/seo-check-missing", "/article"])]) {
  const { response, html } = await request(path);
  assert.equal(response.status, 404, path);
  assert.match(html, /<meta name="robots" content="noindex"/);
}
const { html: studio } = await request("/studio");
assert.match(studio, /<meta name="robots" content="noindex, nofollow"/);
for (const [path, width, height] of [["/opengraph-image?title=Bamboo%20and%20rattan%20in%20Sri%20Lanka", 1200, 630], ["/icon", 96, 96], ["/apple-icon", 180, 180]]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.readUInt32BE(16), width);
  assert.equal(png.readUInt32BE(20), height);
}
console.log(`SEO integration audit passed for ${urls.length} public pages, indexing rules and generated images.`);
