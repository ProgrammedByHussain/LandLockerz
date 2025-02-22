import React, { useEffect, useState } from 'react';
import { useUser } from '../providers/user';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { AuthClient } from '@dfinity/auth-client';
import { useAppBar } from '../providers/navbar';

const LoginComponent = () => {
  const { connectWallet } = useAppBar(); 
  const { updateWalletAddress } = useUser();
  const navigate = useNavigate();
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIAuthenticated] = useState(false);
  const ID = 'rdmx6-jaaaa-aaaaa-aaadq-cai'
  useEffect(() => {
    const createAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      setIAuthenticated(await client.isAuthenticated());
      connectWallet(); 
    };
    createAuthClient();
  }, []);

  const handleLogin = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: `https://identity.ic0.app/?canisterId=${ID}`,
        onSuccess: () => {
        setIAuthenticated(true);
          updateWalletAddress(authClient.getIdentity().getPrincipal().toString());
          navigate('/home');
        },
        onError: (error) => {
          console.error('Login error:', error);
        }
      });
    }
  };

  const handleLogout = async () => {
    if (authClient) {
      await authClient.logout();
      setIAuthenticated(false);
      updateWalletAddress(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login with Internet Identity
        </Typography>
        <Box sx={{ mt: 3 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginComponent;