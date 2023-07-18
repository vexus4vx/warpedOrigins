import { create } from 'zustand';

const useStore = create(set => ({
    // for testing
    acceptState: 0,
    setAcceptState: (v) => set(state => ({ acceptState: v })),
    landingMenuSelection: -1,
    setLandingMenuSelection: (v) => set(state => ({ landingMenuSelection: v }))
}));

export default useStore;