import React, { useState } from 'react';
import { useUser } from '../providers/user';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, Typography, TextField, Button, Container, Paper } from '@mui/material';

const LoginComponent = () => {
  const [inputAddress, setInputAddress] = useState('');
  const { updateWalletAddress } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (event) => {
    setInputAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateWalletAddress(inputAddress); // Update the wallet address in context
    navigate('/home'); // Redirect to the home page
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enter Your Wallet to Continue
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Wallet Address"
            variant="outlined"
            placeholder="Enter your wallet address"
            value={inputAddress}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Continue
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginComponent;