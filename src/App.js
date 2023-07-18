import React from 'react';
import LandingPageLayout from './templates';
import MenuListComposition from './organisms/menu';
import TextComponent from './molecules/textWindow';
import { basicLore, basicLoreHeading, onAcceptLore, onDeclineLore } from './constants';
import AcceptDecline from './molecules/responseComp';
import useStore from './store';

function App() {
  const acceptState = useStore(state => state.acceptState);
  const setAcceptState = useStore(state => state.setAcceptState);

  console.log(acceptState)

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
