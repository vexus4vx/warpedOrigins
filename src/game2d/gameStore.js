import { create } from 'zustand';

export const gameStore = create(set => ({
    setState: (obj) => set(state => ({...obj})),
    selectedRace: '',
    location: '',
    destination: '',
    settlements: [] // of city class
}));