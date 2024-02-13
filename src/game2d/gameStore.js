import { create } from 'zustand';
import Settlement from './settlement';

export const gameStore = create(set => ({
    setState: (obj) => set(state => ({...obj})),
    selectedRace: '',
    location: 'LandingMenu',
    destination: '',
    settlements: {},
    settlementNames: [], // array of strings for now - this will be objects or simply an object [cityName]: tiny bit of data
    initGame: (selectedRace, cityName = 'Una') => {
        // create a new settlement
        set(state => {
            state.manageSettlement({init: cityName});
            return {selectedRace, location: 'Travel', destination: `${selectedRace}Home`}
        });
    },
    settlementData: (settlementName) => {
        let settlement = {};
        set(state => {
            settlement = state.settlements[settlementName] || {};
            return {};
        })
        return settlement;
    },
    manageSettlement: ({settlementName, rename, addUnits, removeUnits, init}) => {
        set(state => {
            if(typeof settlementName === 'string' && state.settlements[settlementName]) {
                const settlement = state.settlements[settlementName];
                if(typeof rename === 'string' && rename.length < 20) settlement.rename(rename);
                if(Array.isArray(addUnits)) settlement.addUnits(addUnits);
                if(Array.isArray(removeUnits)) settlement.removeUnits(removeUnits);
            }else if(init && !state.settlements[init]) {
                const settlements = {...state.settlements, [init]: new Settlement(init, state.selectedRace)};
                const settlementNames = [...state.settlementNames, init];
                return {settlementNames, settlements}
            }

            return {};
        })
    },
    selectedTab: 'Settlements'
}));