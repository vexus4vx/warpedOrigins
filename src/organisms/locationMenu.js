import LocationCard from '../molecules/locationCard';
import './org.css'

import pinkTree from '../assets/locations/pinkTree.png';

export default function LocationMenu({arr}) { // this should simply display the array
    return <div className='sideScroll'>
        {arr.map((obj, k) => <LocationCard toolTip={obj.name} image={pinkTree} onClick={obj.onClick} key={k} />)}
    </div>
}