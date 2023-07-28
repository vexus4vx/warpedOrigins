// place items
// build / load from file
// spin off random instance
// auto generate flora - and posibly fauna

import React from "react";
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls } from "@react-three/drei";
import { FrontSide } from 'three';

import { GenerateNoiseMap, GenerateNoiseMapV2 } from "../vxNoise";
import { terrainShader } from "../terrainShader";
import { terrainStore } from "../../store";

// auto generate terrain
export default function City({position = [0, 0, 0], ...props}) {
  const fov = 60;
  const aspect = 1920 / 1080;  // div width / height
  const near = 0.1;
  const far = 1000.0;

  return (
    <Canvas>
      <PerspectiveCamera makeDefault {...{position: [0, 10, 40], fov, aspect, near, far}} />
      <React.Suspense fallback={null}>
        <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <TerrainChunkManager {...props} />
        </group>
      </React.Suspense>
      <MapControls />
      <ambientLight />
    </Canvas>
  ) 
}

function TerrainChunkManager({ visibleTerrain, seed, width, depth, calculateOnce, scale = 0.1, ...props }){
    const [lastCalculatedPosition, setLastCalculatedPosition] = React.useState();
    
    const keysRequired = terrainStore(state => state.keysRequired);

    const setState = terrainStore(state => state.setState);
    const buildTerrain = terrainStore(state => state.buildTerrain)
  
    const { camera } = useThree();
  
    // React.useEffect(() => {
       // camera.position.set( 40000 , 100 , 30000 );
    // }, [])

    useFrame(() => {
      // calc current chunk position
      const camX = camera.position?.x
      const camZ = camera.position?.z

      const pos = [Math.floor(camX / width), Math.floor(camZ / width)];
      // cam pos when you first calculated ??? why!
      const shouldIReCalculate = !lastCalculatedPosition || outOfRange(pos[0], lastCalculatedPosition[0], 1) || outOfRange(pos[1], lastCalculatedPosition[1], 1);

      // find terrain that should exist
      if((shouldIReCalculate && !(calculateOnce ? visibleTerrain.length : 0))){
        setLastCalculatedPosition([...pos]);

        setState({keysRequired: terrainKeys(pos, depth, width)})
      }
  
      // add to pool
      if(keysRequired.length){
        buildTerrain(TerrainChunk)
        /* ---- 
        // get scale and position from key
        const vals = [k.indexOf('*'), k.indexOf('_')];
        let scle = Number(k.slice(1 + vals[1])); 

        const newChunk = <TerrainChunk {...{
          scale,
          width: width * scle, // this is the wrong way to handle sampling density
          seed,
          meshProps: { position: [Number(k.slice(0, vals[0])) * width, Number(k.slice(1 + vals[0], vals[1])) * -width, 0] },
          key: k,
          ...props
        }} /> */
      }
    }, [])
  
    return visibleTerrain
}

/**
 * @param {Number} pos position at which to start calculating
 * @param {Number} depth sampling densety
 * @param {Number} width the length a where a **2 is the area of the square to be calculated
 * @returns an array of the required terrainChunks as text in the format `${x}*${y}_${3 ** sampling densety}`
 */
function terrainKeys(pos, depth, width){
  let keysReq = [`${pos[0]}*${pos[1]}_1`];

  for(let i = 1; i < depth; i ++){
    const pow = 3 ** (i - 1);
    for(let j = 0; j < 8; j++){
      keysReq.push(`${Math.round(pos[0] + (ofsX[j] * pow)  + ((ofs[i - 1][j << 1]) / width))}*${Math.round(pos[1] + (ofsY[j] * pow)  + ((ofs[i - 1][(j << 1) + 1]) / width))}_${pow}`);
    }
  }
  return keysReq;
}

function TerrainChunk({ width, scale, seed, meshProps, ...props }) {
    let { positions, colors, normals, indices } = React.useMemo(() => {
        const { positions, colors, normals, indices } = calculateTerrainArrayData({width, scale, seed, meshProps, ...props})

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

/**
 * 
 * @param {Number} width width and height of map
 * @param {Number} scale for noise / howfar the points are appart
 * @param {Number} seed ...
 * @param {Number} heightModifier multiplier for height value of noise
 * @param {Number} chunkDepth number of vertecies per mesh
 * @returns 
 */
function calculateTerrainArrayData({width, scale, seed, heightModifier, chunkDepth, meshProps, ...props}) {
    const size = width / chunkDepth;

    let positions = [], colors = [], normals = [], indices = [];

    GenerateNoiseMapV2({width, seed, scale, chunkDepth, ...props}).forEach((h, k) => {
      normals.push(0, 0, 1)

      let i = Math.floor(k / size)
      let j = k % size

      positions.push(j / scale, i / scale, h * heightModifier)
      
      if((i < (size - 1)) && (j < (size - 1))){ // no right and bottom vertecies
        indices.push(k, k + 1, k + size + 1)
        indices.push(k + size + 1, k + size, k)
      }

      colors.push(...terrainShader(h, seed))
      
    })

    return { positions, colors, normals, indices }
}

// ---

const outOfRange = (val, center, range) => val < (center - range) || val > (center + range)

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