import { create } from 'zustand';
import vxGameClass from './vxGameClass';


export const vxGameStore = create(set => ({
    GameClass: new vxGameClass(),
    save: () => {
        set(({GameClass}) => {
            GameClass.save();
            return {};
        })
    },
    load: (data, fileName) => {
        set(({GameClass}) => {
            GameClass.load(data);
            return {};
        })
    },
    info: () => {
        set(({GameClass}) => {
            GameClass.info();
            return {};
        })
        return {}
    },
    newGame: () => {
        set(({GameClass}) => {
            GameClass.newGame();
            return {landscape: GameClass.landscape};
        })
    }
}));

// landscape