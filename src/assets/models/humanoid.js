import React from "react"
import { useGLTF } from '@react-three/drei'

export function Humanoid() {
    const { scene } = useGLTF('human_1.glb');
    const hmn = React.useRef();

    return <group ref={hmn} dispose={null} rotation={[Math.PI/2,0,0]}>
        <primitive object={scene} />
   </group>
}