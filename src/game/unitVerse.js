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
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls, Plane, useGLTF } from "@react-three/drei";
import { FrontSide } from 'three';

import { Humanoid } from "../assets/models/humanoid";

export function UnitView({position = [0, 0, 0], ...props}) {
    const fov = 45; // 60
    const aspect = 1920 / 1080;  // div (width / height) !!!
    const near = 0.1;
    const far = 3000.0;

// need mx and min scrolling boundaries ...
// need a way to load assets ...

  return <Canvas>
    <PerspectiveCamera makeDefault {...{position: [2, 2, 4], fov, near, far}} />
    <React.Suspense fallback={null}>
      <group dispose={null} position={position}>
          <mesh>
            <Plane position={[0, 0, 0]} args={[100, 100]} material-color="green"/>
            <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
            <React.Suspense fallback={null}>
              <Humanoid />
            </React.Suspense>
          </mesh>
      </group>
    </React.Suspense>
    <MapControls />
    <ambientLight />
  </Canvas>
}

export function UnitVerse({position = [0, 0, 0], ...props}){
  const fov = 45; // 60
  const aspect = 1920 / 1080;  // div (width / height) !!!
  const near = 0.1;
  const far = 3000.0;
  // Landscape instead of plane
  return <Canvas>
    <PerspectiveCamera makeDefault {...{position: [2, 2, 4], fov, near, far}} />
    <React.Suspense fallback={null}>
      <group dispose={null} position={position}>
          <mesh>
            <Plane position={[0, 0, 0]} args={[100, 100]} material-color="green"/>
            <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
          </mesh>
      </group>
    </React.Suspense>
    <MapControls />
    <ambientLight />
  </Canvas>
}