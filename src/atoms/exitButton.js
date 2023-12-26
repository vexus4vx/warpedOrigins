import { Button } from "@mui/material"

export default function ExitButton({onClick, ...props}) {
    return <Button onClick={(e) => onClick()} sx={{...styles.exitButton, ...props.styles}}>{props.children || 'X'}</Button>
}

const styles = {
    exitButton: {
        textAlign: 'right',
        fontSize: 'calc(18px + 2vmin)',
    }
}