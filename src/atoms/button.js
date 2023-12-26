import { Button } from "@mui/material"

export function ExitButton({onClick, ...props}) {
    return <Button onClick={(e) => onClick()} sx={{...styles.exitButton, ...props.styles}}>{props.children || 'X'}</Button>
}

export function GeneralButton({onClick, ...props}) {
    return <Button variant={props.variant || 'contained'} sx={{...styles.buttonStyle, ...props.style}} onClick={() => onClick()} >
        {props.children || 'Save to file'}
    </Button>
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