import React from "react";
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls, CameraControls, OrbitControls, Environment, Stats, useProgress, Html } from "@react-three/drei";
import { FrontSide } from 'three';
// import { useControls } from 'leva'
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";

import { Player } from "./vxPlayer";
import Spinner from "../atoms/spinner";
import { CharacterController } from "./vxCharackterController";
//import Playervx from "./vx/Player";
//import Floor from "./vx/Floor";
//import { useStore } from "./vx/Game";
// import Obstacles from "./vx/Obstacles";

// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'

// this needs to be a generated map ...
    /*
        world is the map we are playing on
            1: elevation: at minimum this should include a heightMap or relative function with seed
                1.0: climate (a set description of the weather, heat, humidity forever in this region)
                    should follow from height, soil composition and location
                1.1: terrain (soil type + current like wet, dry, warm, cold -- kinda like the weather on the day)
                    should follow from height and location + climate / seasons
            2: interactivity: ie an algorithm where a manipulation to a set of constants causes permanent change
                this amounts to digging a hole or manually changeing the preset terrain or weather effects on terrain
                basically this is constant change in the environment 
                like a neural net where you randomly spawn the input weights and biases
                and then edit them one by one to cause obvious changes in the environment
                - this is a kinda back burner thing for now
            3: flora: procedurally spawned based on climate, allow for interaction
            4: fauna: procedurally spawned based on climate, allow for interaction
                link to flora



    */

/**
 * 
 * @param {Number} seed 
 * @returns {Object} existing climate 
 * /
export function WorldMap({seed, location, ...props}) {
    // create a map - 2**50 * 2 **50

    return {
        // climate - depends on current date
        weather: 8,
        temperature: 7,
        humidity: 5,
        // terrain
        terrain: 8,
        height: 3,
        soilType: 4
    }
}


    // console.log ({DragonMap1});
    /**
     * --- this is kinda for rules
     I need a map - so lets take a png and load the pixelData - the rbg data should be a smooth transition 
     we then need only spread it over a properly large distance
     the x and y coordinates will need to be used to compute the information of the current and adjasant tiles

     so we have 
        1: 3by of data on the current map in a xy pixel version saved in png format
            say this is for the heightmap (maby 3by is excessive ?)
        2: 1by of data that we can edit freely 
            since we can use the alpha channel to note some things
            maybe resource value ???
            I mean since we aren't going to determine every tree that gets chopped why not keep track of resources this way ?
                some things are renewable - flora and fauna, some aren't - minerals
                1 renewable
                    flora 1 - dependant on climate                              (grassy plants, anuals, brambles, small perenials)
                    flora 2 - dependant on time + climate                       (trees)
                    flora 3 - dependant on env (flora 2) + climate              (parasytic plants, climbing plants, understory plants, fungy ?)
                    fauna 1 - dependant on self and flora and fauna 2 + climate (herbivours  + some omnivoures)
                    fauna 2 - dependant on self and fauna 1 & 2 + climate       (carnivours + some omnivoures)
                    fauna 3 - (humanoids)
        3: we can decide climate based on x,y location + presets
        4: the date can give us info on the weather on the selected day 
     */

    /*
        we need the following
        1: image to map   - 1km**2    ?*?
        2: inner map 1    - 100m**2  10*10
        3: inner map 2    - 10m**2   10*10
        4: inner map 1    - 1m**2    10*10

        lets do the generic map first
    */
    // from png figure out tile info for the current location and the surrounding locations
    // I can't do this so lets just experiment for now

    // basic 3d world from initial images 
    // lets use DragonMap1 to create a heightmap


////..................................................................

export function VxGameWorld({position = [0, 0, 0], landscape}) {
    function Loader() {
        const { progress } = useProgress()
        return <Html center>
            {/*<Spinner />*/}
            {progress} % loaded
        </Html>
    } // add spinner ?

    const canvasRef = React.useRef();

    // <Physics gravity={[0, 1, 0]} interpolation={false} colliders={false} >

    return <Canvas ref={canvasRef} shadows onPointerDown={(e) => e.target.requestPointerLock()}>
        <React.Suspense fallback={<Loader />}>
        <Physics debug>
            {/* <Player canvasRef={canvasRef} position1={landscape?.visibleTerrain} /> */}
            <Player canvasRef={canvasRef} position1={landscape?.visibleTerrain} />
            <group dispose={null} position={position} rotation={[-Math.PI / 2, 0, 0]}>
                <TerrainChunkManager terrainClass={landscape} canvasRef={canvasRef} />
            </group>
            {/*<CharacterController position={[0,200,0]} />*/}
            {/*<Playervx position={[0, 20, 0]} />*/}
        </Physics>
        {/*<Stats />*/}
        </React.Suspense>
        <ambientLight intensity={Math.PI / 2} />
    </Canvas>
}

// for this version of the terrainChunk manager lets addapt a different approach
// all chuncks have equal size but the detail loaded is seperatly controlled ...
function TerrainChunkManager({ terrainClass, canvasRef }) {
    const [lastCalculatedPosition, setLastCalculatedPosition] = React.useState(); // rem ?

    const { camera } = useThree();
  
    /* React.useEffect(() => {
       camera.position.set( 0 , 100 , 0 );
    }, []) */

    useFrame(() => {
      // calc current chunk position
      const camX = camera.position?.x // no change ...
      const camZ = camera.position?.z // no change ...

      // update when you enter the next tile ... - which it's not doing
      const pos = [Math.floor(camX / canvasRef.current.width), Math.floor(camZ / canvasRef.current.width)];
      // cam pos when you first calculated ??? why!
      const shouldIReCalculate = positionNeedsUpdate(pos, lastCalculatedPosition); // bool
      // find terrain that should exist
      if(shouldIReCalculate || terrainClass?.visibleTerrain.length === 0) {
        console.log('I need to recalc') // .................
        setLastCalculatedPosition([...pos]);
        terrainClass?.handlePositionKey(pos)
      }
    }, [])

    return terrainClass?.visibleTerrain.map(({key, ...props}) => <TerrainChunk key={key} {...props} close={key.slice(-1) <= 2} />)
}

const outOfRange = (val, center, range) => val < (center - range) || val > (center + range)
const positionNeedsUpdate = (currentPosition = [0, 0], lastPosition = [0, 0]) => outOfRange(currentPosition[0], lastPosition[0], 1) || outOfRange(currentPosition[1], lastPosition[1], 1)

function TerrainChunk({ position, positions, colors, normals, indices, close }) {
    const ref = React.useRef()

    const terrainChunk = <mesh ref={ref} position={position} receiveShadow>
        <planeGeometry>
            <bufferAttribute attach='attributes-position' array={positions} count={positions.length / 3} itemSize={3} />
            <bufferAttribute attach='attributes-color' array={colors} count={colors.length / 3} itemSize={3} />
            <bufferAttribute attach='attributes-normal' array={normals} count={normals.length / 3} itemSize={3} />
            <bufferAttribute attach="index" array={indices} count={indices.length} itemSize={1} />
        </planeGeometry>
        <meshStandardMaterial wireframe={false} vertexColors {...{ side: FrontSide }} />
    </mesh>

    // hull is ok for 1 or maybe 2 - trimesh doesn't hold it ...
    // maybe decide colliders bases on the value of close
    return close ? <RigidBody colliders="hull" type="fixed" >{terrainChunk}</RigidBody> : terrainChunk;
}