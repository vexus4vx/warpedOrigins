import { create } from 'zustand';

// lets add this just in case 
export const artStore = create(set => ({
    setState: (obj) => {
        // if(obj.height || obj.width) console.log(obj.width, obj.height);
        set(state => ({...obj}))
    },
    mods: [],
    addMod: (v) => {
        set(state => {
            return {mods: [...state.mods, v]}
        })
    },
    removeMod: (i) => {
        set(state => {
            let out = [];
            state.mods.forEach((v, j) => {
                if(i !== j)out.push(v);
            })
            return {mods: out};
        })
    }
}));