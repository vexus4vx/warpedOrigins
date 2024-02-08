import React from 'react'
import data from '../data/data.json'
// import Setup from './newGame';
import { gameStore } from './gameStore';
import { races } from "./creatures";
import { GameInterface, Travel } from './gameInterface';
// import GameDiv from '../molecules/gameDiv';
import './gme.css';
import { LandingScreen, SetupNewGame } from './gameTemplates';

export default function Game2D() {
    const [gameData, setGameData] = React.useState({});
    const {destination, location, setState} = gameStore(state => ({
        destination: state.destination, 
        location: state.location,
        setState: state.setState
    }));

    React.useEffect(() => {
        if(data?.newGame) setGameData({...data});
        // console.log(data)
        // when something important happens save game data
    }, [])

    const landingMenuButtons = [
        {children: 'New Game', onClick: () => setState({location: 'Setup'})},
        {children: 'Load', onClick: () => null}, // load Game
        {children: 'Options', onClick: () => null}, // ...
        {children: 'Credits', onClick: () => null} // ...
    ];

    const onSelect = (v) => setState({selectedRace: v, location: 'Travel', destination: `${v}Home`});

    return <div className='background'>
        <div className='home'>
            {location === "LandingMenu" ? <LandingScreen {...{landingMenuButtons}} /> : null}
            {location === "Setup" ? <SetupNewGame {...{races, onSelect}} /> : null}
            {location === 'Travel' ? <Travel destination={destination} /> : null}
            {destination === location ? <GameInterface /> : null}
        </div>
    </div>
}