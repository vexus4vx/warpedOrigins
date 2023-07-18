// import * as React from 'react';
import { Box, Button } from '@mui/material';
import { primary, secMin, secondary } from '../constants';
import useStore from '../store';

export default function MenuListComposition() {
    const setLandingMenuSelection = useStore(state => state.setLandingMenuSelection);

    const arr = ['Load World', 'Search for new World', 'Lore', 'Settings', 'Gameplay Manual', 'Language', 'Credits']

    return  (
    <Box sx={styles.menu}>
        {arr.map((val, key) => <MenuItem cnt={key} key={key} onClick={() => setLandingMenuSelection(key)}>{val}</MenuItem>)}
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