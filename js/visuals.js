// Word -> how to show it. See pictureFor() below.
//   data/catalog.json: real photos, chosen per word in scripts/concepts.mjs.
//   PICKS and data/emoji.json: emoji used as an accent beside words that have no photo.
//   SKIP: glue words with nothing to picture.

const PICKS = {
  // people
  i: '🙋', im: '🙋', "i'm": '🙋', "i'll": '🙋', "i've": '🙋', "i'd": '🙋', me: '🙋', my: '🙋', mine: '🙋', myself: '🙋',
  you: '🫵', your: '🫵', "you're": '🫵', "you'll": '🫵', "you've": '🫵', yours: '🫵', yourself: '🫵', ya: '🫵',
  we: '👥', us: '👥', our: '👥', "we're": '👥', "we'll": '👥', they: '👥', them: '👥', their: '👥', everybody: '👥', everyone: '👥', people: '👥', together: '🤝',
  he: '👨', him: '👨', his: '👨', "he's": '👨', she: '👩', her: '👩', "she's": '👩', boy: '👦', girl: '👧', woman: '👩', lady: '👩', mama: '👩', mother: '👩', papa: '👨', father: '👨', daddy: '👨', friend: '🧑‍🤝‍🧑', friends: '🧑‍🤝‍🧑', somebody: '🧍', someone: '🧍', nobody: '🚫', lover: '💑', stranger: '🕵️', child: '🧒', children: '🧒', kid: '🧒', kids: '🧒',
  // directions and places
  away: '↗️', up: '⬆️', down: '⬇️', back: '🔙', here: '📍', there: '👉', home: '🏠', far: '🔭', near: '📍', around: '🔄', over: '⤴️', under: '⤵️', through: '➡️', into: '📥', inside: '📥', out: '📤', outside: '🌳', on: '🔛', off: '📴', forward: '⏩', high: '⬆️', higher: '⬆️', low: '⬇️', left: '⬅️', right: '➡️', top: '🔝', end: '🔚', soon: '🔜', between: '↔️', across: '↔️', along: '➡️', where: '🗺️', somewhere: '🗺️', everywhere: '🌍', anywhere: '🗺️', nowhere: '🚫', world: '🌍', earth: '🌍', town: '🏘️', city: '🏙️', street: '🛣️', road: '🛣️', way: '🛣️', highway: '🛣️', place: '📍',
  // nature
  sea: '🌊', ocean: '🌊', wave: '🌊', waves: '🌊', water: '💧', river: '🏞️', sky: '🌤️', sun: '☀️', sunshine: '☀️', moon: '🌙', star: '⭐', stars: '✨', night: '🌙', tonight: '🌙', day: '🌞', today: '🌞', morning: '🌅', light: '💡', lights: '💡', dark: '🌑', darkness: '🌑', shadow: '👤', rain: '🌧️', storm: '⛈️', thunder: '⛈️', lightning: '⚡', snow: '❄️', wind: '🌬️', fire: '🔥', flame: '🔥', burn: '🔥', burning: '🔥', ice: '🧊', cold: '🥶', hot: '🥵', summer: '🏖️', winter: '❄️', spring: '🌱', fall: '🍂', mountain: '⛰️', hill: '⛰️', field: '🌾', fields: '🌾', garden: '🌷', flower: '🌸', rose: '🌹', tree: '🌳', air: '🌬️', ground: '🟫', land: '🏝️', shore: '🏖️', beach: '🏖️', desert: '🏜️', space: '🚀', heaven: '☁️', hell: '🔥', cloud: '☁️', clouds: '☁️', rainbow: '🌈',
  // feelings
  love: '❤️', loved: '❤️', loving: '❤️', heart: '❤️', hearts: '❤️', hate: '😠', happy: '😊', sad: '😢', cry: '😭', crying: '😭', tears: '😢', tear: '😢', smile: '😊', laugh: '😂', lonely: '🧍', alone: '🧍', afraid: '😨', fear: '😨', scared: '😨', mad: '😡', angry: '😡', crazy: '🤪', wild: '🐅', free: '🕊️', freedom: '🕊️', hope: '🤞', dream: '💭', dreams: '💭', dreaming: '💭', pain: '🤕', hurt: '🤕', broken: '💔', break: '💔', soul: '👻', mind: '🧠', think: '🤔', thinking: '🤔', thought: '💭', know: '🧠', feel: '🫀', feeling: '🫀', want: '🤲', need: '🤲', wish: '🌠', believe: '🙏', pray: '🙏', sorry: '🙇', good: '👍', bad: '👎', better: '👍', best: '🏆', beautiful: '🌹', pretty: '🌹', sweet: '🍬', cool: '😎', tired: '😴', kiss: '💋', hug: '🤗', miss: '🥺', peace: '☮️', war: '⚔️', god: '🙏', lord: '🙏', angel: '👼', devil: '😈', magic: '✨',
  // actions
  sail: '⛵', sailing: '⛵', boat: '⛵', fly: '🕊️', flying: '🕊️', run: '🏃', running: '🏃', walk: '🚶', walking: '🚶', go: '🚦', going: '🚶', gone: '💨', come: '🫴', coming: '🫴', leave: '🚪', leaving: '🚪', stay: '🛑', stop: '🛑', wait: '⏳', waiting: '⏳', dance: '💃', dancing: '💃', sing: '🎤', singing: '🎤', song: '🎵', songs: '🎵', music: '🎶', play: '▶️', hear: '👂', listen: '👂', see: '👀', look: '👀', looking: '👀', watch: '👀', eyes: '👀', eye: '👁️', say: '💬', said: '💬', tell: '💬', talk: '💬', call: '📞', hold: '🤝', touch: '👆', take: '🫳', give: '🎁', get: '🫳', gather: '🧺', find: '🔍', lose: '📉', lost: '🧭', search: '🔍', try: '💪', fight: '🥊', win: '🏆', fall_down: '🍂', rise: '🌅', stand: '🧍', sit: '🪑', sleep: '😴', wake: '⏰', live: '🌱', life: '🌱', alive: '🌱', die: '💀', dead: '💀', death: '💀', kill: '🗡️', born: '👶', grow: '🌱', drive: '🚗', ride: '🏇', turn: '↩️', carry: '🎒', carried: '🎒', climb: '🧗', swim: '🏊', drink: '🥤', eat: '🍽️', work: '🛠️', remember: '🧠', forget: '🌫️', change: '🔁', begin: '🏁', start: '🏁', open: '🔓', close: '🔒', shine: '✨', show: '🎭', make: '🔨', build: '🏗️', write: '✍️', read: '📖', learn: '📚', follow: '👣', lead: '🧭', save: '🛟', help: '🆘', let: '🤲', keep: '🔐', bring: '📦',
  // things and time
  ship: '🚢', starship: '🚀', starships: '🚀', car: '🚗', train: '🚂', plane: '✈️', door: '🚪', window: '🪟', house: '🏠', room: '🛏️', bed: '🛏️', phone: '📱', money: '💰', gold: '🥇', gun: '🔫', guitar: '🎸', drum: '🥁', radio: '📻', book: '📖', letter: '✉️', picture: '🖼️', photograph: '📷', ring: '💍', crown: '👑', king: '🤴', queen: '👸', wine: '🍷', whiskey: '🥃', cigarette: '🚬', hand: '✋', hands: '🙌', arms: '💪', face: '🙂', head: '🗣️', feet: '🦶', body: '🧍', blood: '🩸', bones: '🦴', hair: '💇', wings: '🪽', wing: '🪽', bird: '🐦', dog: '🐕', horse: '🐎', time: '⏰', times: '⏰', now: '⏱️', forever: '♾️', always: '♾️', never: '🚫', no: '🚫', not: '🚫', "don't": '🚫', "can't": '🚫', "won't": '🚫', yes: '✅', yeah: '🙌', oh: '😮', ooh: '😮', ah: '😮', hey: '👋', hello: '👋', goodbye: '👋', bye: '👋', tomorrow: '📅', yesterday: '📆', year: '📅', years: '📅', old: '👴', young: '🧒', new: '🆕', little: '🤏', small: '🤏', big: '🐘', long: '📏', one: '1️⃣', two: '2️⃣', three: '3️⃣', all: '💯', every: '💯', everything: '💯', nothing: '🕳️', more: '➕', again: '🔁', only: '☝️', virgin: '🌊', memory: '🧠', memories: '🧠', childhood: '🧸', question: '❓', why: '❓', what: '❓', who: '❓', how: '❓', when: '❓', true: '✅', truth: '✅', lie: '🤥', lies: '🤥', secret: '🤫', name: '📛', word: '💬', words: '💬', story: '📖', game: '🎲', party: '🎉', baby: '👶',
};

const SKIP = new Set(
  `a an the and or but if of to in at by for with from as is am are was were be been being it its it's
   this that these those so than then too very just do does did has have had will would shall should can
   could may might must there's that's what's let's 'cause cause because about while though although some any
   such each both either which whom whose also still even ever yet got gonna wanna gotta ain't isn't wasn't
   aren't don doesn't didn't couldn't wouldn't shouldn't la na da mm hmm uh`.split(/\s+/),
);

let emoji = {};
let catalog = { images: [], words: {} };
let common = new Set(); // the 2,500 most-used lyric words; ones without a catalogue photo are "idea" words
export async function loadPictures() {
  const [e, c, w] = await Promise.all(['data/emoji.json', 'data/catalog.json', 'data/common-words.json'].map((u) => fetch(u).then((r) => r.json())));
  emoji = e;
  catalog = c;
  common = new Set(w);
}

function stems(k) {
  const out = [k];
  const add = (s) => s.length > 1 && out.push(s);
  if (k.endsWith("in'")) add(k.slice(0, -1) + 'g');
  const bare = k.replace(/'(s|ll|ve|re|d)$/, '').replace(/'/g, '');
  add(bare);
  for (const w of [bare, k.endsWith("in'") ? k.slice(0, -1) + 'g' : null]) {
    if (!w) continue;
    if (w.endsWith('ies')) add(w.slice(0, -3) + 'y');
    if (w.endsWith('es')) add(w.slice(0, -2));
    if (w.endsWith('s')) add(w.slice(0, -1));
    for (const suf of ['ing', 'ed', 'er', 'est', 'ly']) {
      if (!w.endsWith(suf) || w.length - suf.length < 3) continue;
      const base = w.slice(0, -suf.length);
      add(base);
      add(base + 'e');
      if (base.at(-1) === base.at(-2)) add(base.slice(0, -1));
    }
  }
  return out;
}

// How a word is shown:
//   kind 'photo' - full-screen photo (from the catalogue, or looked up for this song)
//   kind 'text'  - an idea word with no photo: shown as big text, with `emoji` as an accent if any
//   kind 'glue'  - a small connecting word: only the caption changes
export function pictureFor(key) {
  const forms = stems(key);
  const hit = forms.find((s) => Object.hasOwn(catalog.words, s));
  if (hit) {
    const image = catalog.images[catalog.words[hit]];
    return { kind: 'photo', photo: { src: image.src, credit: image.credit } };
  }
  if (forms.some((s) => SKIP.has(s))) return { kind: 'glue' };
  const found = forms.map((s) => lookedUp[s]).find(Boolean);
  if (found) return { kind: 'photo', photo: found };
  const pick = forms.find((s) => Object.hasOwn(PICKS, s));
  const generic = forms.find((s) => Object.hasOwn(emoji, s));
  return { kind: 'text', emoji: pick ? PICKS[pick] : generic ? emoji[generic] : undefined };
}

// ---- photos for rare words, looked up on Wikipedia when a song loads ----

const LOOKUP_KEY = 'songpics.lookup.v1';
let lookedUp = {}; // word -> { src, credit }, or 0 when Wikipedia has nothing usable
try {
  lookedUp = JSON.parse(localStorage.getItem(LOOKUP_KEY) || '{}');
} catch {}

// Common words were already decided by hand (photo or not), so only uncommon words are
// looked up: those are mostly concrete nouns, which is what an encyclopedia pictures well.
function worthLookingUp(key) {
  if (!/^[a-z]{4,}$/.test(key) || key in lookedUp) return false;
  const forms = stems(key);
  return !forms.some((s) => common.has(s) || SKIP.has(s) || Object.hasOwn(catalog.words, s));
}

export async function lookUpPhotos(keys) {
  const todo = [...new Set(keys)].filter(worthLookingUp).slice(0, 100);
  const width = Math.min(screen.width, screen.height) * (window.devicePixelRatio || 1) < 900 ? 500 : 960;
  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50);
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1' +
      `&prop=pageimages|pageprops&piprop=thumbnail|name&pilicense=free&pithumbsize=${width}&ppprop=disambiguation` +
      `&titles=${encodeURIComponent(batch.join('|'))}`;
    try {
      const { query } = await (await fetch(url)).json();
      const asked = {}; // final page title -> the word we asked about
      for (const n of query.normalized ?? []) asked[n.to] = n.from;
      for (const r of query.redirects ?? []) asked[r.to] = asked[r.from] ?? r.from;
      for (const w of batch) lookedUp[w] = 0;
      for (const page of query.pages ?? []) {
        const word = asked[page.title] ?? page.title;
        if (!page.thumbnail || page.pageprops?.disambiguation !== undefined || !(word in lookedUp)) continue;
        lookedUp[word] = {
          src: page.thumbnail.source.split('?')[0],
          credit: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage)}`,
        };
      }
    } catch {
      break; // offline or rate-limited: those words simply show as text this time
    }
  }
  try {
    localStorage.setItem(LOOKUP_KEY, JSON.stringify(lookedUp));
  } catch {}
}

// ---- photo loading ----

const loaded = new Map(); // src -> HTMLImageElement, kept so the browser holds the decoded photo

function load(src) {
  if (!loaded.has(src)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    loaded.set(src, img);
  }
  return loaded.get(src);
}

// The photo element for a word if it has finished loading, otherwise null (and starts loading it).
export function readyPhoto(photo) {
  const img = load(photo.src);
  return img.complete && img.naturalWidth ? img : null;
}

// Fetches every photo a song needs before its words are sung, in the order they appear.
export async function preloadPhotos(keys) {
  const todo = [...new Set(keys.map((k) => pictureFor(k).photo?.src).filter(Boolean))].filter((src) => !loaded.has(src));
  const one = (src) => new Promise((done) => {
    const img = load(src);
    if (img.complete) return done();
    img.onload = img.onerror = done;
  });
  await Promise.all(Array.from({ length: 4 }, async () => { while (todo.length) await one(todo.shift()); }));
}
