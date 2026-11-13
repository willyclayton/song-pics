# Song Pics

Play a song and see each word as a picture, in time with the music.

## Run it

```
npm start        # serves the folder at http://localhost:5173
```

No build step: it is plain HTML, CSS and JavaScript modules, so any static host works.

## How it works

- **Lyrics** come from [LRCLIB](https://lrclib.net), a free database of time-synced lyrics. You can also paste your own `.lrc` text.
- **Word timing**: synced lyrics are timed per line, so each word's time is estimated by spreading the line across its syllables. Use the sync −/+ buttons (or `[` and `]`) to shift the lyrics if they run early or late.
- **Audio** is either the embedded YouTube player (paste a link), an audio file from your device, or no sound at all (timer only).
- **Pictures** (`js/visuals.js`): a hand-picked list for the most common song words, then about 4,000 words generated from emoji names and keywords (`data/emoji.json`). The optional Photos switch looks words up on Wikimedia Commons instead.

## Develop

```
npm install
npm run build:emoji   # regenerate data/emoji.json
npm test
```
