import { TransitionButton } from '../atoms/button';
import './mol.css';

export default function ResidentMenuItem({style, raceIcon, unitName}){
    return <div style={style} className='residentMenuItem'>
        <div className='raceIcon homeImg' style={{backgroundImage: `url(${raceIcon})`}}/>
        <div className='unitNameButton'>
            <TransitionButton>{unitName}</TransitionButton>
        </div>
        <div className='raceIcon'/>
        <div className='raceIcon'/>
        <div className='raceIcon'/>
    </div>
}

// race img
// unit name
// some rudementary health indication
// some rudementary status indication
// ? 
// add info on society status ??