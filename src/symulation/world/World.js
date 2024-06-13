// file for testing
// I want to symulate some custom data

export function Test ({ windowHeight, windowWidth, viewV, position }) {
    console.log('redrawing', {viewV, position})
    const arr = []

    for (let h = 0; h < windowHeight; h++) {
        for (let w = 0; w < windowWidth; w++) {
    
            const rgba = thorus({windowHeight, windowWidth, w, h, viewV, position});

            // arr = [...arr, ...rgba];
    
            arr.push(rgba[0]); // r
            arr.push(rgba[1]); // g
            arr.push(rgba[2]); // b
            arr.push(rgba[3]); // a
        }
    }

    return new Uint8ClampedArray(arr);
};

const rnd = () => Math.round(Math.random() * 255);

function thorus({windowHeight, windowWidth, w, h, viewV, position}) {
    // I need to know where I am in relation to the object ...
    const halfW = windowWidth / 2;
    const halfH = windowHeight / 2;
    const iW = halfW - 200;
    const oW = halfW + 200;

    const iH = halfH - 200;
    const oH = halfH + 200;

    let aa = 255; // rnd();
    if(w > iW && w < oW){
        if(h > iH && h < oH){
            aa = 122;
        }
    }

    return [aa, 255, 255, 255];
    // return [rnd(), rnd(), rnd(), rnd()];
}
// we need to be able to zoom in and out
// we need some kind of reusable regular noise function
// we need to test moving the screen
// we need to make atoms, molecules etc
// we need to allow for motion - that is a non static environment

// create monocromatic field first
// implement the motion rules for mags



// ideas

/**
 * sample an array and return the relevant element
 * @param {Array} arr array to be sampled
 * @param {Number} element element desired
 * @returns the Array element from the sample - note that this could be a number or array
 */
function sampleArray(arr, element){
    return arr[Math.floor(element % arr.length)];
}

/**
 * 1D perlin noise
 * @param {Number} location in the seedArray that is to be calculated
 * @param {Array} seedArray
 * @param {Number} sampleDepth harmonic count
 */
export function standardPerlinNoise({location = 4312, seedArray = [10, 15, 125, 23, 56, 122, 202, 98, 17, 0, 152, 245, 90, 66, 31, 72], sampleDepth = 5}){
    // const seedArray = [10, 15, 125, 23, 56, 122, 202, 98, 17, 0, 152, 245, 90, 66, 31, 72];
    // const sampleDepth = 5; // max = 1 + Math.sqrt(seedArray.length)

    const seedArrayLength = seedArray.length;
    if(location > seedArrayLength) location %= seedArrayLength; // just in case

    let ret = 0;

    for(let i = 0; i < sampleDepth; i++){
        const stepSize = seedArrayLength >> i;

        const toN = (stepSize * Math.ceil(location / stepSize)) || stepSize;
        const fromN = toN - stepSize;

        const ratio = (Math.abs(location - toN) / stepSize);

        const sampleAverage = location === toN ? 
            sampleArray(seedArray, toN) : 
            location === fromN ?
            sampleArray(seedArray, fromN) :
            sampleArray(seedArray, fromN) * ratio + sampleArray(seedArray, toN) * (1 - ratio)

        ret += sampleAverage;
    }
    return ret / sampleDepth;
}


/**
 * 1D perlin noise from sequence
 * @param {Number} location in the seedArray that is to be calculated
 * @param {Function} seed a function that returns the value at a given location - some self crafted sequence ?
 * @param {Number} harmonics harmonic count
 * @param {Number} seedLength seed array length - the repitition index of the sequence
 */
export function perlinNoiseFromSeq({location = 4312, seed, seedLength, harmonics}){
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
 * 2D perlin noise
 * @param {Number} location in the seedArray that is to be calculated
 * @param {Array} seedArray
 * @param {Number} sampleDepth
 */
 export function terrainPerlinNoise({location1, location2, seedArray1, seedArray2, sampleDepth1, sampleDepth2, version}){

    const seedArrayLength1 = seedArray1.length;
    const seedArrayLength2 = seedArray2.length;
    if(location1 > seedArrayLength1) location1 %= seedArrayLength1; // just in case
    if(location2 > seedArrayLength2) location2 %= version === 1 ? seedArrayLength1 : seedArrayLength2; // just in case

    const perlin1 = standardPerlinNoise({location: location1, sampleDepth: sampleDepth1, seedArray: seedArray1})
    const perlin2 = standardPerlinNoise({location: version === 1 ? location1 : location2, sampleDepth: sampleDepth2, seedArray: seedArray2})

    if(!version){
        // perlin1 along x where y == 0 and perlin2 along y where y == 0 
        return (perlin1 + perlin2) / 2;
    }else if(version === 1){
        // perlin1 along x where y == 0 and perlin2 along x where y == max 
        const ratio = location2 / seedArrayLength2;
        return perlin1 * ratio + perlin2 * (1 - ratio);
    }else{
        // tst 
        return perlin1
    }
    
    return 0;
}

/**
 * 2D perlin noise
 * @param {Array<Number>} location the desired output location
 * @param {Function} seed  a function that returns a random value for a given location - some self crafted consistent sequence
 * @param {Array<Number>} dimentionLengths the side lengths for 0'th to n'th dimention - values must be positive
 * @param {Array<Number>} harmonicDepth the number of harmonics to display or leave out for the 0'th to n'th dimention
 */
 export function harmonicNoiseTry1(props){
    const { location, seed, dimentionLengths } = props;
    let harmonicDepth = props.harmonicDepth.map(v => v > 0 ? v : 100);

    const dimentions = dimentionLengths.length;

    // 1 << dimentions // how many values are required per harmonic
    let out = [];

    for(let i = 0; i < dimentions; i++){
        // single harmonic itteration
        const originalHarmonicDepth = props.harmonicDepth[i] < 0 ? - props.harmonicDepth[i] : 0;
        const seedOffset = i * dimentionLengths[(i || 1) - 1];
        
        let ret = 0;
        for(let j = 0; j < harmonicDepth[i]; j++){
            const stepSize = dimentionLengths[i] >> j;
            const singleSeedOffset = seedOffset * j;
    
            if(stepSize < (1 + originalHarmonicDepth)) {
                harmonicDepth[i] = j;
            }else {
                const toN = (stepSize * Math.ceil(location[i] / stepSize)) || stepSize;
                const fromN = toN - stepSize;
        
                const ratio = (Math.abs(location[i] - toN) / stepSize);
        
                const sampleAverage = location[i] === toN ? 
                    seed(toN + singleSeedOffset) :
                    location[i] === fromN ?
                        seed(fromN + singleSeedOffset) :
                        seed(fromN + singleSeedOffset) * ratio + seed(toN + singleSeedOffset) * (1 - ratio);
                ret += sampleAverage;
            }
        }
        out.push(ret / harmonicDepth[i]);
    }

    let fin = 0;

    out.forEach(v => fin+=v);

    return fin / out.length;
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

    const sum = locationLength === 1 ? (
        (prcnt[0]) * (vals[1]) +
        (1 - prcnt[0]) * (vals[0])
    ) : (
        (prcnt[1]) * (vals[2] + vals[3]) +
        (1 - prcnt[1]) * (vals[0] + vals[1]) +
        (1 - prcnt[0]) * (vals[0] + vals[2]) +
        (prcnt[0]) * (vals[1] + vals[3])
    );

    let sm = 0;
    for(let i = 0; i < numberOfPoints; i++){
        let tic = 0;
        for(let j = 0; j < numberOfPoints; j++){ 
            if(nxorSum(i,j,locationLength) === (locationLength - 1)) {
                sm += (vals[i] * (((i < j) ^ (prcnt[tic] < 0.5)) ? 1 - prcnt[tic] : prcnt[tic]));
                tic ++;
            }
        }
    }

    return sm / (divisionFactor || numberOfPoints);
}

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