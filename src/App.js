import React from 'react';
import LandingPageLayout from './templates';
import MenuListComposition from './organisms/menu';
import TextComponent from './molecules/textWindow';
import { basicLore, basicLoreHeading, onAcceptLore, onDeclineLore } from './constants';
import AcceptDecline from './molecules/responseComp';

function App() {
  const [state, setstate] = React.useState({
    acceptState: 0,
  })

  const setState = (obj) => {
    if(typeof obj === 'object') setstate({...state, ...obj})
  }

  const onAccept = () => {
    setState({acceptState: 1})
  } 

  const onDecline = () => {
    setState({acceptState: -1})
  } 

  return <LandingPageLayout {...{menu: state.acceptState === 1 ? <MenuListComposition /> : null}}>
    <TextComponent {...{
      body: state.acceptState === 1 ? onAcceptLore : !state.acceptState ? basicLore : onDeclineLore, 
      heading: basicLoreHeading, 
      controlls: !state.acceptState ? <AcceptDecline {...{onAccept, onDecline}}/> : null
      }} 
    />
  </LandingPageLayout>
}

export default App;
