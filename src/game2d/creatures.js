import elfFemale from '../assets/elf2f_0.png';
import elfMale from '../assets/elf1m_0.png';
import humanFemale from '../assets/human1f_0.png';
import humanMale from '../assets/human1m_0.png';
import vulpinFemale from '../assets/vulpin1f_0.png';
import vulpinMale from '../assets/vulpin1m_0.png';
import foxkinFemale from '../assets/foxkin1f_2.png';
import foxkinMale from '../assets/foxkin1m_1.png';
import seaElfFemale from '../assets/seaElf1f_0.png';
import seaElfMale from '../assets/seaElf1m_0.png';
import danaieyFemale from '../assets/danaiey1f_0.png';
import danaieyMale from '../assets/danaiey1m_0.png';
import drogeFemale from '../assets/droge1f_3.png';
import drogeMale from '../assets/droge1m_0.png';
import fenrikFemale from '../assets/fenrik1f_0.png';
import fenrikMale from '../assets/fenrik1m_0.png';
import flutterlingFemale from '../assets/flutterling1f_0.png';
import flutterlingMale from '../assets/flutterling1m_0.png';
import korbisFemale from '../assets/korbis1f_4.png';
import korbisMale from '../assets/korbis1m_0.png';
import mosslingFemale from '../assets/mossling1f_0.png';
import mosslingMale from '../assets/mossling1m_0.png';
import forestNymphFemale from '../assets/forestNymh1f_0.png';
import forestNymphMale from '../assets/forestNymh1m_0.png';
import lamiaFemale from '../assets/lamia1f_0.png';
import lamiaMale from '../assets/lamia1m_0.png';
import merfolkFemale from '../assets/merfolk1f_0.png';
import merfolkMale from '../assets/merfolk1m_0.png';
import tharanthosFemale from '../assets/tharanthos1f_0.png';
import tharanthosMale from '../assets/tharanthos1m_0.png';
import dryadFemale from '../assets/dryad1f_0.png';


export const races = [
    {
        name: 'Humans',
        info: [`As the original race before the 'great star fall', humans originally inhabited the entire world, even now following the invasions of other races they have a strong presence, great ingenuity and superior craftsmanship.`,
        `Humans possess well rounded stats with moderate nature affinity, the ability to preform arcane arts, and great adaptivity.`,
        `The average human lives 60 years however they can reach twice this age if they live a healthy stress free life.`],
        raceImg: [humanFemale, humanMale]
    },
    {
        name: 'Elves',
        info: [`Elves arrived on earth in the first year of the 'great star fall', humans who originally inhabited the world showed them great hospitality as they were more human like in appearance than man of the other races.`,
        `Elves have taken up residence in may places in the world, just like humans they posess great ingenuity and superior craftsmanship, however elves are a pridefull race that has long practiced the art of magical enhancements.`,
        `Elves possess well rounded stats, posessing both great speed and streangth along with strong nature affinity, the ability to preform arcane arts, and posess great skill in weapon enchantment.`,
        `The average elf lives 500 years.`],
        raceImg: [elfFemale, elfMale]
    },
    {
        name: 'Foxkin',
        info: [`Foxkin arrived on earth in the third year of the 'great star fall', as a member of the beaskin they have a fairly strained relationship with humans.`,
        `Foxkin are kunning hunters that prioritise speed and strength over arcane arts though some of them reach extraordinarry proficiency therin.`,
        `Like many beastkin foxkin may fall into a bloodrush state where they contingue killing enemies for what may seem to others like sport.`,
        `The average foxkin lives 40 years.`],
        raceImg: [foxkinFemale, foxkinMale]
    },
    {
        name: 'Vulpin',
        info: [`Vulpin arrived on earth in the ninth year after the 'great star fall', since they are part of the high beast races they were feared, however due to their unearthly charm they never had much conflict with humans.`,
        `Vulpin excell in the arcane arts they are revered by foxkin and often take them as their subordinates.`,
        `Among the vulpin there are individuals that have more than one tail this is not only a sign of their heritage but generally denotes great power.`,
        `The average vulpin lives 400 years.`],
        raceImg: [vulpinFemale, vulpinMale]
    },
    {
        name: 'SeaElf',
        info: [`SeaElves arrived on earth in the second year of the 'great star fall', since they are similar in appearance to Elves they were not seen as a threat especially since thy need water to thrive and are easilly susceptible to polution.`,
        `SeaElves live around rivers lakes and the ocean they are gifted in water Magic but have no other speciallity`,
        `SeaElves are peacefull and less pridefull than their Elven relatives they are wary of strangers and seldom interact depply with other races.`,
        `The average seaElf lives 300 years.`],
        raceImg: [seaElfFemale, seaElfMale]
    },
    {
        name: 'Danaiey',
        info: [`The Danaiey arrived on earth as the first forren non monster race right after the initial monster wave in the first year of the 'great star fall'.`,
        `The Dan-nai-ey as they call themselves are a race of semi Giants their heights range from 3 to 3.5 meters in height.`,
        `Danaiey are very powerfull, however they do not care about anything else than battle, they are not gifted with Magic and believe that their superior strength makes them superior to others.`,
        `The average Danaiey lives 40 years, mainly due to death in battle.`],
        raceImg: [danaieyFemale, danaieyMale]
    },
    {
        name: 'Droges',
        info: [`The Droges arrived on earth in the first year after the 'great star fall'.`,
        `The Droges are a race of draconic origin their apperance is unique, them having dragon scales horns and eyes on their head like a second face.`,
        `Droges are very much disliked, they are gifted with Magic and great tenancy, but are known for their apparent cruelty.`,
        `Droges are able to see in infra red with their dragon eyes allowing them to see at night`,
        `The average Droge lives 200 years.`],
        raceImg: [drogeFemale, drogeMale]
    },
    {
        name: 'Fenrik',
        info: [`The Fenrik arrived on earth in the second year of the 'great star fall', they were feared greatly since they appered to be much like monsters, hence there is a lot of bad blood between them and humans.`,
        `Fenrik are strong and tough along with very fast, they do not usually fall into a blood rush like many other berstkin.`,
        `As the most long lived of the lower beastkin the average Fenrik lives 80 years.`],
        raceImg: [fenrikFemale, fenrikMale]
    },
    {
        name: 'Flutterling',
        info: [`The Flutterling arrived in the first year after the 'great star fall'.`,
        `The Flutterling have a pair of butterfly wings that is too small to let them fly, though some specimens may be able to glide a small bit.`,
        `The flutterling are very diverse, some being tall while some are small, some strong some weak.`,
        `The average Flutterling lives for 25 years.`],
        raceImg: [flutterlingFemale, flutterlingMale]
    },
    {
        name: 'Korbis',
        info: [`The Korbis arrived on earth in the second year of the 'great star fall'.`,
        `The Korbis have a pair of wings that while too small to allow them to fly, allows them to glide from high places break falls or move faster.`,
        `As part of the high beastkin Korbis are akin to royalty among bird type beastkin, they have affinity with various elements and are physically durable, the excell in speed and can cause a powerfull blow to an unsuspecting opponent.`,
        `The average Korbis lives 350 years.`],
        raceImg: [korbisFemale, korbisMale]
    },
    {
        name: 'Mossling',
        info: [`Mosslings arrived on earth in the fifth year after the 'great star fall'.`,
        `Mosslings are a vendictive forest drelling race they do not tollerate any encroachment on their teritory and don't normally interact with other races.`,
        `Mosslings will capture intruders and their captives are usually never heard off again their fates unknown.`,
        `The average Mossling lives 600 years.`],
        raceImg: [mosslingFemale, mosslingMale]
    },
    {
        name: 'ForestNymph',
        info: [`ForestNymphs arrived on earth in the final year the 'great star fall'.`,
        `ForestNymphs are a forest drelling race, they do not tollerate intruders in their teritory and will hunt down prey by any means.`,
        `ForestNymphs will capture and / or kill travelers that are in low numbers they like hunting at night.`,
        `The average ForestNymph lives 500 years.`],
        raceImg: [forestNymphFemale, forestNymphMale]
    },
    {
        name: 'Lamia',
        info: [`Lamias arrived on earth in the third year after the 'great star fall'.`,
        `Lamias are a snake like race posessing the lower body of a serpant, their temprements vary and the do not do well in the cold.`,
        `Lamias will interact with other races to some extent however their tendency to backstab others makes them ambigious, st least socially speeking.`,
        `The average Lamia lives 300 years.`],
        raceImg: [lamiaFemale, lamiaMale]
    },
    {
        name: 'Merfolk',
        info: [`Merfolk arrived on earth between the second year of the 'great star fall' and the third year after 'the great starfall'.`,
        `Merfolk are a see dwelling race and had thus escaped notice for a long time, only the increace of monsters had forced them to move int costal areas of the mainland.`,
        `Merfolk have strong magical afinity their voices being able to lure you into the deapth's which may or may not be intentionally on their part.`,
        `Merfolk live for an average of 80 years.`],
        raceImg: [merfolkFemale, merfolkMale]
    },
    {
        name: 'Tharanthos',
        info: [`The Tharanthos arrived on earth in the second year after the 'great star fall'.`,
        `Tharanthos are a peculiar race their apperance is human but their hare is very different looking nearly like tentacles that respond to touch and can to some degree be controlled.`,
        `Tharanthos are good warriors with, they are not bad at anything in particular.`,
        `The average Tharanthos lives 180 years.`],
        raceImg: [tharanthosFemale, tharanthosMale]
    },
    {
        name: 'Dryad',
        info: [`Dryads arrived on earth in the third year of the 'great star fall'.`,
        `Dryads are a forrest dwelling race that incite tree growth near them they have average magic afinity and are usually not easy to notice.`,
        `It is unknown if male Dryads exist, however females use other races to proliferate.`,
        `Dryads are not known to cause harm.`,
        `The average Dryad lives 800 years.`],
        raceImg: [dryadFemale]
    }
]

// centepead race
const races1 = [
    {
        race: 'Danaiey',
        skeliton: 'human',
        height: [300, 350], // cm
        skinTone: ['copper', 'bronze'],
        hairColor: ['black'],
        eyecolor: ['blue', 'green']
    },
    {
        race: 'Human',
        skeliton: 'human',
        height: [140, 210],
        skinTone: ['pale', 'tanned', 'black'],
        hairColor: ['white', 'blond', 'black', 'red', 'brown'],
        eyecolor: ['green', 'gray', 'blue', 'brown', 'auburn', 'black']
    },
    {
        race: 'High Human',
        skeliton: 'human',
        height: [140, 210],
        skinTone: ['pale', 'tanned', 'black'],
        hairColor: ['white', 'blond', 'black', 'red', 'brown'],
        eyecolor: ['green', 'gray', 'blue', 'brown', 'auburn', 'black']
    },
    {
        race: 'Elf',
        skeliton: 'elf', // ear offset - pointy but not very long
        height: [160, 210],
        skinTone: ['pale'],
        hairColor: ['white', 'blond', 'red'],
        eyecolor: ['green', 'gray', 'blue']
    },
    {
        race: 'High Elf',
        skeliton: 'elf',
        height: [180, 210],
        skinTone: ['pale'],
        hairColor: ['white', 'blond', 'red'],
        eyecolor: ['green', 'gray', 'blue']
    },
    {
        race: 'Dark Elf',
        skeliton: 'elf',
        height: [180, 210],
        skinTone: ['brown', 'tanned', 'black'],
        hairColor: ['white', 'gray', 'black'],
        eyecolor: ['brown', 'purple', 'black']
    },
    {
        race: 'Fay',
        skeliton: 'fay', // ear offset - shorther and rounder than elves
        height: [120, 160],
        skinTone: ['pale', 'tanned', 'brown'],
        hairColor: ['blond', 'red', 'brown', 'green'],
        eyecolor: ['green', 'brown']
    },
    {
        race: 'Dryad',
        skeliton: 'fay',
        height: [160, 180],
        skinTone: ['pale', 'tanned', 'brown'],
        hairColor: ['green', 'brown', 'red', 'gray'],
        eyecolor: ['green']
    },
    {
        race: 'High Dryad',
        skeliton: 'fay',
        height: [160, 180],
        skinTone: ['pale'],
        hairColor: ['red'],
        eyecolor: ['green']
    },
    {
        race: 'Desert Elf',
        skeliton: 'arin', // long pointy ears 10+ cm and more sideward than straight
        height: [180, 210],
        skinTone: ['tanned', 'brown'],
        hairColor: ['white', 'blond', 'red'],
        eyecolor: ['green', 'gray', 'blue']
    },
    {
        race: 'Arin',
        skeliton: 'arin',
        height: [180, 210],
        skinTone: ['brown', 'black'],
        hairColor: ['blond', 'brown', 'red', 'black'],
        eyecolor: ['brown', 'purple']
    },
    /*
    trolls,
    Gnomes,
    Golems,
    oni,
    goblins,
    orks,
    mermaids,
    lamia,
    harpy,
    vampire,
    giant,
    halfling,
    dwarf,
    elemental,
    beastkin,
    minotaur,
    dragon,
    unicorns,
//*/
    {
        race: 'Aquana',
        skeliton: 'aquana', // tail, adapted to marine life
        height: [200, 240],
        skinTone: ['green', 'blue'],
        hairColor: ['blue', 'black', 'green'],
        eyecolor: ['brown', 'blue', 'green', 'yellow']
    },
    {
        race: 'Lunarias',
        skeliton: 'lunarias', // wings (white / pale yellow) feathery - elf ears
        height: [140, 180],
        skinTone: ['blue', 'purple', 'brown'],
        hairColor: ['gray', 'white', 'black'],
        eyecolor: ['yellow', 'gray', 'white']
    },
    {
        race: 'Endor',
        skeliton: 'endor', // 2 lagre and 4 small horns (pairs)
        height: [160, 200],
        skinTone: ['red'],
        hairColor: ['purple', 'black', 'red'],
        eyecolor: ['red', 'purple', 'black']
    },   
    {
        race: 'Zona',
        skeliton: 'human',
        height: [160, 200],
        skinTone: ['tan', 'pale'],
        hairColor: ['white'],
        eyecolor: ['pink', 'violet']
    },  
    {
        race: 'Kidak',
        skeliton: 'human',
        height: [160, 200],
        skinTone: ['tan', 'pale', 'black'],
        hairColor: ['white', 'brown', 'black'],
        eyecolor: ['yellow']
    },
]