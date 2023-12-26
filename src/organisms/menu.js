// import * as React from 'react';
import { Box, Button } from '@mui/material';
import { primary, secMin, secondary } from '../constants';
import useStore from '../store';

export function LandingMenu() {
    const setLandingMenuSelection = useStore(state => state.setLandingMenuSelection);
    const arr = [
        {onClick: () => setLandingMenuSelection(0), children: 'Load 3D World'},
        {onClick: () => setLandingMenuSelection(1), children: 'Search for new World'},
        {onClick: () => setLandingMenuSelection(7), children: 'Neural: 1'},
        {onClick: () => setLandingMenuSelection(2), children: 'Lore'},
        {onClick: () => setLandingMenuSelection(3), children: 'Settings'},
        {onClick: () => setLandingMenuSelection(5), children: 'Gameplay Manual'},
        {onClick: () => setLandingMenuSelection(4), children: 'Image handling'},
        {onClick: () => setLandingMenuSelection(6), children: 'Credits'}
    ]

    return <MenuListComposition arr={arr} />
}

export default function MenuListComposition({arr = []}) {
    return  (
    <Box sx={styles.menu}>
        {arr.map((obj, key) => <MenuItem cnt={key} key={key} {...obj} />)}
    </Box>
  );
}

// move to molecules ?
function MenuItem (props){
    return  <Box sx={styles.item(props?.cnt || 0)}>
        <Button sx={styles.button} {...props} />
    </Box>
}

const styles = {
    menu : {
        backgroundColor: secMin('9a'),
        minHeight: 400,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },
    item: (k) => {
        let obj = {
            width: '100%',
            display: 'flex',
            justifyCotent: 'space-around',
            marginTop: 1
        }

        return k ? obj : {...obj, marginTop: 0}
    },
    button: {
        width: 250,
        height: 54,
        margin: 0.4,
        backgroundColor: secondary('99'),//'rgba(30, 40, 29, 0.9)',
        color: primary(),//'rgba(184, 110, 15, 1)',
        border: 1.5,
        borderRadius: 2,
        fontWeight: 'bold'
    }
}