// place items
// build / load from file
// spin off random instance
// auto generate flora - and posibly fauna

import React from "react";
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls } from "@react-three/drei";
import { FrontSide } from 'three';

import { perlin2, perlin3 } from "../noise";
import { random } from "../vxNoise";

// auto generate terrain
export default function City({...props}) {

  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 0.1;
  const far = 1000.0;

  return (
    <Canvas>
      <PerspectiveCamera makeDefault {...{position: [-201, 81, 68], fov, aspect, near, far}} />
      <React.Suspense fallback={null}>
        <group position={props?.position || [0,0,0]} rotation={[-Math.PI / 2, 0, 0]}>
            <TerrainChunkManager {...{ depth: 4 }} />
        </group>
      </React.Suspense>
      <MapControls />
      <ambientLight />
    </Canvas>
  )

    
}

/*
    since this is no open world we need to define the initial size of the map we want
    - say 400 * 400 ?
    - so 160,000 - values ? is that too much ?
    - lets start with 100 * 100 - that allows us to use %
        - every segment can be 10 * 10 ?
        a b c d
        e f g h
        i j k l
        m n o p

*/
function TerrainChunkManager({ seed = 14659, width = 200, depth = 5, ...props }){
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

function TerrainChunk({ width = 100, scale = 1, seed = 124415, meshProps = [0, 0] }) {
    let { positions, colors, normals, indices } = React.useMemo(() => {
        const { positions, colors, normals, indices } = calculateTerrainArrayData(width, scale, seed, meshProps)

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

function calculateTerrainArrayData(width, scale, seed, meshProps){
    const size = width * scale;
    let positions = [], colors = [], normals = [], indices = [];

    for (let i = 0; i < size; i++) {
      let y = ((i / scale) - (width + 1.) / 2.)
        for (let j = 0; j < size; j++) {
          let x = ((j / scale) - (width - 1.) / 2.)
          let z = compNoise(x + meshProps?.position[0] || 0, y + meshProps?.position[1] || 0)
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

    return {
        positions,
        colors,
        normals,
        indices
    }
}


function terrainShader(x, y, z, seed) {
    // return getColour2(x, y, z, seed);
    //
    const variation = ((Math.sin(seed + 1) * 10000) - Math.floor(1001 * x - 4 * y + seed) * 0.01) * 0.000062;
  
    return [
      z + variation, // r
      z / 5 + variation, // g
      ((x ** 2 + y ** 2) / 75 + variation) % 1 // b
    ]
}

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
] 