import { Box, Button } from "@mui/material"
import React from "react"
import { brown, imageList, secondary } from "../constants"
import Spinner from "../atoms/spinner"
import MyToolbar from "../organisms/toolbar"
import { vxGameStore } from "./vxGameStore"
import { ReadFileData } from "../io/fileIO"

const resetSource = (set) => {
    const pic = imageList[Math.abs(((Date.now() * Math.random()) >> 1) % imageList.length)]
    if(set) set(pic)
    else return pic
}

export function VxGameLayout ({gameAreaContent, rightMenu}) { 
    // const [info, setInfo] = React.useState({});

    const {info, save, load, newGame} = vxGameStore(state => ({
        save: state.save,
        load: state.load,
        info: state.info,
        newGame: state.newGame
    }))

    const leftMenu = [
        {txt: 'New Game', onSelect: () => newGame()},
        {txt: <ReadFileData txt='Load Game' set={(v, n) => load(v, n)} setName={true}/>},
        {txt: 'Save Game', onSelect: () => save()},
        // {txt: 'Settings'},
        {txt: 'info - remove', onSelect: () => info()}
    ]
    const src = resetSource()

    return <Box sx={{...styles.main, justifyContent: 'flex-start'}}>
        <Box sx={styles.topToolbar}>
            <MyToolbar {...{leftMenu}} />
        </Box>
        <Box sx={styles.mainArea}>
            <Box sx={styles.gameArea}>
                {gameAreaContent || [
                <Box key={0} sx={styles.spinner}>
                    <Spinner size={300} speedMultiplier={0.7} color={'black'}/>
                </Box>,
                <DefaultText key={1} />,
                <img
                    key={2}
                    src={src}
                    srcSet={src}
                    alt={`Ups >_< `}
                    loading="lazy"
                    width='100%'
                    height='100%'
                />].map(a => a)}
            </Box>
            {rightMenu}
        </Box>
    </Box>
}

function DefaultText() {
    return <Box key={0} sx={{...styles.spinner, ...styles.text}}>
        About this Game: 
        we can now add a ton of text here 
    </Box>
}

const styles = {
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        justifyContent: 'flex-start',
        left: '10%',
        width: '80%'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100vh',
        minWidth: 700,
        overflow: 'auto'
    },
    landingMenu : {
        position: 'absolute',
        height: '50vh',
        right: '10%',
        overflow: 'auto',
        borderRadius: 1,
        border: 5,
        borderColor: 'rgba(0,0,0,0.5)',
        margin: '1%',
    },
    landingLoreBasic : {
        position: 'absolute',
        height: '30vh',
        left: '10%',
        bottom: '20%',
        overflow: 'auto',
        borderRadius: 1,
        border: 5,
        borderColor: 'rgba(0,0,0,0.5)',
        margin: '1%',
        backgroundColor: secondary('99')
    },
    topToolbar : {
        height: '9%',
        backgroundColor: brown[7],
        border: 1,
    },
    mainArea : {
        display: 'flex',
        flexDirection: 'row',
        height: '91%',
        width: '100%',
        backgroundColor: 'black'
    },
    gameArea : {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'skyblue'
    },
    rightToolbar :  {
        width: 40,
        height: '100%'
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        width: '90%',
        top: '25%',
        position: 'fixed',
        overflow: 'visible',
        height: 0
    },
    drawer: {
        width: 250
    }
}