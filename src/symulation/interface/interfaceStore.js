/**
 * the interface connects the user to the data displayed
 * the interfaceStore holds functions and variables required
 * the interfaceClass provides quick and smoth opperation for keyboard and mouse events
 */
import { create } from 'zustand';
import interfaceClass from './interfaceClass';
import { initPosition, initViewV } from './../consts';
import gpsClass from '../world/gpsClass';

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
    // position: [0,0,0],
    // viewV: [0,0,0],
    gps: () => {
        let obj = {};
        set(state => { 
            obj = {position: initPosition, viewV: initViewV} // from stored position onLoad
            return obj;
        });
        return new gpsClass(obj);
    },
    interface: () => {
        let GpsClass = null;
        set(state => { GpsClass = state.gps; return {} })
        return new interfaceClass({GpsClass});
    },
    initiateStore: () => {
        set(state => { return {gps: state.gps()}; })
        set(state => { return {interface: state.interface()}; })
        set(state => { return {initiateStore: null}; })
    },
    onScroll: (obj) => {
        set(state => {
            state.interface.onScroll(obj);
            return {}
        })
    },
    onKeyDown: (key) => {
        set(state => {
            state.interface.onKeyDown(key);
            return {}
        })
    },
    onKeyUp: (key) => {
        set(state => {
            state.interface.onKeyUp(key);
            return {}
        })
    },
    onMouseDown: ({x, y}) => {
        set(state => {
            state.interface.onMouseDown({x, y});
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
    onEnterTriggerBoundary: ({x, y}) => {
        set(state => {
            state.interface.onEnterTriggerBoundary({x, y});
            return {}
        })
    },
    onLeaveTriggerBoundary: () => {
        set(state => {
            state.interface.onLeaveTriggerBoundary();
            return {}
        })
    },
    updateCanvas: () => {
        let recalc = false;
        set(state => {
            recalc = state.interface.updateCanvas;
            if(recalc) state.interface.updateCanvas = false;
            return {}
        })
        return recalc;
    }
}));