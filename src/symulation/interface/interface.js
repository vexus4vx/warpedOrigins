/**
 * we need a div that handles user actions and a canvas that lets us display as we please
 */
import React from 'react'
import { interfaceStore } from './interfaceStore';
import { useCanvas, useWindowDimentions } from './hooks';

import './interfaceStyle.css'

// to do: add canves - timeing for updating

// finding the windowHeight is all nice and dandy however I need the divHeight ... ups
export function Interface(){
    const {setWindowDimensions, onEnterTriggerBoundary, onLeaveTriggerBoundary, onMouseMove, onMouseDown, onMouseUp, onScroll, onKeyDown, onKeyUp, updateCanvas} = interfaceStore(state => {
        return {
            setWindowDimensions: ({windowHeight, windowWidth}) => state.setState({windowHeight, windowWidth}),
            onEnterTriggerBoundary: () => state.onEnterTriggerBoundary(),
            onLeaveTriggerBoundary: () => state.onLeaveTriggerBoundary(),
            onMouseDown: () => state.onMouseDown(),
            onMouseUp: () => state.onMouseUp(),
            onMouseMove:({clientX, clientY, target, timeStamp, buttons}) => extractOffsets({clientX, clientY, target, timeStamp, buttons}, state.onMouseMove),
            onScroll: ({clientX, clientY, target, timeStamp, buttons}) => extractOffsets({clientX, clientY, target, timeStamp, buttons}, state.onScroll),
            onKeyDown: (key) => state.onKeyDown(key),
            onKeyUp: (key) => state.onKeyUp(key),
            updateCanvas: () => state.updateCanvas()
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
            const imgData = Test({ windowHeight, windowWidth });
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

function extractOffsets({clientX, clientY, target, timeStamp, buttons}, funct) {
    funct({
        x: clientX - (target.offsetParent.offsetParent?.offsetLeft || target.offsetParent.offsetLeft), // the offset is rounded up so we can get -1 here
        y: clientY - (target.offsetParent.offsetParent?.offsetTop || target.offsetParent.offsetTop), // the offset is rounded up so we can get -1 here
        timeStamp, 
        buttons
    })
}

export function Test ({ windowHeight, windowWidth }) {
    console.log('redrawing')
    const arr = []

    const rnd = () => Math.floor(Math.random() * 255);

    for (let h = 0; h < windowHeight; h++) {
      for (let w = 0; w < windowWidth; w++) {
  
        const rgba = [rnd(), rnd(), rnd(), rnd()];
  
        arr.push(rgba[0]); // r
        arr.push(rgba[1]); // g
        arr.push(rgba[2]); // b
        arr.push(rgba[3]); // a
      }
    } // */
  

  return new Uint8ClampedArray(arr);
};