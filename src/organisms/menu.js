// import * as React from 'react';
import { Box, Button } from '@mui/material';
import { brown, gray, lime, primary, secMin, secondary } from '../constants'



export default function MenuListComposition() {

    const arr = [
        {onClick: (e) => console.log(e), children: 'Load Game'},
        {onClick: (e) => console.log(e), children: 'New Game'},
        {onClick: (e) => console.log(e), children: 'Lore'},
        {onClick: (e) => console.log(e), children: 'Settings'},
        {onClick: (e) => console.log(e), children: 'Gameplay Manual'},
        {onClick: (e) => console.log(e), children: 'Language'},
        {onClick: (e) => console.log(e), children: 'Credits'}
    ]

    return  (
    <Box sx={styles.menu}>
        {arr.map((obj, key) => <MenuItem cnt={key} key={key} {...obj} />)}
    </Box>
  );
}


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