import { Box } from "@mui/material"
import React from "react"

const imageList = [
    'https://wallup.net/wp-content/uploads/2018/09/26/170987-fantasy_art.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/26/193004-fantasy_art-forest-trees-birds.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/26/165273-fantasy_art-field-clouds.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/25/570599-warrior-fantasy_art-samurai-sword.jpg',
    'https://wallup.net/wp-content/uploads/2018/03/19/590424-original_characters-elven-Sakimichan-women-looking_at_viewer-blonde-pointed_ears-platinum_blonde-blue_eyes-white_hair-fantasy_art-digital_art-artwork-illustration-anime-necklace.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/505568-warrior-archer-fantasy_art.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/524776-anime_girls-fantasy_girl-fantasy_art-Legend_of_the_Five_Rings.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/509214-fantasy_art-forest-deer-fawns.jpg',
    'https://wallup.net/wp-content/uploads/2016/01/259711-river-fantasy_art-nature-video_games.jpg',
    'https://wallpapercave.com/wp/v29iuWR.jpg',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.9_xkmDngAgltHckaB9DNKQHaEK%26pid%3DApi&f=1&ipt=801c26dd435fe53b6ae5845d6f036eafd2b4247092f4b2f52b86a9c576eca4b5&ipo=images'
]

const resetSource = (set) => set(imageList[Math.abs(((Date.now() * Math.random()) >> 1) % imageList.length)])

export default function LandingPageLayout () {
    const [src, setSrc] = React.useState('')

    React.useLayoutEffect(()=> {
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
    </Box>
}

export function InGameLayout ({}) {
    return <Box sx={styles.main}>
        <Box sx={styles.top}>
            {'top'}
        </Box>
        <Box sx={styles.middle}>
        </Box>
    </Box>
}

export function TopToolbarLayout ({top, middleL, middleR}) {
    return <Box sx={styles.main}>
        <Box sx={styles.top}>
            {top}
        </Box>
        <Box sx={styles.middle}>
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
    top: {
        height: '16%',
        margin: '1%',
        justifyContent: 'space-around',
        borderRadius: 1,
        border: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    middle: {
        height: '80%',
        margin: '1%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 1
    },
    middleInner: {
        height: '100%',
        width: '47%',
        justifyContent: 'space-around',
        borderRadius: 2,
        border: 1,
    }
}