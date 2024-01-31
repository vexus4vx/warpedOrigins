import LocationCard from '../molecules/locationCard';
import './org.css'

import pinkTree from '../assets/locations/pinkTree.png';
import sample2 from '../assets/locations/MountainVilage2.png';
import sample3 from '../assets/locations/elvenCity1.png';
import sample4 from '../assets/locations/elvenCastle1.png';
import sample5 from '../assets/locations/MV5.png';

export default function LocationMenu({arr}) { // this should simply display the array
    return <div className='sideScroll'>
        {arr.map((obj, k) => <div className='spaceAppart'>
            <LocationCard toolTip={obj.name} image={!k ? pinkTree : k === 1 ? sample2 : k === 2 ? sample3 : k ===3 ? sample4 : k === 4 ? sample5 : pinkTree } onClick={obj.onClick} key={k} /> 
        </div>)}
    </div>
}