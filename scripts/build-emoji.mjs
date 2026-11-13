// Builds data/emoji.json: a word -> emoji lookup used as the instant picture for each lyric word.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const info = require('unicode-emoji-json');
const keywords = require('emojilib');

const best = new Map(); // word -> { emoji, score }
const offer = (word, emoji, score) => {
  if (!/^[a-z]{2,}$/.test(word)) return;
  const cur = best.get(word);
  if (!cur || score > cur.score) best.set(word, { emoji, score });
};

for (const [emoji, meta] of Object.entries(info)) {
  if (meta.group === 'Flags') continue;
  const nameWords = meta.name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  // Exact one-word name is the best match; words inside short names beat loose keywords.
  if (nameWords.length === 1) offer(nameWords[0], emoji, 100);
  else nameWords.forEach((w) => offer(w, emoji, 50 - nameWords.length));
  for (const kw of keywords[emoji] ?? []) {
    const k = kw.toLowerCase();
    if (/^[a-z]+$/.test(k)) offer(k, emoji, 10);
  }
}

const out = Object.fromEntries([...best].sort().map(([w, v]) => [w, v.emoji]));
writeFileSync(new URL('../data/emoji.json', import.meta.url), JSON.stringify(out));
console.log(`wrote ${Object.keys(out).length} words`);
