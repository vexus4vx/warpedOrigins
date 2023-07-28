import { Box } from "@mui/material"
import React from "react"
import { brown, imageList, secondary } from "./constants"
import Spinner from "./atoms/spinner"

const resetSource = (set) => {
    const pic = imageList[Math.abs(((Date.now() * Math.random()) >> 1) % imageList.length)]
    if(set) set(pic)
    else return pic
}

export function LandingPageLayout ({menu, ...props}) {
    const [src, setSrc] = React.useState('')

    React.useEffect(()=> {
        resetSource(setSrc)
    })

    return <Box sx={styles.main}>
        <img
            onError={(e) => resetSource(setSrc)}
            src={src}
            srcSet={src}
            alt={`Ups >_< , ${src}`}
            loading="lazy"
            width='100%'
            height='100%'
        />
        <Box sx={menu ? styles.landingMenu : null}>
            {menu}
        </Box>
        <Box sx={styles.landingLoreBasic}>
            {props?.children || null}
        </Box>
    </Box>
}

export function InGameLayout ({toolbar, gameAreaContent, rightMenu}) { 
    const src = resetSource()

    return <Box sx={{...styles.main, justifyContent: 'flex-start'}}>
        <Box sx={styles.topToolbar}>
            {toolbar}
        </Box>
        <Box sx={styles.mainArea}>
            <Box sx={styles.gameArea}>
                {gameAreaContent || [<Box key={0} sx={styles.spinner}>
                    <Spinner size={300} speedMultiplier={0.7} color={'red'}/>
                </Box>,
                <img
                    key={1}
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

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100vh'
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