/**
 * the interface connects the user to the data displayed
 * the interfaceStore holds functions and variables required
 * the interfaceClass provides quick and smoth opperation for keyboard and mouse events
 */
import { create } from 'zustand';
import interfaceClass from './interfaceClass';

export const interfaceStore = create(set => ({
    setState: (obj) => {
        set(state => {
            if(obj.windowHeight || obj.windowWidth) {
                state.interface.updateDimentions({windowHeight: obj.windowHeight, windowWidth: obj.windowWidth});
            }
            return obj;
        });
    },
    windowHeight: 0,
    windowWidth: 0,
    interface: new interfaceClass({}),
    onScroll: (obj) => {
        set(state => {
            state.interface.onScroll(obj);
            return {}
        })
    },
    onKeyDown: (key) => {
        //
    },
    onKeyUp: (key) => {
        //
    },
    onMouseDown: () => {
        set(state => {
            state.interface.onMouseDown();
            return {}
        })
    },
    onMouseUp: () => {
        set(state => {
            state.interface.onMouseUp();
            return {}
        })
    },
    onMouseMove: (obj) => {
        set(state => {
            state.interface.onMouseMove(obj);
            return {}
        })
    },
    onEnterTriggerBoundary: () => {
        set(state => {
            state.interface.onEnterTriggerBoundary();
            return {}
        })
    },
    onLeaveTriggerBoundary: () => {
        set(state => {
            state.interface.onLeaveTriggerBoundary();
            return {}
        })
    }
}));