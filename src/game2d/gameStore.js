import { create } from 'zustand';
import Settlement from './settlement';

const testUnits = [
    {name: 'lll434ybrbvdsdld', location: 'city', race: 3},
    {name: 'lll434ybrlsfdbtybttlldldbvdsdld', location: 'city', race: 1},
    {name: 'lllbetyqeqedld', location: 'city', race: 3},
    {name: 'lllqrgqtgqreqdld', location: 'captives', race: 3},
    {name: 'lllvergretfd qrrdld', location: 'city', race: 1},
    {name: 'lll434ybll12314ldld rbvdsdld', location: 'visitors', race: 1},
    {name: 'll12314ldld', location: 'visitors', race: 1},
    {name: 'llldrecld', location: 'city', race: 11},
    {name: 'lll dld', location: 'city', race: 20},
    {name: 'llldeqgqeqld', location: 'expidition', race: 1},
    {name: 'lrlldld', location: 'expidition', race: 13},
    {name: 'llfdreldld', location: 'expidition', race: 12},
    {name: 'lll434ybrbv nenne Xsen dsdld', location: 'city', race: 10},
];

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
            state.manageSettlement({init: cityName, addUnits: testUnits});
            return {selectedRace, location: 'Travel', destination: `${selectedRace}Home`, selectedSettlement: cityName}
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
                const settlements = {...state.settlements, [init]: new Settlement({init, race: state.selectedRace, units: addUnits})};
                const settlementNames = [...state.settlementNames, init];
                return {settlementNames, settlements}
            }

            return {};
        })
    },
    selectedTab: 'Settlements',
    selectedSettlement: '', // the settlement you are currently viewing 
}));