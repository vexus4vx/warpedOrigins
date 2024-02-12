import React from 'react';
import landingScreenImg0 from '../assets/locations/starfall0.png';
import landingScreenImg1 from '../assets/locations/starfall1.png';
import landingScreenImg2 from '../assets/locations/starfall2.png';
import oldPaper0 from '../assets/misc/oldPaper0.png';
import './gme.css';
import { MenuButton2 } from "../atoms/button";
import { Confirmation } from '../molecules/confirmation';
import GameDiv from '../molecules/gameDiv';
import ResidentMenu from '../organisms/residentMenu';
import LocationMenu from '../organisms/locationMenu';
import { InformationWindow } from './gameInterface';

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

export function SetupNewGame({races = [], onSelect}){
    const [selected, setSelected] = React.useState();
    const [selectedRace, setSelectRace] = React.useState();

    return <div className='homeImg row' style={{backgroundImage: `url(${landingScreenImg1})`}}>
        <div className='setupNewGame'>
            <div className="overflow">
                <div className="column">
                    {races.map((obj, k) => <MenuButton2 key={k} onClick={() => setSelected(obj)} >{obj.name}</MenuButton2>)}
                </div>
            </div>
            {selected? <MenuButton2 className="column bottomBox" onClick={() => setSelectRace(true)}>
                Choose {selected?.name || '...'}
            </MenuButton2>: null}
        </div>
        <div className='max column'>
            <div className='raceTitle'>{selected ? selected.name : 'Select a Race'}</div>
            <div className='homeImg column loreArea' style={{backgroundImage: `url(${oldPaper0})`, display: selected ? '' : 'none'}}> {/* add some parchment img as background ... */}
                <div className='txtHead' children={'History'} />
                <div className='txtBoxInr'>
                    <div className='txtBody'>
                        {typeof (selected?.info) === 'object' ? selected.info.map((txt, k) => <div style={{marginBottom: 2}} key={k}>{txt}</div>) : selected?.info}
                    </div>
                    <div className='raceImgs'>
                        <div className="homeImg" style={{backgroundImage: `url(${selected ? selected.raceImg[0] : ''})`}} />
                        <div className="homeImg" style={{backgroundImage: `url(${selected ? selected.raceImg[1] : ''})`}} />
                    </div>
                </div>
            </div>
        </div>
        {selectedRace ? <Confirmation onConfirm={() => onSelect(selected?.name)} onReject={() => setSelectRace(false)} children={`You will choose ${selected?.name} as your starting race.`}/> : null}
    </div>
}

export default function GameLayout({showBottomActionBar, backgroundImg, showUnitInfo}){
    return  <GameDiv style={{minWidth: '1000px'}}>
        <div className='column max black'>
            <div className='max row'>
                <GameDiv type={1} clip={['tl']} style={{width: `${showUnitInfo ? 75 : 100}%`, backgroundImage: `url(${backgroundImg})`}}>
                    <InformationWindow/>
                </GameDiv>
                {showUnitInfo ? <GameDiv clip={['tr']} type={2} style={{width: '25%', minWidth: '340px', backgroundImage: `url(${backgroundImg})`}}>
                    <ResidentMenu/>
                </GameDiv> : null}
            </div>
            {showBottomActionBar ? <div className='locations'>
                <GameDiv scale={'Small'} clip={['bl', 'br']}>
                    <LocationMenu />
                </GameDiv>
            </div> : null}
        </div>
    </GameDiv>
}