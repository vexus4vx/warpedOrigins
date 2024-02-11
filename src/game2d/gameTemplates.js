import React from 'react';
import landingScreenImg0 from '../assets/locations/starfall0.png';
import landingScreenImg1 from '../assets/locations/starfall1.png';
import landingScreenImg2 from '../assets/locations/starfall2.png';
import './gme.css';
import { MenuButton2 } from "../atoms/button";
import { Confirmation } from '../molecules/confirmation';
import GameDiv from '../molecules/gameDiv';
import ResidentMenu from '../organisms/residentMenu';
import MenuListComposition from '../organisms/menu';
import { UnitView } from '../game/unitVerse';
import LocationMenu from '../organisms/locationMenu';

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
            {selected? <MenuButton2 className="column bottomBox" onClick={() => setSelectRace(true)}>
                Choose {selected?.name || '...'}
            </MenuButton2>: null}
        </div>
        <div className='max column'>
            <div className='raceTitle'>{selected ? selected.name : 'Select a Race'}</div>
            <div className='raceSelection' style={{display: selected ? '' : 'none'}}>
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

export default function GameLayout({showWindow, askforName, locationMenuData, showBottomActionBar, backgroundImg}){
    return  <GameDiv style={{minWidth: '1000px'}}>
        <div className='column max black'>
            <div className='max row'>
                <GameDiv type={1} clip={['tl', 'tr']} style={{width: '75%'}}>
                    <div className='homeImg' style={{backgroundImage: `url(${backgroundImg})`}} >
                        <InformationWindow {...showWindow} />
                    </div>
                </GameDiv>
                <GameDiv clip={['tr']} type={2} style={{width: '25%', minWidth: '340px'}}>
                    <ResidentMenu {...{backgroundImg}} units={askforName} />
                </GameDiv>
            </div>
            {showBottomActionBar ? <div className='locations'>
                <GameDiv scale={'Small'} clip={['bl', 'br']}>
                    <LocationMenu arr={locationMenuData} />
                </GameDiv>
            </div> : null}
        </div>
    </GameDiv>
}

//...
function InformationWindow({name, body, settlementNames, unitNames, FacilityNames, inventoryContent}) {
    const [secondWindow, setSecondWindow] = React.useState();

    React.useLayoutEffect(() => {
        setSecondWindow(null);
    }, [name])

    const arr = name === 'Settlements' ? settlementNames : name === 'Citizens' ? unitNames : name === 'Facilities' ? FacilityNames : name === 'Inventory' ? inventoryContent : [];
    let lst = [];
    arr.forEach((obj, k) => {
        lst.push({
            children: obj.name,
            onClick: () => {
                if(name === 'Citizens'){ // we need to draw the units image ...
                    setSecondWindow(obj);
                    // console.log(obj);
                } else {
                    console.log('show Image of whatever ...');
                }
            }
        })
    })

    // make unit view a second window
    return name ? <div className='column window'>
        <div className='column'>
            <div className='windowTitle' children={name} />
            <div className='windowBody' children={body} />
            <div style={{display: 'flex', marginTop: 10}}>
                <MenuListComposition menuListStyle={{backgroundColor: 'rgba(80, 80, 80, 0)'}} arr={lst} />
                {secondWindow ? <div style={{height: '98%', width: '50%', border: 'solid', marginLeft: '8%'}}>
                    <UnitView />
                </div> : null}
            </div>
        </div>
    </div> : null;
}