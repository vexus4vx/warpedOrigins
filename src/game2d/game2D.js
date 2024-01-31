import React from 'react'
import data from '../data/data.json'
import Setup from './newGame';
import { gameStore } from './gameStore';

import pinkTree from '../assets/locations/pinkTree.png';
import { GameInterface, Travel } from './gameInterface';
import GameDiv from '../molecules/gameDiv';
import './gme.css';

export default function Game2D() {
    const [gameData, setGameData] = React.useState({});
    const {selectedRace, destination, location} = gameStore(state => ({selectedRace: state.selectedRace, destination: state.destination, location: state.location}));

    React.useEffect(() => {
        if(data?.newGame) setGameData({...data});
        // console.log(data)
        // when something important happens save game data
    }, [])

    // load Game
    return <div className='background'>
        <div className='home'>
            <GameDiv>
                {selectedRace ? (destination === location ? <GameInterface /> : <Travel />) : <div className='setup' style={{backgroundImage: `url(${pinkTree})`}}>
                    <Setup />
                </div>}
            </GameDiv>
        </div>
    </div>
}