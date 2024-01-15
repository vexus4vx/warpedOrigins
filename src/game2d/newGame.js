import React from "react";
import MenuListComposition, { MenuTextComponent } from "../organisms/menu";
import { races } from "./creatures";
import { Box } from "@mui/system";
// import { GeneralButton } from "../atoms/button"; // do something about the on hover for the selection button
import { secondary } from "../constants";
import { Button } from "@mui/material";
import { gameStore } from "./gameStore";


export default function Setup() {
    const [selected, setSelected] = React.useState({});
    const [imageLocation, setImageLocation] = React.useState({});
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
            <MenuListComposition menuListStyle={{backgroundColor: 'rgba(80, 80, 80, 0)'}} arr={arr} />
            {selected?.raceImg ? <img onMouseEnter={mouseEnter} style={styles.img} src={typeof selected?.raceImg === 'string' ? selected.raceImg : selected.raceImg[imageLocation]} height={'98%'} width={'40%'} /> : null}
            <MenuTextComponent heading={selected.name}>
                {selected?.info}
            </MenuTextComponent>
        </Box>
    </Box>;
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        border: 'solid',
        borderRadius: 10,
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
    }
}