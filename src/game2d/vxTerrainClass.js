const { saveFileData } = require("../io/fileIO");

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
            width: 50,//84,// 30, // must be even and <= 84 if depth === 4
            depth: 3, 
            seed: 4151,
            scale: 0.5,
            lacunarity: 0.9,
            heightModifier: 120,
            octaves: 7, 
            persistence: -0.34, // < 1
            octaveOffSetX: 5, 
            octaveOffSetY: -3,
            streach: 1,
            amplitude: 0.21, // very small
            frequency: 0.03,
            calcVer: 1,
            setTerrainProps: (obj) => {
                this.terrainProps = {...(this.terrainProps), ...obj}
                // recalculate visibleTerrain from scratch 
                this.visibleTerrain = [];
                this.terrainPool = {}
            }
        }
        this.visibleTerrain = []
        this.terrainPool = {}
        this.keysRequired = []
        
        this.cameraBoundaries = {from: [0, 0], to: [0, 0]} // how far the camera may move ?

        return this;
    }


    LandscapeClass.prototype.setAppendArrState = function(obj) {
        let toSet = {}
        Object.keys(obj).forEach(k => {
            toSet[k] = [...this[k], obj[k]]
        })

        return ({...toSet})
    }
    
    LandscapeClass.prototype.addToPool = function(obj) {
       
        let out = {}, poolKeys = Object.keys(this.terrainPool)
        Object.keys(obj).forEach(k => {
            if(!poolKeys.includes(k)) out[k] = obj[k]
        })
        
        if(Object.keys(out).length) {this.terrainPool = {...this.terrainPool, ...out}}
        
    }
    
    LandscapeClass.prototype.buildTerrain = function(TerrainChunk) {
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
                const { position, grow, vertexDepth } = positionFromKey(key, this.terrainProps.width, this.terrainProps.streach)
                let newChunk = this.terrainPool[key] || TerrainChunk({meshProps: {position}, key, ...(this.terrainProps), vertexDepth, width: this.terrainProps.width * grow + 1})

                this.setAppendArrState({visibleTerrain: newChunk})
            }

            this.keysRequired = this.keysRequired.slice(1) // ...
        })
    }
    
    LandscapeClass.prototype.handlePositionKey = function(pos, funct) {
        // const pos2 = screenStore.getState().mousePosition

        if(!this.keysRequired.length) this.keysRequired(terrainKeys(pos, this.terrainProps.depth))

        if(this.keysRequired.length) this.buildTerrain(funct)
    }

    LandscapeClass.prototype.handleCameraPositionChange = function(position) {
        // undo if out of bounds
    }

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
     * Save to file
     * @public
     */
    LandscapeClass.prototype.save = function() {
        saveFileData({test: this.test}, 'autoSave'); 
    }

    /**
     * Load from file
     * @param {Object} data 
     * @public
     */
    LandscapeClass.prototype.load = function(data) {
        const {...consts} = JSON.parse(data);
        Object.keys(consts).forEach(key => this[key] = consts[key]);
    }

    LandscapeClass.prototype.newGame = function () {
        // initiate a new game
        // step 1 : create the map data from scratch
        // step 2 : create the charackters
        // step 3 : pick attributes etc
    }

    LandscapeClass.prototype.info = function () {
        // for testing
        console.log(this)
    }

    return LandscapeClass;
})();