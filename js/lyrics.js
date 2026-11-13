// Lyrics: fetch time-synced lyrics, parse LRC, and estimate a start/end time for every word.

const LRCLIB = 'https://lrclib.net/api';

export async function searchLyrics(query) {
  const res = await fetch(`${LRCLIB}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Lyrics search failed (${res.status})`);
  const rows = await res.json();
  return rows
    .filter((r) => r.syncedLyrics)
    .map((r) => ({
      id: r.id,
      title: r.trackName,
      artist: r.artistName,
      album: r.albumName,
      duration: r.duration,
      lrc: r.syncedLyrics,
    }));
}

const STAMP = /\[(\d+):(\d+(?:[.:]\d+)?)\]/g;
const WORD_STAMP = /<(\d+):(\d+(?:\.\d+)?)>/g;
const toSeconds = (m, s) => Number(m) * 60 + Number(String(s).replace(':', '.'));

// Parses LRC text into [{ time, text, wordTimes? }] sorted by time.
// Supports repeated stamps on one line and "enhanced" LRC with <mm:ss.xx> word stamps.
export function parseLRC(text) {
  const lines = [];
  for (const raw of text.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(STAMP)];
    if (!stamps.length) continue;
    let body = raw.replace(STAMP, '').trim();
    let wordTimes = null;
    if (WORD_STAMP.test(body)) {
      WORD_STAMP.lastIndex = 0;
      wordTimes = [];
      const parts = body.split(WORD_STAMP); // [pre, m, s, chunk, m, s, chunk...]
      for (let i = 1; i < parts.length; i += 3) {
        const t = toSeconds(parts[i], parts[i + 1]);
        for (const w of parts[i + 2].trim().split(/\s+/).filter(Boolean)) wordTimes.push({ time: t, text: w });
      }
      body = wordTimes.map((w) => w.text).join(' ');
    }
    for (const s of stamps) lines.push({ time: toSeconds(s[1], s[2]), text: body, wordTimes });
  }
  return lines.sort((a, b) => a.time - b.time);
}

export const wordKey = (w) =>
  w
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9']/g, '')
    .replace(/^'+|'+$/g, '');

export function syllables(word) {
  const w = wordKey(word).replace(/[^a-z]/g, '');
  if (!w) return 1;
  const groups = w.replace(/e$/, '').match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

// Flattens lines into words with start/end times. LRC only times whole lines, so words are
// spread across the line in proportion to their syllable count.
export function buildWords(lines) {
  const words = [];
  lines.forEach((line, li) => {
    const tokens = line.text.split(/\s+/).filter((t) => wordKey(t));
    if (!tokens.length) return;
    const next = lines.slice(li + 1).find((l) => l.time > line.time);
    const gap = next ? next.time - line.time : Infinity;
    const first = words.length;

    if (line.wordTimes?.length === tokens.length) {
      tokens.forEach((text, i) => {
        const start = line.wordTimes[i].time;
        const end = line.wordTimes[i + 1]?.time ?? Math.min(start + 1.5, line.time + gap);
        words.push({ text, key: wordKey(text), start, end, line: li });
      });
    } else {
      const weights = tokens.map(syllables);
      const total = weights.reduce((a, b) => a + b, 0);
      // Sung span: most of the gap to the next line, but capped so a long
      // instrumental break after a line doesn't stretch its words out.
      const span = Math.min(gap * 0.9, total * 0.6 + 0.8);
      let t = line.time;
      tokens.forEach((text, i) => {
        const d = (span * weights[i]) / total;
        words.push({ text, key: wordKey(text), start: t, end: t + d, line: li });
        t += d;
      });
    }
    line.first = first;
    line.last = words.length - 1;
  });
  return words;
}

// Index of the word being sung at time t, or -1 if between words.
export function wordAt(words, t) {
  let lo = 0;
  let hi = words.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (t < words[mid].start) hi = mid - 1;
    else if (t >= words[mid].end) lo = mid + 1;
    else return mid;
  }
  return -1;
}
