import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLRC, buildWords, wordAt, syllables } from '../js/lyrics.js';
import { youTubeId } from '../js/players.js';

test('parses LRC lines, metadata and repeated stamps', () => {
  const lines = parseLRC('[ar:Someone]\n[00:10.00][01:00.50] hello there\n[00:05.5] first\nno stamp');
  assert.deepEqual(lines.map((l) => [l.time, l.text]), [[5.5, 'first'], [10, 'hello there'], [60.5, 'hello there']]);
});

test('spreads words across a line by syllables, inside the gap', () => {
  const words = buildWords(parseLRC('[00:00.00] I am sailing away\n[00:03.00] home'));
  assert.equal(words.length, 5);
  assert.equal(words[0].start, 0);
  assert.ok(words[3].end <= 3);
  assert.ok(words[2].end - words[2].start > words[0].end - words[0].start);
  assert.equal(words[wordAt(words, 3.1)].key, 'home');
  assert.equal(wordAt(words, -1), -1);
});

test('uses word stamps from enhanced LRC', () => {
  const words = buildWords(parseLRC('[00:01.00] <00:01.00> sail <00:02.50> away'));
  assert.deepEqual(words.map((w) => [w.key, w.start]), [['sail', 1], ['away', 2.5]]);
});

test('syllables and YouTube ids', () => {
  assert.equal(syllables('sailing'), 2);
  assert.equal(syllables('me'), 1);
  assert.equal(youTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3'), 'dQw4w9WgXcQ');
  assert.equal(youTubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(youTubeId('nope'), null);
});
