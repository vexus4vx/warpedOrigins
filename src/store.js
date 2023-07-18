import { create } from 'zustand';

const useStore = create(set => ({
    // for testing
    acceptState: 0,
    setAcceptState: (v) => set(state => ({ acceptState: v })),
}));

export default useStore;