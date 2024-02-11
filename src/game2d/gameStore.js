import { create } from 'zustand';
import Settlement from './settlement';

export const gameStore = create(set => ({
    setState: (obj) => set(state => ({...obj})),
    selectedRace: '',
    location: 'LandingMenu',
    destination: '',
    settlements: {},
    settlementNames: [],
    initGame: (selectedRace, cityName = 'Una') => {
        // create a new settlement
        const settlements = {[cityName]: new Settlement(cityName, selectedRace)};
        const settlementNames = [cityName];
        set(state => ({selectedRace, location: 'Travel', destination: `${selectedRace}Home`, settlements, settlementNames}));
    },
    settlementData: (settlementName) => {
        let settlement = {};
        set(state => {
            settlement = state.settlements[settlementName] || {};
            return {};
        })
        return settlement;
    }
}));