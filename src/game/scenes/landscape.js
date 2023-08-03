// place items
// build / load from file
// spin off random instance
// auto generate flora - and posibly fauna

import React from "react";
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls, Plane } from "@react-three/drei";
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

  // consider adding upright planes that simulate a shade applied to the distance
  return (
    <Canvas>
      <PerspectiveCamera makeDefault {...{position: [0, 100, 0], fov, aspect, near, far}} />
      <React.Suspense fallback={null}>
        <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <TerrainChunkManager {...props} />
            {/*<mesh>
              <Plane position={[0, 0, 0]} args={[1000, 1000]} material-color="blue" />
              <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
            </mesh>*/}
        </group>
      </React.Suspense>
      <MapControls />
      <ambientLight />
    </Canvas>
  ) 
}

function TerrainChunkManager({ keysRequired, visibleTerrain, width, calculateOnce }) {
    const [lastCalculatedPosition, setLastCalculatedPosition] = React.useState();
    
    const buildTerrain = terrainStore(state => state.buildTerrain)
    const handlePositionKey = terrainStore(state => state.handlePositionKey)
  
    const { camera } = useThree();
  
    // React.useEffect(() => {
       // camera.position.set( 40000 , 100 , 30000 );
    // }, [])

    useFrame(() => {
      // calc current chunk position
      const camX = camera.position?.x
      const camZ = camera.position?.z

      // update when you enter the next tile

      const pos = [Math.floor(camX / width), Math.floor(camZ / width)];
      // cam pos when you first calculated ??? why!
      const shouldIReCalculate = !calculateOnce && positionNeedsUpdate(pos, lastCalculatedPosition);

      // find terrain that should exist
      if(shouldIReCalculate || visibleTerrain.length === 0) {
        setLastCalculatedPosition([...pos]);
        handlePositionKey(pos)
      }
  
      if(keysRequired.length) buildTerrain(TerrainChunk)
    }, [])
  
    return visibleTerrain
}

function TerrainChunk({ meshProps, ...props }) {
    let { positions, colors, normals, indices } = React.useMemo(() => {
        const { positions, colors, normals, indices } = calculateTerrainArrayData({...props, ...{position: meshProps.position}})

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
        <meshStandardMaterial wireframe={false} vertexColors {...{ side: FrontSide }} />
    </mesh>
}

/**
 * 
 * @param {Number} width width and height of map
 * @param {Number} streach the basic distance between point x and point x + 1
 * @param {Number} vertexDepth the higher this the less vertecies --- [width % vertexDepth === 0]
 * @param {Number} heightModifier multiplier for height value of noise
 * @returns 
 */
function calculateTerrainArrayData({width, heightModifier, vertexDepth, streach, mono, calcVer, ...props}) { // add location offset
  const size = ((width - 1) / vertexDepth) + 1; // width ??
  let positions = [], colors = [], normals = [], indices = [];

  // adjustment for shader
  let ww =  (width - 1)
  let shaderOffset = 0
  for(let l = 0; l < vertexDepth; l++){
    ww /= 3
    shaderOffset += ww
  }

  const gen = [GenerateNoiseMapV2, GenerateNoiseMap]
  gen[calcVer ? 0 : 1]({width, vertexDepth, ...props}).forEach((h, k) => {
    normals.push(0, 0, 1) // calc ... ?

    let i = Math.floor(k / size)
    let j = k % size

    positions.push(j * vertexDepth * streach, i * vertexDepth * streach, h * heightModifier)
    
    if((i < (size - 1)) && (j < (size - 1))){ // no right and bottom vertecies
      indices.push(k, k + 1, k + size + 1)
      indices.push(k + size + 1, k + size, k)
    }

    let obj = {
      x: (i * vertexDepth) + 1 * (props.position[1] + width / 2) - shaderOffset,
      y: (j * vertexDepth) + 1 * (props.position[0] + width / 2) - shaderOffset
    }

    colors.push(...terrainShader({h, mono, ...obj}))
  })

  return { positions, colors, normals, indices }
}

const outOfRange = (val, center, range) => val < (center - range) || val > (center + range)
const positionNeedsUpdate = (currentPosition = [0, 0], lastPosition = [0, 0]) => outOfRange(currentPosition[0], lastPosition[0], 1) || outOfRange(currentPosition[1], lastPosition[1], 1)