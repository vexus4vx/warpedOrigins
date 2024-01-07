import React from "react";
import MenuListComposition, { MenuTextComponent } from "../organisms/menu";
import { races } from "./creatures";


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
        <h2>Setup new Game</h2>
        <div style={styles.menu}>
            <MenuListComposition menuListStyle={{backgroundColor: 'gray'}} arr={arr} />
            <MenuTextComponent heading={selected.name}>
                {selected.info}
            </MenuTextComponent>
        </div>
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
        height: '80%',
        minHeight: 300,
        maxWidth: '70%',
        minWidth: '50%',
        overflowY: 'auto',
        textAlign: 'center',
        backgroundColor: 'gray',
        opacity: '70%'   
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-evenly',
        overflow: 'auto'
    }
}