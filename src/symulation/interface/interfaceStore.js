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
    windowStyle: {},
    windowHeight: 0,
    windowWidth: 0,
    interface: new interfaceClass({}),
    onScroll: () => {
        //
    },
    onKeyDown: (key) => {
        //
    },
    onKeyUp: (key) => {
        //
    },
    onClick: (position) => {
        //
    },
    // on drag ?
    onEnterTriggerBoundary: () => {
        //
    },
    onLeaveTriggerBoundary: () => {
        //
    }
}));