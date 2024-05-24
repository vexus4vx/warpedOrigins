import React from 'react';
import { gameStore } from './gameStore';
import { races } from "./creatures";
import { Travel } from './gameInterface';
import { locations } from './locations';
import './gme.css';
import GameLayout, { LandingScreen, SetupNewGame } from './gameTemplates';

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
        {children: 'Options', onClick: () => null}, // ...
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
        </div>
    </div>
}