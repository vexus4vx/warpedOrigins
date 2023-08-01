import { perlin2, perlin3, seed } from "./noise";

/**
 * returns a value (between -1 and 1) based on the seed and location parameters
 * @param {*} seed ...
 * @param {*} x x param in 3d env
 * @param {*} y y param in 3d env
 * @param {*} z z param in 3d env
 */
export function randomValueFromSeed(seed, x = 0, y = 0, z = 0){
    const values = [
        seed / 200,
        (seed - 300) / 450,
        seed - 43321,
        (seed ** 2) - (4006 * (seed ** 3)),
        ((seed << 2) - 433050) ** 2,
        (((seed / 12550) << 2) + 6) ** 2,
        ((seed << 2) + 6) ** 2,
        (seed >> 2) - 700
    ] // add a few if statements

    let val = (values[3] * z) + values[2] - x + (55 * y) + ((values[1] - values[2]) * (y + x)) - (values[0] * (2 * y - x + z - 4.4))
    val = (val / 1234) + ((val / 5) >> 2)
    if(values[2] > 500) val = (val + values[4] + (values[5] * z) + ((z ** 3 - y** 2) * values[6]) + ((x * z * y / 3.42) % values[7]))
    val = Math.abs(val)

    while(val > 1) val/=10

    return val
}

const interpolate = (a, b, t) => a + t * (b - a)
const fade = (t) => t*t*t*(t*(t*6-15)+10);

//////

/**
 * this looks great
 * @param {*} width > 0
 * @param {*} height > 0
 * @param {*} scale 
 * @param {*} seed 
 * @param {*} octaves > 0
 * @param {*} persistence 0 - 1
 * @param {*} lacunarity >= 1
 * @returns 
 */
export function GenerateNoiseMap({width, scale, vertexDepth, position, seed, ...props}) {
    let noiseMap = []

    if(!scale || scale < 0) scale = 0.0001;

    let prevVal = 0, maxVal = 1, minVal = -1;

    for(let y = 0; y < width; y += vertexDepth){
        let sampleY = ((y + position[1]) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x + position[0]) / scale);

            const seedBasedVal = randomValueFromSeed(seed, sampleX, sampleY, prevVal)
            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed, ...props}) * 2 - 1

            const res = interpolate(perlinValue, prevVal, seedBasedVal)
            noiseMap.push(Math.cos((res / 4.764) + 0.26))
            prevVal = (perlinValue + seedBasedVal) / 2
        }
    }

    // for values between 0 and 1 ?
    noiseMap = noiseMap.map(v => (maxVal - v) / ( maxVal - minVal))

    return noiseMap
}

/**
 * this looks great
 * @param {*} width > 0
 * @param {*} height > 0
 * @param {*} scale 
 * @param {*} seed 
 * @param {*} octaves > 0
 * @param {*} persistence 0 - 1
 * @param {*} lacunarity >= 1
 * @returns 
 */
export function GenerateNoiseMapV2({width, scale, octaves , persistence, lacunarity, vertexDepth, position, amplitude, ...props }) {
    if(!scale || scale < 0) scale = 0.0001;
    if(octaves < 1) octaves = 1;
    if(lacunarity < 1) lacunarity = 1;
    if(width < 1) width = 1;
    if(persistence < 0 || persistence > 1) persistence = 1 / persistence

    // const centers = [position[0] + ((width -1)/2), position[1] + ((width -1)/2)]
    // console.log(vertexDepth)

    let maxVal = Math.abs(valueAtLimit({amplitude, persistence, octaves})), minVal = -maxVal, noiseMap = [];

    for(let y = 0; y < width; y += vertexDepth){
        let sampleY = ((y + position[1]) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x + position[0]) / scale);

            
            let perlinValue = perlinNoise({x: sampleX, y: sampleY, octaves, persistence, amplitude, lacunarity, ...props})

            if(perlinValue < minVal) minVal = perlinValue
            else if(perlinValue > maxVal) maxVal = perlinValue
     
            noiseMap.push(perlinValue)
        }
    }

    // for values between 0 and 1 ?
    noiseMap = noiseMap.map(v => (maxVal - v) / ( maxVal - minVal))

    console.log({maxVal,minVal})

    return noiseMap // should display values between 0 and 1 ...
}

function perlinNoise ({x, y, seed, lacunarity = 2.4, persistence = 0.75, octaves = 20, scale = 0.0833333, octaveOffSetX = 0, octaveOffSetY = 0, frequency, amplitude }) {
    let z = interpolate(seed % 200, seed / 255, seed % 3314 - 77); // seed % 200
  
    let v = 0
    for (let i = 0; i < octaves; i++) {
        let octaveOffSetA = randomValueFromSeed(seed, i)
        let octaveOffSetB = randomValueFromSeed(seed, 0, i)
        let perl3 = perlin3((x * frequency * scale) + octaveOffSetA + (octaveOffSetX || 0), (y * frequency * scale) + octaveOffSetB + (octaveOffSetY || 0), z)

        v += (perl3 * amplitude)
        amplitude *= persistence
        frequency *= lacunarity
    }
  
    return v
}

const valueAtLimit = ({octaves, persistence, amplitude}) => {
    let v = 0;
    for (let i = 0; i < octaves; i++) {
        v += amplitude
        amplitude *= persistence
    }
    return v
}

function fractionalBrowneanMotion(x, y){
    const persistence = 0.8;
    const octaves = 5;
    const scale = 23;
    const lacunarity = 1;
    const height = 10
    const exponentiation = 2;
    function noise2D(x, y) {
      return perlin2(x, y) * 2.0 - 1.0;
    }
  
    const xs = x / scale;
    const ys = y / scale;
    let amplitude = 1.0;
    let frequency = 1.0;
    let normalization = 0;
    let total = 0;
    for (let o = 0; o < octaves; o++) {
      const noiseValue = noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    total /= normalization;
    return Math.pow(total, exponentiation) * height;
}