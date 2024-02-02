import { create } from 'zustand';

export const gameStore = create(set => ({
    setState: (obj) => set(state => ({...obj})),
    selectedRace: '',
    location: 'LandingMenu',
    destination: '',
    settlements: {}, // of city class
    createRandomUnits: (settlementName, numberOfUnits) => { // redo this once settlement class is done
        // create units for a given settlement 
        set(state => {
            let out = state.settlements[settlementName] || [];
            for(let i = 0; i< numberOfUnits; i++){
                out.push({unitName: `greg ${1 + i}`, location: 'city'})
            }
            return {settlements: {...state.settlements, [settlementName]: out}}
        })
    }
}));