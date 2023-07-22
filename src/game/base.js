import { Box, Plane, PerspectiveCamera, MapControls } from "@react-three/drei";
import React from "react";
import { Canvas } from "react-three-fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import niceColors from 'nice-color-palettes';
import Simulation from "./simulation";

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

function Scene() {
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

function Scene2() {

  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 0.1;
  const far = 10000.0;

  return (
    <Canvas>
      <PerspectiveCamera makeDefault {...{position: [-201, 81, 68], fov, aspect, near, far}} />
      <React.Suspense fallback={null}>
        <Simulation />
      </React.Suspense>
      <MapControls />
      <ambientLight />
    </Canvas>
  )
}

export default function Game() {
  return <Scene2 />
}