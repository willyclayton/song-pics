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
- **Audio** is found on YouTube and played in its embedded player. This needs a free YouTube Data API key, entered once under Settings or committed in `js/config.js`. Without one the pictures run silently, or you can give a YouTube link or audio file under "Other ways to play".
- **Version matching** (`js/finder.js`): lyrics are timed against one specific recording, so the app pairs the video and the lyrics whose lengths agree, preferring the label's studio audio ("Topic" channels) and skipping live versions, covers and the like. If the lengths disagree it says so; "Other version" tries the next pairing and "Tap sync" snaps the lyrics to the moment you tap.
- **Word timing**: synced lyrics are timed per line, so each word's time is estimated by spreading the line across its syllables.
- **Pictures** (`js/visuals.js`): a hand-picked list for the most common song words, then about 4,000 words generated from emoji names and keywords (`data/emoji.json`). The optional Photos switch looks words up on Wikimedia Commons instead.

## Develop

```
npm install
npm run build:emoji   # regenerate data/emoji.json
npm test
```
