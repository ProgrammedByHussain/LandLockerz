// AppBarComponent.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAppBar } from '../providers/navbar';
import { useNavigate } from 'react-router-dom';

const AppBarComponent = () => {
  const { isWalletConnected, connectWallet, disconnectWallet } = useAppBar();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isWalletConnected) {
      disconnectWallet();
      navigate('/'); // Redirect to the home page or login page after logout
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LandLockerz
        </Typography>
        <Button color="inherit" onClick={() => navigate('/transfers')}>
          Search By ID
        </Button>
        <Button color="inherit" onClick={() => navigate('/transfers')}>
          Transfer NFTs
        </Button>
        <Button color="inherit" onClick={() => navigate('/validate')}>
          Lockup A property  
        </Button>
        <Button color="inherit" onClick={() => navigate('/Home')}>
          Home
        </Button>
        
        <Button
          color="inherit"
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={isWalletConnected ? handleLogout : connectWallet}
        >
          {isWalletConnected ? 'Logout' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;