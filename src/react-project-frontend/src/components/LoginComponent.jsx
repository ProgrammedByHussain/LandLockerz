import React, { useEffect, useState } from "react";
import { useUser } from "../providers/user";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { AuthClient } from "@dfinity/auth-client";
import { useAppBar } from "../providers/navbar";

const LoginComponent = () => {
  const { connectWallet } = useAppBar();
  const { updateWalletAddress } = useUser();
  const navigate = useNavigate();
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ID = "rdmx6-jaaaa-aaaaa-aaadq-cai";

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          connectWallet();
          updateWalletAddress(client.getIdentity().getPrincipal().toString());
          navigate("/home");
        }
      } catch (error) {
        console.error("Auth client initialization error:", error);
      }
    };
    initAuthClient();
  }, []);

  const handleLogin = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: `https://identity.ic0.app/?canisterId=${ID}`,
        onSuccess: () => {
          setIsAuthenticated(true);
          const principal = authClient.getIdentity().getPrincipal().toString();
          updateWalletAddress(principal);
          connectWallet();
          navigate("/home");
        },
        onError: (error) => {
          console.error("Login error:", error);
          setIsAuthenticated(false);
        },
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8, textAlign: "center" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login with Internet Identity
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginComponent;
