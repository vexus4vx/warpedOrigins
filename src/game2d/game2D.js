import React from 'react'
import data from '../data/data.json'
// import Setup from './newGame';
import { gameStore } from './gameStore';
import { races } from "./creatures";
import pinkTree from '../assets/locations/pinkTree.png';
import { GameInterface, Travel } from './gameInterface';
import GameDiv from '../molecules/gameDiv';
import './gme.css';
import { LandingScreen, SetupNewGame } from './gameTemplates';

export default function Game2D() {
    const [gameData, setGameData] = React.useState({});
    const {selectedRace, destination, location, setState} = gameStore(state => ({
        selectedRace: state.selectedRace, 
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

    const onSelect = (v) => setState({selectedRace: v});

    return <div className='background'>
        <div className='home'>
            {location === "LandingMenu" ? <LandingScreen {...{landingMenuButtons}} /> : null}
            {location === "Setup" ? <SetupNewGame {...{races, onselect}} /> : null}
        </div>
    </div>
}

// landing menu background
// version bottom left
// box where you can select - new game, load, option, credits, exit


/*

<GameDiv>
                landingMenu
            </GameDiv>
{selectedRace ? (destination === location ? <GameInterface /> : <Travel />) : <div className='setup' style={{backgroundImage: `url(${pinkTree})`}}>
                    <Setup />
                </div>}
*/