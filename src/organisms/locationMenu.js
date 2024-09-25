import LocationCard from '../molecules/locationCard';
import blacksmith from '../assets/misc/blacksmith.png';
import potions from '../assets/misc/potions.png';
import landscape from '../assets/locations/landscape0.png';
import inventory from '../assets/locations/inventory0.png';
import training from '../assets/misc/training.png';
import city from '../assets/misc/city.png';
import citizens from '../assets/misc/citizens.png';
import facility from '../assets/misc/facility.png';
import './org.css'
import { gameStore } from '../game2d/gameStore';


export default function LocationMenu() { // this should simply display the array
    const {setState, selectedTab} = gameStore(state => ({
        setState: state.setState,
        selectedTab: state.selectedTab
    }));

    let arr = [
        ['Settlements', city],
        ['Citizens', citizens],
        ['Facilities', facility],
        ['Inventory', inventory],
        ['Blacksmith', blacksmith],
        ['Alchimist', potions],
        ['Training Center', training],
        ['Explore', landscape]
    ].map((arr, k) => <div className='spaceAppart' key={k}>
        <LocationCard 
            toolTip={arr[0]} 
            image={arr[1]} 
            onClick={() => {
                //if(arr[0] === 'Explore'){
                //    if(selectedTab !== 'Settlements') setState({selectedTab: 'Settlements'});
                //    console.log('in  Game2D this will need to change the displayed menus ...')
                //} else 
                if(selectedTab !== arr[0]) setState({selectedTab: arr[0]});
            }}
        /> 
    </div>)

    return <div className='sideScroll'>
        {arr}
    </div>
}