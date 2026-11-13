// The picture catalogue's source of truth: which real-world subject illustrates each lyric word.
// Each line is "word, word, ... : Wikipedia article". scripts/build-catalog.mjs turns the article
// into its lead photo. Words are base forms; the app also tries plurals and -ing/-ed endings.
// Priorities come from data/word-freq.json (most common words in ~3,000 well-known songs).
// A subject starting with "File:" names an exact Wikimedia Commons file instead of an article.

export const CONCEPTS = `
# people
i, me, my, mine, myself, i'm, i'll, i've, i'd, im, i'ma : Selfie
you, your, yours, yourself, you're, you'll, you've, you'd, ya, u : Uncle Sam
we, us, our, we're, we'll, we've, we'd, together : Holding hands
they, them, their, they're, people, everybody, everyone, crowd, y'all : Crowd
he, him, his, he's, he'll, man, men, guy, mr : Man
she, her, she's, she'll, woman, women, lady, ladies : Woman
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
master : Chess master
stranger : Silhouette
soldier : Soldier
cowboy : Cowboy
hero : Superhero

# directions and places
away : Vanishing point
up : Hot air balloon
down : Stairs
fall, fell : Waterfall
back, return : U-turn
home : Cottage
inside, room : Living room | Room
outside, out : Outdoor recreation
over, across : Bridge
under, beneath, deep, deeper : Underwater diving
through : Tunnel
around, round : Carousel
far : Telescope
near, close, closer : Hug
high, higher, top : Mount Everest
low : Valley
above : Aerial photography
edge : Cliff
where, somewhere, everywhere, nowhere, anywhere, wherever, place : Map
world, earth : Earth
way, road : Road
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
time, hour, late : Clock
minute, moment, second, quick, fast : Stopwatch
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
hold, holdin, touch : Hand-holding
happy, happiness, glad, joy : Happiness
smile : Smile
laugh : Laughter
fun, party, celebrate : Party
sad, cry, cryin, tear, tears : Crying
lonely, alone : Solitude
afraid, scared, fear : Fear
mad, angry, hate : Anger
crazy, insane : Roller coaster
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
life, live, living, livin, alive : Tree of life
grow, grown : Seedling
strong, strength, stronger : Olympic weightlifting
beautiful, beauty, lovely : Aurora
pretty : Cherry blossom
perfect : Rose window
sweet, candy : Candy
sugar : Sugar
good, better, great, fine, nice, okay, alright, yes : Thumb signal
best, win : Trophy
cool : Sunglasses
lie, lies, lying : Pinocchio
secret, whisper, quiet : Silence | Secrecy | Finger
dirty, mess : Mud
clean : Soap
money, pay, paid, price, buy, bought, spend, rich, million : Money
gold : Gold
diamond : Diamond
fame : Hollywood Walk of Fame
lose, lost, losing : Maze
trouble, danger : Warning sign
promise, swear : Pinky swear
shame, sorry : Facepalm
crush : Love letter

# doing things
go, going, goin, goes : Traffic light
gone, went : Footprint
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
move, moving, movin : Moving company
shake : Maraca
turn, turning, turned : Steering wheel
roll, rolling, rollin, wheel : Wheel
stop : Stop sign
wait, waiting, waitin : Waiting room
stay : Anchor
start, begin, beginning : Starting blocks
end : Racing flags
work, working, job : Construction worker
make, made, build, built : Construction
give, gave : Gift
keep, safe : Safe
catch : Baseball glove
throw : Pitcher
pull : Tug of war
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
see, saw, seen, watch, watching, sight, view : Binoculars
look, looking, lookin, find, found, search, searching : Magnifying glass
eye : Human eye
blind : Blindfold
say, said, says, talk, talking, talkin, speak, tell, told, tellin, sayin : Public speaking | Speech
word : Dictionary
story, read, book : Book
write, wrote : Writing
letter : Letter (message)
name : Name tag
call, calling, callin, called, phone : Mobile phone
ask, why, what, what's, who, who's, how, wonder, question, answer, reason : Question | Curiosity | Riddle
know, knows, knew, known, mind, brain, understand : Human brain
think, thinking, thinkin, thought : The Thinker
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
plan : Blueprint
sign : Traffic sign
speed : Speedometer
fever, sick : Thermometer
poison : Poison
boom, bang, blow up : Explosion
gun, shot, shoot : Revolver
chain : Chain
pieces, piece : Jigsaw puzzle

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

# very common small words that still deserve a picture
no, not, never, don't, can't, won't, ain't, didn't, couldn't, wouldn't, doesn't, isn't, wasn't, cannot, stop it : No symbol
yeah, yea, yeh, yo : Thumb signal
oh, ooh, ohh, ah, aah, whoa, woah, wow, woo, whoo, hoo : Surprise (emotion)
la, na, da, doo, dum, dee, sha, ba, bop, bum : Eighth note | Musical notation
like : Like button
please, thank : Namaste
change, changes, changed : Chameleon
help, save : Lifebuoy
first : Gold medal
big : Elephant
little, small, lil, bit : Kitten
slow, slowly : Snail
full : Full moon
maybe, guess : Coin flipping
nothing, nobody, nothin, empty, none : Ghost town
someone, somebody, something, somethin : Silhouette
hard, harder, tough : Anvil
feel, feeling, feelin, feels, felt : Goose bumps
want, wanna, need, wanted, desire : Shopping
come, coming, comin, came, c'mon : Welcome mat | Doormat
miss, missing : Empty chair | Bench (furniture)
more, most, much, many, lot : Buffet
same, twice, again, double : Twin
different, strange : Black sheep
alright : Rainbow
high five, five : High five
two, couple : Pair of shoes | Tandem bicycle
three : Three-leaf clover | Shamrock
one, only, single : Number 1 | Index finger

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
