import React, { useEffect, useState } from "react";
import { useUser } from "../providers/user";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AuthClient } from "@dfinity/auth-client";
import { useAppBar } from "../providers/navbar";
import LandLocks from "/LandLocks.png";

const LoginComponent = () => {
  const { connectWallet } = useAppBar();
  const { updateWalletAddress } = useUser();
  const navigate = useNavigate();
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };
    if (imageLoaded) {
      initAuthClient();
    }
  }, [imageLoaded]);

  const handleLogin = async () => {
    if (authClient) {
      setLoginLoading(true);
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
      setLoginLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 8,
          textAlign: "center",
          borderRadius: 3,
          width: "100%",
          maxWidth: 700,
        }}
      >
        <img
          src={LandLocks}
          alt="LandLocks Logo"
          onLoad={() => setImageLoaded(true)}
          style={{ width: "200px", height: "auto", marginBottom: "30px" }}
        />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Welcome to LandLocks
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Securely authenticate with Internet Identity to manage your digital
          land ownership.
        </Typography>
        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LoginComponent;
