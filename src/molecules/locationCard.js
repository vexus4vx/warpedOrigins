import React from 'react';
import Shortcut from '../atoms/shortcut';
import './mol.css';

/**
 * displays a little image witha shortcut key - to be used for selecting
 * @param {String} image ...
 * @param {String} shortcutKey ...
 * @param {String} toolTip ...
 * @param {Function} onClick ...
 * @param {String} type the type of card
 */
export default function LocationCard({image, shortcutKey = '?', toolTip, onClick, type}){

    return <div className='locationCard' onClick={onClick} style={{backgroundImage: `url(${image})`}}>
        <span className="tooltiptext">{toolTip}</span>
        <div className='lock shortcutLocation'>
            <Shortcut>
                {shortcutKey}
            </Shortcut>
        </div>
    </div>
}

// fix tooltip style ...
// need fancy border
// fixed size