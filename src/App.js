import React from 'react';
import LandingPageLayout from './templates';
import MenuListComposition from './organisms/menu';
import TextComponent from './molecules/textWindow';
import { basicLore, basicLoreHeading, onAcceptLore, onDeclineLore } from './constants';
import AcceptDecline from './molecules/responseComp';
import useStore from './store';

const onLoadWorld = () => { // put somewhere
  // check if game data file exists
      // y => call switchGameMode from useStore
          // show Game window with loader in Game area and some fantasy background
          // show frontend huds
          // populate game and display
      // n => tell the user that no game data exists

  // skip check if you are creating a new game and overwrite everything on save
}

function App() {
  const acceptState = useStore(state => state.acceptState);
  const setAcceptState = useStore(state => state.setAcceptState);


  const landingMenuSelection = useStore(state => state.landingMenuSelection);
  console.log({landingMenuSelection})

  const onAccept = () => {
    setAcceptState(1)
  } 

  const onDecline = () => {
    setAcceptState(-1)
  } 

  return <LandingPageLayout {...{menu: acceptState === 1 ? <MenuListComposition /> : null}}>
    <TextComponent {...{
      body: acceptState === 1 ? onAcceptLore : !acceptState ? basicLore : onDeclineLore, 
      heading: basicLoreHeading, 
      controlls: !acceptState ? <AcceptDecline {...{onAccept, onDecline}}/> : null
      }} 
    />
  </LandingPageLayout>
}

export default App;
