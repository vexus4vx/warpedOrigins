import { create } from 'zustand';
import Settlement from './settlement';

// this needs to be an object I think ...
const testUnits = [
    {id: 112, name: 'lll434ybrbvdsdld', location: 'city', race: 3},
    {id: 1121, name: 'lll434ybrlsfdbtybttlldldbvdsdld', location: 'city', race: 1},
    {id: 1211, name: 'lllbetyqeqedld', location: 'city', race: 3},
    {id: 12211, name: 'lllqrgqtgqreqdld', location: 'captives', race: 3},
    {id: 1311, name: 'lllvergretfd qrrdld', location: 'city', race: 1},
    {id: 13311, name: 'lll434ybll12314ldld rbvdsdld', location: 'visitors', race: 1},
    {id: 1131, name: 'll12314ldld', location: 'visitors', race: 1},
    {id: 1141, name: 'llldrecld', location: 'city', race: 11},
    {id: 13411, name: 'lll dld', location: 'city', race: 20},
    {id: 12311, name: 'llldeqgqeqld', location: 'expidition', race: 1},
    {id: 111, name: 'lrlldld', location: 'expidition', race: 13},
    {id: 1411, name: 'llfdreldld', location: 'expidition', race: 12},
    {id: 1151, name: 'lll434ybrbv nenne Xsen dsdld', location: 'city', race: 10},
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
    selectedUnitId: ''
}));