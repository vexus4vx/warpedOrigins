// page for testing only

import React from "react";

// create 2 random creatures - show their stats and combine into a third one

// if compatability is too low a monster will be created

export default function TestCreatures(){
    const [creatures, setCreatures] = React.useState([[],[],[]]);
    return <div style={{height: '97%', width: '98%', margin: '0.5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
        <div style={{backgroundColor: 'oldlace', height: '50%', width: '100%', marginBottom: '1%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style={{width: '40%', backgroundColor: 'white'}}>
                {visualiseCreature(creatures[0])}
            </div>
            <div style={{margin: '4%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <button style={{height: 30, width: 240, marginTop: '10%'}}>Create Parent 1</button>
                <button style={{height: 30, width: 240, marginTop: '10%'}}>Create Parent 2</button>
                <button style={{height: 30, width: 240, marginTop: '10%'}}>Merge</button>
            </div>
            <div style={{width: '40%', backgroundColor: 'white'}}>
                {visualiseCreature(creatures[1])}
            </div>
        </div>
        <div style={{backgroundColor: 'oldlace', height: '50%', width: '100%'}}>
            <div style={{width: '40%', backgroundColor: 'white', height: '100%', marginLeft: '30%'}}>
                {visualiseCreature(creatures[2])}
            </div>
        </div>
    </div>
}

function visualiseCreature(arr){
    if(!arr || !arr.length) return null;
    return 'the array as a proper readable element'
}