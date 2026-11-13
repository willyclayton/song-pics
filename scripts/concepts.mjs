// The picture catalogue's source of truth: which real-world subject illustrates each lyric word.
// Each line is "word, word, ... : Wikipedia article". scripts/build-catalog.mjs turns the article
// into its lead photo. Words are base forms; the app also tries plurals and -ing/-ed endings.
// Priorities come from data/word-freq.json (most common words in ~3,000 well-known songs).
// A subject starting with "File:" names an exact Wikimedia Commons file instead of an article.
// Only words with an obvious picture belong here. Broad words (know, want, maybe, up) are left
// out on purpose: the app shows those as big text instead of forcing a loosely related photo.

export const CONCEPTS = `
# people (pronouns use anonymous silhouettes so they read as "a person", not someone in particular)
i, me, my, mine, myself, i'm, i'll, i've, i'd, im, i'ma : File:Sunset silhouette of man (Unsplash).jpg
you, your, yours, yourself, you're, you'll, you've, you'd, ya, u : Uncle Sam
we, us, our, we're, we'll, we've, we'd, together : File:Orange sunset celebration (Unsplash).jpg
they, them, their, they're, people, everybody, everyone, crowd, y'all : Crowd
he, him, his, he's, he'll, man, men, guy, mr : File:Man standing beach silhouette (Unsplash).jpg
she, her, she's, she'll, woman, women, lady, ladies : File:Silhouette woman standing sunset (Unsplash).jpg
boy, son : Boy
girl : Girl
baby, babe, born : Infant
child, kid, children : Child
mama, mother, mom, ma : Mother
daddy, father, papa, dad : Father
brother : Brother
sister : Sister
grandma, grandmother : Grandparent
friend : Friendship
family : Family
lover, darling, romance : Romance (love)
king : King
queen : Elizabeth II
prince : Prince
lord, pray, prayer, mercy : Prayer
god : The Creation of Adam
jesus : Jesus
angel : Angel
devil, evil : Devil
heaven : Heaven
hell : Hell
soul, ghost : Ghost
holy, halo, glory : Halo (religious iconography)
faith, believe : Christian cross | Cross
doctor, dr : Physician
fool, funny : Jester
band : Rock band
dj : Disc jockey
human : Human
soldier : Soldier
cowboy : Cowboy
hero : Superhero

# directions and places
away : Vanishing point
fall, fell : Waterfall
home : Cottage
inside, room : Living room | Room
over, across : Bridge
edge : Cliff
world, earth : Earth
road : Road
highway : Highway
street : Street
miles : Milestone
town : Town
city : City
york : New York City
country : Rural area
land : Landscape
america : Flag of the United States
california : Golden Gate Bridge
south, southern, west : Compass
paradise : Maldives | Bora Bora
beach : Beach
sea : Sea
ocean : Ocean
river : River
mountain : Mountain
hill : Hill
ground, dirt : Soil
dust : Dust storm
sand : Sand
stone : Rock (geology)
rock : Rock concert
grass : Lawn
tree : Tree
flower : Flower
rose : Rose
leaves, leaf : Leaf
garden : Garden
jungle : Jungle
field : Field (agriculture)
desert, heat : Desert
space : Outer space
sky, skies : Sky
island : Island
forest : Forest
lake : Lake

# sky, weather, time
sun : Sun
sunshine, sunlight, shine, bright : Sunlight
sunset : Sunset
dawn, morning, mornin, tomorrow, rise, rising : Sunrise
day, today : Daylight
night, tonight : Night
midnight : Night sky
moon : Moon
moonlight : Moonlight
star : Pleiades | Star cluster
light : Incandescent light bulb
dark, darkness : Cave | Darkness
shadow : Shadow
rain : Rain
storm : Storm
thunder : Thunderstorm
lightning, power : Lightning
snow : Snow
ice : Ice
cold, winter : Winter
hot : Chili pepper
wind, blow : Wind turbine
air, breath, breathe : Atmosphere of Earth
cloud : Cloud
weather : Weather
fire, flame, burn : Fire
smoke, smokin : Smoke
water : Drinking water | Body of water
drop : Drop (liquid)
wave : Wind wave
summer, summertime : Summer
spring : Spring (season)
autumn : Autumn
christmas : Christmas tree
week, year, sunday, saturday, friday : Calendar
time, hour, clock : Clock
forever, always : Infinity
past, memory, memories, remember, yesterday : Photo album
future : Crystal ball
old, older : Old age
young : Youth
rainbow, colors : Rainbow

# feelings
love, loving, lovin, loved, love's : Love lock | Wedding
heart, heartbeat : Heart symbol
kiss : Kiss
happy, happiness, glad, joy : Happiness
smile : Smile
laugh : Laughter
fun, party, celebrate : Party
sad, cry, cryin, tear, tears : Crying
lonely, alone : Solitude
afraid, scared, fear : Fear
mad, angry, hate : Anger
wild : Wildlife
scream, screaming : The Scream
pain, hurt : Pain
broken, broke, break, breaking : Broken heart
tired, sleep, sleeping : Sleep
dream : Dream
wake, awake : Alarm clock
wish : Wishing well
hope : Candle
lucky, luck, chance : Four-leaf clover
magic : Magic (illusion)
pride, proud : Peafowl
free, freedom : Statue of Liberty
peace : Peace symbols
war : Battle | War
fight, fighting, hit : Boxing
die, dead, death, died, dying, kill, killer : Cemetery
grow, grown : Seedling
strong, strength, stronger : Olympic weightlifting
beautiful, beauty, lovely : Aurora
pretty : Cherry blossom
perfect : Rose window
sweet, candy : Candy
sugar : Sugar
best, win : Trophy
cool : Sunglasses
lie, lies, lying : Pinocchio
secret, whisper, quiet : Silence | Secrecy | Finger
money, pay, paid, price, buy, bought, spend, rich, million : Money
gold : Gold
diamond : Diamond
fame : Hollywood Walk of Fame
promise, swear : Pinky swear
crush : Love letter

# doing things
leave, leaving, goodbye, bye : Suitcase
hello, hey : Waving
run, running, runnin, runaway : Running
walk, walking, walkin, step : Walking
ride : Equestrianism
drive, driving, car : Car
truck : Pickup truck
train : Train
track : Railway track
plane : Airplane
fly, flying : Bird flight
sail, sailing : Sailing
boat : Boat
ship : Ship
swim : Swimming
jump : Jumping
climb : Climbing
stand, standing : Standing
sit, sitting : Chair
shake : Maraca
turn, turning, turned : Steering wheel
roll, rolling, rollin, wheel : Wheel
stop : Stop sign
stay : Anchor
work, working, job : Construction worker
gift : Gift
catch : Baseball glove
throw : Pitcher
knock, door : Door
open : Gate
shut, locked, key : Lock and key
window : Window
wall : Wall
floor : Floor
house : House
bed : Bed
mirror : Mirror
glass : Drinking glass
bottle : Bottle
wine : Wine
beer : Beer
whiskey : Whisky
drink, drinkin, drunk : Cocktail
eat : Meal
taste : Ice cream
honey : Honey
coffee : Coffee
dance, dancing, dancin : Dance
boogie, groove, funky : Disco
sing, singing, voice : Singing
song : Musical notation | Music stand
music, sound : Orchestra
radio : Radio
guitar : Guitar
beat, drum : Drum kit
bass : Bass guitar
rap, rhyme : Rapping
blues : B.B. King | Blues rock
bell, ring : Bell
loud, shout : Megaphone
hear, heard, listen : Ear
view, sight : Binoculars
search, searching : Magnifying glass
eye : Human eye
blind : Blindfold
word : Dictionary
story, read, book : Book
write, wrote : Writing
letter : Letter (message)
call, calling, callin, called, phone : Mobile phone
mind, brain : Human brain
learn, learned, school : Classroom
game : Board game
play, playing, playin : Playground
ball : Ball
bar : Pub | Tavern
club : Nightclub
show, scene : Stage (theatre)
picture, photograph : Camera
tv : Television set
news, paper : Newspaper
sign : Traffic sign
speed : Speedometer
fever, sick : Thermometer
poison : Poison
boom, bang, blow up : Explosion
gun, shot, shoot : Revolver
chain : Chain

# body and clothes
hand : Hand
arms : Arm
face : Face
head : Human head
hair : Hair
lips, mouth : Lip
tongue : Tongue
teeth : Human tooth
body : Vitruvian Man
feet, foot : Foot
legs : Human leg
knees : Knee
finger : Finger
bones, bone : Human skeleton
blood, bleed : Blood
skin : Tattoo
dress : Dress
shoes : Shoe
jeans : Jeans
clothes : Clothing
crown : Crown
bag : Handbag
pocket : Pocket

# animals
bird : Bird
dog, dogg : Dog
cat : Cat
horse : Horse
bee : Bee
butterfly : Butterfly
wolf : Wolf
lion : Lion
tiger : Tiger
snake : Snake
fish : Fish
eagle : Bald eagle
dove : Columbidae
wings : Feather

# sung syllables
la, na, da, doo, dum, dee, sha, ba, bop, bum : Eighth note | Musical notation
alright : Rainbow

# colours
red : Red
blue : Blue
black : Black
white : White
green : Green
pink : Pink
brown : Brown
yellow : Yellow
`;

export function parseConcepts(text = CONCEPTS) {
  const map = {};
  for (const line of text.split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const at = line.lastIndexOf(' : ');
    const subject = line.slice(at + 3).trim(); // may list fallbacks: "A | B"
    for (const w of line.slice(0, at).split(',')) if (w.trim() && !(w.trim() in map)) map[w.trim()] = subject;
  }
  return map;
}
