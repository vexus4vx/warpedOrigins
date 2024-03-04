import { TransitionButton } from '../atoms/button';
import { Icons } from '../constIcons';
import { cityClass } from '../constants';
import './mol.css';

/**
 * MenuItem for displaying in residentMenu
 * @param {Object} style ...
 * @param {Number} race number of
 * @param {String} name number of
 * @returns 
 */
export function ResidentMenuItem({style, race, name}){
    return <div style={style} className='residentMenuItem'>
        <div className='raceIcon homeImg' style={{backgroundImage: `url(${Icons(race)})`, marginRight: '5px'}}/>
        <TransitionButton style={{maxWidth: '180px', overflow: 'auto', marginRight: '5px', color: 'white', fontWeight: 'bold'}}>
            {name}
        </TransitionButton>
        <div className='round raceIcon' style={{backgroundColor: 'red', marginRight: '5px'}}/>
        <div className='round raceIcon' style={{backgroundColor: 'violet', marginRight: '5px'}}/>
        <div className='round raceIcon' style={{backgroundColor: 'orange', marginRight: '5px'}}/>
        <div className='round raceIcon' style={{backgroundColor: 'yellow', marginRight: '5px'}}/>
    </div>
}

// race img
// unit name
// some rudementary health indication
// some rudementary status indication
// ? 
// add info on society status ??

/**
 * MenuItem for displaying the cities
 * @param {Number} residents number of
 * @param {Number} captives number of
 * @param {Number} visitors number of
 * @param {String} name cityName
 * @param {Number} status number 1, 0, -1
 */
export function CityItem({name = '', residents = 0, status = 1, captives = 0, visitors = 0}){
    const style = {marginLeft: '4px', marginRight: '4px'}
    return <div className='row cityItem'>
        <div style={{...style, width: '200px', overflow: 'auto'}}>{`${name} ${cityClass(residents)}`}</div>
        <div className='round' style={{...style, backgroundColor: status === 1 ? 'green' : status === -1 ? 'red' : 'orange'}} />
        <div style={{...style}}>{residents + captives + visitors}</div>
    </div>
}

export function UnitInfo({}){
    return <div className='max' style={{backgroundColor: 'red'}}>
        //
    </div>
}