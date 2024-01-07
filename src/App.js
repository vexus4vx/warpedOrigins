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
import NeuralInterface from './neural/two';
import { ImageHandling } from './neural/interfaces/imageHandling';
import Game2D from './game2d/game2D';

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

  if(landingMenuSelection === 7) return <NeuralInterface />

  if(landingMenuSelection === 4) return <ImageHandling />

  return showGameWindow ? <InGameLayout gameAreaContent={landingMenuSelection ? <Game2D /> : <Game />} toolbar={<Toolbar />} rightMenu={<RightMenu {...(landingMenuSelection === 1 ? {} : {setTerrainProps, ...terrainProps})} />} /> : <LandingPageLayout {...{menu: acceptState === 1 ? <LandingMenu /> : null}}>
    <TextComponent {...{
      body: acceptState === 1 ? onAcceptLore : !acceptState ? basicLore : onDeclineLore, 
      heading: basicLoreHeading, 
      controlls: !acceptState ? <AcceptDecline {...{onAccept, onDecline}}/> : null
      }} 
    />
  </LandingPageLayout>
}

export default App;
