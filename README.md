# Song Pics

Play a song and see each word as a picture, in time with the music.

## Run it

```
npm start        # serves the folder at http://localhost:5173
```

No build step: it is plain HTML, CSS and JavaScript modules, so any static host works.

## How it works

- **Pick a song**: the search uses the iTunes catalogue (free, no key).
- **Lyrics** come from [LRCLIB](https://lrclib.net), a free database of time-synced lyrics.
- **Audio** is found on YouTube and played in its embedded player. The search uses the YouTube Data API key in `js/config.js` (a different key can be set per browser under Settings). You can also give a YouTube link or audio file under "Other ways to play".
- **Version matching** (`js/finder.js`): lyrics are timed against one specific recording, so the app pairs the video and the lyrics whose lengths agree, preferring the label's studio audio ("Topic" channels) and skipping live versions, covers and the like. If the lengths disagree it says so; "Other version" tries the next pairing and "Tap sync" snaps the lyrics to the moment you tap.
- **Word timing**: synced lyrics are timed per line, so each word's time is estimated by spreading the line across its syllables.
- **Pictures** (`js/visuals.js`): each word looks for a real photo in the catalogue first, then a hand-picked emoji, then one of about 4,000 emoji matched by name. Small glue words ("the", "of") keep the previous picture on screen. A song's photos are loaded before its words are sung.

- **Words view** (`js/wordsview.js`): the "View" button switches from pictures to a lyrics-only view, and "Style" cycles through Stack, Typewriter, One word and Lines. Text builds up with the song and clears when the screen is full. Both choices are remembered.

## The picture catalogue

- `data/word-freq.json` ranks the words used in about 3,000 well-known songs (`npm run build:words`).
- `scripts/concepts.mjs` is the catalogue itself: one line per picture, listing the words it illustrates and the Wikipedia article whose lead photo to use. Add or change lines here.
- `npm run build:catalog` fetches each photo from Wikimedia, saves a resized copy in `pictures/`, and writes `data/catalog.json`. Existing files are kept; delete a file in `pictures/` to refetch it.
- Photos come from Wikimedia Commons under their respective free licences. Each picture's "photo credit" link in the app opens its source page with author and licence.

## Develop

```
npm install
npm run build:emoji   # regenerate data/emoji.json
npm run build:catalog # fetch new catalogue photos
npm test
```
