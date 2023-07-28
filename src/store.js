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
        chunkDepth: 1,
        octaves: 1, 
        persistence: 1,
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
                let newChunk = state.terrainPool[key] || <TerrainChunk key={key} {...(state.terrainProps)} />

                state.setAppendArrState({visibleTerrain: newChunk})
                if(!state.terrainPool[key]) set(state => ({terrainPool: {...state.terrainPool, [key]: newChunk}})) // add to pool
            })

            return ({keysRequired: []})
        })
    }
}));

export default useStore;