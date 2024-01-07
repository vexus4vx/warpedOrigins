import * as React from 'react';
import { TextField, Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';

export default function TemporaryDrawer({setTerrainProps, ...terrainProps}) {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [stats, setStats] = React.useState({...terrainProps});

    const onUpdateStats = (v, k) => {
        setStats({...stats, [k]: v})
    }

    const list = () => (
      <Box sx={{ width: 300 }} role="presentation" >
        <List>
          {Object.keys(stats).map(key => (
            <ListItem key={key} disablePadding>
              <ListItemButton>
                <ListItemText primary={key} />
                <TextField onChange={(e) => onUpdateStats(e.target.value, key)} value={stats[key]} sx={{width: 100}} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setTerrainProps(stats)}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={'Update All'} />
              </ListItemButton>
            </ListItem>
        </List>
      </Box>
    );
  
    return (
        <Box sx={styles.main} onMouseOver={() => setIsDrawerOpen(true)}>
            <React.Fragment>
                <Drawer
                    anchor={'right'}
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                >
                    {list()}
                </Drawer>
            </React.Fragment>
        </Box>
    );
}

const styles = {
    main: {
        width: 40,
        height: '100%',
        overflow: 'none'
    }
}