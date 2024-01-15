import React from 'react';
import { gameStore } from './gameStore';
import { locations } from './locations';
import { display } from '@mui/system';

export function GameInterface() {
    const {setState, selectedRace} = gameStore(state => ({setState: state.setState, selectedRace: state.selectedRace}));
    const backgroundImg = locations[`init${selectedRace}`].slice(-1)[0].loc
    

    return <div style={{display: 'flex', height: '100%', backgroundColor: 'black'}} >
        <div style={{width: 200}}>
            ...
            add menu 
            buttons for ...
            number of inhabitants - click to see 
            facilities - click to see 
            incidents ...
            wheel of time
            actually overlay an absolute menu onto the top menu to make these be on top ...
            assest ...
            ///
            special areas - click in screen to move there ...

            // - gameplay
            1: solve incidents
            2: increase capacity
            3: explore
            4: hunt
            5: assign units to tasks, ocupations ...
            ...
        </div>
        <div style={{...styles.main, ...styles.homeImg, backgroundImage: `url(${backgroundImg})`}} >
            nice background - home ??
            having tons of interfaces is crap so lets prepare some eye candy
            we need a menu - and some visuals + a way to load / save data
            the units need to be sorted into jobs by the user lets ??? or since we picked a vilage starter theme lets auto initialise them ...
            - all races are a tad bit different - ie initially that is
            so foxkin won't have magicians to begin with ... - and some races might all be gatherers
        </div>
        <div style={{width: 200}}>
            ...
        </div>
    </div>
}

export function Travel() {
    const {setState, selectedRace} = gameStore(state => ({setState: state.setState, selectedRace: state.selectedRace}));
    const [loc, setLoc] = React.useState(0);
    const trail = locations[`init${selectedRace}`];

    const onClick = () => {
        if(loc < (trail.length - 1)) setLoc(loc + 1);
        else if(loc === (trail.length - 1)) setState({location: `${selectedRace}Home`})
    }

    return <div style={styles.main}>
        <div onClick={onClick} style={{...styles.main, ...styles.travel, backgroundImage: `url(${trail[loc].loc})`}} />
        <div style={styles.description}>
            {trail[loc].desc}
        </div>
    </div>
}

const styles = {
    main: {
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
    },
    travel: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: "contain",
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    description: {
        position: 'absolute',
        width: '20%',
        height: '50%',
        color: 'red',
        left: '3%'
    },
    homeImg: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: "100% 100%",
        backgroundPosition: 'center',
    }
}