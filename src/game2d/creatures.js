import elfFemale from '../assets/elf2f_0.png';
import elfMale from '../assets/elf1m_0.png';
import humanFemale from '../assets/human1f_0.png';
import humanMale from '../assets/human1m_0.png';
import vulpinFemale from '../assets/vulpin1f_0.png';
import vulpinMale from '../assets/vulpis1m_0.png';
import foxkinFemale from '../assets/foxkin1f_2.png';
import foxkinMale from '../assets/foxkin1m_1.png';


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
    }
]


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