// import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { primary, secMin, secondary } from '../constants';
import useStore from '../store';
import './org.css'

export function LandingMenu(props) {
    const setLandingMenuSelection = useStore(state => state.setLandingMenuSelection);
    const arr = [
        {onClick: () => setLandingMenuSelection(0), children: 'Load 3D World'},
        {onClick: () => setLandingMenuSelection(1), children: 'Load Game World'},
        {onClick: () => setLandingMenuSelection(8), children: 'Symulation'},
        {onClick: () => setLandingMenuSelection(7), children: 'Neural: 1'},
        {onClick: () => setLandingMenuSelection(2), children: 'Lore'},
        {onClick: () => setLandingMenuSelection(3), children: 'Settings'},
        {onClick: () => setLandingMenuSelection(5), children: 'Gameplay Manual'},
        {onClick: () => setLandingMenuSelection(4), children: 'Image handling'},
        {onClick: () => setLandingMenuSelection(6), children: 'Credits'}
    ]

    return <MenuListComposition arr={arr} />
}

export default function MenuListComposition({arr = [], ...props}) {
    return  (
    <Box sx={{...styles.menu, ...(props?.menuListStyle || {})}}>
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

export function MenuTextComponent(props) {
    return <Box sx={{...styles.button, ...styles.txtBox}} >
        <Box sx={styles.txtHead} children={props?.heading} />
        <Box sx={styles.txtBoxInr}>
            <Box sx={styles.txtBody}>
                {typeof (props?.children) === 'object' ? setParas(props.children) : props.children}
            </Box>
        </Box>
    </Box>
}

const setParas = (arr) => {
    return arr.map((txt, k) => <Typography sx={{marginBottom: 2}} key={k}>{txt}</Typography>)
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
        color: 'black', // primary(),//'rgba(184, 110, 15, 1)',
        border: 1.5,
        borderRadius: 2,
        fontWeight: 'bold',
        "&:hover": {
            border: "1px solid #00FF00",
            color: 'gray',
            backgroundColor: 'lightblue'
        }
    },
    txtBox: {
        height: '86%', // ...
        overflowY: 'auto',
        backgroundColor: secMin('45'),
        padding: 3,
        "&:hover": {}
    },
    txtHead: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 2
    },
    txtBody: {
        fontWeight: 5,
        fontSize: 16,
        marginBottom: 2,
        textAlign: 'justify'
    },
    txtBoxInr: {
        height: '80%',
        overflowY: 'auto'
    }
}