import { create } from 'zustand';

const useStore = create(set => ({
    // for testing
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

export const terrainStore = create(set => ({
    terrainProps: {
        width: 100,
        depth: 1, 
        seed: 124415, 
        calculateOnce: true, 
        scale: 0.21,
        lacunarity: 1.4,
        heightModifier: 100,
        vertexDepth: 2, // the distance between vertecies
        octaves: 1, 
        persistence: 1,
        octaveOffSetX: 5, 
        octaveOffSetY: -3,
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
    buildTerrain: (TerrainChunk) => {
        set(state => {
            if(!state.keysRequired.length) return ({})

            // if pool is too full remove some chunks
            const dpth = state.terrainProps.depth * 8 - 7;
            if(Object.keys(state.terrainPool).length > (dpth * 3)){
                let obj = {};
                let rem = dpth;
                const visKeys = Object.values(state.visibleTerrain).map(({key}) => key);
                Object.keys(state.terrainPool).forEach(k => {
                    // these keys need to stay
                    if(!rem || state.keysRequired.includes(k) || visKeys[k]){
                        obj[k] = state.terrainPool[k];
                    }
                    if(rem) rem --;
                })
                state.setstate({terrainPool: obj});
            }

            state.keysRequired.forEach(key => {
                let newChunk = state.terrainPool[key] || <TerrainChunk meshProps={{position: positionFromKey(key, state.terrainProps.width)}} key={key} {...(state.terrainProps)} />

                state.setAppendArrState({visibleTerrain: newChunk})
                if(!state.terrainPool[key]) set(state => ({terrainPool: {...state.terrainPool, [key]: newChunk}})) // add to pool
            })

            return ({keysRequired: []})
        })
    },
    handlePositionKey: (pos) => {
        set(state => {
            state.setState({keysRequired: terrainKeys(pos, state.depth, state.width)})

            return ({})
        })
    }
}));

const positionFromKey = (k, w) => {
    let xPos = k.indexOf('*'), yPos = k.indexOf('_');
    w /= 2;

    return [Number(k.slice(0, xPos)) * w, Number(k.slice(1 + xPos, yPos)) * -w, 0];
}

// refactor
function terrainKeys(pos, depth, width){
    let keysReq = [`${pos[0]}*${pos[1]}_1`];

    const ofsX = [1, 0, -1, 1, -1, 1, 0, -1], ofsY = [1, 1, 1, 0, 0, -1, -1, -1];
    const ofs = [
        [-1, -1,   0, -1,   1, -1,   -1, 0,    1, 0,    -1, 1,   0, 1,   1, 1],
        [-2, -4,   1, -4,   4, -4,   -2, -1,   4, -1,   -2, 2,   1, 2,   4, 2],
        [-5, -13,   4, -13,   13, -13,   -5, -4,   13, -4,   -5, 5,   4, 5,   13, 5],
        [-14, -40,   13, -40,   40, -40,   -14, -13,   40, -13,   -14, 14,   13, 14,   40, 14],
        [-41, -121,   40, -121,   121, -121,   -41, -40,   121, -40,   -41, 41,   40, 41,   121, 41],
        [-122, -364,   121, -364,   364, -364,   -122, -121,   364, -121,   -122, 122,   121, 122,   364, 122],
        [-365, -1093,   364, -1093,   1093, -1093,   -365, -364,   1093, -364,   -365, 365,   364, 365,   1093, 365],
        [-1094, -3280,   1093, -3280,   3280, -3280,   -1094, -1093,   3280, -1093,   -1094, 1094,   1093, 1094,   3280, 1094]
    ]
  
    for(let i = 1; i < depth; i ++){
      const pow = 3 ** (i - 1);
      for(let j = 0; j < 8; j++){
        keysReq.push(`${Math.round(pos[0] + (ofsX[j] * pow)  + ((ofs[i - 1][j << 1]) / width))}*${Math.round(pos[1] + (ofsY[j] * pow)  + ((ofs[i - 1][(j << 1) + 1]) / width))}_${pow}`);
      }
    }
    return keysReq;
}

export default useStore;