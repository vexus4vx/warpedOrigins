import React from "react";
import { Button } from "@mui/material";
import './atm.css';

export function ExitButton({onClick, ...props}) {
    return <Button onClick={(e) => onClick()} sx={{textAlign: 'right', fontSize: 'calc(18px + 2vmin)', ...props.styles}}>{props.children || 'X'}</Button>
}

export function MenuButton({onClick, style, children}) {
    const [selected, setSelected] = React.useState(false);
    const onButtonClick = () => {
        if(typeof onClick === 'function'){
            onClick();
            setSelected(!selected);
        }
    }

    return <a className={`btn ${selected ? 'btnClicked' : ''}`} style={style} onClick={onButtonClick}>
        {children}
    </a>
}

// set on hover color
export function TransitionButton({onClick, style, children}) {
    const onButtonClick = () => {
        if(typeof onClick === 'function') onClick();
    }
    return <a className='transitionButton' style={style} onClick={onButtonClick}>
        {children}
    </a>
}

export function MenuButton2({onClick, style, children, className}) {
    const onButtonClick = () => {
        if(typeof onClick === 'function') onClick();
    }

    return <a className={`btn ${className || ""}`} style={style} onClick={onButtonClick}>
        {children}
    </a>
}