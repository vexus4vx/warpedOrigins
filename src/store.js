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

export const terrainStore = create(set => ({
    terrainProps: {
        width: 30, // must be even  // 240 
        depth: 4, 
        seed: 4151,
        calculateOnce: false, 
        scale: 0.21,
        lacunarity: 1.4,
        heightModifier: 1,
        octaves: 7, 
        persistence: -0.34, // < 1
        octaveOffSetX: 5, 
        octaveOffSetY: -3,
        streach: 1,
        amplitude: 0.21, // very small
        frequency: 0.03,
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
            const keysRequired = [...state.keysRequired]
            state.setState({keysRequired: []})

            if(!keysRequired.length) return ({})

            // if pool is too full remove some chunks
            const dpth = state.terrainProps.depth * 8 - 7;
            if(Object.keys(state.terrainPool).length > (dpth * 3)){
                let obj = {};
                let rem = dpth;
                const visKeys = Object.values(state.visibleTerrain).map(({key}) => key);
                Object.keys(state.terrainPool).forEach(k => {
                    // these keys need to stay
                    if(!rem || keysRequired.includes(k) || visKeys[k]){
                        obj[k] = state.terrainPool[k];
                    }
                    if(rem) rem --;
                })
                state.setState({terrainPool: obj});
            }

            // remove unseeable terrain
            let toKeep = []
            state.visibleTerrain.forEach(v => {
                if(keysRequired.includes(v.key)) toKeep.push(v)
            })
            state.setState({visibleTerrain: toKeep})
            toKeep = toKeep.map(v => v.key)

            keysRequired.forEach(key => {
                if(!toKeep.includes(key)){
                    const { position, grow, vertexDepth } = positionFromKey(key, state.terrainProps.width, state.terrainProps.streach)
                    let newChunk = state.terrainPool[key] || <TerrainChunk meshProps={{position}} key={key} {...(state.terrainProps)} vertexDepth={vertexDepth} width={state.terrainProps.width * grow + 1} />
    
                    state.setAppendArrState({visibleTerrain: newChunk})
                    if(!state.terrainPool[key]) set(state => ({terrainPool: {...state.terrainPool, [key]: newChunk}})) // add to pool    
                }})

            return ({})
        })
    },
    handlePositionKey: (pos) => {
        set(state => {
            state.setState({keysRequired: terrainKeys(pos, state.terrainProps.depth)})

            return ({})
        })
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