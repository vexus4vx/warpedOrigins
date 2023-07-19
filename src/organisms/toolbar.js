import { Box, Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { gray, lime } from "../constants";

// use AppBar from mui ?
export default function Toolbar({onSave, onExit, ...props}){
    const actions = [
        { icon: <CloseIcon onClick={() => onExit} />, name: 'Exit'},
        { icon: <SaveIcon onClick={() => onSave} />, name: 'Save' },
    ];

    return <Box sx={styles.main}>
            <SpeedDial
                direction='down'
                ariaLabel="Menu"
                icon={<SpeedDialIcon color={''} />}
                FabProps={{
                    sx: {
                    bgcolor: gray[5],
                    '&:hover': {
                        bgcolor: lime[4],
                    }
                    }
                }}
            >
                {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                />
                ))}
            </SpeedDial>
            <Box sx={styles.worldName}>{props.Worldname || 'Base: Oblivion'}</Box>
            <Box sx={styles.timeArea}>
                <Box sx={styles.time}>{props.gameTime}</Box>
                <Button sx={styles.pause}>{props.pauseText || 'pause'}</Button>
            </Box>
        </Box>
}

const styles = {
    main: {
        width: '98%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        top: 5,
        left: '1%'
    },
    worldName: {
        fontWeight: 'bold',
        fontSize: 30
    },
    time: {
        fontsize: 16
    },
    pause: {
        color: 'black',
        backgroundColor: gray[4],
        border: 1,
        marginBottom: 1,
        width: 150,
        fontWeight: 'bold'
    },
    timeArea: {
        marginRight: 2
    }
}