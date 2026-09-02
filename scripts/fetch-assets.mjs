// ORÉE — visual asset system
// -------------------------------------------------------------
// Every image in this project belongs to one "film production":
// identical subject families, one estate, one lighting language
// (golden hour → cellar dark), one grade (muted, warm, cinematic).
// This script queries Unsplash's search API and prints candidates
// with their alt text so subjects can be verified for continuity.
//
//   node scripts/fetch-assets.mjs search
//   node scripts/fetch-assets.mjs download
// -------------------------------------------------------------

const SEARCHES = [
  { key: 'barrels',       q: 'oak barrels winery cellar' },
  { key: 'cellar-tanks',  q: 'wine fermentation steel tanks' },
  { key: 'winemaker',     q: 'winemaker tasting wine cellar' },
  { key: 'bottle-solo',   q: 'single wine bottle black background' },
  { key: 'bottle-row',    q: 'wine bottles row' },
  { key: 'juice',         q: 'grape juice purple glass' },
  { key: 'wine-misty',    q: 'vineyard morning mist' },
  { key: 'toast',         q: 'friends wine toast vineyard' },
  { key: 'table-food',    q: 'wine cheese board rustic' },
  { key: 'cellar-racks',  q: 'wine bottles aging cellar rack' },
];

async function search() {
  for (const s of SEARCHES) {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(s.q)}&per_page=6&orientation=landscape`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'oree-asset-tool/1.0' } });
      if (!res.ok) { console.log(`\n## ${s.key} — HTTP ${res.status}`); continue; }
      const json = await res.json();
      console.log(`\n## ${s.key} — "${s.q}"`);
      for (const r of json.results.slice(0, 6)) {
        console.log(`  id=${r.id}  ${r.width}x${r.height}  color=${r.color}`);
        console.log(`    alt: ${(r.alt_description || r.description || '(none)').slice(0, 110)}`);
      }
    } catch (e) {
      console.log(`\n## ${s.key} — FAILED ${e.message}`);
    }
  }
}

// Scene → Unsplash photo id. Verified by hand from `npm run assets:search`
// for subject, light direction and colour continuity.
const MANIFEST = [
  { file: 'vineyard-wide',   id: 'vHds06aM3c8', w: 2000 }, // hero — sun setting over vineyard
  { file: 'vineyard-rows',   id: 'Kj-nmS5bg6o', w: 1600 }, // dolly — sunlight through rows at sunset
  { file: 'vineyard-fog',    id: '8hV7wyAWOqo', w: 1600 }, // rows emerging from morning fog
  { file: 'grapes-cluster',  id: '9cVSyTyCgqs', w: 1600 }, // bunch hanging from vine
  { file: 'grapes-macro',    id: '9ohN8KCREek', w: 2000 }, // macro bunch, deep purple
  { file: 'grapes-dark',     id: 'OVOVKT1X41A', w: 1600 }, // dark bunch — skin pass
  { file: 'harvest-hands',   id: 'zBwxaS0SkTk', w: 1600 }, // hands holding dark grapes
  { file: 'harvest-touch',   id: 'CszvWoGd4PY', w: 1200 }, // hand touching ripe bunch
  { file: 'harvest-crate',   id: '2MZ3PkBpN1Y', w: 1600 }, // crate of dark fruit
  { file: 'cellar-barrels',  id: 'R_fHvalXid0', w: 2000 }, // dimly lit barrel cellar
  { file: 'cellar-tanks',    id: 'sL1p9EPPTPk', w: 1600 }, // fermentation tanks, warm dark
  { file: 'cellar-racks',    id: 'bYvmOw-3kqE', w: 2000 }, // bottle library tunnel
  { file: 'winemaker',       id: 'K9VyHt8AHWk', w: 1600 }, // winemaker among barrels
  { file: 'sommelier',       id: 'k61X_vMdKLE', w: 1200 }, // tasting in cellar
  { file: 'pour',            id: 'gg6CKBHPkQo', w: 1600 }, // pouring red wine
  { file: 'pour-2',          id: '9nvopDQqnkI', w: 1600 }, // pour at table, dark
  { file: 'glass-table',     id: 'ADNerVP2LjI', w: 2000 }, // glasses on dark table
  { file: 'toast',           id: 'IB2PBUJJdVs', w: 1600 }, // hands clinking red wine
  { file: 'table-food',      id: 'gaMUhVI_Qho', w: 1600 }, // charcuterie + wine board
  { file: 'estate',          id: 'L0Kea4kqe8g', w: 1600 }, // aerial organic winery
];

async function download() {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = path.resolve(process.cwd(), 'public/images');
  fs.mkdirSync(dir, { recursive: true });
  for (const m of MANIFEST) {
    if (!m.id) { console.log(`skip ${m.file} (no id)`); continue; }
    try {
      // resolve the short id to its raw CDN url
      const meta = await fetch(`https://unsplash.com/napi/photos/${m.id}`, {
        headers: { 'User-Agent': 'oree-asset-tool/1.0' },
      });
      if (!meta.ok) { console.log(`FAIL ${m.file}: meta HTTP ${meta.status}`); continue; }
      const json = await meta.json();
      const sep = json.urls.raw.includes('?') ? '&' : '?';
      const url = `${json.urls.raw}${sep}w=${m.w}&q=78&fm=webp&fit=crop`;
      const res = await fetch(url);
      if (!res.ok) { console.log(`FAIL ${m.file}: HTTP ${res.status}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(dir, `${m.file}.webp`), buf);
      console.log(`ok   ${m.file}.webp  ${(buf.length / 1024).toFixed(0)} KB  ${json.alt_description ? json.alt_description.slice(0, 60) : ''}`);
    } catch (e) {
      console.log(`FAIL ${m.file}: ${e.message}`);
    }
  }
}

const mode = process.argv[2];
if (mode === 'search') await search();
else if (mode === 'download') await download();
else console.log('usage: node scripts/fetch-assets.mjs [search|download]');
