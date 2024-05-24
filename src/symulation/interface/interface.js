/**
 * we need a div that handles user actions and a canvas that lets us display as we please
 */
import React from 'react'
import { interfaceStore } from './interfaceStore';
import { useWindowDimentions } from './hooks';

import './interfaceStyle.css'

// to do: add canves - timeing for updating

// finding the windowHeight is all nice and dandy however I need the divHeight ... ups
export function Interface(){
    const {setWindowDimensions, onEnterTriggerBoundary, onLeaveTriggerBoundary, onMouseMove, onMouseDown, onMouseUp, onScroll, onKeyDown, onKeyUp} = interfaceStore(state => {
        return {
            setWindowDimensions: ({windowHeight, windowWidth}) => state.setState({windowHeight, windowWidth}),
            onEnterTriggerBoundary: () => state.onEnterTriggerBoundary(),
            onLeaveTriggerBoundary: () => state.onLeaveTriggerBoundary(),
            onMouseDown: () => state.onMouseDown(),
            onMouseUp: () => state.onMouseUp(),
            onMouseMove:({clientX, clientY, target, timeStamp, buttons}) => extractOffsets({clientX, clientY, target, timeStamp, buttons}, state.onMouseMove),
            onScroll: ({clientX, clientY, target, timeStamp, buttons}) => extractOffsets({clientX, clientY, target, timeStamp, buttons}, state.onScroll),
            onKeyDown: (key) => state.onKeyDown(key),
            onKeyUp: (key) => state.onKeyUp(key)
        }
    });

    const [windowWidth, windowHeight] = useWindowDimentions();
    const ref = React.useRef(null);

    React.useEffect(() => {
        setWindowDimensions({windowHeight, windowWidth});
    }, [windowHeight, windowWidth]);

    React.useEffect(() => { ref.current.focus(); }, []);

    const common = { onMouseDown, onMouseUp, onMouseMove, onWheel: onScroll }

    return <div className='canvas'>
        <div className='main' {...common} onMouseEnter={onEnterTriggerBoundary} onMouseLeave={onLeaveTriggerBoundary} ref={ref} tabIndex={0} onKeyDown={({key}) => onKeyDown(key)} onKeyUp={({key}) => onKeyUp(key)}>
            <div className='inner' {...common} onMouseEnter={onLeaveTriggerBoundary} onMouseLeave={onEnterTriggerBoundary} />
        </div>
    </div>
}

function extractOffsets({clientX, clientY, target, timeStamp, buttons}, funct) {
    funct({
        x: clientX - (target.offsetParent.offsetParent?.offsetLeft || target.offsetParent.offsetLeft), // the offset is rounded up so we can get -1 here
        y: clientY - (target.offsetParent.offsetParent?.offsetTop || target.offsetParent.offsetTop), // the offset is rounded up so we can get -1 here
        timeStamp, 
        buttons
    })
}