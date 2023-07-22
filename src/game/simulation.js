import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { FrontSide } from 'three';
import { perlin3, perlin2 } from './noise';
import { random } from './vxNoise';

function testTerrain (x, y) {
  const num = 851472

  /*
    a b c
    d e f
    g h i
  */

  let a = (num % (num % (x - 1) + 1) - (num % (y - 1))) % 256
  let b = (num % (num % (x - 1) + 1) - (num % (y))) % 256
  let c = (num % (num % (x - 1) + 1) - (num % (y + 1))) % 256
  let d = (num % (num % (x) + 1) - (num % (y - 1))) % 256
  let e = (num % (num % (x) + 1) - (num % (y))) % 256
  let f = (num % (num % (x) + 1) - (num % (y + 1))) % 256
  let g = (num % (num % (x + 1) + 1) - (num % (y - 1))) % 256
  let h = (num % (num % (x + 1) + 1) - (num % (y))) % 256
  let i = (num % (num % (x + 1) + 1) - (num % (y + 1))) % 256

  return  a + b + c + d + i + f + g + h + (2 * e) / 10
}

function smoothArray ({arr, size, incr = 10, addOn = 4, seed}) {
  let prevX = 0 // arr[0]
  let prevY = 0 // arr[0]

  let xLoc = 0
  let yLoc = -1

  let position = []
  let color = []

  arr.forEach((v, k) => {
    xLoc = k % size
    const diff = prevX - v

    if(!(k % size)) {
      yLoc ++
      const newY = diff > incr ? prevY + addOn : diff < incr ? prevY - addOn : prevY
      prevY = newY
    }
    const newX = diff > incr ? prevX + addOn : diff < incr ? prevX - addOn : prevX
    prevX = newX

    const nVal = (prevX + prevY) / 2
    position.push(nVal)

    if(k % 3 === 2) {
      color.push(terrainShader(position[k-2], position[k-1], position[k], seed))
    }
  })

  return { position, color }
}

export default function Simulation({position, ...props}) {
  const [xAxis, setXaxis] = React.useState([]);
  const [yAxis, setYaxis] = React.useState([]);

  React.useEffect(() => {
      /*promiseFileData(noOneButYou).then((val) => {
          setXaxis(transmuteArr(val));
      })
      .catch((err) => console.log(err));

      promiseFileData(raindancer).then((val) => {
          setYaxis(transmuteArr(val));
      })
      .catch((err) => console.log(err));//*/

      setXaxis(generateFromSeed(44124, 300000))
      setYaxis(generateFromSeed(125514, 300000))
  },[])

  return (
    <>
      <group position={position || [0,0,0]} rotation={[-Math.PI / 2, 0, 0]}>
        {<TerrainChunkManagerV4 {...{ depth: 4, xAxis, yAxis }} />}
        {/*<SoundTerrainGenerator position={position || [300, 300, 0]} />*/}
      </group>
    </>
  );
}

function generateFromSeed(seed, length){
  let arr = []
  const max = 4000

  let previousVal = 0
  let inclineDecline = 1 // go up

  const variesWith = (i) => {
    // out between 1 and 100
    return 24 + ((i % 40) * 3) % 100
  }

  for(let i = 0; i < length; i++){
    arr.push(Math.floor(Math.sin(i) * previousVal))

    let addon = seed % (((i % variesWith(i)) ** 2) || 1) // vary 24 with i

    // let tst = previousVal + (inclineDecline % 2 ? addon : -addon)
    if(previousVal >= max) inclineDecline = 0 // previousVal to tst
    if(previousVal <= -max) inclineDecline = 1 // previousVal to tst

    previousVal += (inclineDecline % 2 ? addon : -addon)
  }
  console.log(previousVal, arr, inclineDecline, seed)
  return new Int16Array(arr.map(a => Math.floor(a / 4)))
}

// smooth out the noise - I need more shallow inclines
function transmuteArr(arr) {
  // arr is 16 b
  return arr.map((v, i) => v * Math.sin(i) || arr[arr.length - 1 - i] * Math.cos(i))
}

// noise ...
const zz = random(700, 220);
function perlinNoise (x, y) {
  let z = zz % 200;

  let scale = 1 / 12
  let octaves = 20
  let persistence = 0.75
  let lacunarity = 2.4

  let amp = 1.2
  let freq = 0.03

  let v = 0
  for (let i = 0; i < octaves; i++) {
    v += amp * perlin3(x * freq * scale, y * freq * scale, z)
    amp *= persistence
    freq *= lacunarity
  }

  return v
}

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

function compNoise(x, y){
  const fbm = fractionalBrowneanMotion(x, y);
  const prl = perlinNoise(x, y);

  return fbm * prl + fbm + prl;
}

function terrainShader(x, y, z, seed) {
  return getColour2(x, y, z, seed);
  //
  const variation = ((Math.sin(seed + 1) * 10000) - Math.floor(1001 * x - 4 * y + seed) * 0.01) * 0.000062;

  return [
    z + variation, // r
    z / 5 + variation, // g
    ((x ** 2 + y ** 2) / 75 + variation) % 1 // b
  ]
}

/* const getColour = (x, y, z, seed) => {
  const variation = ((Math.sin(seed + 1) * 10000) - Math.floor(1001 * x - 4 * y + seed) * 0.01) * 0.000062;

  const Z = (z + variation);

  const rgb = shader(Z);
  // return rgb;

  ///
  //const avg = (a, b) => (a + b) / 2;
  //const rgb2 = shader(Z + ((((Z * 10) >> 0) / 10) < Z ? -0.1 : 0.1));
  // return [avg(rgb[0], rgb2[0]), avg(rgb[1], rgb2[1]), avg(rgb[2], rgb2[2])];

  ///
  const fact = Math.abs((Z * 10) - ((Z * 10) >> 0)); // use with rgb
  const fa = (fact > 0.5 ? fact : 1 - fact);
  const fb = (fact < 0.5 ? fact : 1 - fact);

  const sdr = shader(Z + Z > 0 ? 0.1 : -0.1);
  const rgb3 = rgb.map((v, ind) => (v * fa) + (sdr[ind] * fb));
  return rgb3
} // */

const getColour2 = (x, y, z, seed) => {
  const variation = ((Math.sin(seed + 1) * 10000) - Math.floor(1001 * x - 4 * y + seed) * 0.01) * 0.000062;

  const Z = (z * variation);

  // console.log(z, Z)

  const rgb = shader2(Z);
  // return rgb;

  ///
  // const avg = (a, b) => (a + b) / 2;
  // const rgb2 = shader(Z + ((((Z * 10) >> 0) / 10) < Z ? -0.1 : 0.1));
  // return [avg(rgb[0], rgb2[0]), avg(rgb[1], rgb2[1]), avg(rgb[2], rgb2[2])];

  ///
  const fact = Math.abs((Z * 10) - ((Z * 10) >> 0)); // use with rgb
  const fa = (fact > 0.5 ? fact : 1 - fact);
  const fb = (fact < 0.5 ? fact : 1 - fact);

  const sdr = shader(Z + Z > 0 ? 0.1 : -0.1);
  const rgb3 = rgb.map((v, ind) => (v * fa) + (sdr[ind] * fb));
  return rgb3
}

const shader2 = (v) => 
  v < -0.8 ? color.deepBlue : 
  v < -0.5 ? color.blueGray : 
  v < -0.4 ? color.gray1 : 
  v < -0.3 ? color.gray2 : 
  v < -0.2 ? color.grayGreen : 
  v < -0.1 ? color.green1 : 
  v < 0 ? color.green2 : 
  v < 0.1 ? color.green3 : 
  v < 0.2 ? color.green4 : 
  v < 0.3 ? color.forrest1 : 
  v < 0.6 ? color.cliff1 : 
  v < 5 ? [0.22, 0.40, 0.20] : 
  v < 10 ? [0.34, 0.43, 0.12] : 
  v < 20 ? [0.15, 0.15, 0.15] : 
  v < 30 ? [0.25, 0.25, 0.25] : 
  v < 40 ? [0.5, 0.5, 0.5] : 
  v < 70 ? [1, 1, 1] : 
  v < 80 ? [5, 5, 5] : 
  v < 100 ? [7.95, 7.94, 7.94] : 
  [10, 10, 10];


const shader = (v) => v < -0.8 ? color.deepBlue : 
  v < -0.5 ? color.blueGray : 
  v < -0.4 ? color.gray1 : 
  v < -0.3 ? color.gray2 : 
  v < -0.2 ? color.grayGreen : 
  v < -0.1 ? color.green1 : 
  v < 0 ? color.green2 : 
  v < 0.1 ? color.green3 : 
  v < 0.2 ? color.green4 : 
  v < 0.3 ? color.forrest1 : 
  v < 0.4 ? color.forrest2 : 
  v < 0.5 ? color.forrest3 : 
  v < 0.6 ? color.cliff1 : 
  v < 0.7 ? color.cliff2 : 
  v < 0.8 ? color.cliff3 : 
  v < 0.9 ? color.cliff4 : 
  v < 1 ? color.snow1 : 
  color.snow2;

const color = {
  blueGray : [0.141, 0.3, 0.36],
  deepBlue : [0.16, 0.17, 0.34],
  gray1 : [0.27, 0.25, 0.19],
  gray2 : [0.29, 0.29, 0.13],
  grayGreen : [0.34, 0.33, 0.08],
  green1 : [0.34, 0.31, 0.15],
  green2 : [0.22, 0.40, 0.20],
  green3 : [0.16, 0.45, 0.1],
  green4 : [0.29, 0.50, 0.15],
  forrest1 : [0.07, 0.22, 0.04],
  forrest2 : [0.22, 0.25, 0.09],
  forrest3 : [0.44, 0.43, 0.12],
  cliff1 : [0.35, 0.27, 0.21],
  cliff2 : [0.42, 0.40, 0.39],
  cliff3 : [0.25, 0.29, 0.42],
  cliff4 : [0.59, 0.57, 0.59],
  snow1 : [0.79, 0.79, 0.82],
  snow2 : [0.63, 0.71, 0.87]
}

// it feels like this keeps on recalculation - debug
function TerrainChunk({ width, scale, seed, meshProps, xAxis, yAxis }) {
    const size = width * scale;

    let { positions, colors, normals, indices } = React.useMemo(() => {
        let positions = [], colors = [], normals = [], indices = [];

        for (let i = 0; i < size; i++) {
          let y = ((i / scale) - (width + 1.) / 2.)
            for (let j = 0; j < size; j++) {
              let x = ((j / scale) - (width - 1.) / 2.)
              let z = compNoise(x + meshProps?.position[0] || 0, y + meshProps?.position[1] || 0)
              // let z = compoundSound([x + meshProps?.position[0] || 0, y + meshProps?.position[1] || 0], xAxis, yAxis)
              // let z = testTerrain(x + meshProps?.position[0] || 0, y + meshProps?.position[1] || 0, xAxis, yAxis)
              positions.push(x, y, z)
              normals.push(0, 0, 1)

              if((i < (size - 1)) && (j < (size - 1))){
                  const l = i * size + j;
                  indices.push(l, l + 1, l + size + 1)
                  indices.push(l + size + 1, l + size, l)
              }

              colors.push(...terrainShader(x, y, z, seed));
            }
        }

        // const {position, color} = smoothArray({arr: positions, size, seed})

        return {
            positions: new Float32Array(positions),
            colors: new Float32Array(colors),
            normals: new Float32Array(normals),
            indices: new Uint16Array(indices)
        }
    }, [])

    return <mesh {...meshProps} >
        <bufferGeometry>
            <bufferAttribute attach='attributes-position' array={positions} count={positions.length / 3} itemSize={3} />
            <bufferAttribute attach='attributes-color' array={colors} count={colors.length / 3} itemSize={3} />
            <bufferAttribute attach='attributes-normal' array={normals} count={normals.length / 3} itemSize={3} />
            <bufferAttribute attach="index" array={indices} count={indices.length} itemSize={1} />
        </bufferGeometry>
        <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
    </mesh>
}

const ofsX = [1, 0, -1, 1, -1, 1, 0, -1], ofsY = [1, 1, 1, 0, 0, -1, -1, -1];
const ofs = [
  [-1, -1,   0, -1,   1, -1,   -1, 0,    1, 0,    -1, 1,   0, 1,   1, 1],
  [-2, -4,   1, -4,   4, -4,   -2, -1,   4, -1,   -2, 2,   1, 2,   4, 2],
  [-5, -13,   4, -13,   13, -13,   -5, -4,   13, -4,   -5, 5,   4, 5,   13, 5],
  [-14, -40,   13, -40,   40, -40,   -14, -13,   40, -13,   -14, 14,   13, 14,   40, 14],
  [-41, -121,   40, -121,   121, -121,   -41, -40,   121, -40,   -41, 41,   40, 41,   121, 41],
  [-122, -364,   121, -364,   364, -364,   -122, -121,   364, -121,   -122, 122,   121, 122,   364, 122],
  [-365, -1093,   364, -1093,   1093, -1093,   -365, -364,   1093, -364,   -365, 365,   364, 365,   1093, 365],
  [-1094, -3280,   1093, -3280,   3280, -3280,   -1094, -1093,   3280, -1093,   -1094, 1094,   1093, 1094,   3280, 1094]
] // 1, 1+3, 4+9, 13+27, 40+81, 120+(3**5) ...

// zustand ?
// returns an array of terrain chunks ...
function TerrainChunkManagerV4({ seed = 14659, width = 200, depth = 5, ...props }){
  const [lastCalculatedPosition, setLastCalculatedPosition] = React.useState([]);
  //
  const [addableTerrainKeys, setAddableTerrainKeys] = React.useState([]); // terrain to be created
  const [visibleTerrain, setVissableTerrain] = React.useState([]); // terrain currently displayed
  const [terrainPool, setTerrainPool] = React.useState({}); // a pool of terrain so we don't need to recreate everything
  const [keysCalculating, setKeysCalculating] = React.useState([]); // currently calculating
  const [keysRequired, setKeysRequired] = React.useState([]); // recalculated every time shouldIReCalculate is true

  const { camera } = useThree();

  // React.useEffect(() => {
     // camera.position.set( 40000 , 100 , 30000 );
  // }, [])

  useFrame(() => {
    // calc current chunk position
    const camX = camera.position?.x;
    const camZ = camera.position?.z;
    const pos = [Math.floor(camX / width), Math.floor(camZ / width)];

    const shouldIReCalculate = !lastCalculatedPosition.length || pos[0] !== lastCalculatedPosition[0] || pos[1] !== lastCalculatedPosition[1];

    // find terrain that should exist
    if(shouldIReCalculate){
      setLastCalculatedPosition([...pos]);
      let keysReq = [`${pos[0]}*${pos[1]}_1`];

      for(let i = 1; i < depth; i ++){
        const pow = 3 ** (i - 1);
        for(let j = 0; j < 8; j++){
          keysReq.push(`${(pos[0] + (ofsX[j] * pow)  + ((ofs[i - 1][j << 1]) / width))}*${(pos[1] + (ofsY[j] * pow)  + ((ofs[i - 1][(j << 1) + 1]) / width))}_${pow}`);
        }
      }
      setKeysRequired(keysReq);
    }

    // add to pool
    if(keysCalculating.length){
      const k = keysCalculating[0];

      if(!terrainPool[k]){
        // get scale and position from key
        const vals = [k.indexOf('*'), k.indexOf('_')];
        let scle = Number(k.slice(1 + vals[1]));

        const newChunk = <TerrainChunk {...{
          scale: 1 / scle,
          width: width * scle,
          seed,
          meshProps: { position: [Number(k.slice(0, vals[0])) * width, Number(k.slice(1 + vals[0], vals[1])) * -width, 0] },
          key: k,
          ...props
        }} />

        setVissableTerrain([...visibleTerrain, newChunk])
        setTerrainPool({...terrainPool, [k]: newChunk})
      } else if(!(Object.values(visibleTerrain).map(({key}) => key)).includes(k)) {
        setVissableTerrain([...visibleTerrain, terrainPool[k]]);
      }

      setAddableTerrainKeys([...addableTerrainKeys, k]);
      setKeysCalculating(keysCalculating.slice(1));
    }else if(addableTerrainKeys.length) {
      // switch out
      setVissableTerrain(addableTerrainKeys.map(k => terrainPool[k])); 

      // if pool is too full remove some chunks
      const dpth = depth * 8 - 7;
      if(Object.keys(terrainPool).length > (dpth * 3)){
        let obj = {};
        let rem = dpth;
        const visKeys = Object.values(visibleTerrain).map(({key}) => key);
        Object.keys(terrainPool).forEach(k => {
          // these keys need to stay
          if(!rem || addableTerrainKeys.includes(k) || keysCalculating.includes(k) || keysRequired.includes(k) || visKeys[k]){
            obj[k] = terrainPool[k];
          }
          if(rem) rem --;
        })
        setTerrainPool({...obj});
      }

      setAddableTerrainKeys([]);
      if(keysRequired.length){
        setKeysCalculating(keysRequired);
        setKeysRequired([]);
      }
    }else if(keysRequired.length && !keysCalculating.length) {
      setKeysCalculating(keysRequired);
      setKeysRequired([]);
    }
  }, [])

  return visibleTerrain
}