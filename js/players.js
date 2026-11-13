// Audio sources. Each exposes: time, playing, duration, play(), pause(), seek(t), destroy().

// No audio at all: a plain stopwatch, used for the demo and for lyrics-only playback.
export class TimerSource {
  constructor(duration = null) {
    this.duration = duration;
    this.base = 0;
    this.startedAt = null;
  }
  get playing() {
    return this.startedAt !== null;
  }
  get time() {
    return this.base + (this.playing ? (performance.now() - this.startedAt) / 1000 : 0);
  }
  play() {
    if (!this.playing) this.startedAt = performance.now();
  }
  pause() {
    this.base = this.time;
    this.startedAt = null;
  }
  seek(t) {
    this.base = t;
    if (this.playing) this.startedAt = performance.now();
  }
  destroy() {}
}

// An audio file from the user's own device.
export class FileSource {
  constructor(file) {
    this.url = URL.createObjectURL(file);
    this.el = new Audio(this.url);
  }
  get playing() {
    return !this.el.paused && !this.el.ended;
  }
  get time() {
    return this.el.currentTime;
  }
  get duration() {
    return Number.isFinite(this.el.duration) ? this.el.duration : null;
  }
  play() {
    return this.el.play();
  }
  pause() {
    this.el.pause();
  }
  seek(t) {
    this.el.currentTime = t;
  }
  destroy() {
    this.el.pause();
    URL.revokeObjectURL(this.url);
  }
}

export function youTubeId(input) {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1, 12) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

let ytApi;
function loadYouTubeApi() {
  ytApi ??= new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => reject(new Error('Could not load the YouTube player'));
    document.head.append(s);
  });
  return ytApi;
}

// The official embedded YouTube player: the song streams from YouTube, nothing is downloaded.
export class YouTubeSource {
  constructor(videoId, mount, onError) {
    this.mount = mount;
    this.lastValue = 0;
    this.lastStamp = performance.now();
    this.state = -1;
    this.ready = loadYouTubeApi().then(
      (YT) =>
        new Promise((resolve, reject) => {
          const holder = document.createElement('div');
          mount.replaceChildren(holder);
          this.player = new YT.Player(holder, {
            videoId,
            width: 200,
            height: 113,
            playerVars: { playsinline: 1, rel: 0 },
            events: {
              onReady: () => resolve(),
              onStateChange: (e) => (this.state = e.data),
              onError: (e) => {
                const err = new Error(`YouTube can't play this video here (error ${e.data}).`);
                reject(err);
                onError?.(err); // embedding blocks only show up once playback starts
              },
            },
          });
        }),
    );
  }
  get playing() {
    return this.state === 1;
  }
  // YouTube only refreshes its reported time a few times a second, so interpolate in between.
  get time() {
    const v = this.player?.getCurrentTime?.() ?? 0;
    const now = performance.now();
    if (v !== this.lastValue) {
      this.lastValue = v;
      this.lastStamp = now;
    }
    return this.playing ? v + Math.min(0.5, (now - this.lastStamp) / 1000) : v;
  }
  get duration() {
    return this.player?.getDuration?.() || null;
  }
  play() {
    this.player?.playVideo();
  }
  pause() {
    this.player?.pauseVideo();
  }
  seek(t) {
    this.player?.seekTo(t, true);
  }
  destroy() {
    this.player?.destroy?.();
    this.mount.replaceChildren();
  }
}
