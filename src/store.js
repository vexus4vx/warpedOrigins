import { create } from 'zustand';

const useStore = create(set => ({
    acceptState: 0,
    setAcceptState: (v) => set(state => ({ acceptState: v })),
    landingMenuSelection: -1,
    showGameWindow: false,
    setLandingMenuSelection: (v) => {
        if(v > 1) set(state => ({ landingMenuSelection: v }))
        else {
            // I need to await and ignore dubble clicks ...
            if(!v) {
                // try load game Data - if no file then prompt user
                // if file - change to game window 
                set(state => ({ showGameWindow: true }))
            }else {
                // change to game window
                set(state => ({ showGameWindow: true }))
            }
        }
    },
    onLoadWorld: () => {
        // check if game data file exists
            // y => call switchGameMode from useStore
                // show Game window with loader in Game area and some fantasy background
                // show frontend huds
                // populate game and display
            // n => tell the user that no game data exists
      
        // skip check if you are creating a new game and overwrite everything on save
    },
    onNewWorld: () => {
    //
    }
}));

export const screenStore = create(set => ({
    mousePosition: [0,0],
    screenWidth: 0,
    screenHeight: 0
}));

// add camera position bounds
export const terrainStore = create(set => ({
    terrainProps: {
        width: 84,// 30, // must be even and <= 84 if depth === 4
        depth: 4, 
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
            set(state => ({terrainProps : {...(state.terrainProps), ...obj}}))
            // recalculate visibleTerrain from scratch 
            set(state => ({visibleTerrain: [], terrainPool: {}}))
        }
    },
    visibleTerrain: [],
    terrainPool: {},
    keysRequired: [],
    setState: (obj) => {
        set(state => ({...obj}))
    },
    setAppendArrState: (obj) => {
        set(state => {
            let toSet = {}
            Object.keys(obj).forEach(k => {
                toSet[k] = [...state[k], obj[k]]
            })

            return ({...toSet})
        })
    },
    addToPool: (obj) => {
        set(state => {
            let out = {}, poolKeys = Object.keys(state.terrainPool)
            Object.keys(obj).forEach(k => {
                if(!poolKeys.includes(k)) out[k] = obj[k]
            })
            
            return Object.keys(out).length ? {terrainPool: {...state.terrainPool, ...out}} : {}
        })
    },
    buildTerrain: (TerrainChunk) => {
        // setup - the breakdown aids smooth updating
        let keysRequired = []
        set(state => {
            keysRequired = [...state.keysRequired]
            
            return {}
        })

        // if pool is too full remove some chunks
        set(state => {
            const terrainPoolKeys = Object.keys(state.terrainPool)
            let obj = {}, dpth = ((state.terrainProps.depth << 4) - 7); //  (dpth) ... * 16 - 7 gives double the spaces required
            if(terrainPoolKeys.length > (dpth * 3)){
                const visKeys = Object.values(state.visibleTerrain).map(({key}) => key);
                terrainPoolKeys.forEach(k => {
                    // these keys need to stay
                    if(!dpth || state.keysRequired.includes(k) || visKeys[k]){
                        obj[k] = state.terrainPool[k];
                    }
                    if(dpth) dpth --;
                })
            }
            return Object.keys(obj).length ? {terrainPool: obj} : {}
        })

        // remove non visible terrain
        let toKeep = []
        set(state => {
            state.visibleTerrain.forEach(v => {
                if(state.keysRequired.includes(v.key)) toKeep.push(v)
                else state.addToPool({[v.key]: v}) // add to pool now
            })
            if(toKeep.length !== state.visibleTerrain.length) state.setState({visibleTerrain: toKeep})
            toKeep = toKeep.map(v => v.key) // keep only keys
            return {}
        })

        // build terrain
        keysRequired.forEach(key => {
            set(state => {
                if(!toKeep.includes(key)){
                    const { position, grow, vertexDepth } = positionFromKey(key, state.terrainProps.width, state.terrainProps.streach)
                    let newChunk = state.terrainPool[key] || <TerrainChunk meshProps={{position}} key={key} {...(state.terrainProps)} vertexDepth={vertexDepth} width={state.terrainProps.width * grow + 1} />
    
                    state.setAppendArrState({visibleTerrain: newChunk})
                }
   
                return {keysRequired: state.keysRequired.slice(1)} // ...
            })
        })
    },
    handlePositionKey: (pos, funct) => {
        // const pos2 = screenStore.getState().mousePosition

        set(state => {
            if(!state.keysRequired.length) state.setState({keysRequired: terrainKeys(pos, state.terrainProps.depth)})
            return ({})
        })

        set(state => {
            if(state.keysRequired.length) state.buildTerrain(funct)
            return ({})
        })
    },
    cameraBoundaries: {from: [0, 0], to: [0, 0]}, // how far the camera may move ?
    handleCameraPositionChange: (position) => {
        // undo if out of bounds
    }
}));

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
    return keysReq
}

export default useStore;