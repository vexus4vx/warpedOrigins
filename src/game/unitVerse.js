// minimalistic extremely low poly world that units move in 

/*
    1: landscape - need to shade accordingly
    2: physics
    3: assets - need to be able to freely color
    4: manakin - need to be able to r=freely color
    5: day / night / cloudy sky 
    6: water / swim / rivers ... 
    7: unit unit and unit player interaction

    // https://www.turbosquid.com/3d-models/gum-tree-3d-models-with-green-summer-fall-and-leafless-winter-2148164
*/
import React from "react";
import { useFrame, useThree, Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, MapControls, Plane } from "@react-three/drei";
import { FrontSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function UnitView({position = [0, 0, 0], ...props}) {
    const fov = 45; // 60
    const aspect = 1920 / 1080;  // div (width / height) !!!
    const near = 0.1;
    const far = 3000.0;
    const gltf = useLoader(GLTFLoader, '../assets/models/human_1.glb');
  
    return (
      <Canvas>
        <primitive
          object={gltf.scene}
          position={[0, 1, 0]}
          children-0-castShadow
        />
        <PerspectiveCamera makeDefault {...{position: [50, 50, -140], fov, near, far}} />
        <React.Suspense fallback={null}>
          <group dispose={null} position={position} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh>
                <Plane position={[0, 0, 0]} args={[1000, 1000]} material-color="green" />
                <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
              </mesh>
          </group>
        </React.Suspense>
        <MapControls />
        <ambientLight />
      </Canvas>
    ) 
  }