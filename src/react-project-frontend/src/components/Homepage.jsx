import React from 'react';
import { Typography, Box } from '@mui/material';
import { useUser } from '../providers/user';

const HomePage = () => {
  const { walletAddress } = useUser();

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Typography variant="h5" component="p">
        Your Wallet Address: {walletAddress}
      </Typography>
    </Box>
  );
};

export default HomePage;