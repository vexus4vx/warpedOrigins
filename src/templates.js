import { Box } from "@mui/material"
import React from "react"
import { imageList, secondary } from "./constants"

const resetSource = (set) => set(imageList[Math.abs(((Date.now() * Math.random()) >> 1) % imageList.length)])

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

export function InGameLayout ({}) {
    return <Box sx={styles.main}>
        <Box>
            toolbar at top
        </Box>
        <Box>
            <Box>
                GameArea
            </Box>
            <Box>
                infoArea on Right
            </Box>
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
    }
}