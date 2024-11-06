import React from "react";
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { PerspectiveCamera, MapControls, Plane } from "@react-three/drei";
import { FrontSide } from 'three';

import LandscapeClass from './vxTerrainClass';


import DragonMap1 from './maps/vxMaps/DragonMap1.json';
import vxTerrainClass from "./vxTerrainClass";
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
 */
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


/**
 * from png figure out tile info for the current location and the surrounding locations
 * @returns ...
 */
export function FlatMap({x, y}){
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
    return <div />;
}

////..................................................................

export function Landscape3D({position = [0, 0, 0], ...props}) {
    const fov = 45; // 60
    const aspect = 1920 / 1080;  // div (width / height) !!!
    const near = 0.1;
    const far = 3000.0;
  
    // consider adding upright planes that simulate a shade applied to the distance
    // dispose={null} or not ?
    return (
      <Canvas>
        <PerspectiveCamera makeDefault {...{position: [48, 136, -148], fov, near, far}} />
        <React.Suspense fallback={null}>
          <group dispose={null} position={position} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh>
                <Plane position={[0, 0, 40]} args={[1000, 1000]} material-color="blue" />
                <meshStandardMaterial vertexColors {...{ side: FrontSide }} />
              </mesh>
          </group>
        </React.Suspense>
        <MapControls />
        <ambientLight />
      </Canvas>
    ) 
}

// for this version of the terrainChunk manager lets addapt a different approach
// all chuncks have equal size but the detail loaded is seperatly controlled ...
function TerrainChunkManager({ visibleTerrain, width }) {
    const [terranClass, setTerrainClass] = React.useState(new LandscapeClass());
    const [lastCalculatedPosition, setLastCalculatedPosition] = React.useState();
    
    // this needs to be a new instance of the terrain class
    const handlePositionKey = terranClass.handlePositionKey
  
    const { camera } = useThree();
  
    /* React.useEffect(() => {
       camera.position.set( 0 , 100 , 0 );
    }, []) */

    useFrame(() => {
      // calc current chunk position
      const camX = camera.position?.x
      const camZ = camera.position?.z

      // update when you enter the next tile

      const pos = [0, 0] // [Math.floor(camX / width), Math.floor(camZ / width)];
      // cam pos when you first calculated ??? why!
      const shouldIReCalculate = positionNeedsUpdate(pos, lastCalculatedPosition);

      // console.log(pos, camera.position) // 48 136 -148

      // find terrain that should exist
      if(shouldIReCalculate || visibleTerrain.length === 0) {
        setLastCalculatedPosition([...pos]);
        handlePositionKey(pos, TerrainChunk)
      }
    }, [])
  
    return visibleTerrain
}

const outOfRange = (val, center, range) => val < (center - range) || val > (center + range)
const positionNeedsUpdate = (currentPosition = [0, 0], lastPosition = [0, 0]) => outOfRange(currentPosition[0], lastPosition[0], 1) || outOfRange(currentPosition[1], lastPosition[1], 1)

function TerrainChunk({ meshProps, ...props }) {
    // console.time('buildChunk')
      let { positions, colors, normals, indices } = React.useMemo(() => {
          const { positions, colors, normals, indices } = calculateTerrainArrayData({...props, ...{position: meshProps.position}})
  
          return {
              positions: new Float32Array(positions),
              colors: new Float32Array(colors),
              normals: new Float32Array(normals),
              indices: new Uint16Array(indices)
          }
      }, [])
    // console.timeEnd('buildChunk')
  
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

function calculateTerrainArrayData({width, heightModifier, vertexDepth, streach, calcVer, ...props}) { // add location offset
    vertexDepth = 3 ** (vertexDepth - 1)
  
    const size = ((width -1) / vertexDepth) + 1; // width ??
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
  
      const i = Math.floor(k / size), j = k % size, basicHeight = 0//terrainOverSlope(i, j, {scale: props.scale, position: props.position, vertexDepth, width})
  
      positions.push(j * vertexDepth * streach, i * vertexDepth * streach, h * heightModifier + basicHeight)
      
      if((i < (size - 1)) && (j < (size - 1))){ // no right and bottom vertecies
        indices.push(k, k + 1, k + size + 1)
        indices.push(k + size + 1, k + size, k)
      }
  
      let obj = {
        x: (i * vertexDepth) + 1 * (props.position[1] + width / 2) - shaderOffset,
        y: (j * vertexDepth) + 1 * (props.position[0] + width / 2) - shaderOffset
      }
  
      colors.push(...terrainShader({h: (h + (basicHeight / heightModifier)), ...obj, mono: true}))
    })
  
    return { positions, colors, normals, indices }
}

function terrainShader({h, mono = false, x, y}) {
    let col = [h, h, h];
    if(mono) return col;
  
    for(let i = 0; i < regions.length; i++) {
      if(h <= regions[i].height) {
        col = finalColor({arr: colors[regions[i].key], arrG: colors[regions[i - 1].key], x, y, h, h1: regions[i].height, g: regions[i - 1].height})
        break;
      }
    }
  
    return col
}

function finalColor({arr, arrG, x, y, h, h1, g}){
    const prl = perl(x, y) 
  
    // blend
    let max = arr[rand() % arr.length].map(v => ((prl / 10) + v) / 1.1) // 1.1 = 110 %
    let min = arrG[rand() % arrG.length].map(v => ((prl / 15) + v) / 1.15) // 1.15 = 115 %
    
    const selectedPercentage = (h - g) / (h1 - g) // 0 -> 1
    return max.map((v, k) => selectedPercentage * v + ((1 - selectedPercentage) * min[k]))
}

const rand = () => Math.round((Math.random() * 10) + 1)
const perl = (x, y) => perlinNoise({x, y, ...A}) / maxA

const regions = [
    {height: -10000000, key: 'brownGray'}, // bottom limit
    {height: 0.25, key: 'brownGray'},
    {height: 0.29, key: 'sandy'},
    // {height: 0.30, key: 'cliffGray'},
    {height: 0.45, key: 'greenLight'},
    {height: 0.5, key: 'greenLush'},
    {height: 0.65, key: 'greenDeep'},
    {height: 0.70, key: 'wastedGreen'},
    {height: 0.75, key: 'brown'},
    {height: 0.95, key: 'brownGray'},
    {height: 0.98, key: 'grayDark'},
    {height: 0.99, key: 'grayLight'},
    {height: 1, key: 'white'},
    {height: 200000000, key: 'white'} // top limit
]


const A = {
    width: 30,
    depth: 4,
    seed: 4151,
    scale: 3.6,
    lacunarity: 1.9,
    octaves: 5,
    persistance: -0.3,
    octaveOffsetX: 5,
    octaveOffsetY: -3,
    streach: 1,
    amplitude: 0.21,
    frequency: 0.01
}

const colors = {
    white: [[1,1,1], [0.99,1,1], [0.99, 0.99, 0.99], [1, 0.989, 0.99]],
    grayLight: [[0.9,0.91,0.9], [0.87,0.86,0.86], [0.78, 0.8, 0.81], [0.92, 0.91, 0.87]],
    grayDark: [[0.41,0.41,0.4], [0.5,0.52,0.51], [0.3, 0.3, 0.3], [0.21, 0.21, 0.2]],
    brownGray: [[0.3176, 0.3569, 0.302], [0.298, 0.2588, 0.188], [0.247, 0.2, 0.1098], [0.35686, 0.341176, 0.30588]],
    wastedGreen: [[0.243, 0.4392, 0.28235], [0.149, 0.4196, 0.2039], [0.2941, 0.40784, 0.262745]],
    greenDeep: [[0.08235, 0.2471, 0.07451], [0.023529, 0.266667, 0.12941]],
    greenLush: [[0.0588, 0.349, 0.0549], [0.0470588, 0.4196, 0.027491]],
    greenLight: [[0.2916, 0.5294, 0.0862745], [0.2916, 0.607843, 0.05098], [0.145, 0.65882, 0.117647]],
    cliffGray: [[0.41,0.41,0.4], [0.3, 0.3, 0.3], [0.87,0.86,0.86]],
    sandy: [[0.7882, 0.7255, 0.447], [0.95686, 0.90588, 0.67843], [0.898, 0.870588, 0.75294]],
    brown: [[0.2588235, 0.25098, 0.231372549], [0.39216, 0.2549, 0.09019]]
}

const valueAtLimit = ({octaves, persistence, amplitude}) => {
    let v = 0;
    for (let i = 0; i < octaves; i++) {
        v += amplitude
        amplitude *= persistence
    }
    return v
}
  
const maxA = Math.abs(valueAtLimit({amplitude: A.amplitude, persistence: A.persistance, octaves: A.octaves}))

function GenerateNoiseMapV2({width, scale, octaves , persistence, lacunarity, vertexDepth, position, amplitude, ...props }) {
    if(!scale || scale < 0) scale = 0.0001;
    if(octaves < 1) octaves = 1;
    if(lacunarity < 1) lacunarity = 1;
    if(width < 1) width = 1;
    if(persistence < 0 || persistence > 1) persistence = 1 / persistence

    // const centers = [position[0] + ((width -1)/2), position[1] + ((width -1)/2)]
    // console.log(vertexDepth)

    const maxVal = Math.abs(valueAtLimit({amplitude, persistence, octaves}))
    let noiseMap = [];

    for(let y = 0; y < width; y += vertexDepth){
        let sampleY = ((y + position[1]) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x + position[0]) / scale);

            // console.log({sampleX, sampleY})

            const perlinValue = perlinNoise({x: sampleX, y: sampleY, octaves, persistence, amplitude, lacunarity, ...props})
            // const yy = rand3(sampleX, sampleY, 1256)
     
            noiseMap.push(perlinValue) // noiseMap.push(perlinValue) // ((perlinValue / maxVal) + 1) / 2
        }
    }

    // for values between 0 and 1 ?
    return noiseMap.map(v => (maxVal - v) / (maxVal << 1)) // just devide v by maxVal
}

function GenerateNoiseMap({width, scale, vertexDepth, position, seed, ...props}) {
    if(!scale || scale < 0) scale = 0.0001;
    const  {amplitude, persistence, octaves} = props

    const maxVal = Math.abs(valueAtLimit({amplitude, persistence, octaves}))
    let prevVal = 0, noiseMap = [];

    for(let y = 0; y < width; y += vertexDepth){
        let sampleY = ((y + position[1]) / scale);
        for(let x = 0; x < width; x += vertexDepth){
            let sampleX = ((x + position[0]) / scale);

            const seedBasedVal = randomValueFromSeed(seed, sampleX, sampleY, prevVal)
            let perlinValue = perlinNoise({x: sampleX, y: sampleY, seed, ...props}) * 2 - 1

            const res = interpolate(perlinValue, prevVal, seedBasedVal)
            noiseMap.push(Math.cos((res / 4.764) + 0.26))
            prevVal = (perlinValue + seedBasedVal) / 2
        }
    }

    // for values between 0 and 1 ?
    noiseMap = noiseMap.map(v => (maxVal - v) / (maxVal << 1))

    return noiseMap
}

function randomValueFromSeed(seed, x = 0, y = 0, z = 0){
    const values = [
        seed / 200,
        (seed - 300) / 450,
        seed - 43321,
        (seed ** 2) - (4006 * (seed ** 3)),
        ((seed << 2) - 433050) ** 2,
        (((seed / 12550) << 2) + 6) ** 2,
        ((seed << 2) + 6) ** 2,
        (seed >> 2) - 700
    ] // add a few if statements

    let val = (values[3] * z) + values[2] - x + (55 * y) + ((values[1] - values[2]) * (y + x)) - (values[0] * (2 * y - x + z - 4.4))
    val = (val / 1234) + ((val / 5) >> 2)
    if(values[2] > 500) val = (val + values[4] + (values[5] * z) + ((z ** 3 - y** 2) * values[6]) + ((x * z * y / 3.42) % values[7]))
    val = Math.abs(val)

    while(val > 1) val/=10

    return val
}

const interpolate = (a, b, t) => a + t * (b - a)

function perlinNoise ({x, y, seed, lacunarity = 2.4, persistence = 0.75, octaves = 20, scale = 0.0833333, octaveOffSetX = 0, octaveOffSetY = 0, frequency, amplitude }) {
    if(Math.abs(octaveOffSetX) > 1) octaveOffSetX = 1 / octaveOffSetX
    let z = interpolate(seed % 200, seed / 255, seed % 3314 - 77); // seed % 200
  
    let v = 0
    for (let i = 0; i < octaves; i++) {
        let octaveOffSetA = randomValueFromSeed(seed, i)
        let octaveOffSetB = randomValueFromSeed(seed, 0, i)
        let perl3 = perlin3((x * frequency * scale) + octaveOffSetA + (octaveOffSetX || 0), (y * frequency * scale) + octaveOffSetB + (octaveOffSetY || 0), z)

        v += (perl3 * amplitude)
        amplitude *= persistence
        frequency *= lacunarity
    }
  
    return v
}

function perlin3(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
        lerp(n000, n100, u),
        lerp(n001, n101, u), w),
        lerp(
        lerp(n010, n110, u),
        lerp(n011, n111, u), w),
        v);
}

function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
}

function lerp(a, b, t) {
    return (1-t)*a + t*b;
}

var perm = new Array(512);
var gradP = new Array(512);