import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboard, useMouse, useKeyboardControls } from "../symulation/interface/hooks";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const CharackterClass = (function() {
    /**
     * construct a charackter-class.
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function CharackterClass(props) { // set relavent parameters
        // we need the mesh
        // we need the animations
        // we need the behaviour
        // we need functions to act on info - like there is a wall so go left
        // maybe hook in an ai class and grow a neural network collectively

        return this;
    }

    /**************Public API****************/

    CharackterClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return CharackterClass;
})();

export const Player = ({ position = [0, 200, 0], position1, canvasRef }) => {
    const [updPos, setUpdPos] = React.useState(1);
    const keyboard = useKeyboard();
    const mouse = useMouse();
    const ref = React.useRef()

    useFrame((state, delta) => {
        // ...
        // setChange(hasChanged()); // is this ok ?

        const {move, look, running} = getInput(keyboard, mouse);
        if((move[0] || move[1] || move[2]) && ((Date.now() - updPos) > 60)){
            setUpdPos(new Date());

            ref.current.position.x += move[0];
            ref.current.position.y += move[1];
            ref.current.position.z += move[2];

            state.camera.lookAt(ref.current.position);
            state.camera.updateProjectionMatrix();
        }
    });

    // maybe rotate ?
    // needs to be kinematic type
    return <RigidBody type="dynamic" mass={5} collider='auto'>
        <group position={position} ref={ref}>
            <PerspectiveCamera makeDefault {...{fov: 60, near: 0.1, aspect: canvasRef.current.width / canvasRef.current.height, far: 30000.0}} />
            <mesh userData={{ tag: "player" }} castShadow>
                <meshPhysicalMaterial metalness={0.5} roughness={0} />
                <sphereGeometry args={[10, 50, 50]} />
            </mesh>
        </group>
    </RigidBody>
};

function getInput(keyboard, mouse) {
    let [x, y, z] = [0, 0, 0];
    // Checking keyboard inputs to determine movement direction
    if (keyboard["s"]) z += 1.0; // Move backward
    if (keyboard["w"]) z -= 1.0; // Move forward
    if (keyboard["d"]) x += 1.0; // Move right
    if (keyboard["a"]) x -= 1.0; // Move left
    if (keyboard[" "]) y += 1.0; // Jump
  
    // Returning an object with the movement and look direction
    return {
      move: [x, y, z],
      look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
      running: keyboard["Shift"], // Boolean to determine if the player is running (Shift key pressed)
    };
}

/// this works but ... 
export const Player2 = () => {
    const {
      moveBackward,
      moveForward,
      moveLeft,
      moveRight
    } = useKeyboardControls();
  
    const targetRef = React.useRef(null);
  
    useFrame((state, delta) => {
      targetRef.current.position.x += moveRight ? 0.2 : moveLeft ? -0.2 : 0;
      targetRef.current.position.z += moveForward
        ? -0.2
        : moveBackward
        ? +0.2
        : 0;
      state.camera.lookAt(targetRef.current.position);
      state.camera.updateProjectionMatrix();
    });
    return <group ref={targetRef}>
        <OrbitControls />
        <PerspectiveCamera
            makeDefault
            position={[0, 260, 0]}
            args={[60, 0.1, 1, 1000]}
        />
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={"#ff0000"} />
        </mesh>
    </group>
};