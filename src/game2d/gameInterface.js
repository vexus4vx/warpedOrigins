import React from 'react';
import { gameStore } from './gameStore';
import { locations } from './locations';

export function GameInterface() {
    return <div >
        kkk
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
    }
}