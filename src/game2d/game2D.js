import React from 'react';
import { gameStore } from './gameStore';
import { races } from "./creatures";
import { Travel } from './gameInterface';
import { locations } from './locations';
import GameLayout, { LandingScreen, SetupNewGame } from './gameTemplates';
import AdminScreen from './AdminScreen';
import './gme.css';

/*
    I would like to propose a little change 
    we can use sessionStorage to keep track of some minor things 
    loading the game is a must along with saveing
    I love the setup and the work involved but I think it's ineficcient 

    lets design the whole thing first from scratch 
    see gameDesign for this
*/

export default function Game2D() {
    const {destination, location, setState, initGame, selectedRace} = gameStore(state => ({
        destination: state.destination, 
        location: state.location,
        setState: state.setState,
        initGame: state.initGame,
        selectedRace: state.selectedRace
    }));

    const landingMenuButtons = [
        {children: 'New Game', onClick: () => setState({location: 'Setup'})},
        {children: 'Load', onClick: () => null}, // load Game
        {children: 'Settings', onClick: () => null}, // settings
        {children: 'Admin Functions', onClick: () => setState({location: 'AdminScreen'})}, // ...
        {children: 'Credits', onClick: () => null} // ...
    ];

    return <div className='background'>
        <div className='home'>
            {location === "LandingMenu" ? <LandingScreen {...{landingMenuButtons}} /> : null}
            {location === "Setup" ? <SetupNewGame {...{races, onSelect: (a) => initGame(a)}} /> : null}
            {location === 'Travel' ? <Travel destination={destination} /> : null}
            {destination === location ? <GameLayout {...{
                showUnitInfo: true,
                showBottomActionBar: !!selectedRace,
                backgroundImg: locations[`init${selectedRace}Home`].slice(-1)[0].loc}} 
            /> : null}
            {location === 'AdminScreen' ? <AdminScreen /> : null}
        </div>
    </div>
}