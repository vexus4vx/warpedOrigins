import { Box, Button } from "@mui/material";
import { brown, lime } from "../constants";


export default function AcceptDecline ({onAccept, onDecline}) {
    return <Box sx={styles.main}>
        <Button sx={{...styles.button, ...styles.switch}} onClick={(e) => onDecline()}>Decline</Button>
        <Button sx={styles.button} onClick={(e) => onAccept()}>Accept</Button>
    </Box>
}

const col1 = lime[5]
const col2 = brown[6]
const styles = {
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around"
    },
    button: {
        height: 35,
        borderRadius: 1,
        border: 2,
        borderColor: 'rgba(0,0,0,0.5)',
        color: col1,
        backgroundColor: col2
    },
    switch: {
        color: col2,
        backgroundColor: col1
    }
}