import { perlin3 } from "./noise";

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
export function GenerateNoiseMap({width, height = width, scale, seed, lacunarity, octaves, persistence, vertexDepth}) {
    let noiseMap = []

    if(!scale || scale < 0) scale = 0.0001;

    let prevVal = 0, maxVal = -10000, minVal = 999999;

    for(let y = 0; y < height; y += vertexDepth){
        let sampleY = ((y - (height / 2)) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x - (width / 2)) / scale)
            const seedBasedVal = randomValueFromSeed(seed, sampleX, sampleY, prevVal)
            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed, lacunarity, octaves, persistence}) * 2 - 1

            const res = interpolate(perlinValue, prevVal, seedBasedVal)
            noiseMap.push(res)
            prevVal = (perlinValue + seedBasedVal) / 2

            if(res > maxVal) maxVal = res
            else if(res < minVal) minVal = res
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
export function GenerateNoiseMapV2({width, height = width, scale, seed, octaves , persistence, lacunarity, octaveOffSetX, octaveOffSetY, vertexDepth }) {
    let noiseMap = []

    if(!scale || scale < 0) scale = 0.0001;
    if(octaves < 1) octaves = 1;
    if(lacunarity < 1) lacunarity = 1;
    if(width < 1) width = 1;
    if(height < 1) height = 1;
    if(persistence < 0 || persistence > 1) persistence = 1 / persistence


    let maxVal = -10000, minVal = 999999;

    for(let y = 0; y < height; y += vertexDepth){
        let sampleY = ((y - (height / 2)) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x - (width / 2)) / scale);

            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed, octaves, persistence, lacunarity, octaveOffSetX, octaveOffSetY}) * 2 - 1

            noiseMap.push(perlinValue)
            if(perlinValue > maxVal) maxVal = perlinValue
            else if(perlinValue < minVal) minVal = perlinValue
        }
    }

    // for values between 0 and 1 ?
    noiseMap = noiseMap.map(v => (maxVal - v) / ( maxVal - minVal))

    return noiseMap
}

function perlinNoise ({x, y, seed, lacunarity = 2.4, persistence = 0.75, octaves = 20, scale = 0.0833333, octaveOffSetX = 0, octaveOffSetY = 0 }) {
    let z = interpolate(seed % 200, seed / 255, seed % 3074 - 77); // seed % 200
  
    let amp = 1.2
    let freq = 0.03
  
    let v = 0
    for (let i = 0; i < octaves; i++) {
        let octaveOffSetA = randomValueFromSeed(seed, i)
        let octaveOffSetB = randomValueFromSeed(seed, 0, i)

        v += amp * perlin3((x * freq * scale) + octaveOffSetA + (octaveOffSetX || 0), (y * freq * scale) + octaveOffSetB + (octaveOffSetY || 0), z)
        amp *= persistence
        freq *= lacunarity
    }
  
    return v
}