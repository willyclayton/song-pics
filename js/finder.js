// One-stop song lookup: find the song, its timed lyrics, and a YouTube video of the SAME
// recording, so the lyric times actually line up with the audio.

import { YT_KEY } from './config.js';

const clean = (s) =>
  s
    .replace(/\s*[([][^)\]]*[)\]]/g, '') // (Remastered 2011), [Live], ...
    .replace(/\s+-\s+.*\b(remaster|version|edit|mix|mono|stereo)\b.*$/i, '')
    .trim();
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw Object.assign(new Error(body?.error?.message || `Request failed (${res.status})`), { status: res.status });
  }
  return res.json();
}

// ---- songs (iTunes catalogue: free, no key) ----

export async function searchSongs(term) {
  const data = await getJSON(`https://itunes.apple.com/search?entity=song&limit=12&term=${encodeURIComponent(term)}`);
  return data.results.map((r) => ({
    id: r.trackId,
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    duration: Math.round((r.trackTimeMillis || 0) / 1000),
    art: r.artworkUrl100,
  }));
}

// ---- lyrics (LRCLIB) ----

export async function findLyrics(song) {
  const base = 'https://lrclib.net/api/search?';
  let rows = await getJSON(`${base}track_name=${encodeURIComponent(clean(song.title))}&artist_name=${encodeURIComponent(song.artist)}`);
  if (!rows.some((r) => r.syncedLyrics)) rows = await getJSON(`${base}q=${encodeURIComponent(`${clean(song.title)} ${song.artist}`)}`);
  const seen = new Set();
  return rows
    .filter((r) => r.syncedLyrics && !seen.has(r.syncedLyrics) && seen.add(r.syncedLyrics))
    .map((r) => ({ id: r.id, title: r.trackName, artist: r.artistName, duration: r.duration, lrc: r.syncedLyrics }));
}

// ---- videos (YouTube Data API) ----

export const youTubeKey = () => YT_KEY || localStorage.getItem('songpics.ytkey') || '';

export function isoSeconds(iso) {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  return m ? (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0) : 0;
}

const VIDEO_CACHE = 'songpics.videos.v1';

export async function findVideos(song, key) {
  let cache = {};
  try {
    cache = JSON.parse(localStorage.getItem(VIDEO_CACHE) || '{}');
  } catch {}
  if (cache[song.id]) return cache[song.id];

  const api = 'https://www.googleapis.com/youtube/v3';
  const q = encodeURIComponent(`${song.artist} ${clean(song.title)}`);
  const found = await getJSON(`${api}/search?part=id&type=video&videoEmbeddable=true&maxResults=15&q=${q}&key=${key}`);
  const ids = found.items.map((i) => i.id.videoId).filter(Boolean);
  if (!ids.length) return [];
  const details = await getJSON(`${api}/videos?part=snippet,contentDetails&id=${ids.join(',')}&key=${key}`);
  const videos = details.items.map((v) => ({
    id: v.id,
    title: v.snippet.title,
    channel: v.snippet.channelTitle,
    // "Topic" channels carry the label's own studio audio, exactly as released.
    studio: / - Topic$/.test(v.snippet.channelTitle) || /^Provided to YouTube by/.test(v.snippet.description || ''),
    duration: isoSeconds(v.contentDetails.duration),
  }));
  cache[song.id] = videos;
  try {
    localStorage.setItem(VIDEO_CACHE, JSON.stringify(cache));
  } catch {}
  return videos;
}

// ---- matching ----

const OFF_VERSION = /\b(live|cover|karaoke|instrumental|remix|reaction|lesson|tutorial|sped up|slowed|nightcore|8d|acoustic|concert|tribute|drum|guitar|piano|bass)\b/i;

function videoPenalty(video, song) {
  let p = video.studio ? 0 : 2;
  const title = norm(video.title);
  if (!title.includes(norm(clean(song.title)))) p += 40;
  const odd = OFF_VERSION.exec(video.title);
  if (odd && !new RegExp(`\\b${odd[1]}\\b`, 'i').test(song.title)) p += 40;
  if (song.duration) p += Math.min(20, Math.abs(video.duration - song.duration)) * 0.3;
  return p;
}

const nearest = (lyrics, duration) =>
  lyrics.reduce((best, l) => (Math.abs(l.duration - duration) < Math.abs(best.duration - duration) ? l : best));

// Pairs each video with the lyrics whose length is closest to it, best pair first.
// Lyrics are timed against one specific recording, and matching lengths is the best
// available sign that the audio and the lyrics are that same recording.
export function rankPairs(song, videos, lyrics) {
  if (!lyrics.length) return [];
  if (!videos.length) return [{ video: null, lyrics: nearest(lyrics, song.duration), diff: null }];
  return videos
    .map((video) => {
      const l = nearest(lyrics, video.duration);
      const diff = Math.abs(l.duration - video.duration);
      return { video, lyrics: l, diff, cost: videoPenalty(video, song) + Math.min(diff, 60) };
    })
    .filter((c) => c.cost < 40)
    .sort((a, b) => a.cost - b.cost);
}
