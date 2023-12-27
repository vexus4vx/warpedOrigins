import { create } from 'zustand';

// lets add this just in case 
export const artStore = create(set => ({
    setState: (obj) => {
        // console.log(obj);
        set(state => ({...obj}))
    }
}));