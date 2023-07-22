// my attempt at noise - findes the noise value at the specified location so this could be great for a reusable random function that we can use to generate "Random" vallues for decision maps or heightMaps

/**
 * for a given length find how many bits are equal
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} len depth of interest
 * @returns the number of equal bits between a and b
 */
export function nxorSum(a, b, len){
    let out = 0;
    for(let i =0; i < len; i++){
      out += !(((a >> i) % 2) ^ ((b >> i) % 2))
    }
    return out;
}

/**
 * 1D perlin noise from sequence
 * @param {Number} location in the seedArray that is to be calculated
 * @param {Function} seed a function that returns the value at a given location - some self crafted sequence ?
 * @param {Number} harmonics harmonic count
 * @param {Number} seedLength seed array length - the repitition index of the sequence
 */
export function perlinNoiseFromSeq({location, seed, seedLength, harmonics}){
    if(location > seedLength) location %= seedLength; // just in case

    let ret = 0;

    for(let i = 0; i < harmonics; i++){
        const stepSize = seedLength >> i;

        if(stepSize < 1) {
            harmonics = i;
            break;
        }

        const toN = (stepSize * Math.ceil(location / stepSize)) || stepSize;
        const fromN = toN - stepSize;

        const ratio = (Math.abs(location - toN) / stepSize);

        const sampleAverage = location === toN ? 
            seed(toN) : 
            location === fromN ?
                seed(fromN) :
                seed(fromN) * ratio + seed(toN) * (1 - ratio)
        ret += sampleAverage;
    }
    return ret / harmonics;
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
 export function harmonicNoise(props){
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

function find2DValue({stepSize, location, seedArraydimentions, seed}){
    const locationLength = location.length;
    let xy = [];

    for(let j = 0; j < locationLength; j++){
        xy.push((location[j] % seedArraydimentions[j]) / stepSize[j])
    }

    const leftCorner = xy.map((v, ind) => (v >> 0) * stepSize[ind]);

    const n = (x, y) => x + y *(seedArraydimentions[0]);

    const points = [
        n(leftCorner[0], leftCorner[1]),
        n(leftCorner[0] + stepSize[0], leftCorner[1]),
        n(leftCorner[0], leftCorner[1] + stepSize[1]),
        n(leftCorner[0] + stepSize[0], leftCorner[1] + stepSize[1])
    ];

    // interpollate

    const vals = points.map(v => seed(v >> 0)); // seed(v) issue if v is a float
    const prcnt = xy.map(v => v - (v >> 0))

    return (
        (prcnt[1]) * (vals[2] + vals[3]) +
        (1 - prcnt[1]) * (vals[0] + vals[1]) +
        (1 - prcnt[0]) * (vals[0] + vals[2]) +
        (prcnt[0]) * (vals[1] + vals[3])
    ) / (1 << locationLength);
}

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