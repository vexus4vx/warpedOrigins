/**
 * we need a div that handles user actions and a canvas that lets us display as we please
 */
import React from 'react'
import { interfaceStore } from './interfaceStore';
import { useWindowDimentions } from './hooks';

import './interfaceStyle.css'

export function Interface(){
    const {setWindowDimensions, windowStyle, storeData} = interfaceStore(state => {
        return {
            setWindowDimensions: ({windowHeight, windowWidth}) => state.setState({windowHeight, windowWidth}),
            windowStyle: state.windowStyle,
            storeData: () => console.log(state) // remove
        }
    });

    const [windowWidth, windowHeight] = useWindowDimentions();

    React.useEffect(() => {
        setWindowDimensions({windowHeight, windowWidth});
    }, [windowHeight, windowWidth]);

    return <div className='main' style={windowStyle}>
        <div className='inner'>
            <button onClick={() => storeData()}>storeData - remove</button>
        </div>
    </div>
}

// finding the windowHeight is all nice and dandy however I need the divHeight ... ups