import React from "react";
import { Box, Plane } from "@react-three/drei";
import { Canvas } from "react-three-fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import niceColors from 'nice-color-palettes';

import City from "./scenes/landscape";
import { terrainStore } from "../store";

function PhyPlane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }));

  return (
      <Plane args={[1000, 1000]} ref={ref}>
        <meshStandardMaterial color={color} />
      </Plane>
  );
}

function PhyBox(props) {
  const [ref, api] = useBox(() => ({ args: [1, 1, 1], mass: 1, ...props }));

  return (
      <Box
          args={[1, 1, 1]}
          ref={ref}
          onClick={() => api.applyImpulse([0, 5, -10], [0, 0, 0])}
      >
        <meshNormalMaterial />
      </Box>
  );
}

function SceneTest() {
  return (
      <Canvas camera={{ position: [0, 0, 0], near: 0.1, far: 1000 }}>
          <Physics gravity={[0, -10, 0]}>
              <PhyPlane
                  color={niceColors[17][5]}
                  position={[0, -2, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
              />
          </Physics>
          <ambientLight intensity={0.3} />
          <pointLight intensity={0.8} position={[5, 0, 5]} />
      </Canvas>
  );
}

export default function Game({id = 0}) {
  const {setTerrainProps, ...terrainProps} = terrainStore(state => state.terrainProps);
  const visibleTerrain = terrainStore(state => state.visibleTerrain);

  return <City {...terrainProps} visibleTerrain={visibleTerrain} />
}