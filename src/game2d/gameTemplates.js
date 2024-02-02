import React from 'react';
import landingScreenImg0 from '../assets/locations/starfall0.png';
import landingScreenImg1 from '../assets/locations/starfall1.png';
import landingScreenImg2 from '../assets/locations/starfall2.png';
import './gme.css';
import { MenuButton2 } from "../atoms/button";




export default function GameLayout({showBottomActionBar, backgroundImg}){
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'black'}} >
        <div className='generalMenu homeImg' style={{backgroundImage: `url(${backgroundImg})`}} >
           
        </div>
    </div>
}

export function LandingScreen({landingMenuButtons = []}){
    return <div className="homeImg column" style={{backgroundImage: `url(${landingScreenImg2})`}}>
        <div className="gameName">Starfall - The Aftermath</div>
        <div className="column landingMenuInterface">
            {landingMenuButtons.map((obj, k) => <MenuButton2 key={k} {...obj} />)}
            <div className="homeImg" style={{backgroundImage: `url(${landingScreenImg0})`, marginTop: 10}}/>
        </div>
        <div className="version">ver. 0.1</div>
    </div>
}

// raceImg info
export function SetupNewGame({races = [], onSelect}){
    const [selected, setSelected] = React.useState();

    return <div className='setup'>
        <div className='setupNewGame'>
            <div className="overflow">
                <div className="column">
                    {races.map((obj, k) => <MenuButton2 key={k} onClick={() => setSelected(obj)} >{obj.name}</MenuButton2>)}
                </div>
            </div>
            <div className="overflow">
                <div className="homeImg" style={{backgroundImage: `url(${selected ? selected.raceImg[0] : ''})`}}/>
            </div>
        </div>
        <div className="homeImg column" style={{backgroundImage: `url(${selected ? selected.raceImg[0] : ''})`}}>
        </div>
        <div className="homeImg column" style={{backgroundImage: `url(${selected ? selected.raceImg[1] : ''})`}}>
        </div>
    </div>
}

/**
  <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                <GameDiv type={1} clip={['tl', 'tr']} style={{width: '75%'}}>
                    <div className='generalMenu homeImg' style={{backgroundImage: `url(${backgroundImg})`}} >
                        .....
                    </div>
                </GameDiv>
                <GameDiv clip={['tr']} type={2} style={{width: '25%', minWidth: '340px'}}>
                    llllll
                </GameDiv>
            </div>
            {showBottomActionBar ? <div className='locations'>
                <GameDiv scale={'Small'} clip={['bl', 'br']}>
                    llllll
                </GameDiv>
            </div> : null}
 */