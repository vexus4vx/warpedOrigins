import React from "react";
import MenuListComposition, { MenuTextComponent } from "../organisms/menu";
import { races } from "./creatures";
import { Box } from "@mui/system";


export default function Setup() {
    const [selected, setSelected] = React.useState({})

    let arr = [];

    races.forEach((obj, k) => {
        arr.push({
            children: obj.name,
            onClick: () => setSelected({...obj, k})
        })
    })
    
    return <div style={styles.main} >
        <Box>
            <h2>Choose a starting race</h2>
            <h4>you will be able to obtain units of other races as the game progresses</h4>
        </Box>
        <Box sx={styles.menu}>
            <MenuListComposition menuListStyle={{backgroundColor: 'rgba(80, 80, 80, 0)'}} arr={arr} />
            {selected?.raceImg ? <img style={styles.img} src={selected?.raceImg} height={'98%'} width={'40%'} /> : null}
            <MenuTextComponent heading={selected.name}>
                {selected.info}
            </MenuTextComponent>
        </Box>
    </div>;
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
    }
}