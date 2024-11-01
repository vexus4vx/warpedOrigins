import React from 'react';
import { LandingPageLayout, InGameLayout } from './templates';
import { LandingMenu } from './organisms/menu';
import TextComponent from './molecules/textWindow';
import { basicLore, basicLoreHeading, onAcceptLore, onDeclineLore } from './constants';
import AcceptDecline from './molecules/responseComp';
import useStore, { terrainStore } from './store';
import Toolbar from './organisms/toolbar';
import Game from './game/base';
import RightMenu from './organisms/rightMenu';
import NeuralInterface from './neural/neuralInterface';
import { ImageHandling } from './neural/interfaces/imageHandling';
import Game2D from './game2d/game2D';
import { Interface } from './symulation/interface/interface';
import TestCreatures from './symulation/creatures/creatures';
import { VxGameLayout } from './game2d/vxGameLayout';

function App() {
  const {landingMenuSelection, showGameWindow, setAcceptState, acceptState} = useStore(state => {
     return {acceptState: state.acceptState, landingMenuSelection: state.landingMenuSelection, showGameWindow: state.showGameWindow, setAcceptState: state.setAcceptState};
  })

  const {setTerrainProps, ...terrainProps} = terrainStore(state => state.terrainProps);

  const onAccept = () => {
    setAcceptState(1);
  } 

  const onDecline = () => {
    setAcceptState(-1);
  }

  if(landingMenuSelection === 7) return <InGameLayout gameAreaContent={<NeuralInterface />} toolbar={<Toolbar />} />

  if(landingMenuSelection === 4) return <ImageHandling />

  if(landingMenuSelection === 10) return <VxGameLayout />

  if(landingMenuSelection === 8) return <InGameLayout gameAreaContent={<Interface />} toolbar={<Toolbar />} />

  if(landingMenuSelection === 9) return <InGameLayout gameAreaContent={<TestCreatures />} toolbar={<Toolbar />} />

  return showGameWindow ? landingMenuSelection ? <Game2D /> : <InGameLayout gameAreaContent={<Game />} toolbar={<Toolbar />} rightMenu={landingMenuSelection === 0 ? <RightMenu {...{setTerrainProps, ...terrainProps}} /> : null} /> : <LandingPageLayout {...{menu: acceptState === 1 ? <LandingMenu /> : null}}>
    <TextComponent {...{
      body: acceptState === 1 ? onAcceptLore : !acceptState ? basicLore : onDeclineLore, 
      heading: basicLoreHeading, 
      controlls: !acceptState ? <AcceptDecline {...{onAccept, onDecline}}/> : null
      }} 
    />
  </LandingPageLayout>
}

export default App;
