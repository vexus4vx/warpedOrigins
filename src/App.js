import React from 'react';
import { LandingPageLayout, InGameLayout } from './templates';
import { LandingMenu } from './organisms/menu';
import TextComponent from './molecules/textWindow';
import { basicLore, basicLoreHeading, onAcceptLore, onDeclineLore } from './constants';
import AcceptDecline from './molecules/responseComp';
import useStore from './store';
import Toolbar from './organisms/toolbar';
import Game from './game/base';
import RightMenu from './organisms/rightMenu';
import NeuralInterface from './neural/two';
import { ImageHandling } from './neural/interfaces/imageHandling';

function App() {
  const acceptState = useStore(state => state.acceptState);
  const setAcceptState = useStore(state => state.setAcceptState);
  const showGameWindow = useStore(state => state.showGameWindow);

  const landingMenuSelection = useStore(state => state.landingMenuSelection);
  // console.log({landingMenuSelection})

  const onAccept = () => {
    setAcceptState(1)
  } 

  const onDecline = () => {
    setAcceptState(-1)
  } 

  if(landingMenuSelection === 7) return <NeuralInterface />

  if(landingMenuSelection === 4) return <ImageHandling />

  return showGameWindow ? <InGameLayout gameAreaContent={<Game />} toolbar={<Toolbar />} rightMenu={<RightMenu />} /> : <LandingPageLayout {...{menu: acceptState === 1 ? <LandingMenu /> : null}}>
    <TextComponent {...{
      body: acceptState === 1 ? onAcceptLore : !acceptState ? basicLore : onDeclineLore, 
      heading: basicLoreHeading, 
      controlls: !acceptState ? <AcceptDecline {...{onAccept, onDecline}}/> : null
      }} 
    />
  </LandingPageLayout>
}

export default App;
