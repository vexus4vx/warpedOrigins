import React from 'react';
import landingScreenImg0 from '../assets/locations/starfall0.png';
import landingScreenImg1 from '../assets/locations/starfall1.png';
import landingScreenImg2 from '../assets/locations/starfall2.png';
import './gme.css';
import { MenuButton2 } from "../atoms/button";
import { Confirmation } from '../molecules/confirmation';

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

export function SetupNewGame({races = [], onSelect}){
    const [selected, setSelected] = React.useState();
    const [selectedRace, setSelectRace] = React.useState();

    return <div className='setup' style={{backgroundImage: `url(${landingScreenImg1})`}}>
        <div className='setupNewGame'>
            <div className="overflow">
                <div className="column">
                    {races.map((obj, k) => <MenuButton2 key={k} onClick={() => setSelected(obj)} >{obj.name}</MenuButton2>)}
                </div>
            </div>
            <MenuButton2 className="column bottomBox" onClick={() => setSelectRace(true)}>
                Choose {selected?.name || '...'}
            </MenuButton2>
        </div>
        <div className='raceSetupArea'>
            <div className='raceTitle'>{selected ? selected.name : 'Select a Race'}</div>
            <div className='raceSelection'>
                <div className='loreArea'> {/* add some parchment img as background ... */}
                    <div className='txtHead' children={'History'} />
                    <div className='txtBoxInr'>
                        <div className='txtBody'>
                            {typeof (selected?.info) === 'object' ? selected.info.map((txt, k) => <div style={{marginBottom: 2}} key={k}>{txt}</div>) : selected?.info}
                        </div>
                    </div>
                </div>
                <div className='gameSetup'>
                    <div className='raceImgs'>
                        <div className="homeImg column" style={{backgroundImage: `url(${selected ? selected.raceImg[0] : ''})`}} />
                        <div className="homeImg column" style={{backgroundImage: `url(${selected ? selected.raceImg[1] : ''})`}} />
                    </div>
                </div>
            </div>
        </div>
        {selectedRace ? <Confirmation onConfirm={() => onSelect(selected?.name)} onReject={() => setSelectRace(false)} children={`You will choose ${selected?.name} as your starting race.`}/> : null}
    </div>
}