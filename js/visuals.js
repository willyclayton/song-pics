// Word -> picture. Three layers, first hit wins:
//   1. PICKS: hand-chosen pictures for words that show up in nearly every song.
//   2. data/emoji.json: ~4,000 words generated from emoji names and keywords.
//   3. (optional) a photo looked up on Wikimedia Commons, cached in the browser.
// Words in SKIP are glue words with nothing to picture; only the word itself is shown.

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
export async function loadEmoji() {
  emoji = await (await fetch('data/emoji.json')).json();
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

// Returns { emoji } for a word, { skip: true } for glue words, or {} when nothing matches.
export function pictureFor(key) {
  if (SKIP.has(key)) return { skip: true };
  for (const s of stems(key)) {
    if (Object.hasOwn(PICKS, s)) return { emoji: PICKS[s] };
  }
  for (const s of stems(key)) {
    if (SKIP.has(s)) return { skip: true };
    if (Object.hasOwn(emoji, s)) return { emoji: emoji[s] };
  }
  return {};
}

// ---- Optional photos (Wikimedia Commons: free to use, no API key) ----

const CACHE_KEY = 'songpics.photos.v1';
let photoCache = {};
try {
  photoCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
} catch {}
const pending = new Map();

export const cachedPhoto = (key) => photoCache[key] || null;

export function fetchPhoto(key) {
  if (key in photoCache) return Promise.resolve(photoCache[key]);
  if (pending.has(key)) return pending.get(key);
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    '&generator=search&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=640' +
    `&gsrsearch=${encodeURIComponent(`${key} filetype:bitmap`)}`;
  const p = fetch(url)
    .then((r) => r.json())
    .then((data) => {
      const page = Object.values(data.query?.pages ?? {})[0];
      const src = page?.imageinfo?.[0]?.thumburl ?? null;
      photoCache[key] = src;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(photoCache));
      } catch {}
      if (src) new Image().src = src; // warm the browser cache before the word is sung
      return src;
    })
    .catch(() => null)
    .finally(() => pending.delete(key));
  pending.set(key, p);
  return p;
}

// Looks up photos for every picturable word in a song ahead of time, a few at a time.
export async function prefetchPhotos(keys) {
  const todo = [...new Set(keys)].filter((k) => !pictureFor(k).skip && !(k in photoCache));
  const workers = Array.from({ length: 4 }, async () => {
    while (todo.length) await fetchPhoto(todo.shift());
  });
  await Promise.all(workers);
}
