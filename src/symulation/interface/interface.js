/**
 * we need a div that handles user actions and a canvas that lets us display as we please
 */
import React from 'react'
import { interfaceStore } from './interfaceStore';
import { useCanvas, useWindowDimentions } from './hooks';

import './interfaceStyle.css'

// testing
import { Test } from '../world/World';

// to do: add timeing for updating
// consider useing setTimeout or setInterval - mabe do this on the hook

// finding the windowHeight is all nice and dandy however I need the divHeight ... ups
export function Interface(){
    const {setWindowDimensions, onEnterTriggerBoundary, onLeaveTriggerBoundary, onMouseMove, onMouseDown, onMouseUp, onScroll, onKeyDown, onKeyUp, updateCanvas, position, viewV} = interfaceStore(state => {
        if(state.initiateStore) state.initiateStore();
        return {
            setWindowDimensions: ({windowHeight, windowWidth}) => state.setState({windowHeight, windowWidth}),
            onEnterTriggerBoundary: ({clientX, clientY, target}) => extractOffsets({clientX, clientY, target}, state.onEnterTriggerBoundary),
            onLeaveTriggerBoundary: () => state.onLeaveTriggerBoundary(),
            onMouseDown: ({clientX, clientY, target}) => extractOffsets({clientX, clientY, target}, state.onMouseDown),
            onMouseUp: () => state.onMouseUp(),
            onMouseMove:({clientX, clientY, target, timeStamp, buttons}) => extractOffsets({clientX, clientY, target, timeStamp, buttons}, state.onMouseMove),
            onScroll: ({clientX, clientY, target, timeStamp, buttons, deltaX, deltaY}) => extractOffsets({clientX, clientY, target, timeStamp, buttons, deltaX, deltaY}, state.onScroll),
            onKeyDown: (key) => state.onKeyDown(key),
            onKeyUp: (key) => state.onKeyUp(key),
            updateCanvas: () => state.updateCanvas(),
            viewV: state.viewV,
            position: state.position
        }
    });

    const [windowWidth, windowHeight] = useWindowDimentions();
    const ref = React.useRef(null);

    React.useEffect(() => {
        setWindowDimensions({windowHeight, windowWidth});
    }, [windowHeight, windowWidth]);

    React.useEffect(() => { ref.current.focus(); }, []);

    const draw = React.useCallback(ctx => {
        // do we need to recalc ?? - we will need this info from the game world and the interface class
        if(updateCanvas()) {
            const imgData = Test({ windowHeight, windowWidth, position, viewV });
            ctx.putImageData(new ImageData(imgData, windowWidth, windowHeight), 0, 0);
        }
    }, [windowHeight, windowWidth]);

    const canvasRef = useCanvas(draw);

    const common = { onMouseDown, onMouseUp, onMouseMove, onWheel: onScroll }

    return <div className='page'>
        <canvas className='canvas' ref={canvasRef} width={windowWidth} height={windowHeight} />
        <div className='main' {...common} onMouseEnter={onEnterTriggerBoundary} onMouseLeave={onLeaveTriggerBoundary} ref={ref} tabIndex={0} onKeyDown={({key}) => onKeyDown(key)} onKeyUp={({key}) => onKeyUp(key)}>
            <div className='inner' {...common} onMouseEnter={onLeaveTriggerBoundary} onMouseLeave={onEnterTriggerBoundary} />
        </div>
    </div>
}

function extractOffsets({clientX, clientY, target, timeStamp, buttons, deltaX, deltaY}, funct) {
    funct({
        x: clientX - (target.offsetParent.offsetParent?.offsetLeft || target.offsetParent.offsetLeft), // the offset is rounded up so we can get -1 here
        y: clientY - (target.offsetParent.offsetParent?.offsetTop || target.offsetParent.offsetTop), // the offset is rounded up so we can get -1 here
        timeStamp, 
        buttons,
        direction: deltaY < deltaX
    })
}