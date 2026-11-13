// Resolves every subject in scripts/concepts.mjs to a real photo on Wikimedia, saves a resized
// copy in pictures/, and writes data/catalog.json:
//   { images: [{ src, credit, subject }], words: { word: imageIndex } }
// Photos already in pictures/ are kept, so re-running only fetches new subjects.
// Run with: NODE_USE_ENV_PROXY=1 node scripts/build-catalog.mjs   (the env var only matters behind a proxy)
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { parseConcepts } from './concepts.mjs';

const UA = { 'User-Agent': 'song-pics-catalog/1.0 (https://github.com/willyclayton/song-pics)' };
const WIDTH = 960; // size requested from Wikimedia
const SIZE = 800; // longest side of the copy we keep
const DIR = new URL('../pictures/', import.meta.url);
mkdirSync(DIR, { recursive: true });
const REMOTE = process.argv.includes('--remote'); // link to Wikimedia instead of downloading missing photos
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const concepts = parseConcepts();
const choices = (entry) => entry.split(' | '); // an entry may list fallback subjects
const subjects = [...new Set(Object.values(concepts).flatMap(choices))];
// Plain upload.wikimedia.org thumbnail address, without tracking parameters.
const tidy = (src) => src.replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/').split('?')[0];

async function api(host, params) {
  const url = `https://${host}/w/api.php?format=json&formatversion=2&${new URLSearchParams(params)}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.json();
    if (attempt === 3) throw new Error(`${res.status} for ${url}`);
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
}

const found = {}; // subject -> { src, credit }

// Wikipedia articles: use the article's lead image.
const articles = subjects.filter((s) => !s.startsWith('File:'));
for (let i = 0; i < articles.length; i += 40) {
  const batch = articles.slice(i, i + 40);
  const data = await api('en.wikipedia.org', {
    action: 'query', prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: WIDTH, pilicense: 'any', redirects: 1, titles: batch.join('|'),
  });
  const alias = {}; // resolved title -> what we asked for
  for (const n of data.query.normalized ?? []) alias[n.to] = n.from;
  for (const r of data.query.redirects ?? []) alias[r.to] = alias[r.from] ?? r.from;
  for (const page of data.query.pages) {
    if (!page.thumbnail) continue;
    found[alias[page.title] ?? page.title] = {
      src: tidy(page.thumbnail.source),
      credit: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`,
    };
  }
}

// Exact Commons files.
const files = subjects.filter((s) => s.startsWith('File:'));
for (let i = 0; i < files.length; i += 40) {
  const batch = files.slice(i, i + 40);
  const data = await api('commons.wikimedia.org', { action: 'query', prop: 'imageinfo', iiprop: 'url', iiurlwidth: WIDTH, titles: batch.join('|') });
  const alias = {};
  for (const n of data.query.normalized ?? []) alias[n.to] = n.from;
  for (const page of data.query.pages) {
    const info = page.imageinfo?.[0];
    if (info) found[alias[page.title] ?? page.title] = { src: tidy(info.thumburl), credit: info.descriptionurl };
  }
}

const pick = (entry) => choices(entry).find((s) => found[s]);
const missing = [...new Set(Object.values(concepts))].filter((e) => !pick(e));
if (missing.length) console.warn(`No image for: ${missing.join(', ')}`);
const order = [...new Set(Object.values(concepts).map(pick).filter(Boolean))];

// Download politely (Wikimedia rate-limits bursts) and keep a resized JPEG.
const slug = (s) => s.replace(/^File:/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const images = [];
for (const subject of order) {
  const file = `${slug(subject)}.jpg`;
  const path = new URL(file, DIR);
  if (!existsSync(path)) {
    if (REMOTE) {
      images.push({ src: found[subject].src, credit: found[subject].credit, subject });
      continue;
    }
    let res;
    for (let attempt = 0; attempt < 6; attempt++) {
      res = await fetch(found[subject].src, { headers: UA });
      if (res.status !== 429) break;
      await sleep((Number(res.headers.get('retry-after')) || 10) * 1000 + 1000);
    }
    if (!res.ok) {
      console.warn(`Download failed (${res.status}): ${subject}`);
      continue;
    }
    await sharp(Buffer.from(await res.arrayBuffer()))
      .flatten({ background: '#ffffff' })
      .resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(path.pathname);
    await sleep(700);
  }
  images.push({ src: `pictures/${file}`, credit: found[subject].credit, subject });
}

const index = Object.fromEntries(images.map((im, i) => [im.subject, i]));
const catalog = {
  images,
  words: Object.fromEntries(Object.entries(concepts).filter(([, e]) => pick(e) in index).map(([w, e]) => [w, index[pick(e)]])),
};
writeFileSync(new URL('../data/catalog.json', import.meta.url), JSON.stringify(catalog));
console.log(`${images.length} pictures covering ${Object.keys(catalog.words).length} words`);
