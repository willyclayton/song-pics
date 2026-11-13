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

import { rankPairs, isoSeconds } from '../js/finder.js';

test('pairs the studio video with lyrics of the same length', () => {
  const song = { title: 'Come Sail Away', artist: 'Styx', duration: 367 };
  const lyrics = [{ id: 1, duration: 361 }, { id: 2, duration: 367 }, { id: 3, duration: 186 }];
  const videos = [
    { id: 'mv', title: 'Styx - Come Sail Away (Official Video)', channel: 'StyxVEVO', studio: false, duration: 361 },
    { id: 'live', title: 'Styx - Come Sail Away (Live)', channel: 'Styx', studio: false, duration: 367 },
    { id: 'topic', title: 'Come Sail Away', channel: 'Styx - Topic', studio: true, duration: 367 },
    { id: 'other', title: 'Babe', channel: 'Styx - Topic', studio: true, duration: 367 },
  ];
  const ranked = rankPairs(song, videos, lyrics);
  assert.deepEqual(ranked.map((c) => c.video.id), ['topic', 'mv']);
  assert.equal(ranked[0].lyrics.id, 2);
  assert.equal(ranked[1].lyrics.id, 1);
  assert.equal(rankPairs(song, [], lyrics)[0].lyrics.id, 2);
  assert.equal(isoSeconds('PT6M7S'), 367);
  assert.equal(isoSeconds('PT1H2S'), 3602);
});
