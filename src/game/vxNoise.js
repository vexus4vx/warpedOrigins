import { rand3 } from "../ideas";
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
    if(!scale || scale < 0) scale = 0.0001;
    const  {amplitude, persistence, octaves} = props

    const maxVal = Math.abs(valueAtLimit({amplitude, persistence, octaves}))
    let prevVal = 0, noiseMap = [];

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
    noiseMap = noiseMap.map(v => (maxVal - v) / (maxVal << 1))

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

    const maxVal = Math.abs(valueAtLimit({amplitude, persistence, octaves}))
    let noiseMap = [];

    for(let y = 0; y < width; y += vertexDepth){
        let sampleY = ((y + position[1]) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x + position[0]) / scale);

            // console.log({sampleX, sampleY})

            const perlinValue = perlinNoise({x: sampleX, y: sampleY, octaves, persistence, amplitude, lacunarity, ...props})
            // const yy = rand3(sampleX, sampleY, 1256)
     
            noiseMap.push(perlinValue) // noiseMap.push(perlinValue) // ((perlinValue / maxVal) + 1) / 2
        }
    }

    // for values between 0 and 1 ?
    return noiseMap.map(v => (maxVal - v) / (maxVal << 1)) // just devide v by maxVal
}

export function perlinNoise ({x, y, seed, lacunarity = 2.4, persistence = 0.75, octaves = 20, scale = 0.0833333, octaveOffSetX = 0, octaveOffSetY = 0, frequency, amplitude }) {
    if(Math.abs(octaveOffSetX) > 1) octaveOffSetX = 1 / octaveOffSetX
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

export const valueAtLimit = ({octaves, persistence, amplitude}) => {
    let v = 0;
    for (let i = 0; i < octaves; i++) {
        v += amplitude
        amplitude *= persistence
    }
    return v
}

/// - advanced / custom

// returns height for a given point
export function terrainOverSlope(i, j, {scale, position, vertexDepth, width}){

    // const x = ((i * vertexDepth) + position[0]) / scale, z = ((j * vertexDepth) + position[1]) / scale

    const x = (j * vertexDepth) + position[0], z = (i * vertexDepth) + position[1]

    // console.log({x, z})

    const arrX = [
      // linear functions
      () => 0,
      (a) => 0.0021 * a + 10,
      (a) => 1 / (a ** 2) + 30,
      (a) => 0.001 * a + 40,
      () => 0
    ], arrZ = arrX, cde = [-300, 100, 300, 1000]
  
    let xComp = overSlope(x, arrX, cde) // , zComp = overSlope(z, arrZ, cde)


    // console.log(x, z)
    return xComp * scale * 2
    // return (xComp * scale) + (xComp + zComp) / 2
}
  
/**
 * 
 * @param {*} n location
 * @param {*} arr an array of functions as applied from left to right
 */
function overSlope(n, arr, cde, smoothing = 100){
    if(arr.length !== (cde.length + 1)) return 0
    let fMin = arr[arr.length - 1], fMax = fMin, minLoc = 0, maxLoc = 0, pMx
  
    let mm = [cde[0], cde[0]]
    cde.forEach((v, k) => {
      if(v <= n) {
        mm[0] = v
        mm[1] = cde[k + 1] || (cde[k + 1] === 0 ? 0 : v)
        minLoc = k
        maxLoc = (k + 1) === cde.length ? k : k + 1

        /// ...
        fMin = arr[k]
        fMax = arr[k + 1]
      }
    })
    let vMin = cde[minLoc], vMax = cde[maxLoc]

    if(vMax !== vMin) {
        // vMin -n--  vMax
        // 100% = vMax - vMin
        // n% = (n - vMin) * 100 / (vMax - vMin)
        pMx = (n - vMin) * 100 / (vMax - vMin)
    }else if(vMax === cde[0]) {
        // vMax --n--- Sval
        pMx = (n - vMax) * 100 / smoothing
    }else{
        // sVal --n--- vMin
        // sVal = vMin - smoothing
        pMx = (n - (vMin - smoothing)) * 100 / smoothing
    }

    // console.log({pMx, pMn, loc: n, vMin, vMax})

    return ((fMin(n) * (100 - pMx)) + (fMax(n) * pMx)) / 100
}

/*
function fractionalBrowneanMotion({x, y, amplitude = 1, frequency = 1, normalization = 0, persistence = 0.8, octaves = 5, scale = 23, lacunarity = 1, height = 10, exponentiation = 2}){
    const noise2D = (x, y) => perlin2(x, y) * 2.0 - 1.0;
  
    const xs = x / scale;
    const ys = y / scale;
    let total = 0;
    for (let o = 0; o < octaves; o++) {
      const noiseValue = noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    total /= normalization;
    return (total ** exponentiation) * height
} //*/