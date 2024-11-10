import React from 'react'
import { usePlane } from '@react-three/cannon'
import { useStore } from './Game'

export default function Floor() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }), React.useRef())

  const groundObjects = useStore((state) => state.groundObjects)

  React.useEffect(() => {
    const id = ref.current.id
    groundObjects[id] = ref.current
    return () => {
      delete groundObjects[id]
    }
  }, [groundObjects, ref])

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial />
    </mesh>
  )
}
