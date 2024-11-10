// const { terrainOverSlope } = require("../game/vxNoise");
const { perlin3, vxSeed } = require("./vxNoise");
// const { terrainShader } = require("../game/terrainShader");
const DragonMap1 = require("./maps/vxMaps/DragonMap1.json");

module.exports = (function() {
    /**
     * construct a game-class.
     * 
     * @constructor
     * @public
     * @param {Object} props 
     */
    function LandscapeClass(props) { // set relavent parameters
        this.terrainProps = {
            width: 60,//84,// 30, // must be even and <= 84 if depth === 4
            depth: 4, 
            seed: 4151,
            scale: 0.5,
            lacunarity: 0.9,
            heightModifier: 220,
            octaves: 7, 
            persistence: -0.34, // < 1
            octaveOffSetX: 5, 
            octaveOffSetY: -3,
            streach: 1,
            amplitude: 0.21, // very small
            frequency: 0.03
        }
        this.visibleTerrain = [] /* the only issue I have with this (besides it not being an object) is 
        that I can't remove seems this way
        however there are other things we can do instead 
        1: have all tiles of equal size but vary the detail shown ...
        2: show some more close tiles ?? - could add dark plane underneath as well - maybe skybox ?
        */
        this.terrainPool = {}
        this.keysRequired = []
        this.cameraBoundaries = {from: [0, 0], to: [0, 0]} // how far the camera may move ?

        return this;
    }
    
    LandscapeClass.prototype.addToPool = function(obj) {
       
        let out = {}, poolKeys = Object.keys(this.terrainPool)
        Object.keys(obj).forEach(k => {
            if(!poolKeys.includes(k)) out[k] = obj[k]
        })
        
        if(Object.keys(out).length) {this.terrainPool = {...this.terrainPool, ...out}}
        
    }
    
    /**
     * build the objects required to construct the terrainChunks
     */
    LandscapeClass.prototype.buildTerrain = function() {
        // setup - the breakdown aids smooth updating
        let keysRequired = this.keysRequired;

        // if pool is too full remove some chunks
        
        const terrainPoolKeys = Object.keys(this.terrainPool)
        let obj = {}, dpth = ((this.terrainProps.depth << 4) - 7); //  (dpth) ... * 16 - 7 gives double the spaces required
        if(terrainPoolKeys.length > (dpth * 3)){
            const visKeys = Object.values(this.visibleTerrain).map(({key}) => key);
            terrainPoolKeys.forEach(k => {
                // these keys need to stay
                if(!dpth || this.keysRequired.includes(k) || visKeys[k]){
                    obj[k] = this.terrainPool[k];
                }
                if(dpth) dpth --;
            })
        }
        if(Object.keys(obj).length) this.terrainPool = obj   

        // remove non visible terrain
        let toKeep = []
        this.visibleTerrain.forEach(v => {
            if(this.keysRequired.includes(v.key)) toKeep.push(v)
            else this.addToPool({[v.key]: v}) // add to pool now
        })
        if(toKeep.length !== this.visibleTerrain.length) this.visibleTerrain = toKeep
        toKeep = toKeep.map(v => v.key) // keep only keys

        // build terrain
        keysRequired.forEach(key => {
            if(!toKeep.includes(key)){
                let newChunk = this.terrainPool[key] || this.TerrainChunkObject(key)

                // make visibleTerrain an obj
                // the below is annoying and may cause overpopulation
                this.visibleTerrain = [...this.visibleTerrain, newChunk]
            }

            this.keysRequired = this.keysRequired.slice(1) // ...
        })
    }

    /**
     * create the object required to construct this terrain chunk
     * @param {String} key the key of the chunk we need to create
     * @returns 
     */
    LandscapeClass.prototype.TerrainChunkObject = function (key) {
        const { position, grow, vertexDepth } = positionFromKey(key, this.terrainProps.width, this.terrainProps.streach)
        const width = this.terrainProps.width * grow + 1;
    
        // console.time('buildChunk')
        const { positions, colors, normals, indices } = calculateTerrainArrayData({...this.terrainProps, key, vertexDepth, width, position})
        // console.timeEnd('buildChunk')

        // the first map is self enclosed the subsequent ones are fractaly superimposed 
        // need algorithm for that
        // if I jugg things a littlw then we can apply this by rendering equal tiles with the close ones haveing a ton of detail

        return {
            key,
            position,
            positions: new Float32Array(positions),
            colors: new Float32Array(colors),
            normals: new Float32Array(normals),
            indices: new Uint16Array(indices)
        }
    }

    // deconstruct key to get position of tile
    const positionFromKey = (key, width, streach) => {
        let xPos = key.indexOf('*'), yPos = key.indexOf('_'), x = Number(key.slice(0, xPos)), y = Number(key.slice(1 + xPos, yPos)), grow = Number(key.slice(yPos + 1));
        let offset = ((width * streach) / 2)
    
        let n = grow
        let vertexDepth = 0
        while(n) {
            offset += (Math.floor(n / 3) * width)
            n = Math.floor(n / 3)
            vertexDepth ++ 
        }
    
        return {position: [x * width - offset, y * -width - offset, 0], grow, vertexDepth};
    }

    function calculateTerrainArrayData({width, heightModifier, vertexDepth, streach, ...props}) { // add location offset
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
        
        GenerateNoiseMapV2({width, vertexDepth, ...props}).forEach((h, k) => {
          normals.push(0, 0, 1) // calc ... ?
      
          const i = Math.floor(k / size), j = k % size, basicHeight = 0 // terrainOverSlope(i, j, {scale: props.scale, position: props.position, vertexDepth, width})
      
          positions.push(j * vertexDepth * streach, i * vertexDepth * streach, h * heightModifier + basicHeight)
          
          if((i < (size - 1)) && (j < (size - 1))){ // no right and bottom vertecies
            indices.push(k, k + 1, k + size + 1)
            indices.push(k + size + 1, k + size, k)
          }
      
          let obj = {
            x: (i * vertexDepth) + 1 * (props.position[1] + width / 2) - shaderOffset,
            y: (j * vertexDepth) + 1 * (props.position[0] + width / 2) - shaderOffset
          }
      
          colors.push(...terrainShader({h: (h + (basicHeight / heightModifier)), ...obj, mono: false}))
        })

        // console.log({positions, colors})
      
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

    const maxA = Math.abs(valueAtLimit({amplitude: A.amplitude, persistence: A.persistance, octaves: A.octaves}))

    
    /**
     * handle the keys required to build the terrain
     * @param {*} pos 
     * @param {*} funct 
     */
    LandscapeClass.prototype.handlePositionKey = function(pos) {
        // const pos2 = screenStore.getState().mousePosition

        if(!this.keysRequired.length) this.keysRequired = terrainKeys(pos, this.terrainProps.depth)
        if(this.keysRequired.length) this.buildTerrain()
    }

    LandscapeClass.prototype.handleCameraPositionChange = function(position) {
        // undo if out of bounds
    }
    
    function terrainKeys(pos, depth){
        let keysReq = [`${pos[0]}*${pos[1]}_1`];
      
        for(let i = 1; i < depth; i ++){
          const pow = 3 ** (i - 1);
    
          for(let j = -1; j < 2; j++){
            for(let k = -1; k < 2; k++){
                if(j || k) keysReq.push(`${pow * j + pos[0]}*${pow * k + pos[1]}_${pow}`)
            }
          }
        }
        // return [...keysReq, '1*0_1', '1*1_1', '1*-1_1', '3*0_3']
        return keysReq
    }

    /**************Public API****************/

    /**
     * Load data
     * @param {Object} data 
     * @public
     */
    LandscapeClass.prototype.load = function(data) {
        const {...consts} = JSON.parse(data);
        Object.keys(consts).forEach(key => this[key] = consts[key]);
    }

    LandscapeClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return LandscapeClass;
})();