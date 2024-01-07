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
        <Setup />
    </div>
}

const styles = {
    main: {
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        backgroundImage: `url(${pinkTree})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: "100% 100%"
    },
    img: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    }
}