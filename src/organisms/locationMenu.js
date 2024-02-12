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
        {name: 'Settlements', body: 'Establish a settlement if you have none ...'},
        {name: 'Citizens', body: 'all your units in this city'},
        {name: 'Facilities', body: 'in this city'},
        {name: 'Inventory', body: 'assets in this city'},
        {name: 'Blacksmith', body: 'Create custom items'},
        {name: 'Alchimist', body: 'Create custom potions'},
        {name: 'Training Center', body: 'Research and create skills'},
        {name: 'Explore'}
    ].map((obj, k) => <div className='spaceAppart' key={k}>
        <LocationCard 
            toolTip={obj.name} 
            image={
                obj.name === 'Alchimist' ? potions :
                obj.name === 'Blacksmith' ? blacksmith :
                obj.name === 'Explore' ? landscape :
                obj.name === 'Inventory' ? inventory :
                obj.name === 'Training Center' ? training :
                obj.name === 'Settlements' ? city : 
                obj.name === 'Citizens' ? citizens :
                obj.name === 'Facilities' ? facility : null
            } 
            onClick={() => {
                if(obj.name === 'Explore'){
                    if(selectedTab?.name) setState({selectedTab: null});
                    console.log(obj.name);
                } else {
                    if(selectedTab?.name === obj.name) setState({selectedTab: null});
                    else setState({selectedTab: obj});
                }
            }}
        /> 
    </div>)

    return <div className='sideScroll'>
        {arr}
    </div>
}