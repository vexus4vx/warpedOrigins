import React from 'react';
import { MenuButton } from '../atoms/button';
import ResidentMenuItem from '../molecules/residentMenuItem';
import './org.css'

export default function ResidentMenu({backgroundImg, cityType = 'Village', cityName = 'Un-named', units = []}){
    const [selected, setSelected] = React.useState([]);

    let locations = {};
    units.forEach((obj, k) => {
        const out = <ResidentMenuItem unitName={obj.unitName} style={styleAddition2} key={k}/>;
        if(obj?.location === 'city') locations.city = locations.city?.length ? [...locations.city, out] : [out];
        else if(obj?.location === 'visitors') locations.visitors = locations.visitors?.length ? [...locations.visitors, out] : [out];
        else if(obj?.location === 'expidition') locations.expidition = locations.expidition?.length ? [...locations.expidition, out] : [out];
        else if(obj?.location === 'captives') locations.captives = locations.captives?.length ? [...locations.captives, out] : [out];
    });

    const onButtonClick = (v) => {
        if(selected.includes(v)) setSelected(selected.filter(a => a !== v));
        else setSelected([...selected, v]);
    }

    return <div className='residentMenu homeImg' style={{backgroundImage: `url(${backgroundImg})`}} >
        <span className='residentMenuTitle'>{`${cityName} ${cityType}`}</span>
        <span className='residentMenuTitle'>{`Residents: ${units.length}`}</span>
        {locations?.city?.length ? <MenuButton style={styleAddition} onClick={() => onButtonClick('city')}>{cityType}</MenuButton> : null}
        {selected.includes('city') ? locations?.city : null}
        {locations?.visitors?.length ? <MenuButton style={styleAddition} onClick={() => onButtonClick('visitors')}>Visitors</MenuButton> : null}
        {selected.includes('visitors') ? locations?.visitors : null}
        {locations.expidition?.length ? <MenuButton style={styleAddition} onClick={() => onButtonClick('expidition')}>Away</MenuButton> : null}
        {selected.includes('expidition') ? locations?.expidition : null}
        {locations?.captives?.length ? <MenuButton style={styleAddition} onClick={() => onButtonClick('captives')}>Captives</MenuButton> : null}
        {selected.includes('captives') ? locations?.captives : null}
    </div>
}

const styleAddition = {margin: '4px'}
const styleAddition2 = {margin: '4px', marginTop: '-4px', width: 'calc(100% - 8px)'}
// scroll name for village title ? just limit the size
// at some point I might add a fetchData function so I don.t need to pass all this crap down the line ...
// we would then also need a variable that tells us when changes occur
// - would do that to keep zustand out of the organisms

// resedent menu item - complete with on hover display ...