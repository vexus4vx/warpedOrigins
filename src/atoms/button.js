import { Button } from "@mui/material";
import './atm.css';
import React from "react";

export function ExitButton({onClick, ...props}) {
    return <Button onClick={(e) => onClick()} sx={{...styles.exitButton, ...props.styles}}>{props.children || 'X'}</Button>
}

export function GeneralButton({onClick, ...props}) {
    return <Button variant={props.variant || 'contained'} sx={{...styles.buttonStyle, ...props.style}} onClick={() => onClick()} >
        {props.children || 'Save to file'}
    </Button>
}

export function MenuButton({onClick, style, children}) {
    const [selected, setSelected] = React.useState(false);
    const onButtonClick = () => {
        if(typeof onClick === 'function'){
            onClick();
            setSelected(!selected);
        }
    }

    return <a className={`btn ${selected ? 'btnClicked' : ''}`} style={style} onClick={onButtonClick} >
        {children}
    </a>
}

const styles = {
    exitButton: {
        textAlign: 'right',
        fontSize: 'calc(18px + 2vmin)',
    },
    buttonStyle: {
        marginTop: 5
    }
}