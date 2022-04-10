import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';

export default function StyledAppBar(props:any) {
  const [show, setShow] = React.useState(props.show);
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShow(event.target.checked);
    props.handleAppBarButton(event.target.checked)
  };

  const onlogoutClick = () => {
      localStorage.setItem("user","")
      props.onLogout()
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rick and Morty Info
          </Typography>
          <Button onClick={onlogoutClick} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={show}
                    onChange={handleChange}
                    aria-label="favourites switch"
                  />
                }
                label={show ?   'Hide Favourites': 'Show Favourites'}
              />
        </FormGroup>
    </Box>
  );
}
