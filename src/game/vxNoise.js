import { perlin2, perlin3 } from "./noise";

/**
 * 
 * @param {Number} x required
 * @param {Number} y required
 * @param {Number} maxX 2000
 * @param {Number} maxY 1430
 * @param {Function} funct (a) => (a ** 2) - (a / 2)
 * @param {Number} dvf optional semi-scaleing factor
 * @param {Function} harm (a, i) => a / (1 << i)
 * @param {Number} hd harmonicDepth 20
 * @returns 
 */
export function random (x, y, maxX, maxY, funct = (a) => (a ** 2) - (a / 2), harm, hd, dvf) {
    let props = { location: [x, y], seed: funct, seedArraydimentions: [ maxX || 2000, maxY || 1430], harmonicDepth: hd || 20 }
    if(dvf) props.divisionFactor = dvf;
    if(harm) props.harmonics = harm

    return harmonicNoise(props)
} 

/**
 * 2D harmonic noise
 * @param {Array<Number>} location the desired output location
 * @param {Function} seed  a function that returns a random value for a given location - some self crafted consistent sequence
 * @param {Array<Number>} seedArraydimentions the side lengths for 0'th to n'th dimention - values must be positive
 * @param {Number} harmonicDepth the number of harmonics to display or leave out for the 0'th to n'th dimention
 * @param {Function} harmonics if this is null then we assume multiples of 2 until we reach the specified depth
 * @param {Number} divisionFactor a semi-scaleing factor for the noise default is 1 << location.length
 */
function harmonicNoise(props){
    const { location, seed, seedArraydimentions, harmonics, divisionFactor } = props;
    let harmonicDepth = props.harmonicDepth > 0 ? props.harmonicDepth : 100;

    let ret = seed(0);

    for(let i = 1; i < harmonicDepth; i++){
        const stepSize = seedArraydimentions.map(v => !harmonics ? v / (1 << i) : v / harmonics(i)); // I want to apply a function here see sheet function2 for arbritrary harmonics

        if(Math.min.apply(null, stepSize) < 1) {
            harmonicDepth = i;
        }else {
            ret += findDValue({stepSize, location, seedArraydimentions, seed, divisionFactor});
        }
    }

    return ret / harmonicDepth;
}

function findDValue({stepSize, location, seedArraydimentions, seed, divisionFactor}){
    const locationLength = location.length;
    const numberOfPoints = 1 << locationLength;

    const xy = location.map((loc, ind) => (loc % seedArraydimentions[ind]) / stepSize[ind]);
    const leftCorner = xy.map((v, ind) => (v >> 0) * stepSize[ind]);

    const n = (arr) => {
        let ret = arr[0];
        let mult = seedArraydimentions[0];

        if(arr.length > 1){
            for(let i = 1; i < arr.length; i++){
                ret += (arr[i] * mult);
                mult *= (seedArraydimentions[i]);
            }
        }
        return ret;
    };

    let points = [];
    for(let i = 0; i < numberOfPoints; i++){
        let arr = []
        for(let j = 0; j < locationLength; j++){
            arr.push(leftCorner[j] + stepSize[j] * ((i >> j) % 2));
        }
        points.push(n(arr));
    }

    // interpollate

    const vals = points.map(v => seed(v >> 0)); // seed(v) issue if v is a float
    const prcnt = xy.map(v => v - (v >> 0))

    // need proper bilinear interpollation
    const sum = locationLength === 1 ? (
        (prcnt[0]) * (vals[1]) +
        (1 - prcnt[0]) * (vals[0])
    ) : (
        (prcnt[1]) * (vals[2] + vals[3]) +
        (1 - prcnt[1]) * (vals[0] + vals[1]) +
        (1 - prcnt[0]) * (vals[0] + vals[2]) +
        (prcnt[0]) * (vals[1] + vals[3])
    );

    /*let sm = 0;
    for(let i = 0; i < numberOfPoints; i++){
        let tic = 0;
        for(let j = 0; j < numberOfPoints; j++){ 
            if(nxorSum(i,j,locationLength) === (locationLength - 1)) {
                sm += (vals[i] * (((i < j) ^ (prcnt[tic] < 0.5)) ? 1 - prcnt[tic] : prcnt[tic]));
                tic ++;
            }
        }
    }*/

    return sum / (divisionFactor || numberOfPoints);
}

//////

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

const interpolate =(a, b, t) => a + t * (b - a)

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
export function GenerateNoiseMap({width, height = width, scale, seed}) {
    let noiseMap = []

    if(!scale || scale < 0) scale = 0.0001;

    let prevVal = 0, maxVal = -10000, minVal = 999999;

    for(let y = 0; y < height; y++){
        let sampleY = ((y - (height / 2)) / scale);
        for(let x = 0; x < width; x++){
            let sampleX = ((x - (width / 2)) / scale)
            const seedBasedVal = randomValueFromSeed(seed, sampleX, sampleY, prevVal)
            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed}) * 2 - 1

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

export function GenerateNoiseMapV2({width, height = width, scale, seed, octaves , persistence, lacunarity }) {
    let noiseMap = []

    if(!scale || scale < 0) scale = 0.0001;
    if(octaves < 1) octaves = 1;
    if(lacunarity < 1) lacunarity = 1;
    if(width < 1) width = 1;
    if(height < 1) height = 1;
    if(persistence < 0 || persistence > 1) persistence = 1 / persistence


    let maxVal = -10000, minVal = 999999;

    for(let y = 0; y < height; y++){
        let sampleY = ((y - (height / 2)) / scale);
        for(let x = 0; x < width; x++){
            let sampleX = ((x - (width / 2)) / scale);

            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed, octaves, persistence, lacunarity, octaveOffSet: {x: 5, y: -3}}) * 2 - 1

            noiseMap.push(perlinValue)
            if(perlinValue > maxVal) maxVal = perlinValue
            else if(perlinValue < minVal) minVal = perlinValue
        }
    }

    // for values between 0 and 1 ?
    noiseMap = noiseMap.map(v => (maxVal - v) / ( maxVal - minVal))

    return noiseMap
}

function perlinNoise ({x, y, seed, lacunarity = 2.4, persistence = 0.75, octaves = 20, scale = 0.0833333, octaveOffSet = {x: 0, y: 0}}) {
    let z = interpolate(seed % 200, seed / 255, seed % 3074 - 77); // seed % 200
  
    let amp = 1.2
    let freq = 0.03
  
    let v = 0
    for (let i = 0; i < octaves; i++) {
        let octaveOffSetX = randomValueFromSeed(seed, i)
        let octaveOffSetY = randomValueFromSeed(seed, 0, i)

        v += amp * perlin3((x * freq * scale) + octaveOffSetX + (octaveOffSet?.x || 0), (y * freq * scale) + octaveOffSetY + (octaveOffSet?.y || 0), z)
        amp *= persistence
        freq *= lacunarity
    }
  
    return v
}
/// ...
  function fractionalBrowneanMotion(x, y){
    const persistence = 0.5;
    const octaves = 10;
    const scale = 137;
    const lacunarity = 1;
    const height = 100
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