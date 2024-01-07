import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { brown } from '../constants';
import useStore from '../store';

export default function MyToolbar({...props}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {setState} = useStore(state => ({setState: state.setState}));

  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const onExit = () => {
    // do other stuff ask to save ...
    setState({landingMenuSelection: -1, showGameWindow: false});
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={onExit}>Exit</MenuItem>
      <MenuItem onClick={handleMenuClose}>Save Game</MenuItem>
    </Menu>
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{backgroundColor: 'black'}} position="static">
        <Toolbar>
            <IconBtn onClick={handleProfileMenuOpen}>
                <MenuIcon />
            </IconBtn>

          <ToolbarText>Thrive - a kampane based RPG</ToolbarText>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconBtn>
                <MailIcon />
            </IconBtn>
            <IconBtn>
                <NotificationsIcon />
            </IconBtn>

            <IconBtn>
                <AutoStoriesIcon />
            </IconBtn>
          </Box>

        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}

function IconBtn({icon, badgeContent = 0, onClick, ...props}) {
    return <IconButton onClick={onClick} size="large" color="inherit">
    <Badge badgeContent={badgeContent} color="error">
      {props.children}
    </Badge>
  </IconButton>
}

function ToolbarText({children, ...props}) {
    return <Typography
    variant="h6"
    noWrap
    component="div"
    sx={{ display: { xs: 'none', sm: 'block' } }}
    {...props}
  >
    {children}
  </Typography>
}