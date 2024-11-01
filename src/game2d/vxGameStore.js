import { create } from 'zustand';
import vxGameClass from './vxGameClass';


export const vxGameStore = create(set => ({
    GameClass: new vxGameClass(),
    save: () => {
        set(state => {
            state.GameClass.save();
            return {};
        })
    },
    load: (data, fileName) => {
        set(state => {
            state.GameClass.load(data);
            return {};
        })
    },
    info: () => {
        set(state => {
            state.GameClass.info();
            return {};
        })
        return {}
    },
    newGame: () => {
        set(state => {
            state.GameClass.newGame();
            return {};
        })
    }
}));