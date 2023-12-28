import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


export function DisplayList({arr, onChange}){
    const currentlyDisplayed = arr.map((v, i) => {
        return <ListItem key={i} 
            secondaryAction={
            <IconButton onClick={() => onChange(i)} edge="end" aria-label="delete">
                <DeleteIcon />
            </IconButton>
            }
        >
            <ListItemText secondary={v}/>
        </ListItem>
    })

    return arr.length ? <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
        {currentlyDisplayed}
    </List> : null;
}