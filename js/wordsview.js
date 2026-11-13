// "Words" view: no pictures, just the lyrics set in type, building up in time with the song
// and clearing whenever the screen fills. Four styles:
//   stack      - one big word per row, piling down the screen
//   typewriter - lines typed out letter by letter
//   one        - a single huge word at a time
//   lines      - each line appears whole, with the sung word lit up

export const STYLES = ['stack', 'typewriter', 'one', 'lines'];
export const STYLE_NAMES = { stack: 'Stack', typewriter: 'Typewriter', one: 'One word', lines: 'Lines' };

const el = (cls, text = '') => Object.assign(document.createElement('span'), { className: cls, textContent: text });
const bare = (text) => text.replace(/^[^\w']+|[^\w'!?,.]+$/g, '');

export class WordsView {
  constructor(root) {
    this.root = root;
    this.setStyle('stack');
  }

  setStyle(style) {
    this.style = STYLES.includes(style) ? style : 'stack';
    this.root.dataset.style = this.style;
    this.reset();
  }

  reset() {
    this.page = 0; // first word (stack) or first line (typewriter, lines) on the current screen
    this.drawn = -2;
    this.typing = null;
    this.root.replaceChildren();
  }

  // Called every frame with the index of the word being sung (-1 between words) and the song time.
  update(words, lines, idx, t) {
    if (idx >= 0 && idx !== this.drawn) {
      this.drawn = idx;
      if (this.style === 'one') this.drawOne(words[idx]);
      else if (this.style === 'stack') this.drawStack(words, lines, idx);
      else this.drawFlow(words, lines, idx);
    }
    if (this.typing) this.type(idx === this.drawn ? t : Infinity);
  }

  full() {
    return this.root.scrollHeight > this.root.clientHeight + 1;
  }

  drawOne(word) {
    const text = bare(word.text);
    const span = el('w now new', text);
    span.style.fontSize = `min(24vh, ${(125 / Math.max(text.length, 3)).toFixed(1)}vw)`;
    this.root.replaceChildren(span);
  }

  drawStack(words, lines, idx) {
    const lineStart = lines[words[idx].line].first;
    if (idx < this.page) this.page = lineStart; // jumped backwards
    const build = () => {
      const rows = [];
      for (let i = this.page; i <= idx; i++) {
        const text = bare(words[i].text);
        const row = el(`w${i === idx ? ' now new' : ''}${i > this.page && i === lines[words[i].line].first ? ' gap' : ''}`, text);
        row.style.fontSize = `min(8.5vh, ${(125 / Math.max(text.length, 4)).toFixed(1)}vw)`;
        rows.push(row);
      }
      this.root.replaceChildren(...rows);
    };
    build();
    if (this.full()) {
      // Screen is full: wipe and start again, from the top of this line if that fits.
      this.page = lineStart > this.page ? lineStart : idx;
      build();
      if (this.full()) {
        this.page = idx;
        build();
      }
    }
  }

  drawFlow(words, lines, idx) {
    const cur = words[idx].line;
    if (cur < this.page) this.page = cur;
    const typewriter = this.style === 'typewriter';
    const build = () => {
      this.typing = null;
      const rows = [];
      for (let l = this.page; l <= cur; l++) {
        if (lines[l].first === undefined) continue;
        const row = el('row');
        for (let i = lines[l].first; i <= lines[l].last; i++) {
          // Words still to come are laid out but hidden, so the line never reflows as it fills in.
          const state = i < idx ? 'past' : i === idx ? 'now' : 'future';
          const span = el(`w ${state}`, words[i].text);
          if (typewriter && i === idx) this.typing = { span, word: words[i], shown: -1 };
          row.append(span, ' ');
        }
        rows.push(row);
      }
      this.root.replaceChildren(...rows);
    };
    build();
    if (this.full() && this.page < cur) {
      this.page = cur;
      build();
    }
  }

  // Reveals the current word letter by letter across the time it takes to sing it.
  type(t) {
    const { span, word } = this.typing;
    const text = word.text;
    const progress = (t - word.start) / Math.max(0.05, (word.end - word.start) * 0.8);
    const n = Math.max(1, Math.min(text.length, Math.ceil(progress * text.length)));
    if (n === this.typing.shown) return;
    this.typing.shown = n;
    span.replaceChildren(text.slice(0, n), el('cursor'), el('rest', text.slice(n)));
  }
}
