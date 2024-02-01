import React from 'react';
import { MenuButton } from '../atoms/button';
import ResidentMenuItem from '../molecules/residentMenuItem';
import './org.css'

export default function ResidentMenu({backgroundImg, cityType = 'Village', cityName = 'Aruun', units = []}){
    const [selected, setSelected] = React.useState([]);
    const onButtonClick = (v) => {
        if(selected.includes(v)) setSelected(selected.filter(a => a !== v));
        else setSelected([...selected, v]);
    }

    return <div className='residentMenu homeImg' style={{backgroundImage: `url(${backgroundImg})`}} >
        <span className='residentMenuTitle'>{`${cityName} ${cityType}`}</span>
        <span className='residentMenuTitle'>{`Residents: ${units.length}`}</span>
        <MenuButton onClick={() => onButtonClick('city')}>{cityType}</MenuButton>
        {selected.includes('city') ? <ResidentMenuItem /> : null}
        <MenuButton onClick={() => onButtonClick('visitors')}>Visitors</MenuButton>
        {selected.includes('visitors') ? <ResidentMenuItem /> : null}
        <MenuButton onClick={() => onButtonClick('expidition')}>on expeditions</MenuButton>
        {selected.includes('expidition') ? <ResidentMenuItem /> : null}
        <MenuButton onClick={() => onButtonClick('captives')}>Captives</MenuButton>
        {selected.includes('captives') ? <ResidentMenuItem /> : null}
    </div>
}
// scroll name for village title ? just limit the size
// at some point I might add a fetchData function so I don.t need to pass all this crap down the line ...
// we would then also need a variable that tells us when changes occur
// - would do that to keep zustand out of the organisms

// resedent menu item - complete with on hover display ...