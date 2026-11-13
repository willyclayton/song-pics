import { searchLyrics, parseLRC, buildWords, wordAt } from './lyrics.js';
import { TimerSource, FileSource, YouTubeSource, youTubeId } from './players.js';
import { loadEmoji, pictureFor, cachedPhoto, prefetchPhotos } from './visuals.js';

const $ = (id) => document.getElementById(id);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// An original little song so the app can be tried without looking anything up.
const DEMO_LRC = `[00:01.00] I am sailing away on a boat
[00:05.00] Over the ocean under the moon and stars
[00:09.50] You and me dancing in the rain
[00:13.50] My heart is on fire tonight
[00:17.50] Fly little bird fly home
[00:21.00] We sing this song forever`;

let lines = [];
let words = [];
let source = new TimerSource();
let offset = 0; // seconds; positive = lyrics later
let current = -2;
let pickedLrc = null;
let scrubbing = false;

// ---------- stage ----------

function showIdle(text = '') {
  $('picture').textContent = text ? '🎵' : '';
  $('word').textContent = '';
  $('word').classList.remove('solo');
  $('line').textContent = text;
}

function renderLine(lineIdx, wordIdx) {
  const line = lines[lineIdx];
  const frag = document.createDocumentFragment();
  for (let i = line.first; i <= line.last; i++) {
    const span = document.createElement('span');
    span.textContent = words[i].text + ' ';
    if (i < wordIdx) span.className = 'past';
    if (i === wordIdx) span.className = 'now';
    frag.append(span);
  }
  $('line').replaceChildren(frag);
}

function showWord(idx) {
  const w = words[idx];
  const pic = pictureFor(w.key);
  const photo = $('photos').checked && !pic.skip ? cachedPhoto(w.key) : null;
  const box = $('picture');

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.alt = w.key;
    img.onerror = () => img.replaceWith(pic.emoji ?? '');
    box.replaceChildren(img);
  } else {
    box.textContent = pic.emoji ?? '';
  }
  box.classList.remove('pop');
  void box.offsetWidth; // restart the animation
  box.classList.add('pop');

  $('word').textContent = w.text.replace(/^[^\w']+|[^\w'!?]+$/g, '');
  $('word').classList.toggle('solo', !photo && !pic.emoji);
  renderLine(w.line, idx);
}

function tick() {
  const t = source.time;
  const idx = wordAt(words, t - offset);
  if (idx !== current) {
    current = idx;
    if (idx >= 0) showWord(idx);
    else if (words.length && t - offset < words[0].start) showIdle('Get ready…');
    else if (words.length && t - offset >= words.at(-1).end) showIdle('');
    // between words: leave the last picture up
  }
  const duration = source.duration ?? (words.length ? words.at(-1).end + 3 : 0);
  if (!scrubbing) {
    $('seek').max = duration;
    $('seek').value = t;
  }
  $('clock').textContent = fmt(t);
  $('playBtn').textContent = source.playing ? '⏸' : '▶';
  $('playBtn').setAttribute('aria-label', source.playing ? 'Pause' : 'Play');
  if (source instanceof TimerSource && source.playing && t > duration) source.pause();
  requestAnimationFrame(tick);
}

// ---------- controls ----------

$('playBtn').onclick = () => (source.playing ? source.pause() : source.play());
$('seek').oninput = () => (scrubbing = true);
$('seek').onchange = () => {
  source.seek(Number($('seek').value));
  scrubbing = false;
};
const nudge = (d) => {
  offset = Math.round((offset + d) * 10) / 10;
  $('offset').textContent = `sync ${offset > 0 ? '+' : ''}${offset.toFixed(1)}s`;
  current = -2;
};
$('earlier').onclick = () => nudge(-0.1);
$('later').onclick = () => nudge(0.1);
$('photos').onchange = () => {
  if ($('photos').checked) prefetchPhotos(words.map((w) => w.key));
  current = -2;
};
$('change').onclick = () => {
  source.pause();
  $('setup').showModal();
};
document.addEventListener('keydown', (e) => {
  if ($('setup').open || e.target.matches('input, textarea, button')) return;
  if (e.code === 'Space') {
    e.preventDefault();
    $('playBtn').click();
  }
  if (e.key === '[') nudge(-0.1);
  if (e.key === ']') nudge(0.1);
});

// ---------- setup dialog ----------

$('searchForm').onsubmit = async (e) => {
  e.preventDefault();
  const list = $('results');
  $('error').textContent = '';
  list.replaceChildren(Object.assign(document.createElement('li'), { textContent: 'Searching…' }));
  try {
    const hits = await searchLyrics($('query').value);
    list.replaceChildren();
    if (!hits.length) list.append(Object.assign(document.createElement('li'), { textContent: 'No timed lyrics found for that. Try adding the artist.' }));
    for (const hit of hits) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const name = document.createElement('span');
      name.textContent = `${hit.title} — ${hit.artist}`;
      const meta = document.createElement('small');
      meta.textContent = fmt(hit.duration || 0);
      btn.append(name, meta);
      btn.onclick = () => {
        pickedLrc = hit.lrc;
        $('lrcText').value = '';
        list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
        $('picked').textContent = `Lyrics: ${hit.title} — ${hit.artist}`;
      };
      const li = document.createElement('li');
      li.append(btn);
      list.append(li);
    }
  } catch (err) {
    list.replaceChildren();
    $('error').textContent = `${err.message}. Check your connection and try again.`;
  }
};

async function begin(lrc, makeSource) {
  const parsed = parseLRC(lrc);
  const built = buildWords(parsed);
  if (!built.length) throw new Error('Those lyrics have no timestamps. Pick a search result or paste .lrc text.');
  const next = makeSource();
  if (next.ready) await next.ready;
  source.destroy();
  source = next;
  lines = parsed;
  words = built;
  current = -2;
  offset = 0;
  nudge(0);
  if ($('photos').checked) prefetchPhotos(words.map((w) => w.key));
  $('bar').hidden = false;
  $('setup').close();
  await source.play()?.catch?.(() => {}); // autoplay may be blocked; the play button still works
}

$('start').onclick = async () => {
  $('error').textContent = '';
  try {
    const lrc = $('lrcText').value.trim() || pickedLrc;
    if (!lrc) throw new Error('Search for a song and pick a result first (or paste timed lyrics).');
    const url = $('ytUrl').value.trim();
    const file = $('file').files[0];
    const id = url ? youTubeId(url) : null;
    if (url && !id) throw new Error("That doesn't look like a YouTube link.");
    await begin(lrc, () => (id ? new YouTubeSource(id, $('yt')) : file ? new FileSource(file) : new TimerSource()));
  } catch (err) {
    $('error').textContent = err.message;
  }
};

$('demo').onclick = () => begin(DEMO_LRC, () => new TimerSource());

await loadEmoji();
$('setup').showModal();
requestAnimationFrame(tick);
