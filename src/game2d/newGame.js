import React from "react";
import MenuListComposition, { MenuTextComponent } from "../organisms/menu";
import { races } from "./creatures";
import { Box } from "@mui/system";
import { secondary } from "../constants";
import { Button } from "@mui/material";
import { gameStore } from "./gameStore";


export default function Setup() {
    const [selected, setSelected] = React.useState({});
    const [imageLocation, setImageLocation] = React.useState(0);
    const setState = gameStore(state => state.setState);

    let arr = [];

    races.forEach((obj, k) => {
        arr.push({
            children: obj.name,
            onClick: () => setSelected({...obj, k})
        })
    })

    function mouseEnter() {
        setImageLocation(imageLocation ? 0 : 1);
    }
    
    return <Box sx={styles.main} >
        <Box>
            <h2>Choose a starting race</h2>
            <h4>
                you will be able to obtain units of other races as the game progresses 
                {selected?.name ? <Button onClick={() => setState({selectedRace: selected.name, destination: `${selected.name}Home`})} sx={styles.button}>Choose {selected?.name}</Button> : null}
            </h4>
        </Box>
        <Box sx={styles.menu}>
            <Box sx={{height: '98%', overflowX: 'hidden'}}>
                <MenuListComposition menuListStyle={{backgroundColor: 'rgba(80, 80, 80, 0)'}} arr={arr} />
            </Box>
            <Box sx={styles.onSelectRace(selected?.raceImg)}>
                <img 
                    onMouseEnter={mouseEnter} 
                    style={styles.img} 
                    src={selected?.raceImg ? typeof selected.raceImg === 'string' ? selected.raceImg : selected.raceImg[imageLocation] : ''} 
                    alt={''}
                    height='100%' 
                    width='50%' 
                />
                <MenuTextComponent heading={selected.name}>
                    {selected?.info}
                </MenuTextComponent>
            </Box>
        </Box>
    </Box>;
}

/*
divs have a double non filled border 
with an image in each border turned by ? degrees to make fancy corners
-- the overall with allows for a black margin left and right - approx 1.2 cm
*/

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        border: 'solid',
        borderRadius: 5,
        innerRadius: 5,
        borderWidth: 8,
        margin: '10%',
        marginTop: '2%',
        height: '84%',
        minHeight: 300,
        maxWidth: '70%',
        minWidth: '50%',
        overflowY: 'auto',
        textAlign: 'center',
        backgroundColor: 'rgba(80, 80, 80, 0.7)'
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-evenly',
        overflow: 'auto'
    },
    img: {
        opacity: 1,
        backgroundColor: 'black'
    },
    button: {
        fontWeight: 'bold',
        textSize: 20,
        left: 5,
        // top: -20,
        backgroundColor: secondary(99),
        color: 'black'
    },
    onSelectRace: (a) => ({
        visibility: a ? 'visible' : 'hidden',
        // display: a ? 'inline' : 'none',
        height: '98%', 
        display: 'flex'
    })
}