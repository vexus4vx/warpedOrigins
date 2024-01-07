import React from 'react'
import data from '../data/data.json'
import Setup from './newGame';

import pinkTree from '../assets/pinkTree.png';

export default function Game2D() {
    const [gameData, setGameData] = React.useState({});

    React.useEffect(() => {
        if(data?.newGame) setGameData({...data});
        // console.log(data)
        // when something important happens save game data
    }, [])

    // load Game
    return <div style={styles.main} >
        <img style={styles.img} src={pinkTree} />
        <Setup />
    </div>
}

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%'
    },
    img: {
        position: 'fixed',
        width: '100%',
        height: '100%'
    }
}