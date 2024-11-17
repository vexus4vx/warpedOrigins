import { useAnimations, useGLTF } from "@react-three/drei";
import React from "react";
import { LoopOnce, LoopRepeat } from 'three'

export function Character({ animation, ...props }) {
  const ref = React.useRef();
  // const { nodes, materials, animations } = useGLTF("/models/eve.glb");

  const { nodes, materials, animations } = useGLTF('/models/eve.glb')
  const idleAnimation = useGLTF('/models/eve@idle.glb').animations
  const walkAnimation = useGLTF('/models/eve@walking.glb').animations
  const jumpAnimation = useGLTF('/models/eve@jump.glb').animations


  const { actions, mixer } = useAnimations(animations, ref);


  /* 
  React.useEffect(() => {
    const key = {
        run: idleAnimation, 
        walk: walkAnimation, 
        idle: jumpAnimation
    }

    actions[key[animation]]?.reset().fadeIn(0.24).play();
    return () => actions?.[animation]?.fadeOut(0.24);
  }, [animation]); //*/

  //*
  React.useEffect(() => {
    actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current)
    actions['idle'].loop = LoopOnce
    actions['idle'].clampWhenFinished = true
    actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current)
    actions['walk'].loop = LoopRepeat
    actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current)
    actions['jump'].loop = LoopOnce
    actions['jump'].clampWhenFinished = true

    actions['idle'].play()
  }, [actions, mixer, idleAnimation, walkAnimation, jumpAnimation]) //*/


  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh castShadow name="Mesh" frustumCulled={false} geometry={nodes.Mesh.geometry} material={materials.SpacePirate_M} skeleton={nodes.Mesh.skeleton} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(['/models/eve.glb', '/models/eve@idle.glb', '/models/eve@walking.glb', '/models/eve@jump.glb'])