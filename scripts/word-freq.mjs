// Research step: counts how often each word appears across a few thousand well-known songs
// (lyrics from LRCLIB) and writes data/word-freq.json, most common first.
// The photo catalogue (scripts/concepts.mjs) is prioritised from this list.
import { writeFileSync } from 'node:fs';

const ARTISTS = `The Beatles|The Rolling Stones|Elvis Presley|Bob Dylan|Queen|Led Zeppelin|Pink Floyd|Fleetwood Mac|Eagles|Styx|
Lynyrd Skynyrd|Journey|Bruce Springsteen|Tom Petty|David Bowie|Elton John|Billy Joel|Stevie Wonder|Michael Jackson|Prince|
Madonna|Whitney Houston|Aretha Franklin|Marvin Gaye|The Beach Boys|Simon & Garfunkel|Creedence Clearwater Revival|The Doors|
Jimi Hendrix|AC/DC|Guns N' Roses|Bon Jovi|Aerosmith|Van Halen|U2|The Police|R.E.M.|Nirvana|Pearl Jam|Red Hot Chili Peppers|
Green Day|Foo Fighters|Radiohead|Oasis|Coldplay|The Killers|Linkin Park|Metallica|Johnny Cash|Dolly Parton|Willie Nelson|
Garth Brooks|George Strait|Shania Twain|Tim McGraw|Kenny Chesney|Luke Combs|Chris Stapleton|Morgan Wallen|Zach Bryan|
Taylor Swift|Beyoncé|Rihanna|Adele|Ed Sheeran|Bruno Mars|Lady Gaga|Katy Perry|Justin Bieber|Ariana Grande|Billie Eilish|
Olivia Rodrigo|Dua Lipa|Harry Styles|The Weeknd|Drake|Kendrick Lamar|Eminem|Jay-Z|Kanye West|Tupac|The Notorious B.I.G.|
Outkast|Lil Wayne|Nicki Minaj|Post Malone|Travis Scott|SZA|Frank Ocean|Usher|Alicia Keys|Mariah Carey|Celine Dion|
Britney Spears|Backstreet Boys|NSYNC|Spice Girls|ABBA|Bee Gees|Earth, Wind & Fire|Donna Summer|Chic|Bob Marley|
Frank Sinatra|Nat King Cole|Louis Armstrong|Ray Charles|Sam Cooke|Otis Redding|The Temptations|The Supremes|James Brown|
Al Green|Bill Withers|Tina Turner|Phil Collins|Genesis|Toto|Chicago|Boston|Kansas|Foreigner|REO Speedwagon|Heart|
Pat Benatar|Blondie|Talking Heads|The Cure|Depeche Mode|The Smiths|Duran Duran|Tears for Fears|Hall & Oates|
John Denver|James Taylor|Carole King|Joni Mitchell|Neil Young|Cat Stevens|Van Morrison|Eric Clapton|Dire Straits|
The Who|The Kinks|Black Sabbath|Deep Purple|ZZ Top|Def Leppard|Mötley Crüe|Poison|Weezer|Blink-182|The Offspring|
Fall Out Boy|Paramore|My Chemical Romance|Imagine Dragons|Maroon 5|OneRepublic|Twenty One Pilots|Arctic Monkeys|
The Strokes|Tame Impala|Mumford & Sons|The Lumineers|Hozier|Noah Kahan|Lana Del Rey|Lorde|Sia|Pink|Kelly Clarkson|
Avril Lavigne|Alanis Morissette|Sheryl Crow|No Doubt|TLC|Destiny's Child|Lauryn Hill|Mary J. Blige|John Legend|
Sam Smith|Shawn Mendes|Miley Cyrus|Selena Gomez|Doja Cat|Bad Bunny|Shakira|Jimmy Buffett|Alan Jackson|Brooks & Dunn|
Carrie Underwood|Miranda Lambert|Kacey Musgraves|Zac Brown Band|Florida Georgia Line|Hank Williams|Patsy Cline|
The Chainsmokers|Calvin Harris|Daft Punk|Gorillaz|Beastie Boys|Run-DMC|Snoop Dogg|Dr. Dre|50 Cent|Nelly|Ludacris|
Disney|Christmas songs|Grateful Dead|The Band|Steely Dan|Doobie Brothers|Allman Brothers Band|Stevie Nicks|Cher`.replace(/\n/g, '').split('|');

const counts = new Map();
const seen = new Set();
let songs = 0;

async function artist(name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(name)}`, { headers: { 'User-Agent': 'song-pics word-freq' } });
      if (!res.ok) throw new Error(res.status);
      for (const r of await res.json()) {
        const id = `${r.artistName}|${r.trackName}`.toLowerCase().replace(/\s*[([].*/, '');
        if (!r.plainLyrics || seen.has(id)) continue;
        seen.add(id);
        songs++;
        for (const w of r.plainLyrics.toLowerCase().replace(/[‘’]/g, "'").match(/[a-z][a-z']*[a-z]|[a-z]/g) ?? []) {
          counts.set(w, (counts.get(w) ?? 0) + 1);
        }
      }
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  console.error('skipped', name);
}

const queue = [...ARTISTS];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await artist(queue.shift()); }));
const sorted = [...counts].filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]);
writeFileSync(new URL('../data/word-freq.json', import.meta.url), JSON.stringify(Object.fromEntries(sorted)));
console.log(`${songs} songs, ${sorted.length} words`);
