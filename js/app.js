import { parseLRC, buildWords, wordAt } from './lyrics.js';
import { TimerSource, FileSource, YouTubeSource, youTubeId } from './players.js';
import { loadPictures, pictureFor, readyPhoto, preloadPhotos, lookUpPhotos } from './visuals.js';
import { WordsView, STYLES, STYLE_NAMES } from './wordsview.js';
import { searchSongs, findLyrics, findVideos, rankPairs, youTubeKey } from './finder.js';

const $ = (id) => document.getElementById(id);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids);
  return node;
};

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
let scenes = []; // [{ start, photo }] in time order
let sceneIdx = -2;
let scrubbing = false;
let candidates = []; // ranked { video, lyrics, diff } pairs for the chosen song
let candidateIdx = 0;
const view = new WordsView($('wordsView'));
let loadId = 0; // guards against a slow lookup finishing after a newer one started

// ---------- stage ----------

function showIdle(text = '') {
  $('word').textContent = '';
  $('line').textContent = text;
}

// ---------- scenes: the photo track ----------
// Photos don't flip on every word. Each line of the song is planned as a short sequence of
// scenes: it opens on its first picturable word's photo and moves on at each later one, each
// held for a minimum time so nothing flashes by. Scenes cross-fade and drift slowly, so the pictures read
// as a continuous story while the caption carries the individual words.

const MIN_HOLD = 1.1; // seconds a scene stays before another may replace it
const LEAD = 0.25; // start fading in this long before the word, so it lands on the word

function buildScenes() {
  const plan = [];
  lines.forEach((line) => {
    if (line.first === undefined) return;
    let opened = false;
    for (let i = line.first; i <= line.last; i++) {
      const pic = pictureFor(words[i].key);
      if (pic.kind !== 'photo') continue;
      // A line's first photo arrives as the line begins; later ones arrive with their word.
      const wanted = (opened ? words[i].start : words[line.first].start) - LEAD;
      const prev = plan.at(-1);
      opened = true;
      if (prev && prev.photo.src === pic.photo.src) continue;
      // Wait out the previous scene's minimum hold; skip this photo if its word would be over by then.
      const start = prev ? Math.max(wanted, prev.start + MIN_HOLD) : wanted;
      if (start > words[i].end) continue;
      plan.push({ start, photo: pic.photo });
    }
  });
  scenes = plan;
  sceneIdx = -2;
}

function sceneAt(t) {
  let lo = 0;
  let hi = scenes.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (scenes[mid].start <= t) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}

let front = 0; // which of the two stacked layers is showing
function showScene(scene) {
  const img = readyPhoto(scene.photo);
  if (!img) return false; // still downloading: stay on the current scene and retry next frame
  const layers = [$('layerA'), $('layerB')];
  if (layers[front].firstChild !== img) {
    front = 1 - front;
    layers[front].replaceChildren(img); // re-inserting restarts the slow drift
    layers[front].classList.add('on');
    layers[1 - front].classList.remove('on');
  }
  $('credit').href = scene.photo.credit;
  $('credit').hidden = false;
  return true;
}

function renderLine(lineIdx, wordIdx) {
  const line = lines[lineIdx];
  const frag = document.createDocumentFragment();
  for (let i = line.first; i <= line.last; i++) {
    frag.append(el('span', { textContent: words[i].text + ' ', className: i < wordIdx ? 'past' : i === wordIdx ? 'now' : '' }));
  }
  $('line').replaceChildren(frag);
}

function showWord(idx) {
  const w = words[idx];
  const pic = pictureFor(w.key);
  const shown = w.text.replace(/^[^\w']+|[^\w'!?]+$/g, '');
  // Words with no photo of their own get a small emoji accent in the caption when one fits.
  $('word').textContent = pic.kind === 'text' && pic.emoji && shown.length > 3 ? `${pic.emoji} ${shown}` : shown;
  renderLine(w.line, idx);
}

function tick() {
  const t = source.time;
  const idx = wordAt(words, t - offset);
  if (wordsMode) view.update(words, lines, idx, t - offset);
  else {
    const sc = sceneAt(t - offset);
    if (sc !== sceneIdx && sc >= 0 && showScene(scenes[sc])) sceneIdx = sc;
  }
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

// ---------- view: pictures or words ----------

const saved = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

let wordsMode = false;
function setMode(words_) {
  wordsMode = words_;
  document.body.classList.toggle('words-mode', wordsMode);
  $('mode').textContent = wordsMode ? 'View: Words' : 'View: Pictures';
  $('style').hidden = !wordsMode;
  save('songpics.mode', wordsMode ? 'words' : 'pictures');
  view.reset();
  sceneIdx = -2;
  if (!wordsMode) loadPhotos();
}
function setStyle(style) {
  view.setStyle(style);
  $('style').textContent = `Style: ${STYLE_NAMES[view.style]}`;
  save('songpics.style', view.style);
}
$('mode').onclick = () => setMode(!wordsMode);
$('style').onclick = () => setStyle(STYLES[(STYLES.indexOf(view.style) + 1) % STYLES.length]);

// Photos are only fetched when the pictures view is in use.
function loadPhotos() {
  if (!words.length) return;
  const keys = words.map((w) => w.key);
  preloadPhotos(keys);
  lookUpPhotos(keys).then(() => {
    buildScenes(); // rare words that just got photos join the plan
    preloadPhotos(keys);
  });
}

function setOffset(value) {
  offset = Math.round(value * 100) / 100;
  $('offset').textContent = `sync ${offset > 0 ? '+' : ''}${offset.toFixed(1)}s`;
  current = -2;
  view.reset();
}

$('playBtn').onclick = () => (source.playing ? source.pause() : source.play());
$('seek').oninput = () => (scrubbing = true);
$('seek').onchange = () => {
  source.seek(Number($('seek').value));
  scrubbing = false;
};
$('earlier').onclick = () => setOffset(offset - 0.1);
$('later').onclick = () => setOffset(offset + 0.1);

// Tap as a line starts being sung: the nearest lyric line snaps to this moment.
$('tap').onclick = () => {
  if (!lines.length) return;
  const t = source.time;
  const near = lines.reduce((a, b) => (Math.abs(b.time + offset - t) < Math.abs(a.time + offset - t) ? b : a));
  setOffset(t - near.time);
};
// Tapping the picture hides or shows the controls, for a true full-screen view.
$('stage').onclick = () => $('bar').classList.toggle('tucked');
$('change').onclick = () => {
  source.pause();
  $('setup').showModal();
};
$('next').onclick = () => playCandidate(candidateIdx + 1);
document.addEventListener('keydown', (e) => {
  if ($('setup').open || e.target.matches('input, textarea, button')) return;
  if (e.code === 'Space') {
    e.preventDefault();
    $('playBtn').click();
  }
  if (e.key === '[') setOffset(offset - 0.1);
  if (e.key === ']') setOffset(offset + 0.1);
  if (e.key === 't') $('tap').click();
});

// ---------- loading a song ----------

const status = (msg, isError = false) => {
  $('status').textContent = msg;
  $('status').classList.toggle('error', isError);
};
const notice = (msg) => {
  $('notice').textContent = msg;
  $('notice').hidden = !msg;
};

async function begin(lrc, makeSource) {
  const parsed = parseLRC(lrc);
  const built = buildWords(parsed);
  if (!built.length) throw new Error('Those lyrics have no timestamps.');
  const next = makeSource();
  if (next.ready) await next.ready;
  source.destroy();
  source = next;
  lines = parsed;
  words = built;
  setOffset(0);
  for (const id of ['layerA', 'layerB']) $(id).classList.remove('on'); // fade out the last song's photo
  $('credit').hidden = true;
  view.reset();
  buildScenes();
  if (!wordsMode) loadPhotos();
  $('bar').hidden = false;
  $('setup').close();
  await source.play()?.catch?.(() => {}); // autoplay may be blocked; the play button still works
}

// Plays one ranked lyrics+video pair, moving on to the next if YouTube refuses to embed it.
async function playCandidate(i) {
  if (!candidates.length) return;
  candidateIdx = i % candidates.length;
  const c = candidates[candidateIdx];
  const mine = loadId;
  const skip = () => {
    if (mine !== loadId) return;
    if (candidateIdx + 1 < candidates.length) playCandidate(candidateIdx + 1);
    else notice("YouTube won't let any version of this song play on other sites. Use Change song → Other ways to play.");
  };
  try {
    await begin(c.lyrics.lrc, () => new YouTubeSource(c.video.id, $('yt'), skip));
  } catch (err) {
    return; // skip() already ran from the player's error event
  }
  $('next').hidden = candidates.length < 2;
  $('match').textContent = `${c.video.channel} · audio ${fmt(c.video.duration)} · lyrics ${fmt(c.lyrics.duration)}`;
  notice(
    c.diff > 3
      ? `This audio and the lyrics differ by ${Math.round(c.diff)}s, so they are probably different recordings and the timing may drift. Try "Other version" or "Tap sync".`
      : '',
  );
}

async function playSong(song) {
  const mine = ++loadId;
  try {
    status(`Finding lyrics for ${song.title}…`);
    const lyrics = await findLyrics(song);
    if (mine !== loadId) return;
    if (!lyrics.length) return status(`No timed lyrics exist yet for "${song.title}". Try another version of it from the list.`, true);

    // A link or file given under "Other ways to play" overrides the automatic audio.
    const url = $('ytUrl').value.trim();
    const file = $('file').files[0];
    const key = youTubeKey();
    let videos = [];
    if (url && !youTubeId(url)) return status("That doesn't look like a YouTube link.", true);
    if (!url && !file && key) {
      status('Finding the matching audio…');
      try {
        videos = await findVideos(song, key);
      } catch (err) {
        notice(`Couldn't search YouTube: ${err.message}`);
      }
      if (mine !== loadId) return;
    }

    candidates = rankPairs(song, videos, lyrics);
    $('next').hidden = true;
    $('match').textContent = `${song.title} — ${song.artist}`;
    status('');
    if (candidates[0]?.video) return playCandidate(0);

    // No automatic audio: use the user's own, or run silently on a timer.
    const best = rankPairs(song, [], lyrics)[0].lyrics;
    candidates = [];
    await begin(best.lrc, () => (url ? new YouTubeSource(youTubeId(url), $('yt')) : file ? new FileSource(file) : new TimerSource()));
    if (!url && !file && !$('notice').textContent) {
      notice(key ? 'No playable YouTube audio found for this song, so it is running silently.' : 'Running silently. No YouTube key is set, so there is no audio.');
    } else if (url || file) notice('');
  } catch (err) {
    if (mine === loadId) status(err.message, true);
  }
}

// ---------- setup dialog ----------

$('searchForm').onsubmit = async (e) => {
  e.preventDefault();
  const list = $('results');
  status('Searching…');
  try {
    const songs = await searchSongs($('query').value);
    status(songs.length ? '' : 'No songs found. Try adding the artist.');
    list.replaceChildren(
      ...songs.map((song) => {
        const btn = el(
          'button',
          { type: 'button' },
          el('img', { src: song.art, alt: '', width: 40, height: 40 }),
          el('span', {}, el('b', { textContent: song.title }), el('small', { textContent: `${song.artist} · ${song.album}` })),
          el('small', { textContent: fmt(song.duration) }),
        );
        btn.onclick = () => playSong(song);
        return el('li', {}, btn);
      }),
    );
  } catch (err) {
    list.replaceChildren();
    status(`Song search failed: ${err.message}. Check your connection and try again.`, true);
  }
};

$('playLrc').onclick = async () => {
  try {
    loadId++;
    const url = $('ytUrl').value.trim();
    const file = $('file').files[0];
    if (url && !youTubeId(url)) throw new Error("That doesn't look like a YouTube link.");
    candidates = [];
    $('next').hidden = true;
    $('match').textContent = '';
    notice('');
    await begin($('lrcText').value, () => (url ? new YouTubeSource(youTubeId(url), $('yt')) : file ? new FileSource(file) : new TimerSource()));
  } catch (err) {
    status(err.message, true);
  }
};

$('ytKey').value = localStorage.getItem('songpics.ytkey') || '';
$('ytKey').onchange = () => localStorage.setItem('songpics.ytkey', $('ytKey').value.trim());

$('demo').onclick = () => {
  loadId++;
  candidates = [];
  $('next').hidden = true;
  $('match').textContent = 'Demo song';
  notice('');
  begin(DEMO_LRC, () => new TimerSource());
};

await loadPictures();
setStyle(saved('songpics.style', 'stack'));
setMode(saved('songpics.mode', 'pictures') === 'words');
$('setup').showModal();
requestAnimationFrame(tick);
